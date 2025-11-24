import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function PostDetail() {
  const { id } = useParams(); // 取得 URL 中的 id 參數
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`/post/${id}`)
      .then(res => res.json())
      .then(data => setPost(data));
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <p><Link to="/">Back to list</Link></p>
    </div>
  );
}

export default PostDetail;