import { useEffect, useState } from "react";
import { api, login, setToken, clearToken, getToken } from "./api";
import "./styles.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [view, setView] = useState("candidate");
  const [headerAssessments, setHeaderAssessments] = useState([]);

  const loadMe = async () => {
    try {
      const me = await api.me();
      setUser(me);
      setView(me.role === "admin" ? "admin" : me.role === "leadership" ? "leadership" : "candidate");
      const list = await api.assessments();
      setHeaderAssessments(list.slice(0, 3));
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    if (getToken()) loadMe();
  }, []);

  const handleLogout = () => {
    clearToken();
    setUser(null);
  };

  if (!user) {
    return <Auth onAuth={loadMe} onError={setError} error={error} />;
  }

  return (
    <div className="shell">
      <div className="app">
        <header className="header">
          <div className="brand">
            <div className="logo-mark">SS</div>
            <div>
              <div className="brand-title">Shared Services</div>
              <div className="brand-sub">Skill Assessment Suite</div>
            </div>
          </div>
          <div className="nav">
            <span className="badge">{user.role}</span>
            <button className="secondary" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="hero">
          <div>
            <h2>Hi {user.full_name || user.email}, let’s measure capability.</h2>
            <p className="small">Evidence-based assessments for AWS, Azure, ServiceNow, and more.</p>
          </div>
          <div className="tabs" style={{ "--tab-left": view === "candidate" ? "8px" : view === "leadership" ? "120px" : "226px" }}>
            <button className={view === "candidate" ? "active" : ""} onClick={() => setView("candidate")}>Candidate</button>
            {(user.role === "admin" || user.role === "leadership") && (
              <button className={view === "leadership" ? "active" : ""} onClick={() => setView("leadership")}>Leadership</button>
            )}
            {user.role === "admin" && (
              <button className={view === "admin" ? "active" : ""} onClick={() => setView("admin")}>Admin</button>
            )}
          </div>
        </div>

        <div className="header-hero">
          <div className="card">
            <h2>Trusted skill validation at scale.</h2>
            <p className="small">Confidently assess cloud and platform capabilities with structured, timed, and standardized evaluations.</p>
            <div className="sym-grid" style={{ marginTop: 14 }}>
              <div className="sym-card">
                <h3>Active tracks</h3>
                <p className="small">{headerAssessments.length || "No"} assessments available</p>
              </div>
              <div className="sym-card">
                <h3>Secure delivery</h3>
                <p className="small">Timed sessions with randomized questions</p>
              </div>
            </div>
          </div>
          <div className="floating-stack">
            {headerAssessments.map((a, idx) => (
              <div key={a.id} className={`float-card ${idx === 1 ? "small" : ""} float-${idx + 1}`}>
                <div className="float-icon">{a.technology?.slice(0, 2).toUpperCase() || "SS"}</div>
                <div className="float-title">{a.title}</div>
                <div className="float-sub">{a.technology}{a.time_limit_minutes ? ` • ${a.time_limit_minutes}m` : ""}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="wave-divider" />

        {view === "candidate" && <CandidateView />}
        {view === "admin" && user.role === "admin" && <AdminView />}
        {view === "leadership" && (user.role === "admin" || user.role === "leadership") && <LeadershipView />}

        <div className="wave-divider bottom" />
      </div>
    </div>
  );
}

function Auth({ onAuth, onError, error }) {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    onError("");
    try {
      if (isRegister) {
        await api.register({ email: form.email, password: form.password, full_name: form.full_name });
      }
      const token = await login(form.email, form.password);
      setToken(token.access_token);
      await onAuth();
    } catch (err) {
      onError(err.message || "Auth failed");
    }
  };

  return (
    <div className="shell">
      <div className="app">
        <div className="auth-wrap">
          <div className="auth-hero">
            <div className="brand">
              <div className="logo-mark">SS</div>
              <div>
                <div className="brand-title">Shared Services</div>
                <div className="brand-sub">Skill Assessment Suite</div>
              </div>
            </div>
            <h1>Modernize skill validation.</h1>
            <p>Standardized assessments, credible scoring, and leadership-ready insights with a frictionless experience.</p>
          </div>
          <div className="card">
            <p className="small">{isRegister ? "Create an account" : "Sign in to start an assessment"}</p>
            {error && <p className="small" style={{ color: "#b91c1c" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              {isRegister && (
                <label>
                  Full name
                  <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </label>
              )}
              <label>
                Email
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label>
                Password
                <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </label>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button type="submit">{isRegister ? "Register" : "Login"}</button>
                <button type="button" className="secondary" onClick={() => setIsRegister(!isRegister)}>
                  {isRegister ? "Have an account?" : "Create account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function CandidateView() {
  const [assessments, setAssessments] = useState([]);
  const [active, setActive] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [attemptId, setAttemptId] = useState(null);

  useEffect(() => {
    api.assessments().then(setAssessments);
  }, []);

  const startAssessment = async (assessment) => {
    setActive(assessment);
    setResult(null);
    const started = await api.startAssessment(assessment.id);
    setQuestions(started.questions);
    setAttemptId(started.attempt_id);
    setAnswers({});
    if (started.time_limit_minutes) {
      setTimeLeft(started.time_limit_minutes * 60);
    } else {
      setTimeLeft(null);
    }
  };

  const submit = async () => {
    const payload = {
      attempt_id: attemptId,
      assessment_id: active.id,
      answers: questions.map((q) => ({ question_id: q.id, selected_index: answers[q.id] ?? -1 })),
    };
    const res = await api.submit(payload);
    setResult(res);
  };

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      submit();
      return;
    }
    const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  return (
    <div className="card">
      <div className="hero">
        <div>
          <h2>Assessments</h2>
          <p className="small">Choose a skill track and begin your evaluation.</p>
        </div>
        <span className="pill">Secure • Timed • Role-based</span>
      </div>
      <div className="sym-grid" style={{ marginBottom: 16 }}>
        <div className="sym-card">
          <h3>Tracks</h3>
          <p className="small">AWS, Azure, ServiceNow, and custom stacks.</p>
        </div>
        <div className="sym-card">
          <h3>Scoring</h3>
          <p className="small">Consistent difficulty bands and timed sessions.</p>
        </div>
      </div>
      {!active && (
        <div className="grid">
          {assessments.map((a) => (
            <div key={a.id} className="card">
              <h3>{a.title}</h3>
              <p className="small">{a.description}</p>
              <span className="badge">{a.technology}</span>
              <div style={{ marginTop: 12 }}>
                <button onClick={() => startAssessment(a)}>Start</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {active && (
        <div>
          <h3>{active.title}</h3>
          {timeLeft !== null && (
            <p className="small">Time left: {Math.floor(timeLeft / 60)}m {timeLeft % 60}s</p>
          )}
          {questions.map((q) => (
            <div key={q.id} className="question">
              <strong>{q.prompt}</strong>
              {q.options.map((opt, idx) => (
                <label key={idx} className="option">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={answers[q.id] === idx}
                    onChange={() => setAnswers({ ...answers, [q.id]: idx })}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button onClick={submit}>Submit</button>
            <button className="secondary" onClick={() => setActive(null)}>Back</button>
          </div>
          {result && (
            <p className="small">Score: {result.score}% ({result.total} questions)</p>
          )}
        </div>
      )}
    </div>
  );
}

function AdminView() {
  const [assessments, setAssessments] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", technology: "", time_limit_minutes: "", randomize_questions: true });
  const [qForm, setQForm] = useState({ assessment_id: "", prompt: "", options: "", correct_index: 0, difficulty: "medium" });
  const [users, setUsers] = useState([]);
  const [importFile, setImportFile] = useState(null);
  const [importAssessmentId, setImportAssessmentId] = useState("");
  const [importError, setImportError] = useState("");

  const refresh = async () => {
    setAssessments(await api.adminAssessments());
    setUsers(await api.listUsers());
  };

  useEffect(() => {
    refresh();
  }, []);

  const createAssessment = async () => {
    const payload = {
      title: form.title,
      description: form.description,
      technology: form.technology,
      time_limit_minutes: form.time_limit_minutes ? Number(form.time_limit_minutes) : null,
      randomize_questions: Boolean(form.randomize_questions),
    };
    await api.createAssessment(payload);
    setForm({ title: "", description: "", technology: "", time_limit_minutes: "", randomize_questions: true });
    refresh();
  };

  const createQuestion = async () => {
    const options = qForm.options.split("\n").filter(Boolean);
    await api.createQuestion({
      assessment_id: Number(qForm.assessment_id),
      prompt: qForm.prompt,
      options,
      correct_index: Number(qForm.correct_index),
      difficulty: qForm.difficulty,
    });
    setQForm({ assessment_id: "", prompt: "", options: "", correct_index: 0, difficulty: "medium" });
  };

  const updateRole = async (id, role) => {
    await api.updateUser(id, { role });
    refresh();
  };

  const importBank = async () => {
    if (!importAssessmentId) {
      setImportError("Select an assessment first.");
      return;
    }
    if (!importFile) {
      setImportError("Choose a CSV or JSON file to import.");
      return;
    }
    setImportError("");
    await api.importQuestionBank(importAssessmentId, importFile);
    setImportFile(null);
  };

  return (
    <div className="list">
      <div className="card">
        <h2>Create Assessment</h2>
        <label>Title<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
        <label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <label>Technology<input value={form.technology} onChange={(e) => setForm({ ...form, technology: e.target.value })} /></label>
        <label>Time limit (minutes)<input type="number" value={form.time_limit_minutes} onChange={(e) => setForm({ ...form, time_limit_minutes: e.target.value })} /></label>
        <label>Randomize questions
          <select value={form.randomize_questions ? "yes" : "no"} onChange={(e) => setForm({ ...form, randomize_questions: e.target.value === "yes" })}>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <button onClick={createAssessment}>Create</button>
      </div>

      <div className="card">
        <h2>Add Question</h2>
        <label>Assessment
          <select value={qForm.assessment_id} onChange={(e) => setQForm({ ...qForm, assessment_id: e.target.value })}>
            <option value="">Select assessment</option>
            {assessments.map((a) => (<option key={a.id} value={a.id}>{a.title}</option>))}
          </select>
        </label>
        <label>Prompt<textarea value={qForm.prompt} onChange={(e) => setQForm({ ...qForm, prompt: e.target.value })} /></label>
        <label>Options (one per line)<textarea value={qForm.options} onChange={(e) => setQForm({ ...qForm, options: e.target.value })} /></label>
        <label>Correct index<input type="number" value={qForm.correct_index} onChange={(e) => setQForm({ ...qForm, correct_index: e.target.value })} /></label>
        <label>Difficulty
          <select value={qForm.difficulty} onChange={(e) => setQForm({ ...qForm, difficulty: e.target.value })}>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </label>
        <button onClick={createQuestion}>Add</button>
      </div>

      <div className="card">
        <h2>Import Question Bank</h2>
        <p className="small">Upload CSV or JSON. CSV headers: prompt, option_1..option_6, correct_index, difficulty.</p>
        <label>Assessment
          <select value={importAssessmentId} onChange={(e) => setImportAssessmentId(e.target.value)}>
            <option value="">Select assessment</option>
            {assessments.map((a) => (<option key={a.id} value={a.id}>{a.title}</option>))}
          </select>
        </label>
        <input type="file" accept=".csv,.json" onChange={(e) => setImportFile(e.target.files?.[0] || null)} />
        {importError && <p className="small" style={{ color: "#b91c1c" }}>{importError}</p>}
        <button onClick={importBank} disabled={!importAssessmentId || !importFile}>Import</button>
      </div>

      <div className="card">
        <h2>User Roles</h2>
        {users.map((u) => (
          <div key={u.id} className="question">
            <strong>{u.email}</strong>
            <div className="small">{u.full_name || "No name"}</div>
            <select value={u.role} onChange={(e) => updateRole(u.id, e.target.value)}>
              <option value="candidate">candidate</option>
              <option value="admin">admin</option>
              <option value="leadership">leadership</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadershipView() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    api.leadershipOverview().then(setOverview);
  }, []);

  if (!overview) return <div className="card">Loading leadership view...</div>;

  return (
    <div className="list">
      <div className="card">
        <h2>Overview</h2>
        <p>Total Users: {overview.total_users}</p>
        <p>Total Attempts: {overview.total_attempts}</p>
        <p>Average Score: {overview.avg_score}%</p>
      </div>
      <div className="card">
        <h2>Assessments</h2>
        <div className="list">
          {overview.assessments.map((a) => (
            <div key={a.assessment_id} className="question">
              <strong>{a.title}</strong>
              <div className="small">{a.technology}</div>
              <div className="small">Attempts: {a.attempts}</div>
              <div className="small">Avg score: {a.avg_score}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Skill Heatmap</h2>
        <div className="grid">
          {overview.skill_heatmap.map((s, idx) => {
            const intensity = Math.min(1, s.avg_score / 100);
            const bg = `rgba(34, 197, 94, ${0.15 + intensity * 0.5})`;
            return (
              <div key={idx} className="question" style={{ background: bg }}>
                <strong>{s.technology}</strong>
                <div className="small">{s.title}</div>
                <div className="small">Attempts: {s.attempts}</div>
                <div className="small">Avg score: {s.avg_score}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
