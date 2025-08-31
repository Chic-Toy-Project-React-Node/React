
export default function GradeBars({ ratio = [] }) {
  const order = ["P", "B+", "A+", "B0", "A0"];
  const items = ratio
    .filter((r) => order.includes(r.grade))
    .sort((a, b) => order.indexOf(a.grade) - order.indexOf(b.grade));

  return (
    <ul className="ratioplot">
      {items.map(({ grade, pct, color }) => (
        <li key={grade} className="flex">
          <span className="grade">{grade}</span>
          <div className="ratiowrapper">
            <div className="ratiobar" style={{ width: `${pct}%`, backgroundColor: color }} />
          </div>
          <span className="ratiovalue" style={{ color }}>{pct}%</span>
        </li>
      ))}
    </ul>
  );
}

