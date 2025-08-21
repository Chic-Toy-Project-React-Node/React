import React, { useState } from 'react';
import './css/Schedule.css';
import TimeTable from './TimeTable';
import AddCourse from './AddCourse';


function Schedule() {
    // 직접추가 버튼을 눌렀을 때 상태 관리
    const [AddCourseVisible, setAddCourseVisible] = useState(false); // 초기값은 false

    // 직접 추가 버튼을 클릭했을 때 실행 될 함수
    // AddCourse 컴포넌트를 화면에 표시
    const showAddCourse = () => {
        setAddCourseVisible(true);
    };

    // AddCourse 컴포넌트를 닫을 때 실행되는 함수
    const hideAddCourse = () => {
        setAddCourseVisible(false);
    }

    // AddCourse에서 저장 버튼을 눌렀을 때 실행되는 함수
    const handleSaveCourse = () => {
        console.log("강좌가 추가되었습니다.");

        setAddCourseVisible(false);
    }

    return (
        <div className="main-container">
            <div className="side-bar">
                <div className="season-selector">
                    <select name="season" id="selected-season">
                        <option value="2025-2">2025년 2학기</option>
                        <option value="2025-summer">2025년 여름학기</option>
                        <option value="2025-1">2025년 1학기</option>
                    </select>
                </div>


                {/* 2. 현재 시간표 정보 카드 */}
                <div className="card schedule-info">
                    <div className="card-header">
                        <span className="schedule-name">시간표입니당</span>
                    </div>
                    <p className="credits-info">
                        <b className="credits">18 학점</b>
                        <span className="last-modified">08/19 09:27 변경</span>
                    </p>
                    <div className="button-group">
                        <button className="btn">
                            이미지
                        </button>
                        <button className="btn">
                            설정
                        </button>
                    </div>
                </div>

                {/* 3. 시간표 목록 및 생성 */}
                <div className="card schedule-list">
                    <div className="list-item">
                        <span className="schedule-name">시간표입니당</span>
                        <span className="active-schedule">기본시간표</span>
                    </div>
                </div>

                <div className="card schedule-actions">
                    <button className="action-btn add-new">
                        <span className="icon">+</span> 
                        <span>새 시간표 만들기</span>
                    </button>
                    <button className="action-btn wizard">
                        <span className="icon">🪄</span> 
                        <span>마법사로 시간표 만들기</span>
                    </button>
                </div>

                
            </div>

            <TimeTable />

            <button className="add-course" onClick={showAddCourse}>
                <span className="icon">+</span>&nbsp; 직접 추가
            </button>

            {/* AddCourseVisible이 true일 때만 AddCourse 컴포넌트를 렌더링 */}
            {AddCourseVisible && (<AddCourse onClose={hideAddCourse} onSave={handleSaveCourse} />)}
        </div>
    );
};

export default Schedule;