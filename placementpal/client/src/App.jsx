
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  BookOpen,
  FileUser,
  ChartNoAxesCombined,
  Bell,
  Sun,
  Moon,
  Search,
  ArrowRight,
  LogOut,
  CalendarDays,
  Target,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import "./App.css";
const API_URL = "http://localhost:5000";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      navigate("/dashboard");
    }
  }
  const API_URL = "http://localhost:5000";


  return (
    <main className="login-page">
      <section className="login-intro">
        <div className="brand">
          <div className="brand-icon">
            <BriefcaseBusiness size={23} />
          </div>
          <span>PlacementPal</span>
        </div>

        <div className="intro-content">
          <span className="eyebrow">YOUR CAREER STARTS HERE</span>
          <h1>Your dream career is closer than you think.</h1>
          <p>
            Organize your applications, prepare for interviews,
            and take control of your placement journey.
          </p>

          <div className="intro-points">
            <div><CheckCircle2 /> Track every application</div>
            <div><CheckCircle2 /> Prepare with confidence</div>
            <div><CheckCircle2 /> Celebrate your progress</div>
          </div>
        </div>

        <p className="intro-footer">
          Built for students. Designed for your future.
        </p>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <span className="eyebrow">WELCOME TO PLACEMENTPAL</span>
          <h2>Let's get you hired.</h2>
          <p className="muted">
            Sign in to continue your placement journey.
          </p>

          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="primary-button" type="submit">
              Sign in <ArrowRight size={18} />
            </button>
          </form>

<div className="signup-prompt">
  Don't have an account?{" "}
  <button
    type="button"
    className="link-button"
    onClick={() => navigate("/signup")}
  >
    Create an account
  </button>
</div>

          <div className="login-note">
            <BriefcaseBusiness size={17} />
            Your next opportunity starts with one step.
          </div>
          <p className="demo-note">
            UI demo only — authentication will be added later.
          </p>
        </div>
      </section>
    </main>
  );
}

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignup(e) {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("Signup API is not connected yet.");
  }

  return (
    <main className="login-page">
      <section className="login-intro">
        <div className="brand">
          <div className="brand-icon">P</div>
          <h2>PlacementPal</h2>
        </div>

        <h1>Create your account</h1>
        <p>Start organizing your placement journey today.</p>
      </section>

      <section className="login-form-section">
        <form className="login-form" onSubmit={handleSignup}>
          <h2>Sign Up</h2>
          <p>Enter your details to get started.</p>

          {error && <p role="alert" className="form-error">{error}</p>}

          <label htmlFor="signup-name">Full name</label>
          <input
            id="signup-name"
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />

          <label htmlFor="signup-confirm">Confirm password</label>
          <input
            id="signup-confirm"
            type="password"
            placeholder="Enter password again"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Create Account</button>

          <p>
            Already have an account?{" "}
            <button
              type="button"
              className="link-button"
              onClick={() => navigate("/")}
            >
              Sign in
            </button>
          </p>
        </form>
      </section>
    </main>
  );
}


const initialJobs = [
  { company: "Infosys", role: "System Engineer", status: "Applied" },
  { company: "TCS", role: "Graduate Trainee", status: "Interview" },
  { company: "Wipro", role: "Project Engineer", status: "Saved" },
];

function Dashboard() {
  
const [theme, setTheme] = useState(() => {
  return localStorage.getItem("placementpal-theme") || "dark";
});

useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("placementpal-theme", theme);
}, [theme]);

const toggleTheme = () => {
  setTheme((current) => (current === "dark" ? "light" : "dark"));
};

  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
  async function fetchApplications() {
    try {
      const response = await fetch(`${API_URL}/api/applications`);
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Failed to load applications:", error);
    }
  }

  fetchApplications();
}, []);
  const [showForm, setShowForm] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  
