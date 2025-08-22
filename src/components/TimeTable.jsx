import React, { useState, useMemo } from 'react';
import './css/TimeTable.css';
import CourseBlock from './CourseBlock';

// 문자열로 된 시간을 분 단위 숫자로 변환
const timeToMinutes = (hourStr, minuteStr) => {
    let hour = parseInt(hourStr.match(/\d+/)[0], 10);
    const minute = parseInt(minuteStr.match(/\d+/)[0], 10);

    if (hourStr.includes('오후') && hour !== 12) {
        hour += 12;
    }
    if (hourStr.includes('오전') && hour === 12) { 
        hour = 0;
    }

    return hour * 60 + minute;
};

function TimeTable({ courses, onUpdate, onDelete }) {
    // 0교시(오전 8시) 수업 여부 확인 
    const showEarlyHours = useMemo(() => {
        if (!courses) return false;

        // courses 배열을 직접 순회하여 9시(540분) 이전 수업이 있는지 확인
        return courses.some(course =>
            course.timePlaces.some(tp => timeToMinutes(tp.startTimeHour, tp.startTimeMinute) < 540)
        );
    }, [courses]);

    // useMemo를 사용하여 courses 데이터가 변경될 때만 재계산
    // useMemo: 배열 자체가 변경될 때만 재계산하고, 다른 리렌더링 상황에서는 이전 값 재사용 
    const processedClasses = useMemo(() => {
        const classBlocks = [];
        if (!courses) return [];

        // showEarlyHours 값에 따라 기준 시간을 동적으로 설정
        const baselineMinutes = showEarlyHours ? 480 : 540; // true이면 8시(480), false이면 9시(540)

        courses.forEach(course => {
            (course.timePlaces || []).forEach(timePlace => {
                const startMinutes = timeToMinutes(timePlace.startTimeHour, timePlace.startTimeMinute);
                const endMinutes = timeToMinutes(timePlace.endTimeHour, timePlace.endTimeMinute);
                const durationMinutes = endMinutes - startMinutes;

                // 1시간(60분) = 50px (1교시 높이) 기준
                const height = (durationMinutes / 60) * 50;

                // 동적으로 설정된 baselineMinutes를 기준으로 top 계산
                const top = ((startMinutes - baselineMinutes) / 60) * 50;

                classBlocks.push({
                    id: `${course.id}-${timePlace.id}`, // 고유 key
                    day: timePlace.selectedDay,
                    style: { top: `${top}px`, height: `${height}px` },
                    info: {
                        id: course.id,

                        courseName: course.courseName,
                        professorName: course.professorName,
                        location: timePlace.location,

                        startTimeHour: timePlace.startTimeHour,
                        startTimeMinute: timePlace.startTimeMinute,

                        endTimeHour: timePlace.endTimeHour,
                        endTimeMinute: timePlace.endTimeMinute,
                    }
                });
            });
        });
        return classBlocks;
    }, [courses, showEarlyHours]);

    // 토요일 수업이 있는지 확인
    const showSaturday = useMemo(() => 
        processedClasses.some(cls => cls.day === '토'), 
        [processedClasses]
    );

    const days = ['월', '화', '수', '목', '금'];
    if (showSaturday) days.push('토');

    return (
        <div className="time-table">
            <div className="table-head">
                <table className="table-head">
                    <tbody>
                        <tr>
                            <th></th>
                            {days.map(day => (
                                <td key={day}>{day}</td>
                            ))}
                            <th></th>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="table-body">
                <table className="table-body">
                    <tbody>
                        <tr>
                            <th>
                                <div className="hours">
                                    {/* 0교시 */}
                                    <div className="hour first" style={{ display: showEarlyHours ? 'block' : 'none', height: '50px' }}>0교시</div>

                                    {/* 1교시부터 11교시까지 */}
                                    {[...Array(11)].map((_, i) => (
                                        <div key={i} className={`hour ${i + 1 >= 7 ? 'late' : ''}`}>{i + 1}교시</div>
                                    ))}

                                    <div className="hour late"></div>
                                </div>
                            </th>

                            {/* 각 요일별 열 렌더링 */}
                            {days.map(day => (
                                <td key={day}>
                                    <div className="cols">
                                        {/* 해당 요일의 수업만 필터링하여 렌더링 */}
                                        {processedClasses
                                            .filter(cls => cls.day === day)
                                            .map(cls => (
                                                <CourseBlock 
                                                    key={cls.id} 
                                                    courseInfo={cls.info} 
                                                    style={cls.style} 
                                                    onDelete={() => onDelete(cls.info.id)}
                                                    onUpdate={() => onUpdate(cls.info.id)}
                                                />
                                            ))}
                                    </div>
                                    <div className="grids">
                                        {[...Array(showEarlyHours ? 24 : 23)].map((_, i) => (
                                            <div key={i} className="grid"></div>
                                        ))}
                                    </div>
                                </td>
                            ))}    

                            <th>
                                <div className="times">
                                    {/* 오전 8시 */}
                                    <div className="time first" style={{ display: showEarlyHours ? 'block' : 'none' }}>오전 8시</div>
                                     
                                    {/* 오전 9시부터 오후 11시까지 */}
                                    {[...Array(15)].map((_, i) => {
                                        const hour = i + 9;
                                        const displayHour = hour > 12 ? hour - 12 : hour;
                                        const period = hour >= 12 ? '오후' : '오전';
                                        return <div key={i} className="time">{`${period} ${displayHour}시`}</div>
                                    })}
                                </div>
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TimeTable;