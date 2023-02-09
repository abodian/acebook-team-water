import React, { useEffect, useState } from "react";
import Post from "../post/Post";

const Feed = ({ navigate }) => {
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [message, setMessage] = useState("");

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

  /////////////////////////
  // **This below is new code which handles the fetch to api, sending the new post to the database and deleting it
  /////////////////////////

  const handleSubmitPost = async (event) => {
    // event.preventDefault(); This line stops the page refreshing automatically so it has been commented out

    fetch("/posts", {
      method: "post",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message }),
    }).then((response) => {
      if (response.status === 201) {
        navigate("/posts");
      } else {
        navigate("/signup");
      }
    });
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleDeletePost = async (id) => {
    await fetch(`/posts/${id}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status === 200) {
        setPosts(posts.filter((post) => post._id !== id));
      }
    });
  };

  /////////////////////////
  // Below is the code for the form that posts the new message
  /////////////////////////
  if (token) {
    return (
      <div>
        <nav className="nav">
          <a href="/posts" className="site-title">
            Acebook
          </a>
          <ul>
            <button onClick={logout}>Logout</button>
            <br></br>
            {/* <a href="/signup"> logout </a> */}
          </ul>
        </nav>
        <>
          <h2>Posts</h2>
          <form onSubmit={handleSubmitPost}>
            <input
              placeholder="Write your post here"
              id="message"
              type="message"
              defaultValue={post}
              onChange={handleMessageChange}
            />
            <input id="submit" type="submit" value="Submit" />
          </form>

          <div id="feed" role="feed">
            {posts.map((post) => (
              <div key={post._id}>
                <Post post={post} />
                <button onClick={() => handleDeletePost(post._id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      </div>
    );
  } else {
    navigate("/signin");
  }
};

export default Feed;
