import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import './hero.css';
import './trust.css';
import './mobile.css';

const columns = ['Salesperson', 'Region', 'Product', 'Units', 'Unit Price', 'Revenue'];
const starterRows = [
  ['Arjun', 'South', 'Laptop', 5, 45000, ''],
  ['Priya', 'North', 'Monitor', 8, 12000, ''],
  ['Rahul', 'West', 'Laptop', 3, 45000, ''],
  ['Sneha', 'South', 'Keyboard', 12, 1500, ''],
  ['Karan', 'East', 'Monitor', 6, 12000, ''],
];
const expected = [225000, 96000, 135000, 18000, 72000];
const faqs = [
  ['Is ExcelVerse free to start?', 'Yes. You can explore interactive practice before choosing a paid plan.'],
  ['Do I need Excel installed?', 'No. The lessons run in your browser and teach transferable spreadsheet skills.'],
  ['Is this suitable for beginners?', 'Absolutely. Start with spreadsheet foundations and build up one small win at a time.'],
  ['Will I only watch videos?', 'No. The core learning loop is practice: you make changes in a spreadsheet and get feedback.'],
  ['What will I learn?', 'Formulas, functions, data cleaning, analysis, lookup logic, reporting, and practical workflows.'],
  ['Can I learn at my own pace?', 'Yes. Lessons are structured in short modules so you can return whenever you have time.'],
  ['Are the exercises based on real work?', 'They use realistic sales, operations, finance, marketing, and HR scenarios.'],
  ['What happens if I get stuck?', 'Use contextual hints, inspect the solution, and try again without losing the lesson context.'],
  ['Does it work on mobile?', 'The landing page works everywhere; spreadsheet practice is most comfortable on a tablet or desktop.'],
  ['Can I practice formulas?', 'Yes. Formula entry and calculated outcomes are central to the learning experience.'],
  ['Are advanced topics included?', 'The learning path progresses from basics into analysis and more advanced spreadsheet workflows.'],
  ['Can I use what I learn in Google Sheets?', 'Most core concepts transfer directly, though interfaces and a few functions differ.'],
  ['Do you provide certificates?', 'Learning progress is tracked; certificate availability can vary by plan and program.'],
  ['Is this for students or professionals?', 'Both. The projects are designed to feel useful for coursework and everyday work.'],
  ['How do I begin?', 'Choose Start Learning Free and complete the first interactive lesson.'],
];
const levels = [
  ['01', 'Foundations', 'Navigate sheets, cells, formulas, and clean data.'],
  ['02', 'Formula fluency', 'Build confidence with everyday calculations.'],
  ['03', 'Data confidence', 'Sort, filter, validate, and structure information.'],
  ['04', 'Analysis', 'Turn rows into useful business answers.'],
  ['05', 'Lookups', 'Connect tables and retrieve the right values.'],
  ['06', 'Reporting', 'Create clear summaries people can use.'],
  ['07', 'Advanced practice', 'Apply skills in realistic work scenarios.'],
];
const scenarios = {
  Sales: ['Monthly revenue check', 'Calculate revenue by product and identify the strongest region.', '=Units × Unit Price'],
  Finance: ['Budget variance review', 'Compare planned spend with actuals and flag exceptions.', '=Actual - Budget'],
  Marketing: ['Campaign performance', 'Combine channel spend and conversions to calculate cost per lead.', '=Spend / Leads'],
  Operations: ['Inventory reorder', 'Spot items below their reorder point from a live stock table.', '=IF(Stock<Reorder,"Order","OK")'],
  HR: ['Team capacity', 'Summarize staffing information and find coverage gaps.', '=COUNTIF(Status,"Available")'],
};

function Icon({ children }) { return <span className="icon" aria-hidden="true">{children}</span>; }
function scrollTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

