import React, { useState, useRef, useEffect } from 'react';
import './css/Schedule.css';
import TimeTable from './TimeTable';
import AddCourse from './AddCourse';
import ScheduleSetting from './ScheduleSetting';

// 아이콘 import
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

// 새로운 학기 옵션을 선택했을 때, 기본 시간표 생성 
const createDefaultScheduleData = () => {
    const defaultScheduleId = Date.now();
    return {
        schedules: [
            { id: defaultScheduleId, name: '시간표 1', visibility: 'private', isDefault: true, lastModified: Date.now() - 200000, courses: [] }
        ],
        activeScheduleId: defaultScheduleId
    };
};

function Schedule() {
    // 배경색 css
    useEffect(() => {
        // Schedule 컴포넌트가 마운트(등장)되면 body에 전용 클래스를 추가
        document.body.classList.add('body-schedule-page');

        // 컴포넌트가 언마운트(사라질 때)되면 추가했던 클래스를 제거 (뒷정리)
        return () => {
            document.body.classList.remove('body-schedule-page');
        };
    }, []); // 컴포넌트가 처음 생기고 사라질 때 딱 한 번씩만 실행

    // 현재 선택 된 학기 상태 관리
    const [currentSeason, setCurrentSeason] = useState('2025-2');

    // [데이터 구조 통합]
    // localStorage로 학기 데이터 관리 
    const [allSchedulesData, setAllSchedulesData] = useState(() => {
        let data = {};
        try {
            const savedData = localStorage.getItem('allMySchedules');
            // localStorage에 데이터가 있고, 유효한 JSON 객체인지 확인
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                if (typeof parsedData === 'object' && parsedData !== null) {
                    data = parsedData;
                }
            }
        } catch (error) {
            console.error("저장된 시간표 데이터를 불러오는 데 실패했습니다.", error);
            data = {}; // 오류 발생 시 빈 객체로 초기화
        }

        // 불러온 데이터에 현재 학기 데이터가 없으면 즉시 생성
        if (!data[currentSeason]) {
            data[currentSeason] = createDefaultScheduleData();
        }

        return data;
    });

    // 통합 데이터가 변경될 때마다 localStorage에 저장
    useEffect(() => {
        localStorage.setItem('allMySchedules', JSON.stringify(allSchedulesData));
        console.log('localStorage 저장 완료 & 최신 전체 데이터:', allSchedulesData);
    }, [allSchedulesData]);

    // 학기가 변경될 때, 해당 학기 데이터가 없으면 새로 생성 
    useEffect(() => {
        // 이미 데이터가 있다면 아무것도 하지 않음
        if (allSchedulesData[currentSeason]) {
            return;
        }

        // 선택된 학기에 대한 데이터가 없다면, 새로 생성하여 상태에 추가
        setAllSchedulesData(prevData => ({
            ...prevData,
            [currentSeason]: createDefaultScheduleData()
        }));
    }, [currentSeason, allSchedulesData]); 

    // 현재 선택된 학기(currentSeason)의 모든 데이터를 가져옴
    const currentSemesterData = allSchedulesData[currentSeason] || { schedules: [], activeScheduleId: null };

    // 시간표 목록만 추출
    const schedules = currentSemesterData.schedules;

    // 활성화된 시간표의 ID 추출
    const activeScheduleId = currentSemesterData.activeScheduleId;

    // 실제로 화면에 표시될 최종 시간표 객체를 찾음 
    const activeSchedule = schedules.find(s => s.id === activeScheduleId);

    // 직접추가 버튼을 눌렀을 때 상태 관리
    const [AddCourseVisible, setAddCourseVisible] = useState(false); // 초기값은 false
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

    // '직접 추가' 창에서 저장 버튼을 눌렀을 때 실행되는 함수
    const handleSaveCourse = (courseData) => {
        // 현재 활성화된 시간표에 있는 모든 강의 목록 가져오기
        const currentCourses = activeSchedule.courses;

        // 과목의 시간이 겹치면 true, 겹치지 않으면 false
        const isOverlapping = courseData.timePlaces.some(newTp => { // 저장하려는 과목의 각 시간대를 순회
            const newStart = timeToMinutes(newTp.startTimeHour, newTp.startTimeMinute);
            const newEnd = timeToMinutes(newTp.endTimeHour, newTp.endTimeMinute);

            // 현재 시간표에 이미 존재하는 과목과 비교
            return currentCourses.some(existingCourse => {
                // (예외처리) 만약 '수정' 모드일 경우, 자기 자신과 비교하지 않고 건너뜀
                if (editingCourse && editingCourse.id === existingCourse.id) return false;

                // 기존 강의의 시간대와 겹치는지 확인
                return existingCourse.timePlaces.some(existingTp => {
                    // 요일이 다르면 겹칠 수 없으므로 다음으로 넘어감
                    if (newTp.selectedDay !== existingTp.selectedDay) return false;

                    const existingStart = timeToMinutes(existingTp.startTimeHour, existingTp.startTimeMinute);
                    const existingEnd = timeToMinutes(existingTp.endTimeHour, existingTp.endTimeMinute);

                    // 새 강의 시작 시간이 기존 강의 종료 시간보다 빠르고, 새 강의 종료 시간이 기존 강의 시작 시간보다 늦으면 시간이 겹치는 것 
                    return newStart < existingEnd && newEnd > existingStart;
                });
            });
        });

        // 중복 처리
        if (isOverlapping) {
            alert('같은 시간에 이미 수업이 있습니다!');
            return; // 함수를 즉시 종료하여 저장되지 않도록 함
        }

        // React의 상태를 업데이트하는 함수 호출
        // 시간 중복이 없는 경우에만 이 단계가 실행 됨 
        setAllSchedulesData(prevData => {
            // 현재 학기의 시간표 목록에서 '활성화된' 시간표를 찾음
            const updatedSchedules = prevData[currentSeason].schedules.map(schedule => {
                if (schedule.id === activeScheduleId) {
                    // '활성화된' 시간표가 있다면, 해당 시간표의 과목 목록을 업데이트
                    let updatedCourses;

                    // editingCourse 상태 값에 따라 '수정' or '추가' 여부 결정
                    if (editingCourse) {
                        // 수정 모드: 기존 과목에서 ID가 일치하는 과목을 찾아 새 데이터로 교환
                        updatedCourses = schedule.courses.map(c =>
                            c.id === editingCourse.id ? { ...courseData, id: editingCourse.id } : c
                        );
                    } else {
                        // 추가 모드: 새 과목에 새로운 ID를 부여하고 기존 과목 배열의 맨 뒤에 추가
                        const courseWithId = { ...courseData, id: Date.now() };
                        updatedCourses = [...schedule.courses, courseWithId];
                    }

                    // 과목 목록이 업데이트 된 새로운 시간표 객체 반환
                    // 이때, 최종 수정 시간도 갱신 
                    return { ...schedule, courses: updatedCourses, lastModified: Date.now() };
                }

                // 활성화된 시간표가 아니라면 아무것도 변경하지 않고 그대로 반환
                return schedule;
            });

            // 최종적으로 업데이트된 시간표 목록(updatedSchedules)을 포함한 새로운 전체 데이터 객체 반환
            return {
                ...prevData,
                [currentSeason]: {
                    ...prevData[currentSeason],
                    schedules: updatedSchedules
                }
            };
        });

        hideAddCourse();
    };

    // 시간표에서 과목 삭제 기능
    const handleDeleteCourse = (courseIdToDelete) => {
        if (window.confirm("이 수업을 삭제하시겠습니까?")) {
            // 사용자가 '확인'을 누르면 상태 업데이트 시작 
            setAllSchedulesData(prevData => {
                // 현재 학기의 모든 시간표 목록 순회
                const updatedSchedules = prevData[currentSeason].schedules.map(schedule => {
                    // 현재 활성화된 시간표 찾기
                    if (schedule.id === activeScheduleId) {
                        // 과목 목록에서 삭제할 과목을 제외한 새로운 배열 만들기
                        const updatedCourses = schedule.courses.filter(c => c.id !== courseIdToDelete); // 조건이 참인 요소만 남겨 새 배열 반환

                        // 과목 목록이 업데이트 된 새로운 시간표 객체 반환
                        // 이때, 최종 수정 시간도 갱신
                        return { ...schedule, courses: updatedCourses, lastModified: Date.now() };
                    }

                    return schedule;
                });

                // 업데이트된 시간표 목록을 포함한 전체 데이터 구조를 반환하여 최종적으로 상태 업데이트
                return {
                    ...prevData,
                    [currentSeason]: {
                        ...prevData[currentSeason],
                        schedules: updatedSchedules
                    }
                };
            });
        }
    };

    // 시간표에서 과목 수정 기능 
    const handleUpdateCourse = (courseIdToUpdate) => {
        // 과목 목록에서 '수정할 과목'의 전체 데이터 찾기
        const courseToEdit = activeSchedule.courses.find(c => c.id === courseIdToUpdate); // 조건과 일치하는 첫번째 요소 반환

        if (courseToEdit) {
            setEditingCourse(courseToEdit);
            setAddCourseVisible(true);
        }
    };

    // 1분마다 현재 시간을 업데이트하여 'n분 전' 표시가 갱신되도록 함 
    const [currentTime, setCurrentTime] = useState(Date.now());

    // 시간을 항상 최신 상태로 유지
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

    // 편집할 시간표 정보를 담을 state
    // null이면 '새로 만들기', 객체가 있으면 '편집'
    const [editingSchedule, setEditingSchedule] = useState(null);

    // 설정 창 열기 함수
    const showSetting = (scheduleToEdit = null) => {
        setEditingSchedule(scheduleToEdit);
        setIsSettingVisible(true);
    };

    // 설정 창 닫기 함수
    const hideSetting = () => {
        setIsSettingVisible(false);
        setEditingSchedule(null); // 창이 닫히면 편집 상태 초기화
    };

    // 설정 창에서 '저장'을 눌렀을 때 실행할 함수
    const handleSaveSchedule = (savedInfo) => {
        // 저장 시점의 시간 기록
        const newLastModified = Date.now();

        // 상태 업데이트
        setAllSchedulesData(prevData => {
            // 기존 시간표 목록과 활성화된 ID 복사 (불변성 유지)
            let updatedSchedules = [...prevData[currentSeason].schedules];
            let newActiveScheduleId = prevData[currentSeason].activeScheduleId;

            // 저장하려는 정보에 기본 시간표 설정이 true인 경우,
            if (savedInfo.isDefault) {
                // 모든 시간표의 isDefault를 false로 초기화
                // 기본 시간표는 항상 하나만 존재하게 유지
                updatedSchedules = updatedSchedules.map(s => ({ ...s, isDefault: false }));
            }

            // '수정' or '생성' 상태 판단
            if (editingSchedule) {
                // 수정 모드
                updatedSchedules = updatedSchedules.map(s =>
                    s.id === editingSchedule.id ? { ...s, ...savedInfo, lastModified: newLastModified } : s
                );
            } else {
                // 생성 모드
                const newSchedule = { ...savedInfo, courses: [], id: Date.now(), lastModified: newLastModified };
                updatedSchedules.push(newSchedule);

                // 새로 만든 시간표를 바로 활성화
                newActiveScheduleId = newSchedule.id; 
            }

            // 시간표가 1개일 경우 항상 기본 시간표로 설정
            const isDefaultExists = updatedSchedules.some(s => s.isDefault);

            // 시간표가 있는데 기본 시간표가 하나도 없다면, 첫번째 시간표를 기본으로 강제 설정
            if (updatedSchedules.length > 0 && !isDefaultExists) {
                updatedSchedules[0].isDefault = true;
            } 
            
            // 시간표가 하나만 있다면, 그 시간표를 무조건 기본으로 강제 설정
            else if (updatedSchedules.length === 1) {
                updatedSchedules[0].isDefault = true;
            }

            return {
                ...prevData,
                [currentSeason]: {
                    schedules: updatedSchedules,
                    activeScheduleId: newActiveScheduleId
                }
            };
        });
    };

    // 시간표 삭제 기능 
    const handleDeleteSchedule = (scheduleIdToDelete) => {
        setAllSchedulesData(prevData => {
            const currentSchedules = prevData[currentSeason].schedules;
            
            // 삭제하려는 시간표가 현재 학기의 유일한 시간표인지 확인
            if (currentSchedules.length === 1 && currentSchedules[0].id === scheduleIdToDelete) {
                // 마지막 시간표를 삭제하는 경우, 새로 생성
                const newDefaultSchedule = {
                    id: Date.now(),
                    name: '시간표 1', // 이름은 '시간표 1'으로 초기화
                    visibility: 'private',
                    isDefault: true, // 유일한 시간표이므로 기본값으로 설정
                    lastModified: Date.now(),
                    courses: [],
                };

                return {
                    ...prevData,
                    [currentSeason]: {
                        schedules: [newDefaultSchedule],
                        activeScheduleId: newDefaultSchedule.id
                    }
                };
            }

            // 시간표가 여러 개 있는 경우, 기존 삭제 로직 수행
            let remainingSchedules = currentSchedules.filter(s => s.id !== scheduleIdToDelete);
            let newActiveScheduleId = prevData[currentSeason].activeScheduleId;

            // 기본 시간표가 삭제 되었는지 확인
            const isDefaultExists = remainingSchedules.some(s => s.isDefault);
            if (!isDefaultExists) {
                // 기본 시간표가 삭제되었다면, 남은 것 중 첫 번째를 기본으로 설정
                remainingSchedules[0].isDefault = true;
            }

            // 현재 보고있던 시간표가 삭제 되었는지 확인 
            if (activeScheduleId === scheduleIdToDelete) {
                // 활성화된 시간표가 삭제되었다면, 기본 시간표를 활성화
                newActiveScheduleId = remainingSchedules.find(s => s.isDefault).id || remainingSchedules[0].id;
            }

            return {
                ...prevData,
                [currentSeason]: {
                    schedules: remainingSchedules,
                    activeScheduleId: newActiveScheduleId
                }
            };
        });
    };

    // 시간표 목록에서 다른 시간표를 클릭했을 때 활성 시간표를 변경하는 함수
    const handleSetActive = (scheduleId) => {
        setAllSchedulesData(prevData => ({
            ...prevData,
            [currentSeason]: {
                ...prevData[currentSeason],
                activeScheduleId: scheduleId
            }
        }));
    };

    // '새 시간표 만들기' 버튼을 클릭했을 때 실행되는 함수
    const handleAddNewSchedule = () => {
        setAllSchedulesData(prevData => {
            const existingSchedules = prevData[currentSeason].schedules;

            // '시간표 [숫자]' 형식으로 새 시간표의 이름 지정
            const scheduleNumbers = existingSchedules
                .map(s => {
                    const match = s.name.match(/^시간표 (\d+)$/);
                    return match ? parseInt(match[1], 10) : 0;
                })
                .filter(num => num > 0);
    
            const nextNumber = scheduleNumbers.length > 0 ? Math.max(...scheduleNumbers) + 1 : 1;
    
            // 새 시간표 객체 생성
            const newSchedule = {
                id: Date.now(),
                name: `시간표 ${nextNumber}`,
                visibility: 'private',
                // 기존 시간표가 없다면, 이 시간표가 처음이므로 기본 시간표로 설정
                isDefault: existingSchedules.length === 0,
                lastModified: Date.now(),
                courses: [],
            };

            const updatedSchedules = [...existingSchedules, newSchedule];
    
            return {
                ...prevData,
                [currentSeason]: {
                    schedules: updatedSchedules,
                    activeScheduleId: newSchedule.id // 새 시간표를 활성화
                }
            };
        });
    };

    return (
        <div className="schedule-container">
            <div className="side-bar">
                <div className="season-selector">
                <select name="season" id="selected-season" value={currentSeason} onChange={(e) => setCurrentSeason(e.target.value)}>
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

                {/* 현재 시간표 정보 */}
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
                        onDelete={handleDeleteSchedule}
                        totalSchedules={schedules.length}
                    />
                )}

                {/* 시간표 목록 및 생성 */}
                <div className="schedule-list card">
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
                    <button className="action-btn add-new" onClick={handleAddNewSchedule}>
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