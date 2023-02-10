import React, { useState } from "react";

// const Post = ({post, show}) => {
//   return(
//     <article data-cy="post" key={ post._id }>
//       { show === "message" ? post.message : post.author }
//     </article>
//   )
// }
const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || 0);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  return (
    <div className="post">
      <p>{post.message}</p>
      <p>Likes: {likes}</p>
      <button onClick={handleLike}>Like</button>
    </div>
  );
};

export default Post;

