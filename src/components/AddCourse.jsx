import React, { useState, useRef } from 'react';
import './css/AddCourse.css';
import TimePlaceItem from './TimePlaceItem';

function AddCourse({ onClose, onSave }) {
    const [courseName, setCourseName] = useState('');
    const [professorName, setProfessorName] = useState('');

    // 시간/장소 배열 state
    const [timePlaces, setTimePlaces] = useState([
        // 초기값
        {
            id: 1, 
            selectedDay: '월',
            startTimeHour: '오전 9시',
            startTimeMinute: '0분',
            endTimeHour: '오전 10시',
            endTimeMinute: '0분',
            Location: ''
        },
    ]);

    // 컴포넌트가 리렌더링 되어도 초기화 되지 않게 하기 위함
    const nextId = useRef(2);

    // TimePlaceItem의 정보가 변경될 때 호출될 함수
    const handleTimePlaceChange = (id, field, value) => {
        setTimePlaces(prev =>
            prev.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    // '더 입력' 버튼 클릭 시 실행되는 함수
    const addTimePlace = () => {
        const newItem = {
            id: nextId.current, 
            selectedDay: '월',
            startTimeHour: '오전 9시',
            startTimeMinute: '0분',
            endTimeHour: '오전 10시',
            endTimeMinute: '0분',
            Location: ''
        };

        setTimePlaces([...timePlaces, newItem]);
        nextId.current += 1;
    }

    // 시간/장소 항목을 삭제하는 함수
    const deleteTimePlace = (id) => {
        setTimePlaces(timePlaces.filter(item => item.id !== id));
    }

    const handleLocalSave = () => {
        const courseData = { courseName, professorName, timePlaces };

        onSave(courseData);
    }

    return (
        <div className="add-container">
            <h1>새 수업 추가</h1>

            <div className="course-info">
                <div>
                    <label className="label course-name" htmlFor="course-name">과목명 (필수)</label>
                    <input 
                        type="text" 
                        id="course-name" 
                        placeholder="예) 웹서비스설계및실습"
                        value={courseName} 
                        onChange={(e) => setCourseName(e.target.value)} 
                    />
                </div>

                <div>
                    <label className="label professor-name" htmlFor="professor-name">교수명</label>
                    <input 
                        type="text" 
                        id="professor-name"
                        placeholder="예) 박규동"
                        value={professorName}
                        onChange={(e) => setProfessorName(e.target.value)}
                    />
                </div>

                <div>
                    <h3 className="label time-place">시간/장소</h3>
                    <div id="time-place">
                        <ul>
                            {timePlaces.map(item => (
                                <TimePlaceItem
                                    key={item.id}
                                    itemData={item} // 각 아이템의 데이터를 props로 전달
                                    onChange={handleTimePlaceChange} // 값이 변경될 때 호출할 함수 전달
                                    onDelete={deleteTimePlace}
                                />
                            ))}
                        </ul>

                        {/* 리스트 아이템이 5개가 되면 버튼 사라짐 */}
                        {timePlaces.length < 5 && (
                            <button type="button" onClick={addTimePlace}>
                                <span className="icon">+</span>
                                더 입력
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="actions">
                    <button className="cancel-btn" onClick={onClose}>×</button>
                    <button className="save-btn" onClick={handleLocalSave}>저장</button>
                </div>
            </div>

        </div>
    );
}

export default AddCourse;