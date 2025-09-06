import React from 'react';
import Header from "./components/Header.jsx";

// 라우팅 설정 (다른 페이지로 이동하는 기능)
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 각 페이지
import Schedule from './components/Schedule.jsx';
import BoardDirectory from './components/BoardDirectory.jsx';
import Classroom from './components/Classroom.jsx';
import CourseReview from './components/CourseReview.jsx';
import Calculator from './components/Calculator.jsx';
import FreeBoard from './components/FreeBoard.jsx';
import MainPage from './components/MainPage.jsx';
import SecretBoard from './components/SecretBoard.jsx'
import NewBoard from './components/NewBoard.jsx'
import CareerBoard from './components/CareerBoard.jsx'


function App() {
    return (
        <BrowserRouter>
            <div className="App">
               <Header />

                {/* 다른 페이지 컨텐츠 */}
                <main>
                    <Routes>
                        {/* 게시판 (기본 경로) */}
                        <Route path="/" element={<MainPage />} /> 

                         {/* 자유게시판 */}
                        <Route path="/board/free" element={<FreeBoard />} />

                        {/* 비밀 게시판 */}
                        <Route path="/board/secret" element={<SecretBoard />}></Route>

                        {/* 새내기 게시판 */}
                        <Route path="/board/new" element={<NewBoard />}></Route>

                        {/* 진로/취업 게시판*/}
                        <Route path="/board/career" element={<CareerBoard />}></Route>

                        {/* 시간표 */}
                        <Route path="/schedule" element={<Schedule />} />

                        {/* 강의실 */}
                        <Route path="/classroom" element={<Classroom />} />

                        {/* 강의실 상세 리뷰 페이지 */}
                        <Route path="/classroom/review" element={<CourseReview />} />

                        {/* 학점계산기 */}
                        <Route path="/calculator" element={<Calculator />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;