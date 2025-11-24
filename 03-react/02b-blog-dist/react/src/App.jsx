import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PostList from './PostList';
import PostDetail from './PostDetail';
import NewPost from './NewPost';
import './index.css'; // 確保引入樣式

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* 這裡可以放共用的 Header 或導覽列 */}
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/new" element={<NewPost />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;