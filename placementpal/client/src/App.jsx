
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
  Trash2
} from "lucide-react";
import "./App.css";
import ProfileMenu from "./components/profilemenu";
import EditAccount from "./components/editaccount";
import Resume from "./components/Resume";
import JobOpportunities from "./JobOpportunities";
const API_URL = "http://localhost:5000";



function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  
async function handleLogin(e) {
  e.preventDefault();
  setError("");

  if (!email.trim() || !password) {
    setError("Please enter your email and password.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Invalid email or password.");
    }

    // Keep the logged-in user's details if returned by the backend
   if (data.user && data.token) {
  localStorage.setItem("user", JSON.stringify(data.user));
  localStorage.setItem("token", data.token);
}

    navigate("/dashboard");
  } catch (error) {
    console.error("Signin error:", error);
    setError(error.message || "Unable to connect to the server.");
  }
}

  

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
          {error && (
  <p role="alert" className="form-error">
    {error}
  </p>
)}

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

  try {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed.");
    }

    alert("Account created successfully!");
    navigate("/");
  } catch (error) {
    console.error("Signup error:", error);
    setError(error.message || "Unable to connect to the server.");
  }
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

const preparationResources = [
  {
    id: "aptitude-1",
    category: "Aptitude",
    title: "Quantitative aptitude",
    description: "Practice percentages, ratios, averages and number systems.",
    resourceLabel: "Practice questions",
    url: "https://www.indiabix.com/aptitude/questions-and-answers/",
  },
  {
    id: "aptitude-2",
    category: "Aptitude",
    title: "Logical reasoning",
    description: "Improve problem-solving and logical thinking.",
    resourceLabel: "Reasoning practice",
    url: "https://www.indiabix.com/logical-reasoning/questions-and-answers/",
  },
  {
    id: "aptitude-3",
    category: "Aptitude",
    title: "Verbal ability",
    description: "Practice grammar, vocabulary and verbal questions.",
    resourceLabel: "Verbal practice",
    url: "https://www.indiabix.com/verbal-ability/questions-and-answers/",
  },
  {
    id: "technical-1",
    category: "Technical Skills",
    title: "JavaScript fundamentals",
    description: "Learn variables, functions, objects and asynchronous JavaScript.",
    resourceLabel: "Read the guide",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
  },
  {
    id: "technical-2",
    category: "Technical Skills",
    title: "Data structures and algorithms",
    description: "Study arrays, linked lists, stacks, queues and algorithms.",
    resourceLabel: "Explore tutorials",
    url: "https://www.geeksforgeeks.org/data-structures/",
  },
  {
    id: "technical-3",
    category: "Technical Skills",
    title: "Hands-on coding practice",
    description: "Strengthen your programming skills with interactive lessons.",
    resourceLabel: "Start learning",
    url: "https://www.freecodecamp.org/learn/",
  },
  {
    id: "interview-1",
    category: "Interview Preparation",
    title: "Common interview questions",
    description: "Prepare answers and learn how to approach interviews.",
    resourceLabel: "Read interview advice",
    url: "https://www.themuse.com/advice",
  },
  {
    id: "interview-2",
    category: "Interview Preparation",
    title: "Resume improvement",
    description: "Learn how to present your experience and projects clearly.",
    resourceLabel: "Resume resources",
    url: "https://www.indeed.com/career-advice/resumes-cover-letters",
  },
  {
    id: "interview-3",
    category: "Interview Preparation",
    title: "Mock interview practice",
    description: "Learn how to communicate your skills and experience confidently.",
    resourceLabel: "Interview tips",
    url: "https://www.indeed.com/career-advice/interviewing",
  },
];