async function addJob(e) {
  e.preventDefault();

  if (!company.trim() || !role.trim()) return;

  try {
    const response = await fetch(`${API_URL}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company: company.trim(),
        role: role.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save application");
    }

    const newJob = await response.json();

    setJobs((previousJobs) => [...previousJobs, newJob]);
    setCompany("");
    setRole("");
    setShowForm(false);
    setActive("Applications");
  } catch (error) {
    console.error("Error saving application:", error);
    alert("Could not save the application. Please try again.");
  }
}

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Applications", icon: BriefcaseBusiness },
    { name: "Preparation", icon: BookOpen },
    { name: "Resume", icon: FileUser },
    { name: "Progress", icon: ChartNoAxesCombined },
  ];

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="brand sidebar-brand">
          <div className="brand-icon">
            <BriefcaseBusiness size={22} />
          </div>
          <span>PlacementPal</span>
        </div>

        <p className="menu-label">WORKSPACE</p>

        <nav className="side-nav">
          {menu.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-item ${active === name ? "active" : ""}`}
              onClick={() => setActive(name)}
            >
              <Icon size={19} />
              {name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="profile-avatar">S</div>
          <div className="profile-info">
            <strong>Student</strong>
            <span>Placement journey</span>
          </div>
          <button
            className="icon-button"
            title="Sign out"
            onClick={() => navigate("/")}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> {active}
          </div>
          <div className="topbar-actions">
          
<button
  className="theme-toggle"
  onClick={toggleTheme}
  type="button"
  title="Switch theme"
>
  {theme === "dark" ? (
    <Sun size={19} />
  ) : (
    <Moon size={19} />
  )}
</button>

            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
            </button>
            <div className="profile-avatar small-avatar">S</div>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="welcome-row">
            <div>
              <span className="eyebrow">YOUR CAREER WORKSPACE</span>
              <h1>
                {active === "Dashboard"
                  ? "Welcome back!"
                  : active}
              </h1>
              <p className="muted">
                {active === "Dashboard"
                  ? "Small steps today, big opportunities tomorrow."
                  : `Manage your ${active.toLowerCase()} in one place.`}
              </p>
            </div>
            <button
              className="primary-button add-button"
              onClick={() => setShowForm(!showForm)}
            >
              + Add application
            </button>
          </div>

          {showForm && (
            <form className="job-form" onSubmit={addJob}>
              <h3>Add a job application</h3>
              <input
                placeholder="Company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
              <input
                placeholder="Job role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
              <button className="primary-button" type="submit">
                Save application
              </button>
            </form>
          )}

          {active === "Dashboard" ? (
            <>
              <div className="stats-grid">
                <StatCard
                  icon={BriefcaseBusiness}
                  label="Applications"
                  value={jobs.length}
                  note="Jobs you're tracking"
                />
                <StatCard
                  icon={Clock3}
                  label="In progress"
                  value={jobs.filter(j => j.status === "Interview").length}
                  note="Interviews and next steps"
                />
                <StatCard
                  icon={Target}
                  label="Preparation goal"
                  value="0%"
                  note="Start your weekly goal"
                />
                <StatCard
                  icon={CalendarDays}
                  label="Upcoming"
                  value="—"
                  note="Add your next deadline"
                />
              </div>

              <div className="content-grid">
                <section className="panel applications-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Recent applications</h3>
                      <p className="muted">
                        Keep an eye on your opportunities.
                      </p>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => setActive("Applications")}
                    >
                      View all
                    </button>
                  </div>

                  <div className="job-list">
                    {jobs.slice(-4).reverse().map((job, i) => (
                      <div className="job-row" key={`${job.company}-${i}`}>
                        <div className="company-avatar">
                          {job.company.charAt(0).toUpperCase()}
                        </div>
                        <div className="job-details">
                          <strong>{job.company}</strong>
                          <span>{job.role}</span>
                        </div>
                        <span className={`status status-${job.status.toLowerCase()}`}>
                          {job.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="panel preparation-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Preparation plan</h3>
                      <p className="muted">Build your confidence.</p>
                    </div>
                    <BookOpen size={20} />
                  </div>
                  <div className="prep-item">
                    <span className="prep-icon"><BookOpen size={19} /></span>
                    <div>
                      <strong>Aptitude practice</strong>
                      <span>Logical and quantitative reasoning</span>
                    </div>
                  </div>
                  <div className="prep-item">
                    <span className="prep-icon"><FileUser size={19} /></span>
                    <div>
                      <strong>Resume review</strong>
                      <span>Make your projects stand out</span>
                    </div>
                  </div>
                  <div className="prep-item">
                    <span className="prep-icon"><Target size={19} /></span>
                    <div>
                      <strong>Technical interview</strong>
                      <span>Revise core CS concepts</span>
                    </div>
                  </div>
                </section>
              </div>
            </>
          ) : active === "Applications" ? (
            <section className="panel applications-panel">
              <div className="panel-heading">
                <div>
                  <h3>All applications</h3>
                  <p className="muted">Your tracked opportunities.</p>
                </div>
                <Search size={20} />
              </div>
              {jobs.length === 0 ? (
                <p className="muted">No applications yet. Add your first one!</p>
              ) : (
                jobs.map((job, i) => (
                  <div className="job-row" key={`${job.company}-${i}`}>
                    <div className="company-avatar">
                      {job.company.charAt(0).toUpperCase()}
                    </div>
                    <div className="job-details">
                      <strong>{job.company}</strong>
                      <span>{job.role}</span>
                    </div>
                    <span className={`status status-${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </div>
                ))
              )}
            </section>
          ) : (
            <section className="panel placeholder-panel">
              <div className="placeholder-icon">
                {active === "Preparation" ? <BookOpen size={28} /> :
                 active === "Resume" ? <FileUser size={28} /> :
                 <ChartNoAxesCombined size={28} />}
              </div>
              <h3>{active} workspace</h3>
              <p className="muted">
                This section is ready for us to build in the next milestones.
              </p>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, note }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <Icon size={20} />
      </div>
      <h2>{value}</h2>
      <p>{note}</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
