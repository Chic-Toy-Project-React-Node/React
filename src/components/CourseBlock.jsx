import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons"; 

// 과목 블록 컴포넌트 
function CourseBlock({ courseInfo, style, onUpdate, onDelete }) {
  const { id, courseName, professorName, location } = courseInfo;

  return (
    <div className="subject" style={style}>
        <div className="status">
            {/* 수정 버튼 */}
            <button type="button" title="수정" className="update" onClick={() => onUpdate(id)}>
                <FontAwesomeIcon icon={faPenToSquare} size="sm" />
            </button>
            {/* 삭제 버튼 */}
            <button type="button" title="삭제" className="delete" onClick={() => onDelete(id)}>
                <FontAwesomeIcon icon={faXmark} size="sm" />
            </button>
        </div>
        {/* 과목명 */}
        <h3>{courseName}</h3>
        <p>
            {/* 교수명 */}
            <span className="prof">{professorName}</span>
            {/* 장소 */}
            <span>{location}</span>
        </p>
    </div>
  );
}

export default CourseBlock;