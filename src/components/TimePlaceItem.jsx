import React, { useState } from 'react';

// onDelete 함수와 id를 props로 받습니다.
function TimePlaceItem({ id, onDelete }) {
  // 각 TimePlaceItem이 독립적인 상태를 갖도록 useState를 내부에 선언합니다.
  const [selectedDay, setSelectedDay] = useState('월');
  const [startTimeHour, setStartTimeHour] = useState('오전 9시');
  const [startTimeMinute, setStartTimeMinute] = useState('0분');
  const [endTimeHour, setEndTimeHour] = useState('오전 10시');
  const [endTimeMinute, setEndTimeMinute] = useState('0분');
  const [location, setLocation] = useState('');

  return (
    <li>
        {/* 요일 선택 버튼 그룹 */}
        <div className="day-selector">
            {['월', '화', '수', '목', '금', '토'].map((day) => (
            <button
                key={day}
                className={`day-button ${selectedDay === day ? 'selected' : ''}`}
                onClick={() => setSelectedDay(day)}
            >
                {day}
            </button>
            ))}
        </div>

        {/* 시간 및 장소 입력 그룹 */}
        <div className="time-place-selector">
            {/* 시작 시간 */}
            <select className="start-hour" value={startTimeHour} onChange={(e) => setStartTimeHour(e.target.value)}>
                <option>오전 8시</option>
                <option>오전 9시</option>
                <option>오전 10시</option>
                <option>오전 11시</option>
                <option>오후 12시</option>
                <option>오후 1시</option>
                <option>오후 2시</option>
                <option>오후 3시</option>
                <option>오후 4시</option>
                <option>오후 5시</option>
                <option>오후 6시</option>
                <option>오후 7시</option>
                <option>오후 8시</option>
                <option>오후 9시</option>
                <option>오후 10시</option>
                <option>오후 11시</option>
            </select>
            <select className="start-minute" value={startTimeMinute} onChange={(e) => setStartTimeMinute(e.target.value)}>
                <option>0분</option>
                <option>5분</option>
                <option>10분</option>
                <option>15분</option>
                <option>20분</option>
                <option>25분</option>
                <option>30분</option>
                <option>35분</option>
                <option>40분</option>
                <option>45분</option>
                <option>50분</option>
                <option>55분</option>
            </select>
            
            <span className="tilde">~</span>

            {/* 종료 시간 */}
            <select className="end-hour" value={endTimeHour} onChange={(e) => setEndTimeHour(e.target.value)}>
                <option>오전 8시</option>
                <option>오전 9시</option>
                <option>오전 10시</option>
                <option>오전 11시</option>
                <option>오후 12시</option>
                <option>오후 1시</option>
                <option>오후 2시</option>
                <option>오후 3시</option>
                <option>오후 4시</option>
                <option>오후 5시</option>
                <option>오후 6시</option>
                <option>오후 7시</option>
                <option>오후 8시</option>
                <option>오후 9시</option>
                <option>오후 10시</option>
                <option>오후 11시</option>
            </select>
            <select className="end-minute" value={endTimeMinute} onChange={(e) => setEndTimeMinute(e.target.value)}>
            <option>0분</option>
                <option>5분</option>
                <option>10분</option>
                <option>15분</option>
                <option>20분</option>
                <option>25분</option>
                <option>30분</option>
                <option>35분</option>
                <option>40분</option>
                <option>45분</option>
                <option>50분</option>
                <option>55분</option>
            </select>
            
            {/* 장소 입력 */}
            <input
                className="place"
                type="text"
                placeholder="예) 새104"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            />

            <div className="delete-item-container">
                {/* 삭제 버튼 추가 */}
                <button type="button" className="delete-item-button" onClick={() => onDelete(id)}>
                    삭제
                </button>
            </div>

            
        </div>
    </li>
  );
}

export default TimePlaceItem;