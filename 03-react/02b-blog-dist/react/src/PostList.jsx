import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // 對應原本的 fetch('/list')
    fetch('/list')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      <p>You have <strong>{posts.length}</strong> posts!</p>
      <p>
        <Link to="/new">Create a Post</Link>
      </p>
      <ul id="posts">
        {posts.map(post => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>
              {/* 使用 React Router 的 Link 取代 <a href="#"> */}
              <Link to={`/post/${post.id}`}>Read post</Link>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;