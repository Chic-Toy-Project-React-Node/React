// src/components/BoardDirectory.jsx
import './css/BoardDirectory.css';

import { Link } from "react-router-dom"; //

function BoardDirectory() {
  return (
    <div className ="Top">
    <section className="main">
      {/* 1줄: 자유/비밀/새내기 */}
      <div className="line">
        <p><Link to="/board/free">자유 게시판</Link></p>
        <p><a href="/">비밀 게시판</a></p>
        <p><a href="/">새내기 게시판</a></p>
      </div>

      {/* 2줄: 취업·진로 */}
      <div className="line">
        <p><a href="/">취업/진로 게시판</a></p>
      </div>

      {/* 3줄: 광운대신문사 / KW Times */}
      <div className="line">
        <p><a href="/">광운대 신문사</a></p>
        <p><a href="/">KW Times</a></p>
      </div>

      {/* 4줄: 긱사생 / 구름사진 */}
      <div className="line">
        <p><a href="/">긱사생 게시판</a></p>
        <p><a href="/">구름사진 게시판</a></p>
      </div>
    </section>

    </div>
  );
}

export default BoardDirectory;