function SpreadsheetDemo() {
  const [rows, setRows] = useState(starterRows.map(r => [...r]));
  const [selected, setSelected] = useState([0, 5]);
  const [formula, setFormula] = useState('');
  const [message, setMessage] = useState('Select F2, enter =D2*E2, then fill the formula down.');
  const [solved, setSolved] = useState(false);
  const colLetter = (i) => String.fromCharCode(65 + i);
  const cellName = `${colLetter(selected[1])}${selected[0] + 2}`;
  const format = (value, col) => (col >= 3 && value !== '' && !Number.isNaN(Number(value)) ? Number(value).toLocaleString('en-IN') : value);
  const evaluate = (expression) => {
    let exp = expression.trim();
    if (!exp.startsWith('=')) return exp;
    exp = exp.slice(1).replace(/\b([A-F])([2-6])\b/g, (_, letter, number) => {
      const col = letter.charCodeAt(0) - 65; const row = Number(number) - 2;
      return String(Number(rows[row]?.[col]) || 0);
    });
    if (!/^[\d+\-*/().\s]+$/.test(exp)) throw new Error('Use a calculation with cell references, e.g. =D2*E2');
    // Formula characters are restricted to numeric arithmetic before evaluation.
    const value = Function(`"use strict"; return (${exp})`)();
    if (!Number.isFinite(value)) throw new Error('That formula cannot be calculated.');
    return value;
  };
  const applyFormula = () => {
    try {
      const next = rows.map(r => [...r]);
      next[selected[0]][selected[1]] = evaluate(formula);
      setRows(next); setMessage(`Applied ${formula || 'your value'} to ${cellName}.`); setFormula('');
    } catch (error) { setMessage(error.message); }
  };
  const fillDown = () => {
    if (selected[1] !== 5) { setMessage('Select a Revenue cell first, then use Fill down.'); return; }
    const next = rows.map((r, index) => [...r.slice(0, 5), r[3] * r[4]]);
    setRows(next); setMessage('Revenue formula filled down from F2 through F6.');
  };
  const check = () => {
    const correct = rows.every((r, i) => Number(r[5]) === expected[i]);
    setSolved(correct); setMessage(correct ? 'Excellent — every revenue value is correct.' : 'Not quite yet. Check the Units and Unit Price references, then try again.');
  };
  const reset = () => { setRows(starterRows.map(r => [...r])); setSelected([0, 5]); setFormula(''); setSolved(false); setMessage('Reset complete. Start with F2 =D2*E2.'); };
  return <div className="sheet-shell" aria-label="Interactive spreadsheet practice">
    <div className="sheet-top"><span className="sheet-dot red" /><span className="sheet-dot amber" /><span className="sheet-dot green" /><span className="sheet-title">Revenue practice.xlsx</span><span className="autosave">● Saved</span></div>
    <div className="formula-bar"><b>{cellName}</b><span className="fx">fx</span><input value={formula} onChange={e => setFormula(e.target.value)} onKeyDown={e => e.key === 'Enter' && applyFormula()} placeholder="Type a formula, e.g. =D2*E2" aria-label="Formula bar" /><button onClick={applyFormula}>Apply</button></div>
    <div className="grid-wrap"><table className="sheet-grid"><thead><tr><th className="corner" scope="col" />{columns.map((_, i) => <th scope="col" key={i}>{colLetter(i)}</th>)}</tr></thead><tbody><tr className="head-row"><th scope="row">1</th>{columns.map(c => <td key={c}>{c}</td>)}</tr>{rows.map((row, ri) => <tr key={ri}><th scope="row">{ri + 2}</th>{row.map((value, ci) => <td key={ci} tabIndex={0} aria-label={`${cellName === `${colLetter(ci)}${ri + 2}` ? cellName : `${colLetter(ci)}${ri + 2}`}: ${format(value, ci) || 'empty'}`} aria-selected={selected[0] === ri && selected[1] === ci} className={selected[0] === ri && selected[1] === ci ? 'selected' : ''} onClick={() => { setSelected([ri, ci]); setFormula(''); }} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelected([ri, ci]); setFormula(''); } }}><span>{format(value, ci)}</span></td>)}</tr>)}</tbody></table></div>
    <div className="demo-controls"><button className="text-btn" onClick={() => setMessage('Hint: Revenue is the number of units multiplied by the price of one unit.')}>Show hint</button><button className="text-btn" onClick={() => { setRows(rows.map((r, i) => [...r.slice(0, 5), expected[i]])); setMessage('Solution revealed. Review the formula =D2*E2, then notice how it changes per row.'); }}>Reveal solution</button><button className="text-btn" onClick={fillDown}>Fill down</button><button className="text-btn" onClick={reset}>Reset</button><button className="check-btn" onClick={check}>Check answer <span>→</span></button></div>
    <div className={`feedback ${solved ? 'success' : ''}`} role="status"><Icon>{solved ? '✓' : '✦'}</Icon>{message}</div>
    {solved && <div className="completion-next"><strong>Nice work! You just learned your first practical Excel formula.</strong><p>Imagine what you could accomplish with lookup formulas, dashboards, PivotTables, and real-world analysis.</p><button className="primary" onClick={() => scrollTo('final-cta')}>Continue learning for free <span>→</span></button></div>}
  </div>;
}

