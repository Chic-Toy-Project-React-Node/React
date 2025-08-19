import React from 'react';
import Header from "./components/Header.jsx";

// 라우팅 설정 (다른 페이지로 이동하는 기능)
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 각 페이지
import Schedule from './components/Schedule.jsx';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Header />

                {/* 다른 페이지 컨텐츠 */}
                <main>
                    <Routes>
                        {/* 게시판 (기본 경로) */}
                        {/* <Route path="/" element={<Board />} /> */}

                        {/* 시간표 */}
                        <Route path="/schedule" element={<Schedule />} />

                        {/* 강의실 */}


                        {/* 학점계산기 */}
                        
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;