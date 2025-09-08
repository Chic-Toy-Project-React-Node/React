import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/Classroom.css';

// 아이콘 import 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faStar as faStarSolid, faCircleExclamation } from "@fortawesome/free-solid-svg-icons"; 

// api 연동
import axios from 'axios';

function Classroom() {
    // useLocation: 현재 위치 정보 가져오기
    const location = useLocation();

    // useNavigate: 페이지를 이동시키는 함수 반환
    const navigate = useNavigate();

    // 강의평 목록을 저장할 state (추후 api로 불러올 것)
    // const [courses, setCourses] = useState([
    //     {
    //         courseId: 1,
    //         courseName: '소프트웨어공학개론',
    //         profName: '김철수',
    //         // 이 강의에 대한 여러 개의 리뷰를 배열로 관리
    //         reviews: [
    //             {
    //                 reviewId: 101, // 리뷰만의 고유 ID
    //                 rating: 4,
    //                 semester: '24년 2학기 수강자',
    //                 content: '팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요.'
    //             },
    //             {
    //                 reviewId: 102,
    //                 rating: 5,
    //                 semester: '23년 2학기 수강자',
    //                 content: '인생 강의입니다! 다만 팀플원 잘 만나는게 중요해요.'
    //             },
    //             {
    //                 reviewId: 103,
    //                 rating: 5,
    //                 semester: '23년 2학기 수강자',
    //                 content: '인생 강의입니다! 다만 팀플원 잘 만나는게 중요해요.'
    //             },
    //             {
    //                 reviewId: 104, 
    //                 rating: 4,
    //                 semester: '24년 2학기 수강자',
    //                 content: '팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요.'
    //             },
    //             {
    //                 reviewId: 105, 
    //                 rating: 4,
    //                 semester: '24년 2학기 수강자',
    //                 content: '팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요.'
    //             },
    //             {
    //                 reviewId: 106, 
    //                 rating: 4,
    //                 semester: '24년 2학기 수강자',
    //                 content: '팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요.'
    //             },
    //             {
    //                 reviewId: 107, 
    //                 rating: 4,
    //                 semester: '24년 2학기 수강자',
    //                 content: '팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요.'
    //             },
    //             {
    //                 reviewId: 108,
    //                 rating: 4,
    //                 semester: '24년 2학기 수강자',
    //                 content: '팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요. 팀플이 많지만 얻어가는 것이 정말 많은 수업입니다. 교수님 설명이 명쾌해요.'
    //             },
    //         ]
    //     },
    //     {
    //         courseId: 2,
    //         courseName: '자료구조',
    //         profName: '이영희',
    //         reviews: [
    //             {
    //                 reviewId: 201,
    //                 rating: 3,
    //                 semester: '25년 1학기 수강자',
    //                 content: '과제 양이 상당해서 따라가기 조금 벅찼습니다. 시험은 평이한 수준.'
    //             }
    //         ]
    //     },
    //     {
    //         courseId: 3,
    //         courseName: 'eqrqrqere',
    //         profName: '김철수',
    //         reviews: [
    //             {
    //                 reviewId: 201,
    //                 rating: 3,
    //                 semester: '25년 1학기 수강자',
    //                 content: '과제 양이 상당해서 따라가기 조금 벅찼습니다. 시험은 평이한 수준.'
    //             }
    //         ]
    //     },
    //     {
    //         courseId: 4,
    //         courseName: 'eqrqrqeㄹㅇㅁㄻㅇre',
    //         profName: '김철수',
    //         reviews: [
    //             {
    //                 reviewId: 201,
    //                 rating: 3,
    //                 semester: '25년 1학기 수강자',
    //                 content: '과제 양이 상당해서 따라가기 조금 벅찼습니다. 시험은 평이한 수준.'
    //             }
    //         ]
    //     },
    //     {
    //         courseId: 5,
    //         courseName: 'eqrqrㅎㅇㅎㅁㅎㅎㅇ',
    //         profName: '김철수',
    //         reviews: [
    //             {
    //                 reviewId: 201,
    //                 rating: 3,
    //                 semester: '25년 1학기 수강자',
    //                 content: '과제 양이 상당해서 따라가기 조금 벅찼습니다. 시험은 평이한 수준.'
    //             }
    //         ]
    //     },
    //     {
    //         courseId: 6,
    //         courseName: 'eqrㅇㅇㅇㅇㅇㅇㅇㅇㅇqrqere',
    //         profName: '김철수',
    //         reviews: [
    //             {
    //                 reviewId: 201,
    //                 rating: 3,
    //                 semester: '25년 1학기 수강자',
    //                 content: '과제 양이 상당해서 따라가기 조금 벅찼습니다. 시험은 평이한 수준.'
    //             }
    //         ]
    //     },
    //     {
    //         courseId: 7,
    //         courseName: 'eq11111rqrqere',
    //         profName: '김철수',
    //         reviews: [
    //             {
    //                 reviewId: 201,
    //                 rating: 3,
    //                 semester: '25년 1학기 수강자',
    //                 content: '과제 양이 상당해서 따라가기 조금 벅찼습니다. 시험은 평이한 수준.'
    //             }
    //         ]
    //     },
    //     {
    //         courseId: 8,
    //         courseName: 'eqrㄹㅇㅁqrqeㄹㅇㅁㄻㅇre',
    //         profName: '김철수',
    //         reviews: [
    //             {
    //                 reviewId: 201,
    //                 rating: 3,
    //                 semester: '25년 1학기 수강자',
    //                 content: '과제 양이 상당해서 따라가기 조금 벅찼습니다. 시험은 평이한 수준.'
    //             }
    //         ]
    //     },
    //     {
    //         courseId: 9,
    //         courseName: '55',
    //         profName: '김철수',
    //         reviews: [
    //             {
    //                 reviewId: 201,
    //                 rating: 3,
    //                 semester: '25년 1학기 수강자',
    //                 content: '과제 양이 상당해서 따라가기 조금 벅찼습니다. 시험은 평이한 수준.'
    //             }
    //         ]
    //     },
    //     {
    //         courseId: 10,
    //         courseName: 'eqrㅇㅇㅇㅇㄹㅇㅇㅇㅇㅇㅇㅇqrqere',
    //         profName: '김철수',
    //         reviews: [
    //             {
    //                 reviewId: 201,
    //                 rating: 3,
    //                 semester: '25년 1학기 수강자',
    //                 content: '과제 양이 상당해서 따라가기 조금 벅찼습니다. 시험은 평이한 수준.'
    //             }
    //         ]
    //     },
    //     {
    //         courseId: 11,
    //         courseName: 'eqrqrㄹㅇㄹㅇㄴㄴqere',
    //         profName: '김철수',
    //         reviews: [
    //             {
    //                 reviewId: 201,
    //                 rating: 3,
    //                 semester: '25년 1학기 수강자',
    //                 content: '과제 양이 상당해서 따라가기 조금 벅찼습니다. 시험은 평이한 수준.'
    //             }
    //         ]
    //     },
    //     {
    //         courseId: 12,
    //         courseName: 'eqrqrqeㄹㅇㄱㅎㄴㄱㄱㅁㄻㅇre',
    //         profName: '김철수',
    //         reviews: [
    //             {
    //                 reviewId: 201,
    //                 rating: 3,
    //                 semester: '25년 1학기 수강자',
    //                 content: '과제 양이 상당해서 따라가기 조금 벅찼습니다. 시험은 평이한 수준.'
    //             }
    //         ]
    //     },
    //     {
    //         courseId: 13,
    //         courseName: 'eqrqrㅎㅇㅎㅍㅍㅍㅍㅁㅎㅎㅇ',
    //         profName: '김철수',
    //         reviews: [
    //             {
    //                 reviewId: 201,
    //                 rating: 3,
    //                 semester: '25년 1학기 수강자',
    //                 content: '과제 양이 상당해서 따라가기 조금 벅찼습니다. 시험은 평이한 수준.'
    //             }
    //         ]
    //     },
    //     {
    //         courseId: 14,
    //         courseName: 'eqrㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇqrqere',
    //         profName: '김철수',
    //         reviews: [
    //             {
    //                 reviewId: 201,
    //                 rating: 3,
    //                 semester: '25년 1학기 수강자',
    //                 content: '과제 양이 상당해서 따라가기 조금 벅찼습니다. 시험은 평이한 수준.'
    //             }
    //         ]
    //     }
    // ]);

    const [courses, setCourses] = useState([]);

    // api 로딩 및 에러 상태 관리
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 컴포넌트가 처음 렌더링 될 때 API 호출
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // API 호출
                const response = await axios.get('http://localhost:3000/api/lectures');

                // [중요] 어떤 데이터가 오는지 여기서 확인!
                console.log('서버로부터 받은 실제 응답 데이터:', response.data);

                // 기존 courses 구조에 맞게 서버에서 받은 데이터 변환 (mapping)
                const formattedCourses = response.data.data.map(course => ({
                    courseId: course.id,
                    courseName: course.title,
                    profName: course.instructor,
                    
                    // 추후 추가
                    reviews: []
                }));

                setCourses(formattedCourses);
            } catch (e) {
                setError(e);
                console.log('강의 데이터를 불러오는 데 실패했습니다.', e);
            }

            setLoading(false);
        };

        fetchCourses();
    }, []); // 빈 배열을 전달하여 최초 1회만 실행

    // 강의 검색 화면 전환을 위한 state
    const [isShowingSearchResults, setIsShowingSearchResults] = useState(false);

    // 실시간 입력값과 확정된 검색어를 객체로 묶어서 관리
    const [searchQuery, setSearchQuery] = useState({
        term: '',
        type: 'courseName',
    });

    const [submittedQuery, setSubmittedQuery] = useState({
        term: '',
        type: 'courseName',
    });

    // 페이지 이동 시 상태 초기화
    useEffect(() => {
        setIsShowingSearchResults(false);
        setSearchQuery({ term: '', type: 'courseName' });
        setSubmittedQuery({ term: '', type: 'courseName' });
    }, [location.key]);

    // 필터링 로직
    const filteredCourses = useMemo(() => {
        if (!isShowingSearchResults) {
            return [];
        }

        const lowerCaseTerm = submittedQuery.term.toLowerCase();

        if (!lowerCaseTerm) {
            return courses;
        } else {
            return courses.filter(course => {
                // 검색 타입이 '과목명'일 경우 -> 부분 일치 (includes)
                if (submittedQuery.type === 'courseName') {
                    return course.courseName.toLowerCase().includes(lowerCaseTerm);
                }
                // 검색 타입이 '교수명'일 경우 -> 완전 일치 (===)
                if (submittedQuery.type === 'profName') {
                    // course.profName도 소문자로 바꿔서 비교 
                    return course.profName && course.profName.toLowerCase() === lowerCaseTerm;
                }
                return false;
            });
        }
    }, [courses, submittedQuery, isShowingSearchResults]);

    const handleCardClick = (courseData) => {
        navigate('/classroom/review', { state: courseData });
    };

    // 검색 입력창 핸들러
    const handleSearchInputChange = (e) => {
        setSearchQuery(prev => ({ ...prev, term: e.target.value }));
    };

    // 과목명, 교수명 라디오 버튼 핸들러
    const handleSearchTypeChange = (e) => {
        const newType = e.target.value;
        // 실시간 쿼리(UI)를 먼저 업데이트
        setSearchQuery(prev => ({ ...prev, type: newType }));

        // 검색 결과 화면이라면, '제출된' 쿼리도 즉시 업데이트하여 검색을 재실행
        if (isShowingSearchResults) {
            setSubmittedQuery(prev => ({ ...prev, type: newType }));
        }
    };

    // 검색 폼 제출 핸들러
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSubmittedQuery(searchQuery);
        setIsShowingSearchResults(true);
    };

    // 평균 별점 계산 
    const calculateAvgRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / reviews.length);
    };

    // 별점 렌더링 함수
    // 점수(rating)를 받아서 점수만큼 채워진 별 아이콘을 배열로 반환
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating); 
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<FontAwesomeIcon key={i} icon={faStarSolid} color="#ffca37" size="2xs" />);
            } else {
                stars.push(<FontAwesomeIcon key={i} icon={faStarSolid} color="lightgray" size="2xs" />);
            }
        }
        return stars;
    };

    // 강의 검색에 따라 완전히 다른 UI 구현
    if (isShowingSearchResults) {
        // 검색 결과 뷰
        return (
            <div className="search-page-container">
                <div className="search-page-header">
                    <form className="search-box" onSubmit={handleSearchSubmit}>
                        <input 
                            type="text" 
                            className="search-text" 
                            value={searchQuery.term}
                            onChange={handleSearchInputChange}
                            autoFocus
                        />
                        <button className="search-btn" type="submit">
                            <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" className="icon" />
                        </button>
                    </form>
                    <div className="search-type-selector">
                        <label><input type="radio" name="searchTypeResult" value="courseName" checked={searchQuery.type === 'courseName'} onChange={handleSearchTypeChange} /> 과목명</label>
                        <label><input type="radio" name="searchTypeResult" value="profName" checked={searchQuery.type === 'profName'} onChange={handleSearchTypeChange} /> 교수명</label>
                    </div>
                </div>

                <div className="course-list">
                    {filteredCourses.map(course => (
                        <div className="course-card" key={course.courseId} onClick={() => handleCardClick(course)}>
                            <h3 className="course-name">{course.courseName}</h3>
                            <p className="prof-name">{course.profName || '교수명 정보 없음'}</p>
                            <div className="stars">{renderStars(calculateAvgRating(course.reviews))}</div>
                        </div>
                    ))}
                    {filteredCourses.length === 0 && (
                        <div className="no-results">
                            <p className="no-result-icon">
                                <FontAwesomeIcon icon={faCircleExclamation} size="3x" color="#a6a6a6" />
                            </p>
                            <p>검색된 강의가 없습니다</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // 기본 뷰
    return (
        <div className="classroom-container">
            <div className="side-bar">
                <form className="search-box" onSubmit={handleSearchSubmit}>
                    <input 
                        type="text" 
                        className="search-text" 
                        placeholder="과목명, 교수명으로 검색" 
                        value={searchQuery.term} 
                        onChange={handleSearchInputChange}
                    />
                    <button className="search-btn" type="submit">
                        <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" className="icon" />
                    </button>
                </form>
                <div className="point-box">
                    <span>내 포인트 현황</span>
                    <span className="point">[숫자] 포인트</span>
                </div>
            </div>

            <div className="main-content">
                <div className="reviews">
                    {courses.map(course => (
                        course.reviews.map(review => (
                            <div className="review-card" key={review.reviewId} onClick={() => handleCardClick(course)}>
                                <h3 className="course-name">{course.courseName}</h3>
                                <p className="prof-name">{course.profName}</p>
                                <div className="stars">{renderStars(review.rating, "2xs")}</div>
                                <div className="user-season">{review.semester}</div>
                                <p className="course-review">{review.content}</p>
                            </div>
                        ))
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Classroom;