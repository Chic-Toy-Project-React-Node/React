import React, { useState } from 'react';
import './css/CourseReview.css';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faStar } from "@fortawesome/free-regular-svg-icons";

function CourseReview() {
    const location = useLocation();

    const course = location.state;

    // [추가] 현재 활성화된 탭을 관리하는 state. 기본값은 'overview'
    const [activeTab, setActiveTab] = useState('overview');

    // [추가] 모든 리뷰를 보여줄지 여부를 관리하는 state
    const [showAllReviews, setShowAllReviews] = useState(false);

    if (!course || !course.reviews) {
        return <div>강의평 정보를 불러올 수 없습니다.</div>;
    }

    // [추가] 평균 별점과 리뷰 개수 계산
    const reviewCount = course.reviews.length;
    const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : 0;

    // [추가] 상태에 따라 보여줄 리뷰 배열을 결정
    const reviewsToShow = showAllReviews ? course.reviews : course.reviews.slice(0, 2);



    return (
        <>
        <div className="course-review-container">
            <div className="side-bar">
                <h3>{course.courseName}</h3>
                <button 
                    className={`overview ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <span className="icon"><FontAwesomeIcon icon={faCircleQuestion} size="sm" /></span>
                    <span>개요</span>
                </button>
                {/* [수정] 강의평 버튼 */}
                <button 
                    className={`review ${activeTab === 'review' ? 'active' : ''}`}
                    onClick={() => setActiveTab('review')}
                >
                    <span className="icon"><FontAwesomeIcon icon={faStar} size="sm" /></span>
                    <span>강의평</span>
                </button>
            </div>

            <div className="course-info">
                <div className="name-block">
                    <div className="course-name">
                        <span>과목명</span>
                        <span>{course.courseName}</span>
                    </div>
                    <div className="prof-name">
                        <span>교수명</span>
                        <span>{course.profName}</span>
                    </div>
                </div>
                <div className="overview-block">
                    <div className="rating-box">
                        <span className="avg-rating">{avgRating}</span>
                        <span className="stars">별 아이콘</span>
                        <span className="review-count">({reviewCount}개)</span>
                    </div>

                    <div className="review-box">
                        {reviewsToShow.map(review => (
                            <div className="review-card" key={review.reviewId}>
                                <p className="rating">별점 {review.rating}</p>
                                <p className="semester">{review.semester}</p>
                                <p className="content">{review.content}</p>
                            </div>
                        ))}
                        {/* <button className="more-review">강의평 더 보기</button> */}

                        {/* [수정] 조건에 따라 '더 보기' 버튼을 보여주거나 숨김 */}
                        {course.reviews.length > 2 && !showAllReviews && (
                            <button 
                                className="more-review" 
                                onClick={() => setShowAllReviews(true)}
                            >
                                강의평 더 보기
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default CourseReview;