import React from 'react';
import EverytimeSymbol from '../assets/images/Everytime_symbol.svg?react';
import './css/Header.css';

// <a> 태그 대신, NavLink 사용 
import { NavLink } from 'react-router-dom';

function Header() {

    // 메뉴 설정
    const menuItems = [
        { name: '게시판', path: '/boarddirectory '},
        { name: '시간표', path: '/schedule' },
        { name: '강의실', path: '/classroom' },
        { name: '학점계산기', path: '/calculator' },
    ];

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
                        <li key={item.name} className="menu-item">
                            <NavLink to={item.path}
                            className={({ isActive }) => (isActive ? 'active' : '')}>
                            {/* 활성화 상태이면 <a class="active">를 주는 것과 동일 */}
                                {item.name}
                            </NavLink>
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