function PreparationPage({ completedTasks, onToggleTask }) {
  const categories = [
    "Aptitude",
    "Technical Skills",
    "Interview Preparation",
  ];

  return (
    <div className="preparation-page">
      <section className="panel prep-intro">
        <span className="eyebrow">YOUR LEARNING PLAN</span>
        <h2>Prepare for your next opportunity</h2>
        <p className="muted">
          Learn at your own pace, explore useful resources,
          and mark each task complete when you finish it.
        </p>
        <div className="prep-progress-track">
          <div
            className="prep-progress-fill"
            style={{
              width: `${
                (completedTasks.length / preparationResources.length) * 100
              }%`,
            }}
          />
        </div>
        <p className="muted">
          {completedTasks.length} of {preparationResources.length} tasks completed
        </p>
      </section>

      {categories.map((category) => {
        const tasks = preparationResources.filter(
          (task) => task.category === category
        );

        const completedInCategory = tasks.filter(
          (task) => completedTasks.includes(task.id)
        ).length;

        return (
          <section className="prep-category" key={category}>
            <div className="prep-category-heading">
              <div>
                <h2>{category}</h2>
                <p className="muted">
                  {completedInCategory} of {tasks.length} completed
                </p>
              </div>
              <BookOpen size={23} />
            </div>

            <div className="prep-resource-list">
              {tasks.map((task) => {
                const isCompleted = completedTasks.includes(task.id);

                return (
                  <article
                    className={`prep-resource-card ${
                      isCompleted ? "task-completed" : ""
                    }`}
                    key={task.id}
                  >
                    <label className="prep-checkbox-label">
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => onToggleTask(task.id)}
                      />
                      <span className="prep-task-content">
                        <strong>{task.title}</strong>
                        <span>{task.description}</span>
                      </span>
                    </label>

                    <a
                      className="prep-resource-link"
                      href={task.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {task.resourceLabel} <ArrowRight size={15} />
                    </a>

                    {isCompleted && (
                      <span className="prep-completed-label">
                        <CheckCircle2 size={15} /> Completed
                      </span>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ProgressPage({ completedTasks }) {
  const totalTasks = preparationResources.length;
  const completedCount = preparationResources.filter(
    (task) => completedTasks.includes(task.id)
  ).length;

  const percentage = Math.round((completedCount / totalTasks) * 100);

  const categories = [
    "Aptitude",
    "Technical Skills",
    "Interview Preparation",
  ];

  return (
    <div className="progress-page">
      <section className="panel overall-progress">
        <span className="eyebrow">YOUR PLACEMENT JOURNEY</span>
        <h2>Track your preparation</h2>
        <p className="muted">
          Every completed preparation task contributes to your progress.
        </p>

        <div className="overall-progress-number">
          <strong>{percentage}%</strong>
          <span>overall completion</span>
        </div>

        <div className="prep-progress-track">
          <div
            className="prep-progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="progress-summary-grid">
          <div className="progress-summary-card">
            <CheckCircle2 size={22} />
            <strong>{completedCount}</strong>
            <span>Tasks completed</span>
          </div>

          <div className="progress-summary-card">
            <Clock3 size={22} />
            <strong>{totalTasks - completedCount}</strong>
            <span>Tasks remaining</span>
          </div>
        </div>
      </section>

      <section className="panel category-progress-panel">
        <div className="panel-heading">
          <div>
            <h3>Progress by category</h3>
            <p className="muted">
              See which areas need more attention.
            </p>
          </div>
          <Target size={22} />
        </div>

        {categories.map((category) => {
          const tasks = preparationResources.filter(
            (task) => task.category === category
          );

          const completed = tasks.filter(
            (task) => completedTasks.includes(task.id)
          ).length;

          const categoryPercentage = Math.round(
            (completed / tasks.length) * 100
          );

          return (
            <div className="category-progress-item" key={category}>
              <div className="category-progress-heading">
                <strong>{category}</strong>
                <span>
                  {completed}/{tasks.length} tasks · {categoryPercentage}%
                </span>
              </div>

              <div className="prep-progress-track">
                <div
                  className="prep-progress-fill"
                  style={{ width: `${categoryPercentage}%` }}
                />
              </div>
            </div>
          );
        })}

        <button
          type="button"
          className="primary-button progress-continue-button"
          onClick={() => {
            window.dispatchEvent(new Event("open-preparation-page"));
          }}
        >
          Continue preparation <ArrowRight size={17} />
        </button>
      </section>
    </div>
  );
}


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
  
const [completedPrepTasks, setCompletedPrepTasks] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem("placementpal-prep-completed") || "[]"
    );
  } catch {
    return [];
  }
});
const [preparationPageRequested, setPreparationPageRequested] = useState(0);

useEffect(() => {
  localStorage.setItem(
    "placementpal-prep-completed",
    JSON.stringify(completedPrepTasks)
  );
}, [completedPrepTasks]);

function togglePrepTask(taskId) {
  setCompletedPrepTasks((previousTasks) =>
    previousTasks.includes(taskId)
      ? previousTasks.filter((id) => id !== taskId)
      : [...previousTasks, taskId]
  );
}

const preparationPercentage = Math.round(
  (completedPrepTasks.filter((id) =>
    preparationResources.some((task) => task.id === id)
  ).length / preparationResources.length) * 100
);

  
useEffect(() => {
  async function fetchApplications() {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load applications.");
      }

      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Failed to load applications:", error);
    }
  }

  fetchApplications();
}, [navigate]);

  const [showForm, setShowForm] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  useEffect(() => {
  function openPreparationPage() {
    setActive("Preparation");
  }

  window.addEventListener(
    "open-preparation-page",
    openPreparationPage
  );

  return () => {
    window.removeEventListener(
      "open-preparation-page",
      openPreparationPage
    );
  };
}, []);

  

async function addJob(e) {
  e.preventDefault();

  if (!company.trim() || !role.trim()) return;

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        company: company.trim(),
        role: role.trim(),
      }),
    });

    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
      return;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save application.");
    }

    setJobs((previousJobs) => [...previousJobs, data]);
    setCompany("");
    setRole("");
    setShowForm(false);
    setActive("Applications");
  } catch (error) {
    console.error("Error saving application:", error);
    alert(error.message || "Could not save the application. Please try again.");
  }
}

