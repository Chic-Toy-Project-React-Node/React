import React, { useState } from 'react';
import EverytimeSymbol from '../assets/images/Everytime_symbol.svg?react';
import './Header.css';

const Header = () => {
  // 메뉴 아이템 목록
  const menuItems = ['게시판', '시간표', '강의실', '학점계산기'];

  // '게시판'을 기본 메뉴로 설정
  const [activeMenu, setActiveMenu] = useState('게시판');

  return (
    <div className="header-wrapper">
        <header className="header-container">
            {/* 왼쪽 에브리타임 로고 */}
            <div className="logo-section">
                <div className="logo-icon">
                    <EverytimeSymbol width="55" height="55" />
                </div>
                <div className="logo-text">
                    <span className="everytime">에브리타임</span>
                    <span className="university">광운대</span>
                </div>
            </div>

            {/* 중앙 메뉴 */}
            <nav className="menu-section">
                <ul>
                {menuItems.map((item) => (
                    <li
                    key={item}
                    className={item === activeMenu ? 'menu-item active' : 'menu-item'}
                    // 메뉴 클릭 시 active 상태 변경
                    onClick={() => setActiveMenu(item)}
                    >
                        <a href="#">{item}</a>
                    </li>
                ))}
                </ul>
            </nav>

            {/* 오른쪽 아이콘 */}
            <div className="icons-section">
                <div className="icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <div className="icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
            </div>
        </header>
    </div>
  );
};

export default Header;