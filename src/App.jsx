import React from 'react';
import Header from "./components/Header.jsx";

// 라우팅 설정 (다른 페이지로 이동하는 기능)
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 각 페이지
import Schedule from './components/Schedule.jsx';
import BoardDirectory from './components/BoardDirectory.jsx';
import Classroom from './components/Classroom.jsx';
import CourseReview from './components/CourseReview.jsx';

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Header />

                {/* 다른 페이지 컨텐츠 */}
                <main>
                    <Routes>
                        {/* 게시판 (기본 경로) */}
                        <Route path="/" element={<BoardDirectory />} /> 

                        {/* 시간표 */}
                        <Route path="/schedule" element={<Schedule />} />

                        {/* 강의실 */}
                        <Route path="/classroom" element={<Classroom />} />

                        {/* 강의실 상세 리뷰 페이지 */}
                        <Route path="/classroom/review" element={<CourseReview />} />

                        {/* 학점계산기 */}
                        
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;