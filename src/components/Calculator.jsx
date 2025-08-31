import { useEffect, useMemo, useRef, useState } from "react";
import "./css/calculator.css";
import GpaChart from "./GpaChart";
import GradeBars from "./GradeBars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

/* =========================
   유틸/상수
========================= */
const GRADE_POINTS = {
  'A+': 4.5, 'A0': 4.0,
  'B+': 3.5, 'B0': 3.0,
  'C+': 2.5, 'C0': 2.0,
  'D+': 1.5, 'D0': 1.0, 'F': 0,
};
const GRADES = ["P","B+","A+","B0","A0","C+","C0","D+","D0","F"];
const GRADE_COLOR = {
  P:  "rgb(242,133,114)",  // 연한 레드
  "B+": "rgb(236,197,92)", // 머스타드
  "A+": "rgb(160,198,97)", // 연초록
  B0:  "rgb(130,209,194)", // 민트
  A0:  "rgb(122,158,224)", // 연파랑
};

const isPass = (g) => g === "P";

/* 고유 id */
const uid = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

/* 빈 과목 한 줄 */
const makeEmptyCourse = () => ({
  id: uid(), name: "", credit: 0, grade: "A+", isMajor: false
});

/* N=10개로 패딩 */
const padToTen = (courses = []) => {
  const need = Math.max(0, 10 - courses.length);
  return [...courses, ...Array.from({ length: need }, makeEmptyCourse)];
};

/* 기본 학기 생성 (1-1 ~ 6-2 + 기타) */
const makeDefaultTerms = () => {
  const arr = [];
  for (let y = 1; y <= 6; y++) {
    arr.push({ id: `${y}-1`, label: `${y}학년 1학기`, courses: padToTen([]) });
    arr.push({ id: `${y}-2`, label: `${y}학년 2학기`, courses: padToTen([]) });
  }
  arr.push({ id: "etc", label: "기타 학기", courses: padToTen([]) });
  return arr;
};
const DEFAULT_TERMS = makeDefaultTerms();

/* 저장된 terms에 누락 학기 보충 */
const ensureAllTerms = (stored = []) => {
  const byId = new Map(stored.map((t) => [t.id, t]));
  return DEFAULT_TERMS.map((base) => byId.get(base.id) || base);
};

/* 합계 계산 — 빈 행(학점/성적 비어있음)은 제외 */
function sumFrom(courses) {
  return courses.reduce(
    (a, c) => {
      const credit = Number(c.credit);
      if (!credit || !c.grade) return a;

      if (isPass(c.grade)) {
        a.totalCredits += credit;
        if (c.isMajor) a.majorCredits += credit;
        return a;
      }

      const gp = GRADE_POINTS[c.grade];
      if (typeof gp !== "number") return a;

      a.totalPoints += gp * credit;
      a.totalCredits += credit;
      if (c.isMajor) {
        a.majorPoints += gp * credit;
        a.majorCredits += credit;
      }
      return a;
    },
    { totalPoints: 0, totalCredits: 0, majorPoints: 0, majorCredits: 0 }
  );
}

