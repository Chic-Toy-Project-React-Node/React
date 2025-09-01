import { useState } from "react";
import "./css/FreeBoard.css";
import BoardDirectory from "./BoardDirectory";

function FreeBoard() {
  const [posts, setPosts] = useState([
  ]);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleAddPost = () => {
    if (!title.trim() || !content.trim()) return;

    const newPost = {
      title,
      content,
      time: new Date().toLocaleString(),
    };
    setPosts([newPost, ...posts]);
    setTitle("");
    setContent("");
    setShowForm(false);
    
  };

  return (
    <div className="freeBoard">
      <BoardDirectory></BoardDirectory>
      <h1>자유게시판</h1>

      {/* 글 작성 버튼 / 입력 폼 */}
      <div className="write-box">
        {!showForm ? (
          <div
            className="write-placeholder"
            onClick={() => setShowForm(true)}
          >
            새 글을 작성해주세요!
          </div>
        ) : (
          <div className="write-form">
            <input
              type="text"
              placeholder="글 제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="글 내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* 게시글 리스트 */}
      <ul className="post-list">
        {posts.map((post, i) => (
          <li key={i} className="post-item">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <span className="time">{post.time}</span>
          </li>
        ))}
      </ul>

      {/* 우측 하단 빨간 연필 버튼 */}
      {showForm && (
        <button className="fab" onClick={handleAddPost}>
          ✏️
        </button>
      )}
    </div>
  );
}

export default FreeBoard;