async function updateJobStatus(jobId, newStatus) {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/applications/${jobId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    const data = await response.json();

    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
      return;
    }

    if (!response.ok) {
      throw new Error(data.message || "Could not update status.");
    }

    setJobs((previousJobs) =>
      previousJobs.map((job) =>
        job._id === data._id ? data : job
      )
    );
  } catch (error) {
    console.error("Update status error:", error);
    alert(error.message || "Could not update application status.");
  }
}

async function deleteJob(jobId) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this application?"
  );

  if (!confirmed) {
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/applications/${jobId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
      return;
    }

    if (!response.ok) {
      throw new Error(
        data.message || "Could not delete the application."
      );
    }

    setJobs((previousJobs) =>
      previousJobs.filter((job) => job._id !== jobId)
    );
  } catch (error) {
    console.error("Delete application error:", error);
    alert(error.message || "Could not delete the application.");
  }
}



  const menu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Applications", icon: BriefcaseBusiness },
    { name: "Preparation", icon: BookOpen },
    { name: "Resume", icon: FileUser },
    { name: "Progress", icon: ChartNoAxesCombined },
    { name: "Job Opportunities", icon: BriefcaseBusiness },
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
  onClick={() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }}
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
            <ProfileMenu />
          </div>
        </header>

        <section className="dashboard-content">
          <div className="welcome-row">
            <div>
              <span className="eyebrow">YOUR CAREER WORKSPACE</span>
             

<h1>
  {active === "Dashboard"
    ? `Welcome back, ${JSON.parse(localStorage.getItem("user") || "{}").name || "there"}!`
    : active === "Job Opportunities"
    ? ""
    : active}
</h1>

              <p className="muted">
                {active === "Dashboard"
                  ? "Small steps today, big opportunities tomorrow."
                  : `Manage your ${active.toLowerCase()} in one place.`}
              </p>
                        </div>

            {active === "Applications" && (
              <button
                className="primary-button add-button"
                type="button"
                onClick={() => setShowForm(!showForm)}
              >
                + Add application
              </button>
            )}
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
  value={`${preparationPercentage}%`}
  note={`${completedPrepTasks.length} of ${preparationResources.length} tasks completed`}
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
                        
<select
  className={`status-select status-${job.status.toLowerCase()}`}
  value={job.status}
  onChange={(e) => updateJobStatus(job._id, e.target.value)}
>
  {["Saved", "Applied", "Interview", "Offer", "Rejected"].map(
    (status) => (
      <option key={status} value={status}>
        {status}
      </option>
    )
  )}
</select>

<button
  type="button"
  className="delete-button"
  onClick={() => deleteJob(job._id)}
  title="Delete application"
  aria-label="Delete application"
>
  <Trash2 size={18} />
</button>


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
                    
<select
  className={`status-select status-${job.status.toLowerCase()}`}
  value={job.status}
  onChange={(e) => updateJobStatus(job._id, e.target.value)}
>
  {["Saved", "Applied", "Interview", "Offer", "Rejected"].map(
    (status) => (
      <option key={status} value={status}>
        {status}
      </option>
    )
  )}
</select>

<button
  type="button"
  className="delete-button"
  onClick={() => deleteJob(job._id)}
  title="Delete application"
  aria-label="Delete application"
>
  <Trash2 size={18} />
</button>


                  </div>
                ))
              )}
            </section>
          

) : active === "Preparation" ? 
  <PreparationPage
    completedTasks={completedPrepTasks}
    onToggleTask={togglePrepTask}
  />
 : active === "Progress" ? (
  <ProgressPage completedTasks={completedPrepTasks} />
) : active === "Resume" ? (
  <Resume />
) : active === "Job Opportunities" ? (
  <JobOpportunities onSaveJob={addJob} />
) : (
  <section className="panel placeholder-panel">
    <div className="placeholder-icon">
      <ChartNoAxesCombined size={28} />
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
        <Route path="/edit-account" element={<EditAccount />} />
      </Routes>
    </BrowserRouter>
  );
}
