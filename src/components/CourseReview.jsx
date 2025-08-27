import React, { useState, useRef, useEffect, useMemo } from 'react';
import './css/CourseReview.css';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// [아이콘 수정] faStar를 solid(fas)로 가져와야 채워진 별을 쓸 수 있습니다.
import { faStar as faStarSolid, faChevronDown } from "@fortawesome/free-solid-svg-icons"; 
import { faCircleQuestion, faStar } from "@fortawesome/free-regular-svg-icons";

function CourseReview() {
    const location = useLocation();
    const course = location.state;

    // [추가] 현재 활성화된 탭을 관리하는 state. 기본값은 'overview'
    const [activeTab, setActiveTab] = useState('overview');

    // [추가] 모든 리뷰를 보여줄지 여부를 관리하는 state
    // const [showAllReviews, setShowAllReviews] = useState(false);

    // --- 드롭다운 로직 통합 시작 ---
    
    // [통합] 드롭다운 메뉴의 열림/닫힘 상태 관리
    const [isOpen, setIsOpen] = useState(false);
    
    // [통합] 현재 선택된 필터 값을 관리하는 state. 기본값은 'all'
    const [selectedFilter, setSelectedFilter] = useState('all');
    
    // [통합] 드롭다운 DOM을 참조하기 위한 useRef
    const dropdownRef = useRef(null);

    // --- 드롭다운 로직 통합 끝 ---

    const ratingOptions = useMemo(() => {
        // course 데이터가 없을 경우를 대비한 방어 코드
        if (!course || !course.reviews) return [];

        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        course.reviews.forEach(review => {
            if (counts[review.rating] !== undefined) {
                counts[review.rating]++;
            }
        });

        const options = [
            { value: 'all', label: '전체', count: course.reviews.length },
            { value: 5, label: '5', count: counts[5] },
            { value: 4, label: '4', count: counts[4] },
            { value: 3, label: '3', count: counts[3] },
            { value: 2, label: '2', count: counts[2] },
            { value: 1, label: '1', count: counts[1] },
        ];
        return options;
    }, [course]);

    const filteredReviews = useMemo(() => {
        if (!course || !course.reviews) return [];
        if (selectedFilter === 'all') {
            return course.reviews;
        }
        return course.reviews.filter(review => review.rating === selectedFilter);
    }, [course, selectedFilter]);

    // [통합] 드롭다운 외부 클릭 감지를 위한 useEffect
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!course || !course.reviews) {
        return <div>강의평 정보를 불러올 수 없습니다.</div>;
    }


    // [추가] 평균 별점과 리뷰 개수 계산
    const reviewCount = course.reviews.length;
    const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : 0;

    // [통합] 드롭다운 옵션 선택 시 호출될 함수
    const handleFilterSelect = (option) => {
        setSelectedFilter(option.value);
        setIsOpen(false);
    };


    // [수정] '개요' 탭에서는 항상 2개의 리뷰만 보여주도록 로직을 단순화합니다.
    const reviewsToShowInOverview = course.reviews.slice(0, 2);

    // [추가] 별점 렌더링 함수
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                // 채워진 별 (solid)
                stars.push(<FontAwesomeIcon key={i} icon={faStarSolid} color="#ffca37" />);
            } else {
                // 빈 별 (regular)
                stars.push(<FontAwesomeIcon key={i} icon={faStarSolid} color="lightgray" />);
            }
        }
        return stars;
    };

    // 현재 선택된 옵션 객체를 찾습니다.
    const selectedOptionObject = ratingOptions.find(opt => opt.value === selectedFilter);
    if (!selectedOptionObject) {
        return <div>데이터를 불러오는 중입니다...</div>;
    }


    return (
        <>
        <div className="course-review-container">
            <div className="side-bar">
                <h3>{course.courseName}</h3>
                <div className="buttons">
                    <button 
                        className={`overview ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <span className="course-review-icon"><FontAwesomeIcon icon={faCircleQuestion} size="lg" /></span>
                        <span>개요</span>
                    </button>
                    {/* [수정] 강의평 버튼 */}
                    <button 
                        className={`review ${activeTab === 'review' ? 'active' : ''}`}
                        onClick={() => setActiveTab('review')}
                    >
                        <span className="course-review-icon"><FontAwesomeIcon icon={faStar} size="lg" /></span>
                        <span>강의평</span>
                    </button>
                </div>
                
            </div>

            <div className="course-info">
                {/* ================================================================= */}
                {/* 여기가 핵심입니다: activeTab 값에 따라 다른 내용을 렌더링합니다. */}
                {/* ================================================================= */}

                {/* activeTab이 '개요'일 때 보여줄 내용 */}
                {activeTab === 'overview' && (
                    <>
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
                                <span className="stars">{renderStars(avgRating)}</span>
                                <span className="review-count">({reviewCount}개)</span>
                            </div>

                            <div className="review-box">
                                {reviewsToShowInOverview.map(review => (
                                    <div className="review-card" key={review.reviewId}>
                                        <p className="rating">{renderStars(review.rating)}</p>
                                        <p className="semester">{review.semester}</p>
                                        <p className="content">{review.content}</p>
                                    </div>
                                ))}
                                
                                {/* [수정] 버튼 표시 조건을 단순화하고 onClick 이벤트를 변경합니다. */}
                                {course.reviews.length > 2 && (
                                    <button 
                                        className="more-review" 
                                        onClick={() => setActiveTab('review')} // ★★★ 핵심 변경점
                                    >
                                        강의평 더 보기
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* activeTab이 '강의평'일 때 보여줄 내용 */}
                {activeTab === 'review' && (
                    <div className="review-content-block">
                        <div className="review-header">
                            <div className="rating-box">
                                <span className="avg-rating">{avgRating}</span>
                                <span className="stars">{renderStars(avgRating)}</span>
                            </div>

                            <div className="review-sort">
                                {/* 드롭다운 컨테이너에 ref 연결 */}
                                <div className="rating-filter-dropdown" ref={dropdownRef}>
                                    <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
                                        {selectedOptionObject.value === 'all' ? (
                                            <span>{selectedOptionObject.label}</span>
                                        ) : (
                                            <span className="selected-rating">
                                                <FontAwesomeIcon icon={faStarSolid} className="star-icon" />
                                                {selectedOptionObject.label}
                                            </span>
                                        )}
                                        <FontAwesomeIcon icon={faChevronDown} size="xs" className={`arrow-icon ${isOpen ? 'open' : ''}`} />
                                    </button>

                                    {isOpen && (
                                        <ul className="dropdown-menu">
                                            {ratingOptions.map((option) => (
                                                <li 
                                                    key={option.value} 
                                                    className="dropdown-item"
                                                    onClick={() => handleFilterSelect(option)}
                                                >
                                                    {option.value !== 'all' && <FontAwesomeIcon icon={faStarSolid} className="star-icon" />}
                                                    <span className="item-label">{option.label}</span>
                                                    <span className="item-count">({option.count})</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="all-reviews-list">
                            {/* 여기서는 모든 리뷰를 보여줍니다. */}
                            {filteredReviews.length > 0 ? (
                                filteredReviews.map(review => (
                                    <div className="review-card" key={review.reviewId}>
                                        <p className="rating">{renderStars(review.rating)}</p>
                                        <p className="semester">{review.semester}</p>
                                        <p className="content">{review.content}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="no-reviews">
                                    {/* <p>해당 별점의 강의평이 없습니다.</p> */}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}

export default CourseReview;