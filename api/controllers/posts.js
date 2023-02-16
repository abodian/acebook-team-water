const Post = require("../models/post");
const TokenGenerator = require("../models/token_generator");
const { post } = require("../routes/posts");

const PostsController = {
  Index: (req, res) => {
    Post.find(async (err, posts) => {
      if (err) {
        throw err;
      }
      const token = await TokenGenerator.jsonwebtoken(req.user_id);
      res.status(200).json({ posts: posts, token: token });
    });
  },
  Create: (req, res) => {
    const post = new Post(req.body);
    console.log("Post Content: " + post);
    post.save(async (err) => {
      if (err) {
        throw err;
      }

      const token = await TokenGenerator.jsonwebtoken(req.user_id);
      res.status(201).json({ message: "OK", token: token });
    });
  },
  Delete: (req, res) => {
    const postId = req.params.id;
    Post.deleteOne({ _id: postId }, async (err) => {
      if (err) {
        throw err;
      }
      const token = await TokenGenerator.jsonwebtoken(req.user_id);
      res
        .status(200)
        .json({ message: "Post deleted successfully", token: token });
    });
  },


  Addlike: (req, res) => {
    console.log(req.body.postId, req.body.userId);
    Post.findById(req.body.postId, (err, post) => {
        if (err) {
            return res.status(422).json({ error: err });
        }
        if (post.likes.includes(req.body.userId)) {
            return res.status(422).json({ error: 'User has already liked this post' });
        }
        Post.findByIdAndUpdate(req.body.postId, {
            $push: { likes: req.body.userId }
        }, {
            new: true
        }).exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            } else {
                res.json(result);
            }
        });
    });
},


Unlike: (req, res) => {
  console.log(req.body.postId,req.body.userId);
  Post.findByIdAndUpdate(req.body.postId,{
    $pull:{likes:req.body.userId}
  },{
    new:true
  }).exec((err,result) => {
      if(err){
        return res.status(422).json({error:err})
      }else{
        res.json(result)
      }
  })
},



  AddComment: (req, res) => {
    const postId = req.params.id;
    const message = req.body.message;
    const userName = req.body.userName;
    Post.updateOne(
      { _id: postId },
      {
        $push: {
          comments: {
            userName: userName,
            timeStamp: Date.now(),
            message: message,
          },
        },
      },
      async (err) => {
        if (err) {
          throw err;
        }
        const token = await TokenGenerator.jsonwebtoken(req.user_id);
        res
          .status(200)
          .json({ message: "Comment added successfully", token: token });
      }
    );
  },


  ///////////////////////////////////////

  AddComlike: (req, res) => {
    const { postId, comId, userId } = req.body;
    Post.findById(postId, (err, post) => {
        if (err) {
            return res.status(422).json({ error: err });
        }
        const comment = post.comments.find(c => c._id.equals(comId));
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        if (comment.comLikes.includes(userId)) {
            return res.status(422).json({ error: 'User has already liked this comment' });
        }
        comment.comLikes.push(userId);
        post.save((err, savedPost) => {
            if (err) {
                return res.status(422).json({ error: err });
            }
            res.json(savedPost);
        });
    });
},



  // AddComlike: (req, res) => {
  //   console.log(req.body.postId, req.body.comId, req.body.userId);
    
  //   Post.findById(req.body.comId, (err, post) => {
  //       if (err) {
  //           return res.status(422).json({ error: err });
  //       }
  //       if (post.comments.comLikes.includes(req.body.userId)) {
  //           return res.status(422).json({ error: 'User has already liked this comment' });
  //       }
  //       Post.findByIdAndUpdate(req.body.comId, {    //////////it's possible that it should be req.body.postid.commId
  //           $push: { comLikes: req.body.userId }
  //       }, {
  //           new: true
  //       }).exec((err, result) => {
  //           if (err) {
  //               return res.status(422).json({ error: err });
  //           } else {
  //               res.json(result);
  //           }
  //       });
  //   });
  // },


  // UnComlike: (req, res) => {
  //   console.log(req.body.postId,req.body.userId);
  //   Post.findByIdAndUpdate(req.body.postId,{
  //     $pull:{likes:req.body.userId}
  //   },{
  //     new:true
  //   }).exec((err,result) => {
  //       if(err){
  //         return res.status(422).json({error:err})
  //       }else{
  //         res.json(result)
  //       }
  //   })
  // },






  ///////////////////////////////////////







};

module.exports = PostsController;
