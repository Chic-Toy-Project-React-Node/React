// src/components/MainBoard.jsx
import "./css/MainBoard.css";

export default function MainBoard() {
  const cards = [
    {
      title: "자유게시판",
      items: [
        { title: "제목 1", time: "3분 전" },
        { title: "제목 2", time: "36분 전" },
        { title: "제목 3", time: "37분 전" },
        { title: "제목 4", time: "38분 전" },
      ],
    },
    {
      title: "비밀게시판",
      items: [
        { title: "제목 1", time: "12분 전" },
        { title: "제목 2", time: "29분 전" },
        { title: "제목 3", time: "35분 전" },
        { title: "제목 4", time: "08/27 13:20" },
      ],
    },
    {
      title: "졸업생게시판",
      items: [
        { title: "제목 1", time: "08/27 13:15" },
        { title: "제목 2", time: "08/27 12:50" },
        { title: "제목 3", time: "08/27 10:39" },
        { title: "제목 4", time: "08/26 18:04" },
      ],
    },
    {
      title: "새내기게시판",
      items: [
        { title: "제목 1", time: "08/26 23:38" },
        { title: "제목 2", time: "08/26 22:11" },
        { title: "제목 3", time: "08/25 15:10" },
        { title: "제목 4", time: "08/25 11:52" },
      ],
    },
    {
      title: "광운대 신문사",
      items: [
        { title: "제목 1", time: "3분 전" },
        { title: "제목 2", time: "10분 전" },
        { title: "제목 3", time: "30분 전" },
        { title: "제목 4", time: "1시간 전" },
      ],
    },
    {
      title: "KW TIMES",
      items: [
        { title: "제목 1", time: "3분 전" },
        { title: "제목 2", time: "12분 전" },
        { title: "제목 3", time: "40분 전" },
        { title: "제목 4", time: "1시간 전" },
      ],
    },
  ];

  return (
    <div className="mainCard">
      {cards.map((card) => (
        <div key={card.title} className="card">
          <h3 className="mainName">
            <a href="/">{card.title}</a>
          </h3>
          <ul className="list">
            {card.items.map((it, i) => (
              <li key={i}>
                <a className="title" href="/">{it.title}</a>
                <span className="time">{it.time}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
