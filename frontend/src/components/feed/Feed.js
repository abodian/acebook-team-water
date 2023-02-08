import React, { useEffect, useState } from "react";
import Post from "../post/Post";

const Feed = ({ navigate }) => {
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(window.localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      fetch("/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then(async (data) => {
          window.localStorage.setItem("token", data.token);
          setToken(window.localStorage.getItem("token"));
          setPosts(data.posts);
        });
    }
  }, []);

  const logout = () => {
    window.localStorage.removeItem("token");
    navigate("/login");
  };

  const post = () => {};

///////////////////////////////

const [message, setMessage] = useState("");

const handleSubmitPost = async (event) => {
  // event.preventDefault(); this line prevents the page not reloading

  fetch( '/posts', {
    method: 'post',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: message })
  })
    .then(response => {
      if(response.status === 201) {
        navigate('/posts')
      } else {
        navigate('/signup')
      }
    })
}


/////////////////////////

const handleMessageChange = (event) => {
  setMessage(event.target.value)
}

/////////////////////////

  if (token) {
    return (
      <>
        <h2>Posts</h2>
        <button onClick={logout}>Logout</button><br></br>
          <form onSubmit={handleSubmitPost}>
          <input placeholder="Write your post here" id="message" type='message' defaultValue={post} onChange={handleMessageChange} />
          <input id='submit' type="submit" value="Submit" />
         </form>

        <div id="feed" role="feed">
          {posts.map((post) => (
            <Post post={post} key={post._id} />
          ))}
        </div>
      </>
    );
  } else {
    navigate("/signin");
  }
};

export default Feed;
