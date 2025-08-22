import React, { useState, useEffect } from 'react';

function TimePlaceItem({ itemData, onChange, onDelete }) {
    return (
        <li>
            {/* 요일 선택 버튼 그룹 */}
            <div className="day-selector">
                {['월', '화', '수', '목', '금', '토'].map((day) => (
                <button
                    key={day}
                    className={`day-button ${itemData.selectedDay === day ? 'selected' : ''}`}
                    onClick={() => onChange(itemData.id, 'selectedDay', day)}
                >
                    {day}
                </button>
                ))}
            </div>

            {/* 시간 및 장소 입력 그룹 */}
            <div className="time-place-selector">
                {/* 시작 시간 */}
                <select className="start-hour" value={itemData.startTimeHour} onChange={(e) => onChange(itemData.id, 'startTimeHour', e.target.value)}>
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
                <select className="start-minute" value={itemData.startTimeMinute} onChange={(e) => onChange(itemData.id, 'startTimeMinute', e.target.value)}>
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
                <select className="end-hour" value={itemData.endTimeHour} onChange={(e) => onChange(itemData.id, 'endTimeHour', e.target.value)}>
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
                <select className="end-minute" value={itemData.endTimeMinute} onChange={(e) => onChange(itemData.id, 'endTimeMinute', e.target.value)}>
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
                    value={itemData.location}
                    onChange={(e) => onChange(itemData.id, 'location', e.target.value)}
                />

                <div className="delete-item-container">
                    {/* 삭제 버튼 추가 */}
                    <button type="button" className="delete-item-button" onClick={() => onDelete(itemData.id)}>
                        삭제
                    </button>
                </div>
            </div>
        </li>
    );
}

export default TimePlaceItem;