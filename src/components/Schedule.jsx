import React, { useState, useRef } from 'react';
import './css/Schedule.css';
import TimeTable from './TimeTable';
import AddCourse from './AddCourse';


function Schedule() {
    // 직접추가 버튼을 눌렀을 때 상태 관리
    const [AddCourseVisible, setAddCourseVisible] = useState(false); // 초기값은 false

    // 여러 courseData 객체를 담을 배열 상태 추가
    const [courses, setCourses] = useState([]);
    
    // 각 과목에 고유 ID를 부여하기 위한 ref 추가
    const courseIdCounter = useRef(1);

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
    const handleSaveCourse = (courseData) => {
        // 새 과목에 고유 ID를 추가
        const courseWithId = { ...courseData, id: courseIdCounter.current };

        // 기존 courses 배열에 새로 받은 과목 데이터를 추가하여 상태를 업데이트
        setCourses(prevCourses => [...prevCourses, courseWithId]);

        // 다음 ID를 위해 카운터를 1 증가
        courseIdCounter.current += 1;

        // AddCourse 창 닫기
        setAddCourseVisible(false);

        // 확인용 로그 (추후 삭제)
        console.log("강좌가 성공적으로 추가되었습니다.");
        console.log(courses);
    };

    return (
        <div className="main-container">
            <div className="side-bar">
                <div className="season-selector">
                    <select name="season" id="selected-season">
                        <option>2025년 겨울학기</option>
                        <option selected>2025년 2학기</option>
                        <option>2025년 여름학기</option>
                        <option>2025년 1학기</option>
                        <option>2024년 겨울학기</option>
                        <option>2024년 2학기</option>
                        <option>2024년 여름학기</option>
                        <option>2024년 1학기</option>
                        <option>2023년 겨울학기</option>
                        <option>2023년 2학기</option>
                        <option>2023년 여름학기</option>
                        <option>2023년 1학기</option>
                        <option>2022년 겨울학기</option>
                        <option>2022년 2학기</option>
                        <option>2022년 여름학기</option>
                        <option>2022년 1학기</option>
                        <option>2021년 겨울학기</option>
                        <option>2021년 2학기</option>
                        <option>2021년 여름학기</option>
                        <option>2021년 1학기</option>
                        <option>2020년 겨울학기</option>
                        <option>2020년 2학기</option>
                        <option>2020년 여름학기</option>
                        <option>2020년 1학기</option>
                    </select>
                </div>

                {/* 현재 시간표 정보 카드 */}
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

                {/* 시간표 목록 및 생성 */}
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