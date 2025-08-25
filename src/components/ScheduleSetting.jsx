import './css/Schedule.css';
import React, { useState, useEffect } from 'react';

function ScheduleSetting({ onClose, onSave, scheduleToEdit, onDelete, totalSchedules }) {
    // 시간표 설정 정보 상태 관리
    const [scheduleInfo, setScheduleInfo] = useState({
        name: '',
        visibility: 'public',
        isDefault: true,
    });

    // 컴포넌트가 처음 렌더링되거나 scheduleToEdit prop이 변경될 때 실행
    // 기존 설정 정보로 상태 채우기
    useEffect(() => {
        if (scheduleToEdit) {
            setScheduleInfo(scheduleToEdit);
        } else {
            // '새 시간표 만들기' 모드일 때
            setScheduleInfo({
                name: '',
                visibility: 'public',
                isDefault: totalSchedules === 0, // 시간표가 하나도 없다면 해당 시간표가 기본값
            });
        }
    }, [scheduleToEdit, totalSchedules]);

    // 입력(input, radio, checkbox) 값이 변경될 때마다 scheduleInfo state를 업데이트하는 함수
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setScheduleInfo(prevInfo => ({
            ...prevInfo,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // 저장 버튼 클릭 시 실행될 함수
    const handleSave = () => {
        if (!scheduleInfo.name.trim()) {
            alert("시간표 이름을 입력해주세요.");
            return;
        }
        onSave(scheduleInfo);
        onClose();
    };

    // 삭제 버튼 클릭 시 실행될 함수
    const handleDelete = () => {
        if (scheduleToEdit && window.confirm(`'${scheduleToEdit.name}' 시간표를 삭제하시겠습니까?`)) {
            onDelete(scheduleToEdit.id);
            onClose();
        }
    };

    // 체크박스 비활성화 여부 결정
    // 시간표가 하나밖에 없고, 그 시간표가 기본 시간표로 설정되어 있다면 체크박스 비활성화
    const isCheckboxDisabled = totalSchedules === 1 && scheduleInfo.isDefault;

    return (
        <div className="modalwrap">
            <div className="setting-container">
                <h3 className="setting-name">시간표 설정</h3>
                <div className="name">
                    <label htmlFor="schedule-name" className="name">이름</label>
                    <input 
                        type="text" 
                        id="schedule-name" 
                        name="name"
                        value={scheduleInfo.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="visibility">
                    <h3 htmlFor="schedule-visibility" className="visibility">공개 범위</h3>
                    <label className="radio-option">
                        <input type="radio" name="visibility" value="public" 
                            checked={scheduleInfo.visibility === 'public'}
                            onChange={handleChange} 
                        />
                        <span>전체공개</span>
                    </label>

                    <label className="radio-option">
                        <input type="radio" name="visibility" value="friends" 
                            checked={scheduleInfo.visibility === 'friends'}
                            onChange={handleChange}
                        />
                        <span>친구공개</span>
                    </label>

                    <label className="radio-option">
                        <input type="radio" name="visibility" value="private" 
                            checked={scheduleInfo.visibility === 'private'}
                            onChange={handleChange}
                        />
                        <span>비공개</span>
                    </label>
                </div>
                <div className="default">
                    <span htmlFor="schedule-default" className="default-label">기본</span>
                    <div className="default-checkbox">
                        <input type="checkbox" name="isDefault" id="schedule-default" 
                            checked={scheduleInfo.isDefault}
                            onChange={handleChange}
                            // 비활성화 로직
                            disabled={isCheckboxDisabled}
                        />
                        <label htmlFor="schedule-default">기본 시간표 설정</label>
                    </div>
                    
                </div>

                <div className="buttons">
                    {scheduleToEdit && <button className="delete-btn" onClick={handleDelete}>삭제</button>}
                    <button className="setiing-save-btn" onClick={handleSave}>설정 저장</button>
                </div>
            </div>
        </div>
    );
}

export default ScheduleSetting;