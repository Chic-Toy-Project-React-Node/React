import React, { useState } from 'react';
import './css/TimeTable.css';


function TimeTable() {


    return (
        <div className="time-table">
            <div className="table-head">
                <table className="table-head">
                    <tbody>
                        <tr>
                            <th></th>
                            <td>월</td>
                            <td>화</td>
                            <td>수</td>
                            <td>목</td>
                            <td>금</td>
                            <td style={{ display: 'none' }}>토</td>
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
                                    <div className="hour" style={{ display: 'none' }}>0교시</div>
                                    <div className="hour">1교시</div>
                                    <div className="hour">2교시</div>
                                    <div className="hour">3교시</div>
                                    <div className="hour">4교시</div>
                                    <div className="hour">5교시</div>
                                    <div className="hour">6교시</div>
                                    <div className="hour late">7교시</div>
                                    <div className="hour late">8교시</div>
                                    <div className="hour late">9교시</div>
                                    <div className="hour late">10교시</div>
                                    <div className="hour late">11교시</div>
                                    <div className="hour late"></div>
                                </div>
                            </th>
                            <td>
                                <div className="cols"></div>
                                <div className="grids">
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                </div>
                            </td>
                            <td>
                                <div className="cols"></div>
                                <div className="grids">
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                </div>
                            </td>
                            <td>
                                <div className="cols">
                                    <div className="subject">
                                        <ul className="status">
                                            <li title="삭제" className="delete"></li>
                                        </ul>
                                        <h3>웹서비스설계및실습</h3>
                                        <p>
                                            <span>박규동</span>
                                            <span></span>
                                        </p>
                                    </div>
                                </div>
                                <div className="grids">
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                </div>
                            </td>
                            <td>
                                <div className="cols"></div>
                                <div className="grids">
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                </div>
                            </td>
                            <td>
                                <div className="cols"></div>
                                <div className="grids">
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                </div>
                            </td>
                            <td style={{display: 'none'}}>
                                <div className="cols"></div>
                                <div className="grids">
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                    <div className="grid"></div>
                                </div>
                            </td>
                            <th>
                                <div className="times">
                                    <div className="time" style={{ display: 'none' }}>오전 8시</div>
                                    <div className="time">오전 9시</div>
                                    <div className="time">오전 10시</div>
                                    <div className="time">오전 11시</div>
                                    <div className="time">오후 12시</div>
                                    <div className="time">오후 1시</div>
                                    <div className="time">오후 2시</div>
                                    <div className="time">오후 3시</div>
                                    <div className="time">오후 4시</div>
                                    <div className="time">오후 5시</div>
                                    <div className="time">오후 6시</div>
                                    <div className="time">오후 7시</div>
                                    <div className="time">오후 8시</div>
                                    <div className="time">오후 9시</div>
                                    <div className="time">오후 10시</div>
                                    <div className="time">오후 11시</div>
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