function App() {
  const [menu, setMenu] = useState(false); const [activeLevel, setActiveLevel] = useState(0); const [scenario, setScenario] = useState('Sales'); const [openFaq, setOpenFaq] = useState(null);
  const activeScenario = scenarios[scenario];
  const nav = [['Practice', 'demo'], ['Career paths', 'career'], ['How it works', 'how']];
  return <>
    <header className="nav"><a className="brand" href="#top" aria-label="ExcelVerse home"><span>✦</span> ExcelVerse</a><button className="nav-toggle" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Toggle menu">☰</button><nav className={menu ? 'open' : ''}>{nav.map(([label, id]) => <button key={id} onClick={() => { scrollTo(id); setMenu(false); }}>{label}</button>)}</nav><div className="nav-actions"><button className="login" onClick={() => scrollTo('demo')}>Sign in</button><button className="primary small" onClick={() => scrollTo('demo')}>Start learning free <span>→</span></button></div></header>
    <main id="top">
      <section className="hero hero-focused"><div className="hero-copy"><p className="eyebrow hero-label"><span /> INTERACTIVE EXCEL LEARNING</p><h1>Get good at Excel<br />by <em>actually using it.</em></h1><p className="lede">The hands-on learning space for people who want to stop second-guessing spreadsheets and start getting useful work done.</p><div className="hero-actions"><button className="primary" onClick={() => scrollTo('demo')}>Start learning free <span>→</span></button><button className="secondary" onClick={() => scrollTo('demo')}>See how it works <span>↓</span></button></div><div className="hero-note"><b>Free to begin</b><span>•</span><span>No credit card</span><span>•</span><span>Learn in your own time</span></div><div className="proof"><div className="avatars"><i>AK</i><i>RS</i><i>JM</i><i>NP</i></div><span><strong>Made for people who learn by doing.</strong><br />One practical task at a time.</span></div></div></section>
      <section className="logos" aria-label="Learning topics"><p>ONE PRACTICAL SKILL AT A TIME</p><div><span>FORMULAS</span><span>DATA CLEANING</span><span>ANALYSIS</span><span>REPORTING</span><span>LOOKUPS</span></div></section>
      <section className="problem" id="how"><div><p className="eyebrow">THE PROBLEM WITH MOST EXCEL COURSES</p><h2>You do not learn Excel<br />by <em>watching</em> someone<br />else use it.</h2></div><div className="problem-copy"><p>Videos can explain a formula. But confidence comes from choosing the right cells, making mistakes, and seeing why an answer works.</p><p>ExcelVerse turns passive watching into a focused, hands-on habit.</p><a href="#demo">Try the difference <span>→</span></a></div></section>
      <section className="steps"><p className="eyebrow centered">A BETTER WAY TO BUILD SKILL</p><h2>See it. Try it. <em>Own it.</em></h2><div className="step-grid"><article><b>01</b><Icon>◉</Icon><h3>Understand the why</h3><p>Short, plain-language instruction gives every action a purpose before you start.</p></article><article><b>02</b><Icon>⌘</Icon><h3>Practice for real</h3><p>Work directly in a spreadsheet, one guided decision at a time.</p></article><article><b>03</b><Icon>✦</Icon><h3>Get instant feedback</h3><p>Know what worked, fix what did not, and carry the pattern into the next task.</p></article></div></section>
      <section className="demo-section" id="demo"><div className="section-intro"><p className="eyebrow">TRY A REAL LESSON</p><h2>Do not take our word<br />for it. <em>Try it.</em></h2><p>This is how learning feels: a focused task, a live worksheet, and feedback that helps you move forward.</p><div className="task-card"><span>YOUR TASK</span><strong>Calculate revenue for each sale.</strong><p>In cell F2, enter <code>=D2*E2</code>, then apply it to the rows below.</p></div></div><SpreadsheetDemo /></section>
      <section className="journey" id="journey"><div className="journey-intro"><p className="eyebrow">YOUR LEARNING JOURNEY</p><h2>A clear path from<br />“where do I start?”<br />to <em>“I can do this.”</em></h2><p>Build momentum through structured levels that take you from the basics to the spreadsheet work that matters most.</p></div><div className="level-panel"><div className="level-list">{levels.map((level, i) => <button key={level[0]} className={i === activeLevel ? 'active' : ''} onClick={() => setActiveLevel(i)}><small>{level[0]}</small><span>{level[1]}</span><b>→</b></button>)}</div><div className="level-detail"><p>LEVEL {levels[activeLevel][0]}</p><h3>{levels[activeLevel][1]}</h3><span className="live-badge">● Interactive practice</span><p>{levels[activeLevel][2]}</p><div className="progress-line"><i style={{ width: `${(activeLevel + 1) / levels.length * 100}%` }} /></div><button className="secondary" onClick={() => scrollTo('demo')}>Explore this level <span>→</span></button></div></div></section>
      <section className="features"><p className="eyebrow centered">EVERYTHING YOU NEED TO KEEP MOVING</p><h2>Designed for the moment<br />when learning <em>gets real.</em></h2><div className="feature-grid"><article className="feature large"><span className="feature-num">01</span><div className="fake-feedback"><b>✓ Nice work</b><p>Your formula returns the correct total.</p><small>Next: try using AutoFill.</small></div><h3>Feedback that teaches</h3><p>More than right or wrong: clear guidance that explains what to try next.</p></article><article className="feature"><span className="feature-num">02</span><div className="streak">🔥<b>4 day streak</b><span>Keep your momentum.</span></div><h3>Progress you can feel</h3><p>Small wins, visible growth, and a learning habit that is easy to return to.</p></article><article className="feature"><span className="feature-num">03</span><div className="project-lines"><i /><i /><i /></div><h3>Projects with a point</h3><p>Practice skills through scenarios that mirror the questions teams ask every day.</p></article></div></section>
      <section className="applications"><div><p className="eyebrow">PRACTICE FOR THE WORK YOU ACTUALLY DO</p><h2>Excel has a job.<br /><em>So should your practice.</em></h2><p>Choose a context and see the kind of decision you will learn to make.</p><div className="scenario-tabs">{Object.keys(scenarios).map(name => <button className={scenario === name ? 'active' : ''} onClick={() => setScenario(name)} key={name}>{name}</button>)}</div></div><article className="scenario-card"><p>{scenario.toUpperCase()} SCENARIO</p><h3>{activeScenario[0]}</h3><div className="scenario-sheet"><span>Task</span><strong>{activeScenario[1]}</strong><code>{activeScenario[2]}</code></div><button className="text-btn" onClick={() => scrollTo('demo')}>Try a similar exercise <span>→</span></button></article></section>
      <section className="comparison"><p className="eyebrow centered">LEARN DIFFERENTLY</p><h2>Less consuming.<br /><em>More doing.</em></h2><div className="compare-table"><div className="compare-head"><span>Most courses</span><strong>ExcelVerse</strong></div>{[['Watch long videos', 'Practice in a live worksheet'], ['Follow generic examples', 'Solve realistic work scenarios'], ['Wait to know if you are right', 'Get feedback as you work'], ['Try to remember later', 'Build reusable patterns']].map(([oldWay, newWay]) => <div className="compare-row" key={oldWay}><span>— &nbsp;{oldWay}</span><strong>✓ &nbsp;{newWay}</strong></div>)}</div></section>
      <section className="career" id="career"><div><p className="eyebrow">SKILLS THAT TRAVEL WITH YOU</p><h2>Excel confidence<br />opens doors.</h2><p>Whether you are preparing for your first role, becoming stronger in your current one, or making a career change, practical spreadsheet skills show up everywhere.</p><button className="primary" onClick={() => scrollTo('demo')}>Start building your skill <span>→</span></button></div><div className="career-card"><span>YOUR NEXT WIN</span><h3>“I can take a messy sheet and turn it into an answer.”</h3><div><i>✓</i><p>Make a decision with data<br /><small>Not just a prettier spreadsheet</small></p></div></div></section>
      <section className="faq"><p className="eyebrow centered">QUESTIONS, ANSWERED</p><h2>Everything you need<br />to know <em>before you begin.</em></h2><div>{faqs.map(([question, answer], index) => <article key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>{question}<span>{openFaq === index ? '−' : '+'}</span></button>{openFaq === index && <p>{answer}</p>}</article>)}</div></section>
      <section className="final-cta" id="final-cta"><p className="eyebrow">YOUR NEXT SPREADSHEET IS WAITING</p><h2>Stop watching.<br /><em>Start doing.</em></h2><p>Build the Excel confidence your work deserves—one practical step at a time.</p><button className="primary light" onClick={() => scrollTo('demo')}>Start learning free <span>→</span></button><small>No credit card required · Learn at your pace</small></section>
    </main>
    <footer><a className="brand" href="#top"><span>✦</span> ExcelVerse</a><p>Practical spreadsheet learning for real work.</p><div><a href="#journey">Learning path</a><a href="#demo">Practice demo</a><a href="#career">Career skills</a><a href="#top">Privacy</a></div><small>© {new Date().getFullYear()} ExcelVerse. Built for better spreadsheet days.</small></footer>
  </>;
}
createRoot(document.getElementById('root')).render(<App />);
