import { useMemo, useState, useEffect } from "react";
import "./css/Calculator.css";

/* === 최소 유틸 === */
const GRADE_POINTS = { 'A+':4.5,'A0':4.0,'A-':3.7,'B+':3.5,'B0':3.0,'B-':2.7,'C+':2.5,'C0':2.0,'C-':1.7,'D+':1.5,'D0':1.0,'F':0 };
const GRADE_OPTIONS = ['A+','A0','A-','B+','B0','B-','C+','C0','C-','D+','D0','F','P'];
const isPass = (g) => g === 'P';

const DEFAULT_TERMS = [
  { id:"1-1", label:"1학년 1학기", courses:[{id:11,name:"교양국어",credit:3,grade:"A0",isMajor:false}] },
  { id:"1-2", label:"1학년 2학기", courses:[{id:21,name:"자료구조",credit:3,grade:"B0",isMajor:true}] },
  { id:"2-1", label:"2학년 1학기", courses:[
    {id:31,name:"컴퓨터네트워크",credit:3,grade:"A+",isMajor:true},
    {id:32,name:"AI수학",credit:3,grade:"A+",isMajor:true},
    {id:33,name:"빅데이터프로그래밍",credit:3,grade:"A0",isMajor:true},
  ] },
];

/* === 계산 === */
function sumFrom(courses){
  return courses.reduce((a,c)=>{
    if (isPass(c.grade)){
      a.totalCredits += c.credit;
      if (c.isMajor) a.majorCredits += c.credit;
      return a;
    }
    const gp = GRADE_POINTS[c.grade] ?? 0;
    a.totalPoints += gp * c.credit;
    a.totalCredits += c.credit;
    if (c.isMajor){ a.majorPoints += gp * c.credit; a.majorCredits += c.credit; }
    return a;
  }, { totalPoints:0,totalCredits:0,majorPoints:0,majorCredits:0 });
}

export default function Calculator(){
  const [terms, setTerms] = useState(()=> JSON.parse(localStorage.getItem("terms")||"null") || DEFAULT_TERMS);
  const [selected, setSelected] = useState(terms.at(-1)?.id || "1-1");
  const [gradTarget, setGradTarget] = useState(()=> Number(localStorage.getItem("gradTarget")||130));

  useEffect(()=> localStorage.setItem("terms", JSON.stringify(terms)), [terms]);
  useEffect(()=> localStorage.setItem("gradTarget", String(gradTarget)), [gradTarget]);

  const overall = useMemo(()=>{
    const s = sumFrom(terms.flatMap(t=>t.courses));
    return {
      totalGpa: s.totalCredits ? s.totalPoints/s.totalCredits : NaN,
      majorGpa: s.majorCredits ? s.majorPoints/s.majorCredits : NaN,
      totalCredits: s.totalCredits,
    };
  },[terms]);

  const cur = terms.find(t=>t.id===selected) || terms[0];
  const curSum = useMemo(()=> sumFrom(cur.courses), [cur]);
  const curGpa = curSum.totalCredits ? curSum.totalPoints/curSum.totalCredits : NaN;
  const curMajor = curSum.majorCredits ? curSum.majorPoints/curSum.majorCredits : NaN;

  const updateCur = (next) => setTerms(ts=>ts.map(t=>t.id===cur.id? {...t, courses: next } : t));
  const addRow    = () => updateCur([...cur.courses, {id:Date.now(), name:"", credit:3, grade:"A0", isMajor:false}]);
  const updateRow = (id,next) => updateCur(cur.courses.map(c=>c.id===id? next : c));
  const removeRow = (id) => updateCur(cur.courses.filter(c=>c.id!==id));
  const reset     = () => updateCur([{id:Date.now(), name:"", credit:3, grade:"A0", isMajor:true}]);

  return (
    <div id="container" className="calculator">
      <div className="container">

        {/* title */}
        <aside className="none">
          <div className="title"><h1>학점 계산기</h1></div>
        </aside>

        {/* section: overview + charts */}
        <div className="section card">

          {/* overview (상단 3개 카드) */}
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
              <p className="total" title="졸업 학점 설정">/ {gradTarget}</p>
            </div>
          </article>

          {/* charts placeholder (추후 recharts로 대체) */}
          <article className="semester">
            <div className="series">
              <div className="legend">
                <div className="plot" />
              </div>
              <ul className="ratioplot">
                <li>성적 분포 (준비중)</li>
              </ul>
            </div>
          </article>
        </div>

        {/* tabs */}
        <div className="menu">
          <ol>
            {terms.map(t=>(
              <li key={t.id}>
                <a className={selected===t.id? "active":""} onClick={()=>setSelected(t.id)}>{t.label}</a>
              </li>
            ))}
          </ol>
        </div>

        {/* current term header */}
        <h2 style={{margin:"14px 0 6px"}}>
          {cur.label}
          <small style={{marginLeft:8, color:"#ef4444", fontWeight:700}}>
            평점 {isFinite(curGpa)?curGpa.toFixed(2):"-"}
          </small>
          <small style={{marginLeft:8, color:"#999"}}>전공 {isFinite(curMajor)?curMajor.toFixed(2):"-"} 취득 {curSum.totalCredits}</small>
        </h2>

        {/* table */}
        <table className="subjects card">
          <thead>
            <tr>
              <th className="name">과목명</th>
              <th className="credit">학점</th>
              <th className="grade">성적</th>
              <th className="major">전공</th>
            </tr>
          </thead>
          <tbody>
            {cur.courses.map(c=>(
              <tr key={c.id}>
                <td><input className="input" value={c.name} onChange={e=>updateRow(c.id,{...c,name:e.target.value})} placeholder="과목명" /></td>
                <td>
                  <select className="select" value={c.credit} onChange={e=>updateRow(c.id,{...c,credit:Number(e.target.value)})}>
                    {[0.5,1,1.5,2,2.5,3,3.5,4].map(v=><option key={v} value={v}>{v}</option>)}
                  </select>
                </td>
                <td>
                  <select className="select" value={c.grade} onChange={e=>updateRow(c.id,{...c,grade:e.target.value})}>
                    {GRADE_OPTIONS.map(g=><option key={g} value={g}>{g}</option>)}
                  </select>
                </td>
                <td style={{textAlign:"center"}}>
                  <input className="checkbox" type="checkbox" checked={c.isMajor}
                         onChange={e=>updateRow(c.id,{...c,isMajor:e.target.checked})}/>
                  <button className="btn" style={{marginLeft:8}} onClick={()=>removeRow(c.id)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="actions">
          <button className="btn btn--primary" onClick={addRow}>더 입력하기</button>
          <button className="btn" onClick={reset}>초기화</button>
          <div style={{marginLeft:"auto"}}>
            <input className="input" type="number" value={gradTarget} onChange={e=>setGradTarget(Number(e.target.value))} style={{width:120}}/>
            <span style={{marginLeft:8, color:"#666"}}>졸업 학점</span>
          </div>
        </div>

      </div>
    </div>
  );
}