/* =========================
   컴포넌트
========================= */
export default function Calculator() {
  /* terms 초기화: 저장값 병합 + 10줄 패딩 + 즉시 저장 */
  const [terms, setTerms] = useState(() => {
    try {
      const raw = localStorage.getItem("terms");
      const parsed = raw ? JSON.parse(raw) : [];
      const merged = ensureAllTerms(Array.isArray(parsed) ? parsed : []).map((t) => ({
        ...t,
        courses: padToTen(t.courses),
      }));
      localStorage.setItem("terms", JSON.stringify(merged));
      return merged;
    } catch {
      return DEFAULT_TERMS;
    }
  });

  /* 활성 학기 id */
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem("selectedTermId");
    return saved || "1-1";
  });

  /* 졸업학점 + 모달 */
  const [gradTarget, setGradTarget] = useState(
    () => Number(localStorage.getItem("gradTarget") ?? 130)
  );
  const [isGradOpen, setGradOpen] = useState(false);

  const menuRef = useRef(null);

  /* 선택 학기 기억 + 활성 탭 보이게 스크롤 */
  useEffect(() => {
    localStorage.setItem("selectedTermId", selected);
    const el = menuRef.current?.querySelector(".active");
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [selected]);

  /* terms 변경 시 저장 */
  useEffect(() => {
    localStorage.setItem("terms", JSON.stringify(terms));
  }, [terms]);

  /* 졸업학점 저장 */
  useEffect(() => {
    localStorage.setItem("gradTarget", String(gradTarget));
  }, [gradTarget]);

  /* 전체 집계 */
  const overall = useMemo(() => {
    const s = sumFrom(terms.flatMap((t) => t.courses));
    return {
      totalGpa: s.totalCredits ? s.totalPoints / s.totalCredits : NaN,
      majorGpa: s.majorCredits ? s.majorPoints / s.majorCredits : NaN,
      totalCredits: s.totalCredits,
    };
  }, [terms]);

  /* 라인차트 데이터 */
  // 성적 입력된 학기만 라인에 찍힘(없으면 제외), 전공 없으면 null
const chartData = useMemo(() => {
  return terms
    .map((t) => {
      const s = sumFrom(t.courses);
      if (s.totalCredits <= 0) return null;
      return {
        label: t.label,
        overall: +(s.totalPoints / s.totalCredits).toFixed(2),
        major: s.majorCredits > 0 ? +(s.majorPoints / s.majorCredits).toFixed(2) : null,
      };
    })
    .filter(Boolean);
}, [terms]);


 const ratio = useMemo(() => {
  const cnt = Object.fromEntries(GRADES.map(g => [g, 0]));
  terms.flatMap(t => t.courses).forEach(c => {
    const nameOk   = (c.name || "").trim().length > 0;
    const creditOk = Number(c.credit) > 0;
    const gradeOk  = !!c.grade;
    if (!(nameOk && creditOk && gradeOk)) return;  // 조건 미충족 → 스킵
    cnt[c.grade] = (cnt[c.grade] || 0) + 1;
  });
  const total = Object.values(cnt).reduce((a,b)=>a+b,0) || 1;
  return GRADES
    .filter(g => cnt[g] > 0)
    .map(g => ({
      grade: g,
      pct: Math.round((cnt[g] * 100) / total),
      color: GRADE_COLOR[g] || "rgb(166,166,166)",
    }));
}, [terms]);


  /* 현재 학기/소계 */
  const cur = terms.find((t) => t.id === selected) || terms[0];
  const curSum = useMemo(() => sumFrom(cur.courses), [cur]);
  const curGpa = curSum.totalCredits ? curSum.totalPoints / curSum.totalCredits : NaN;
  const curMajor = curSum.majorCredits ? curSum.majorPoints / curSum.majorCredits : NaN;

  /* 과목 편집 (항상 10줄 유지) */
  const updateCurCourses = (next) =>
    setTerms((ts) => ts.map((t) => (t.id === cur.id ? { ...t, courses: padToTen(next) } : t)));

  const addRow = () => updateCurCourses([...cur.courses, makeEmptyCourse()]);
  const updateRow = (id, next) => updateCurCourses(cur.courses.map((c) => (c.id === id ? next : c)));
  const reset = () => updateCurCourses([]); // → padToTen([])로 10개 빈 줄

  return (
    <div id="container" className="calculator">
      <div className="section">
        <div className="chart">
          {/* 상단 집계 */}
          <article className="overview">
            <div className="column gpa">
              <h4>전체 평점</h4>
              <p className="value">{isFinite(overall.totalGpa) ? overall.totalGpa.toFixed(2) : "-"}</p>
              <p className="total">/ 4.5</p>
            </div>

            <div className="column major">
              <h4>전공 평점</h4>
              <p className="value">{isFinite(overall.majorGpa) ? overall.majorGpa.toFixed(2) : "-"}</p>
              <p className="total">/ 4.5</p>
            </div>

            <div className="column acquisition">
              <h4>취득 학점</h4>
              <p className="value">{overall.totalCredits}</p>
              <p className="total" title="졸업 학점 설정">
                / {gradTarget}
                <button
                  className="gearBtn"
                  aria-label="졸업 학점 설정"
                  onClick={() => setGradOpen(true)}
                >
                  <FontAwesomeIcon icon={faGear} />
                </button>
              </p>
            </div>
          </article>

          {/* 그래프 + 분포 */}
          <article className="semester">
            <div className="series">
              <div className="chartArea">
                <div className="legend">
                  <span className="legendItem legendItem--overall">
                    <i className="dot" aria-hidden />
                    <span>전체</span>
                  </span>
                 <span className="legendItem legendItem--major">
                    <i className="dot" aria-hidden />
                    <span>전공</span>
                  </span>
                </div>
                <GpaChart data={chartData} />
              </div>
              <div className="ratioArea">
                <GradeBars ratio={ratio} />
              </div>
            </div>
          </article>
        </div>

        {/* 학기 탭 */}
        <div className="menu" ref={menuRef}>
          <ol>
            {terms.map((t) => (
              <li key={t.id} className={selected === t.id ? "active" : ""}>
                <a onClick={() => setSelected(t.id)}>{t.label}</a>
              </li>
            ))}
          </ol>
        </div>

        {/* 학기 표 */}
        <h2 className="termTitle">
          {cur.label}
          <span className="termSub">
            <small className="termStat">
              평점 <b className="termNum">{isFinite(curGpa) ? curGpa.toFixed(2) : "0"}</b>
            </small>
            <small className="termStat">
              전공 <b className="termNum">{isFinite(curMajor) ? curMajor.toFixed(2) : "0"}</b>
            </small>
            <small className="termStat">
              취득 <b className="termNum">{Number.isFinite(curSum.totalCredits) ? curSum.totalCredits : 0}</b>
            </small>
          </span>
        </h2>

        <table className="subjects">
          <thead>
            <tr>
              <th className="name">과목명</th>
              <th className="credit">학점</th>
              <th className="grade">성적</th>
              <th className="major">전공</th>
            </tr>
          </thead>
          <tbody>
            {cur.courses.map((c) => (
              <tr key={c.id}>
                <td className="nameCell">
                  <input
                    className="input"
                    value={c.name}
                    onChange={(e) => updateRow(c.id, { ...c, name: e.target.value })}
                  />
                </td>
                <td className="creditCell">
                  <input
                    type="number"
                    className="input creditInput"
                    min="0"
                    step="1"
                    value={c.credit ?? 0}
                    onChange={(e) => updateRow(c.id, { ...c, credit: Number(e.target.value) })}
                  />
                </td>
                <td className="gradeCell">
                  <select
                    className="select"
                    value={c.grade ?? "A+"}
                    onChange={(e) => updateRow(c.id, { ...c, grade: e.target.value })}
                  >
                    {["A+","A0","B+","B0","C+","C0","D+","D0","F","P"].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </td>
                <td className="majorCell">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={!!c.isMajor}
                    onChange={(e) => updateRow(c.id, { ...c, isMajor: e.target.checked })}
                    aria-label="전공"
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4">
                <a className="new" onClick={addRow}>더 입력하기</a>
                <a className="reset" onClick={reset} style={{ marginLeft: 8 }}>초기화</a>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 졸업학점 모달 */}
      {isGradOpen && (
        <div className="modalBackdrop" onClick={() => setGradOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>졸업 학점 설정</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const v = Number(e.currentTarget.required_credit.value || 0);
                setGradTarget(Math.max(0, Math.floor(v)));
                setGradOpen(false);
              }}
            >
              <label className="modalLabel">
                졸업 학점
                <input
                  type="number"
                  name="required_credit"
                  min="0"
                  step="1"
                  defaultValue={gradTarget}
                  className="text"
                />
              </label>
              <div className="actions">
                <button type="button" className="btn" onClick={() => setGradOpen(false)}>
                  닫기
                </button>
                <button type="submit" className="btn btn--primary">
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
