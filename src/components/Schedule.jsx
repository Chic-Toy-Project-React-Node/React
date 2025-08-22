import React, { useState, useRef, useEffect } from 'react';
import './css/Schedule.css';
import TimeTable from './TimeTable';
import AddCourse from './AddCourse';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"; 

// 문자열 형태의 시간을 숫자로 변환 
const timeToMinutes = (hourStr, minuteStr) => {
    if (!hourStr || !minuteStr) return 0;

    let hour = parseInt(hourStr.match(/\d+/)[0], 10);
    const minute = parseInt(minuteStr.match(/\d+/)[0], 10);

    // 24시간 기준으로 변환 
    if (hourStr.includes('오후') && hour !== 12) hour += 12;

    // 자정 예외 처리
    if (hourStr.includes('오전') && hour === 12) hour = 0;

    return hour * 60 + minute;
};

function Schedule() {
    // 직접추가 버튼을 눌렀을 때 상태 관리
    const [AddCourseVisible, setAddCourseVisible] = useState(false); // 초기값은 false

    // courses와 last-modified 시간을 하나의 객체로 묶어서 관리 
    // 페이지 로드 시 localStorage에서 데이터 불러오기 (함수는 컴포넌트가 처음 렌더링 될 때 딱 한 번만 실행)
    const [timetable, setTimetable] = useState(() => {
        try {
            const savedTimetable = localStorage.getItem('myTimetable');
            if (savedTimetable) {
                return JSON.parse(savedTimetable);
            }
            // 데이터가 없으면 초기 상태를 반환합니다.
            return { courses: [], lastModified: null };
        } catch (error) {
            console.error("저장된 시간표를 불러오는 데 실패했습니다.", error);
            return { courses: [], lastModified: null };
        }
    });

    //  timetable 객체가 변경될 때마다 자동으로 저장 (항상 최신 상태 유지)
    useEffect(() => {
        localStorage.setItem('myTimetable', JSON.stringify(timetable));
        console.log('localStorage 저장 완료 & 최신 상태:', timetable);
    }, [timetable]);
    
    // 각 과목에 고유 ID를 부여하기 위한 ref 추가
    const courseIdCounter = useRef(
        // courses 배열이 비어있지 않다면 모든 course의 id 중에서 가장 큰 값을 찾고 1을 더함 
        // 배열이 비어있으면 1부터 시작
        timetable.courses.length > 0 ? Math.max(...timetable.courses.map(course => course.id)) + 1 : 1
    );

    // 수정할 과목의 데이터를 임시로 담아둘 state (default는 null)
    const [editingCourse, setEditingCourse] = useState(null);

    // 직접 추가 버튼을 클릭했을 때 실행 될 함수
    // AddCourse 컴포넌트를 화면에 표시
    const showAddCourse = () => {
        setEditingCourse(null);
        setAddCourseVisible(true);
    };

    // AddCourse 컴포넌트를 닫을 때 실행되는 함수
    const hideAddCourse = () => {
        setAddCourseVisible(false);
        setEditingCourse(null);
    }

    // AddCourse에서 저장 버튼을 눌렀을 때 실행되는 함수
    const handleSaveCourse = (courseData) => {
        // 새로 추가/수정될 강의의 모든 시간대 불러오기
        const newTimePlaces = courseData.timePlaces;

        // 기존에 저장된 강의들과 시간이 겹치는지 확인
        const isOverlapping = newTimePlaces.some(newTp => {
            const newStart = timeToMinutes(newTp.startTimeHour, newTp.startTimeMinute);
            const newEnd = timeToMinutes(newTp.endTimeHour, newTp.endTimeMinute);

            // 모든 기존 강의를 순회
            return timetable.courses.some(existingCourse => {
                // 수정 모드일 때, 자기 자신과는 비교하지 않도록 건너뛰기
                if (editingCourse && editingCourse.id === existingCourse.id) {
                    return false;
                }

                // 기존 강의의 모든 시간대를 순회
                return existingCourse.timePlaces.some(existingTp => {
                    // 요일이 다르면 겹칠 수 없으므로 건너뛰기
                    if (newTp.selectedDay !== existingTp.selectedDay) {
                        return false;
                    }

                    const existingStart = timeToMinutes(existingTp.startTimeHour, existingTp.startTimeMinute);
                    const existingEnd = timeToMinutes(existingTp.endTimeHour, existingTp.endTimeMinute);

                    // 겹치는 시간 확인 (A의 시작시간 < B의 종료시간 AND A의 종료시간 > B의 시작시간)
                    if (newStart < existingEnd && newEnd > existingStart) {
                        return true;
                    }
                    return false;
                });
            });
        });

        // 겹치는 시간이 있다면, 경고창을 띄우고 저장하지 않음 
        if (isOverlapping) {
            alert('같은 시간에 이미 수업이 있습니다!');
            return; // 함수 종료
        }

        // editingCourse state에 데이터가 있는지 확인
        if (editingCourse) {
            // 수정 모드일 경우 (editingCourse에 데이터가 있을 때)
            setTimetable(prevTimetable => {
                const updatedCourses = prevTimetable.courses.map(course =>
                    course.id === editingCourse.id ? { ...courseData, id: editingCourse.id } : course
                );
                return {
                    courses: updatedCourses,
                    lastModified: Date.now() // 현재 시간을 Unix timestamp로 저장
                };
            });
            console.log("강좌가 성공적으로 수정되었습니다.");
        } else {
            // 신규 추가 모드일 경우 (editingCourse가 null일 때)
            const courseWithId = { ...courseData, id: courseIdCounter.current };
            setTimetable(prevTimetable => ({
                courses: [...prevTimetable.courses, courseWithId],
                lastModified: Date.now() // 현재 시간을 Unix timestamp로 저장
            }));
            courseIdCounter.current += 1;
            console.log("강좌가 성공적으로 추가되었습니다.");
        }

        // 모든 작업이 끝나면 AddCourse 창 닫기
        hideAddCourse();
    };

    // 시간표에서 과목 삭제 기능
    const handleDeleteCourse = (courseIdToDelete) => {
        if (window.confirm("이 수업을 삭제하시겠습니까?")) {
            setTimetable(prevTimetable => ({
                courses: prevTimetable.courses.filter(course => course.id !== courseIdToDelete),
                lastModified: Date.now() // 현재 시간을 Unix timestamp로 저장
            }));
        }
    };

    // 시간표에서 과목 수정 기능 
    const handleUpdateCourse = (courseIdToUpdate) => {
        // 수정할 과목의 전체 데이터 찾아오기
        const courseToEdit = timetable.courses.find(course => course.id === courseIdToUpdate);
        if (courseToEdit) {
            setEditingCourse(courseToEdit); // 찾은 데이터를 수정 모드 state에 저장
            setAddCourseVisible(true);   
        }
    };

    const [select, setSelect] = useState('2025-2');

    // 1분마다 현재 시간을 업데이트하여 'n분 전' 표시가 갱신되도록 함 
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        // 1분(60000ms)마다 currentTime state를 업데이트하는 인터벌 설정
        const intervalId = setInterval(() => {
            setCurrentTime(Date.now());
        }, 60000);

        // 컴포넌트가 언마운트될 때 인터벌을 정리
        return () => clearInterval(intervalId);
    }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행

    // 시간 포맷팅 
    const formatLastModified = (timestamp) => {
        if (!timestamp) {
            return '변경 내역 없음';
        }

        const now = Date.now();
        const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));

        if (diffInMinutes < 1) {
            return '방금 전 변경';
        }
        if (diffInMinutes < 60) {
            return `${diffInMinutes}분 전 변경`;
        } else {
            const date = new Date(timestamp);
            // MM/DD HH:mm 형식으로 포맷팅 (숫자가 1자리일 경우 앞에 0 붙여주기)
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${month}/${day} ${hours}:${minutes} 변경`;
        }
    };

    return (
        <div className="main-container">
            <div className="side-bar">
                <div className="season-selector">
                    <select name="season" id="selected-season" value={select} onChange={(e) => setSelect(e.target.value)}>
                        <option value="2025-winter">2025년 겨울학기</option>
                        <option value="2025-2">2025년 2학기</option>
                        <option value="2025-summer">2025년 여름학기</option>
                        <option value="2025-1">2025년 1학기</option>
                        <option value="2024-winter">2024년 겨울학기</option>
                        <option value="2024-2">2024년 2학기</option>
                        <option value="2024-summer">2024년 여름학기</option>
                        <option value="2024-1">2024년 1학기</option>
                        <option value="2023-winter">2023년 겨울학기</option>
                        <option value="2023-2">2023년 2학기</option>
                        <option value="2023-summer">2023년 여름학기</option>
                        <option value="2023-1">2023년 1학기</option>
                        <option value="2022-winter">2022년 겨울학기</option>
                        <option value="2022-2">2022년 2학기</option>
                        <option value="2022-summer">2022년 여름학기</option>
                        <option value="2022-1">2022년 1학기</option>
                        <option value="2021-winter">2021년 겨울학기</option>
                        <option value="2021-2">2021년 2학기</option>
                        <option value="2021-summer">2021년 여름학기</option>
                        <option value="2021-1">2021년 1학기</option>
                        <option value="2020-winter">2020년 겨울학기</option>
                        <option value="2020-2">2020년 2학기</option>
                        <option value="2020-summer">2020년 여름학기</option>
                        <option value="2020-1">2020년 1학기</option>
                    </select>
                    <FontAwesomeIcon icon={faChevronDown} size="sm" className="icon" />
                </div>

                {/* 현재 시간표 정보 카드 */}
                <div className="card schedule-info">
                    <div className="card-header">
                        <span className="schedule-name">시간표입니당</span>
                    </div>
                    <p className="credits-info">
                        {/* 직접 추가하는 경우에는 학점이 표시되지 않음 */}
                        {/* <b className="credits">18 학점</b> */}
                        <span className="last-modified">
                            {formatLastModified(timetable.lastModified)}
                        </span>
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

            <TimeTable 
                courses={timetable.courses} 
                onUpdate={handleUpdateCourse}
                onDelete={handleDeleteCourse}
            />

            <button className="add-course" onClick={showAddCourse}>
                <span className="icon">+</span>&nbsp; 직접 추가
            </button>

            {/* AddCourseVisible이 true일 때만 AddCourse 컴포넌트를 렌더링 */}
            {AddCourseVisible && (<AddCourse 
                onClose={hideAddCourse} 
                onSave={handleSaveCourse} 
                // 수정할 데이터(editingCourse)가 있으면 전달하고, 없으면 null을 전달
                initialData={editingCourse}
            />)}
        </div>
    );
};

export default Schedule;