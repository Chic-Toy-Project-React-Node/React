// src/components/Sidebar.jsx
import './css/Sidebar.css';

function Sidebar() {
  return (
    <aside className="sideBar_left">
      {/* 프로필 영역 */}
      <div className="profile">
        <div className="avatar"></div> {/* 프로필 이미지 자리 */}
        <div className="info">
          <p className="nickname">닉네임</p>
          <p className="userid">이름<br />아이디</p>
        </div>
        <div className="buttons">
          <button className="btn">내 정보</button>
          <button className="btn">로그아웃</button>
        </div>
      </div>

      {/* 활동 메뉴 */}
      <div className="activity">
        <button className="id_list">내가 쓴 글</button><br />
        <button className="id_list">댓글 단 글</button><br />
        <button className="id_list">내 스크랩</button>
      </div>
       </aside>
  );
}

export default Sidebar;
