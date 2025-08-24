import React, { useState, useRef, useEffect } from 'react';
import './css/Schedule.css';
import TimeTable from './TimeTable';
import AddCourse from './AddCourse';
import ScheduleSetting from './ScheduleSetting';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faGear, faDownLong } from "@fortawesome/free-solid-svg-icons"; 

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
    // [데이터 구조 통합]
    // 이제 schedules가 모든 시간표 정보와 각 시간표의 과목(courses) 데이터를 관리합니다.
    const [schedules, setSchedules] = useState(() => {
        try {
            const savedSchedules = localStorage.getItem('mySchedules');
            if (savedSchedules) {
                return JSON.parse(savedSchedules);
            }
            // 데이터가 없으면 초기 상태 반환 (courses 배열 포함)
            return [
                { id: 1, name: '나의 기본 시간표', visibility: 'private', isDefault: true, lastModified: Date.now() - 200000, courses: [] }
            ];
        } catch (error) {
            console.error("저장된 시간표 목록을 불러오는 데 실패했습니다.", error);
            return [
                { id: 1, name: '나의 기본 시간표', visibility: 'private', isDefault: true, lastModified: Date.now() - 200000, courses: [] }
            ];
        }
    });

    // schedules 객체가 변경될 때마다 localStorage에 저장
    useEffect(() => {
        localStorage.setItem('mySchedules', JSON.stringify(schedules));
        console.log('localStorage 저장 완료 & 최신 schedules 상태:', schedules);
    }, [schedules]);

    // [활성 시간표 로직]
    const [activeScheduleId, setActiveScheduleId] = useState(() => {
        // 기본 시간표를 찾아 활성화하거나, 없으면 첫 번째 시간표를 활성화
        const defaultSchedule = schedules.find(s => s.isDefault);
        return schedules.length > 0 ? (defaultSchedule ? defaultSchedule.id : schedules[0].id) : null;
    });
    const activeSchedule = schedules.find(s => s.id === activeScheduleId);


    // 직접추가 버튼을 눌렀을 때 상태 관리
    const [AddCourseVisible, setAddCourseVisible] = useState(false); // 초기값은 false
    const [editingCourse, setEditingCourse] = useState(null);
    const courseIdCounter = useRef(1); // ID 관리 단순화

    // courses와 last-modified 시간을 하나의 객체로 묶어서 관리 
    // 페이지 로드 시 localStorage에서 데이터 불러오기 (함수는 컴포넌트가 처음 렌더링 될 때 딱 한 번만 실행)
    // const [timetable, setTimetable] = useState(() => {
    //     try {
    //         const savedTimetable = localStorage.getItem('myTimetable');
    //         if (savedTimetable) {
    //             return JSON.parse(savedTimetable);
    //         }
    //         // 데이터가 없으면 초기 상태 반환
    //         return { courses: [], lastModified: null };
    //     } catch (error) {
    //         console.error("저장된 시간표를 불러오는 데 실패했습니다.", error);
    //         return { courses: [], lastModified: null };
    //     }
    // });

    // //  timetable 객체가 변경될 때마다 자동으로 저장 (항상 최신 상태 유지)
    // useEffect(() => {
    //     localStorage.setItem('myTimetable', JSON.stringify(timetable));
    //     console.log('localStorage 저장 완료 & 최신 상태:', timetable);
    // }, [timetable]);
    
    // 각 과목에 고유 ID를 부여하기 위한 ref 추가
    // const courseIdCounter = useRef(
    //     // courses 배열이 비어있지 않다면 모든 course의 id 중에서 가장 큰 값을 찾고 1을 더함 
    //     // 배열이 비어있으면 1부터 시작
    //     timetable.courses.length > 0 ? Math.max(...timetable.courses.map(course => course.id)) + 1 : 1
    // );

    // // 수정할 과목의 데이터를 임시로 담아둘 state (default는 null)
    // const [editingCourse, setEditingCourse] = useState(null);

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
    // const handleSaveCourse = (courseData) => {
    //     // 새로 추가/수정될 강의의 모든 시간대 불러오기
    //     const newTimePlaces = courseData.timePlaces;

    //     // 기존에 저장된 강의들과 시간이 겹치는지 확인
    //     const isOverlapping = newTimePlaces.some(newTp => {
    //         const newStart = timeToMinutes(newTp.startTimeHour, newTp.startTimeMinute);
    //         const newEnd = timeToMinutes(newTp.endTimeHour, newTp.endTimeMinute);

    //         // 모든 기존 강의를 순회
    //         return timetable.courses.some(existingCourse => {
    //             // 수정 모드일 때, 자기 자신과는 비교하지 않도록 건너뛰기
    //             if (editingCourse && editingCourse.id === existingCourse.id) {
    //                 return false;
    //             }

    //             // 기존 강의의 모든 시간대를 순회
    //             return existingCourse.timePlaces.some(existingTp => {
    //                 // 요일이 다르면 겹칠 수 없으므로 건너뛰기
    //                 if (newTp.selectedDay !== existingTp.selectedDay) {
    //                     return false;
    //                 }

    //                 const existingStart = timeToMinutes(existingTp.startTimeHour, existingTp.startTimeMinute);
    //                 const existingEnd = timeToMinutes(existingTp.endTimeHour, existingTp.endTimeMinute);

    //                 // 겹치는 시간 확인 (A의 시작시간 < B의 종료시간 AND A의 종료시간 > B의 시작시간)
    //                 if (newStart < existingEnd && newEnd > existingStart) {
    //                     return true;
    //                 }
    //                 return false;
    //             });
    //         });
    //     });

    //     // 겹치는 시간이 있다면, 경고창을 띄우고 저장하지 않음 
    //     if (isOverlapping) {
    //         alert('같은 시간에 이미 수업이 있습니다!');
    //         return; // 함수 종료
    //     }

    //     const newLastModified = Date.now(); // 시간 형식을 숫자로 통일

    //     // editingCourse state에 데이터가 있는지 확인
    //     if (editingCourse) {
    //         // 수정 모드일 경우 (editingCourse에 데이터가 있을 때)
    //         setTimetable(prevTimetable => {
    //             const updatedCourses = prevTimetable.courses.map(course =>
    //                 course.id === editingCourse.id ? { ...courseData, id: editingCourse.id } : course
    //             );
    //             return {
    //                 courses: updatedCourses,
    //                 lastModified: newLastModified // 현재 시간을 Unix timestamp로 저장
    //             };
    //         });
    //         console.log("강좌가 성공적으로 수정되었습니다.");
    //     } else {
    //         // 신규 추가 모드일 경우 (editingCourse가 null일 때)
    //         const courseWithId = { ...courseData, id: courseIdCounter.current };
    //         setTimetable(prevTimetable => ({
    //             courses: [...prevTimetable.courses, courseWithId],
    //             lastModified: newLastModified // 현재 시간을 Unix timestamp로 저장
    //         }));
    //         courseIdCounter.current += 1;
    //         console.log("강좌가 성공적으로 추가되었습니다.");
    //     }

    //     // 모든 작업이 끝나면 AddCourse 창 닫기
    //     hideAddCourse();
    // };

    const handleSaveCourse = (courseData) => {
        const currentCourses = activeSchedule.courses;
        const isOverlapping = courseData.timePlaces.some(newTp => {
            const newStart = timeToMinutes(newTp.startTimeHour, newTp.startTimeMinute);
            const newEnd = timeToMinutes(newTp.endTimeHour, newTp.endTimeMinute);
            return currentCourses.some(existingCourse => {
                if (editingCourse && editingCourse.id === existingCourse.id) return false;
                return existingCourse.timePlaces.some(existingTp => {
                    if (newTp.selectedDay !== existingTp.selectedDay) return false;
                    const existingStart = timeToMinutes(existingTp.startTimeHour, existingTp.startTimeMinute);
                    const existingEnd = timeToMinutes(existingTp.endTimeHour, existingTp.endTimeMinute);
                    return newStart < existingEnd && newEnd > existingStart;
                });
            });
        });

        if (isOverlapping) {
            alert('같은 시간에 이미 수업이 있습니다!');
            return;
        }

        setSchedules(prevSchedules => prevSchedules.map(schedule => {
            if (schedule.id === activeScheduleId) {
                let updatedCourses;
                if (editingCourse) { // 수정 모드
                    updatedCourses = schedule.courses.map(c =>
                        c.id === editingCourse.id ? { ...courseData, id: editingCourse.id } : c
                    );
                } else { // 추가 모드
                    const courseWithId = { ...courseData, id: Date.now() }; // ID를 timestamp로 부여
                    updatedCourses = [...schedule.courses, courseWithId];
                }
                return { ...schedule, courses: updatedCourses, lastModified: Date.now() };
            }
            return schedule;
        }));

        hideAddCourse();
    };

    // 시간표에서 과목 삭제 기능
    // const handleDeleteCourse = (courseIdToDelete) => {
    //     if (window.confirm("이 수업을 삭제하시겠습니까?")) {
    //         setTimetable(prevTimetable => ({
    //             courses: prevTimetable.courses.filter(course => course.id !== courseIdToDelete),
    //             lastModified: Date.now() // 현재 시간을 Unix timestamp로 저장
    //         }));
    //     }
    // };
    const handleDeleteCourse = (courseIdToDelete) => {
        if (window.confirm("이 수업을 삭제하시겠습니까?")) {
            setSchedules(prevSchedules => prevSchedules.map(schedule => {
                if (schedule.id === activeScheduleId) {
                    const updatedCourses = schedule.courses.filter(c => c.id !== courseIdToDelete);
                    return { ...schedule, courses: updatedCourses, lastModified: Date.now() };
                }
                return schedule;
            }));
        }
    };

    // 시간표에서 과목 수정 기능 
    const handleUpdateCourse = (courseIdToUpdate) => {
        const courseToEdit = activeSchedule.courses.find(c => c.id === courseIdToUpdate);
        if (courseToEdit) {
            setEditingCourse(courseToEdit);
            setAddCourseVisible(true);
        }
    };

    const [select, setSelect] = useState('2025-2');

    // 1분마다 현재 시간을 업데이트하여 'n분 전' 표시가 갱신되도록 함 
    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        const intervalId = setInterval(() => setCurrentTime(Date.now()), 60000);
        return () => clearInterval(intervalId);
    }, []);

    // 시간 포맷팅 
    const formatLastModified = (timestamp) => {
        if (!timestamp) return '변경 내역 없음';
        const diffInMinutes = Math.floor((currentTime - timestamp) / (1000 * 60));
        if (diffInMinutes < 1) return '방금 전 변경';
        if (diffInMinutes < 60) return `${diffInMinutes}분 전 변경`;
        const date = new Date(timestamp);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${month}/${day} ${hours}:${minutes} 변경`;
    };


    // 설정 컴포넌트의 표시 여부를 관리할 state 추가
    const [isSettingVisible, setIsSettingVisible] = useState(false);

    

    // (예시) 부모 컴포넌트가 가지고 있는 시간표 목록 데이터
    // const [schedules, setSchedules] = useState([
    //     { id: 1, name: '나의 기본 시간표', visibility: 'private', isDefault: true, lastModified: Date.now() - 200000 },
    //     { id: 2, name: '팀 프로젝트', visibility: 'friends', isDefault: false, astModified: Date.now() - 50000000 },
    // ]);

    // 2. 현재 활성화된 시간표의 ID를 관리하는 state (기본값으로 첫 번째 시간표 ID 설정)
    // const [activeScheduleId, setActiveScheduleId] = useState(schedules.length > 0 ? schedules[0].id : null);

    // 편집할 시간표 정보를 담을 state. null이면 '새로 만들기', 객체가 있으면 '편집'
    const [editingSchedule, setEditingSchedule] = useState(null);

    //--- Helper ---//
    // 활성화된 시간표 객체를 찾아서 변수로 저장 (렌더링 시 편리함)
    // const activeSchedule = schedules.find(s => s.id === activeScheduleId);

    // 설정 모달 열기 함수
    // scheduleToEdit 데이터가 있으면 '편집 모드'로, 없으면 '새 시간표 모드'로 엽니다.
    const showSetting = (scheduleToEdit = null) => {
        setEditingSchedule(scheduleToEdit);
        setIsSettingVisible(true);
    };

    // 설정 모달 닫기 함수
    const hideSetting = () => {
        setIsSettingVisible(false);
        setEditingSchedule(null); // 모달이 닫히면 편집 상태 초기화
    };

    // 자식 컴포넌트에서 '저장' 눌렀을 때 실행될 함수
    const handleSaveSchedule = (savedInfo) => {
        const newLastModified = Date.now();
        let updatedSchedules = [...schedules];

        if (savedInfo.isDefault) {
            updatedSchedules = updatedSchedules.map(s => ({ ...s, isDefault: false }));
        }

        if (editingSchedule) {
            updatedSchedules = updatedSchedules.map(s =>
                s.id === editingSchedule.id ? { ...s, ...savedInfo, lastModified: newLastModified } : s
            );
        } else {
            const newSchedule = { ...savedInfo, courses: [], id: Date.now(), lastModified: newLastModified };
            updatedSchedules.push(newSchedule);
            setActiveScheduleId(newSchedule.id);
        }

        // 저장 후에도 기본 시간표가 없는 경우, 첫 번째 항목을 기본으로 설정
        const isDefaultExists = updatedSchedules.some(s => s.isDefault);
        if (!isDefaultExists && updatedSchedules.length > 0) {
            updatedSchedules[0].isDefault = true;
        }

        setSchedules(updatedSchedules);
    };

    // [삭제 기능 추가]
    const handleDeleteSchedule = (scheduleIdToDelete) => {
        let remainingSchedules = schedules.filter(s => s.id !== scheduleIdToDelete);

        if (remainingSchedules.length > 0) {
            const isDefaultExists = remainingSchedules.some(s => s.isDefault);
            if (!isDefaultExists) {
                remainingSchedules[0].isDefault = true;
            }
            if (activeScheduleId === scheduleIdToDelete) {
                setActiveScheduleId(remainingSchedules[0].id);
            }
        } else {
            setActiveScheduleId(null);
        }
        setSchedules(remainingSchedules);
    };

    // 시간표 목록에서 항목을 클릭했을 때 활성 시간표를 변경하는 함수
    const handleSetActive = (scheduleId) => {
        setActiveScheduleId(scheduleId);
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
                {activeSchedule && (
                    <div className="card schedule-info">
                        <div className="card-header">
                            <span className="schedule-name">{activeSchedule.name}</span>
                        </div>
                        <p className="credits-info">
                            {/* 직접 추가하는 경우에는 학점이 표시되지 않음 */}
                            {/* <b className="credits">18 학점</b> */}
                            <span className="last-modified">
                                {formatLastModified(activeSchedule.lastModified)}
                            </span>
                        </p>
                        <div className="button-group">
                            <button className="btn">
                                <FontAwesomeIcon icon={faDownLong} size="sm" className="icon" style={{color: '#f91f15'}} />
                                이미지
                            </button>
                            <button className="btn" onClick={() => showSetting(activeSchedule)}>
                                <FontAwesomeIcon icon={faGear} size="sm" className="icon" style={{color: '#f91f15'}} />
                                설정
                            </button>
                        </div>
                    </div>
                )}
                

                {/* isSettingVisible이 true일 때 ScheduleSetting 컴포넌트 렌더링 */}
                {isSettingVisible && (
                    <ScheduleSetting 
                        onClose={hideSetting}
                        onSave={handleSaveSchedule}
                        scheduleToEdit={editingSchedule} 
                        // [삭제 함수 및 시간표 개수 전달]
                        onDelete={handleDeleteSchedule}
                        totalSchedules={schedules.length}
                    />
                )}

                {/* 시간표 목록 및 생성 */}
                <div className="card schedule-list">
                    {schedules.map(schedule => (
                        <div 
                            key={schedule.id} 
                            className={`list-item ${schedule.id === activeScheduleId ? 'active' : ''}`}
                            onClick={() => handleSetActive(schedule.id)}
                        >
                            <span className="schedule-name">{schedule.name}</span>
                            {schedule.isDefault && <span className="active-schedule">기본시간표</span>}
                        </div>
                    ))}
                </div>

                <div className="card schedule-actions">
                    <button className="action-btn add-new">
                        <span className="icon">+</span> 
                        <span>새 시간표 만들기</span>
                    </button>
                    {/* 시간표 마법사는 수업 목록에서 찾기 때문에 api 없이는 어려울 듯 */}
                    {/* <button className="action-btn wizard">
                        <span className="icon">🪄</span> 
                        <span>마법사로 시간표 만들기</span>
                    </button> */}
                </div>
            </div>

            <TimeTable 
                // 이제 activeSchedule의 courses를 넘겨줍니다.
                courses={activeSchedule ? activeSchedule.courses : []}
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