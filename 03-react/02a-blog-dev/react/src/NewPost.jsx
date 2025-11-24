import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewPost() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate(); // 用來做頁面跳轉

  const handleSubmit = async () => {
    await fetch('/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body })
    });
    
    // 儲存成功後，跳轉回首頁 (原本是 window.location.hash = '#list')
    navigate('/');
  };

  return (
    <div>
      <h1>New Post</h1>
      <p>Create a new post.</p>
      <form>
        <p>
          <input 
            type="text" 
            placeholder="Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </p>
        <p>
          <textarea 
            placeholder="Contents" 
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </p>
        <p>
          <input type="button" onClick={handleSubmit} value="Create" />
        </p>
      </form>
    </div>
  );
}

export default NewPost;