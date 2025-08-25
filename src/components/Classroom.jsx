import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Classroom.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"; 

function Classroom() {
    // 강의평 목록을 저장할 state (추후 api로 불러올 것)
    const [courses, setCourses] = useState([
        {
            courseId: 1,
            courseName: '소프트웨어공학개론',
            profName: '김철수',
            // 이 강의에 대한 여러 개의 리뷰를 배열로 관리
            reviews: [
                {
                    reviewId: 101, // 리뷰만의 고유 ID
                    rating: 4,
                    semester: '24년 2학기 수강자',
                    content: '팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. '
                },
                {
                    reviewId: 102,
                    rating: 5,
                    semester: '23년 2학기 수강자',
                    content: '인생 강의입니다! 다만 팀플원 잘 만나는게 중요해요.'
                },
                {
                    reviewId: 103,
                    rating: 5,
                    semester: '23년 2학기 수강자',
                    content: '인생 강의입니다! 다만 팀플원 잘 만나는게 중요해요.'
                }
            ]
        },
        {
            courseId: 2,
            courseName: '자료구조',
            profName: '이영희',
            reviews: [
                {
                    reviewId: 201,
                    rating: 3,
                    semester: '25년 1학기 수강자',
                    content: '과제 양이 상당해서 따라가기 조금 벅찼습니다. 시험은 평이한 수준.'
                }
            ]
        }
    ]);

    // 2. useNavigate 훅을 사용하여 페이지 이동 함수를 만듭니다.
    const navigate = useNavigate();

    // 3. 카드 클릭 시 호출될 함수를 정의합니다.
    const handleCardClick = (courseData) => {
        navigate('/classroom/review', { state: courseData });
    };



    return(
        <div className="classroom-container">
            <div className="side-bar">
                <form className="search-box" action="" method="get">
                    <input type="text" className="search-text" name="" placeholder="과목명, 교수명으로 검색" />
                    <button className="search-btn" type="submit">
                        <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" className="icon" />
                    </button>
                </form>

                <div className="point-box">
                    <span>내 포인트 현황</span>
                    <span className="point">[숫자] 포인트</span>
                </div>
            </div>

            <div className="reviews">
                {/* 1. courses 배열을 순회 (바깥쪽 루프) */}
                {courses.map(course => (
                    // 2. 각 course 안의 reviews 배열을 다시 순회 (안쪽 루프)
                    course.reviews.map(review => (
                        <div 
                            className="review-card" 
                            key={review.reviewId} // key는 이제 review의 고유 ID를 사용
                            onClick={() => handleCardClick(course)} // 클릭 핸들러 수정
                        >
                            {/* 강의 정보는 course 객체에서 가져옴 */}
                            <h3 className="course-name">{course.courseName}</h3>
                            <p className="prof-name">{course.profName}</p>
                            
                            {/* 리뷰 정보는 review 객체에서 가져옴 */}
                            <div className="stars">별점(나중에 아이콘 변경) {review.rating}</div>
                            <div className="user-season">{review.semester}</div>
                            <p className="course-review">{review.content}</p>
                        </div>
                    ))
                ))}
            </div>
        </div>
    );
}

export default Classroom;