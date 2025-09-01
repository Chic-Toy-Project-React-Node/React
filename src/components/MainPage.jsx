import BoardDirectory from "./BoardDirectory";
import Sidebar from "./Board_Sidebar";
import MainBoard from './MainBoard.jsx';
import "./css/MainPage.css"

function MainPage() {
    return (
        <div className="mainPage">
            {/* 상단 카테고리 띠 */}
            <section className="main">
                <BoardDirectory />
            </section>

            {/* 왼쪽 사이드바 */}
            <Sidebar />

            {/* 메인보드 */}
            <MainBoard />
        </div>
    );
}

export default MainPage;
