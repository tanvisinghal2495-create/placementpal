
import { useEffect, useState } from "react";
import {
  Upload,
  Download,
  Trash2,
  FileUser,
  CheckCircle2,
  Circle,
  Save,
  Eye,
} from "lucide-react";
import "./Resume.css";

const API_URL = "http://localhost:5000";

const checklistItems = [
  { key: "contactDetails", label: "Contact details" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "internships", label: "Internships / experience" },
  { key: "certifications", label: "Certifications" },
];

const emptyChecklist = {
  contactDetails: false,
  education: false,
  skills: false,
  projects: false,
  internships: false,
  certifications: false,
};

const emptyBuilder = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  education: "",
  skills: "",
  projects: "",
  experience: "",
  certifications: "",
};

async function apiRequest(url, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export default function Resume() {
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [checklist, setChecklist] = useState(emptyChecklist);
  const [builder, setBuilder] = useState(emptyBuilder);
  const [score, setScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  async function loadResume() {
    setLoading(true);
    setError("");

    try {
      const [resumeData, scoreData] = await Promise.all([
        apiRequest("/api/resume"),
        apiRequest("/api/resume/score"),
      ]);

      setFileName(resumeData.fileName || "");
      setChecklist({
        ...emptyChecklist,
        ...(resumeData.checklist || {}),
      });
      setBuilder({
        ...emptyBuilder,
        ...(resumeData.builder || {}),
      });
      setScore(scoreData.score || 0);
      setSuggestions(scoreData.suggestions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResume();
  }, []);

  async function uploadResume(e) {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please choose a PDF or DOCX file first.");
      return;
    }

    const extension = selectedFile.name
      .split(".")
      .pop()
      .toLowerCase();

    if (!["pdf", "docx"].includes(extension)) {
      setError("Only PDF and DOCX files are allowed.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("The file must be smaller than 5 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const data = await apiRequest("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      setFileName(data.fileName);
      setSelectedFile(null);
      setMessage(data.message || "Resume uploaded successfully.");

      const fileInput = document.getElementById("resume-file-input");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function saveChecklist(nextChecklist) {
    setChecklist(nextChecklist);
    setError("");
    setMessage("");

    try {
      const data = await apiRequest("/api/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checklist: nextChecklist }),
      });

      const scoreData = await apiRequest("/api/resume/score");
      setScore(scoreData.score || 0);
      setSuggestions(scoreData.suggestions || []);
      setMessage(data.message || "Checklist saved.");
    } catch (err) {
      setError(err.message);
      loadResume();
    }
  }

  async function saveBuilder(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const data = await apiRequest("/api/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ builder }),
      });

      setMessage(data.message || "Resume details saved successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function downloadResume() {
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/resume/download`, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Could not download resume.");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = fileName || "resume";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteResume() {
    if (!window.confirm("Are you sure you want to delete your uploaded resume?")) {
      return;
    }

    setError("");
    setMessage("");

    try {
      const data = await apiRequest("/api/resume/upload", {
        method: "DELETE",
      });

      setFileName("");
      setMessage(data.message || "Resume deleted.");
    } catch (err) {
      setError(err.message);
    }
  }

  function updateBuilder(field, value) {
    setBuilder((current) => ({
      ...current,
      [field]: value,
    }));
  }

  if (loading) {
    return (
      <section className="panel resume-loading">
        Loading your resume workspace...
      </section>
    );
  }

  return (
    <div className="resume-workspace">
      {error && <div className="resume-alert resume-alert-error">{error}</div>}
      {message && (
        <div className="resume-alert resume-alert-success">{message}</div>
      )}

      <section className="panel resume-upload-card">
        <div className="resume-section-heading">
          <div className="resume-heading-icon">
            <FileUser size={23} />
          </div>
          <div>
            <h2>My Resume</h2>
            <p className="muted">
              Upload and manage the resume you use for applications.
            </p>
          </div>
        </div>

        <form onSubmit={uploadResume} className="resume-upload-form">
          <label className="resume-file-picker" htmlFor="resume-file-input">
            <Upload size={25} />
            <strong>
              {selectedFile ? selectedFile.name : "Choose your resume"}
            </strong>
            <span>PDF or DOCX · Maximum 5 MB</span>
          </label>

          <input
            id="resume-file-input"
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => {
              setSelectedFile(e.target.files?.[0] || null);
              setError("");
              setMessage("");
            }}
          />

          <button
            className="primary-button"
            type="submit"
            disabled={busy || !selectedFile}
          >
            <Upload size={17} />
            {busy ? "Uploading..." : "Upload resume"}
          </button>
        </form>

        {fileName && (
          <div className="uploaded-resume">
            <div className="uploaded-file-icon">
              <FileUser size={22} />
            </div>
            <div className="uploaded-file-details">
              <strong>{fileName}</strong>
              <span>Your resume is uploaded.</span>
            </div>
            <button
              className="resume-icon-action"
              type="button"
              title="Download resume"
              onClick={downloadResume}
            >
              <Download size={19} />
            </button>
            <button
              className="resume-icon-action resume-delete-action"
              type="button"
              title="Delete resume"
              onClick={deleteResume}
            >
              <Trash2 size={19} />
            </button>
          </div>
        )}
      </section>

      <div className="resume-two-column">
        <section className="panel resume-checklist-card">
          <div className="resume-section-heading">
            <div>
              <h2>Resume checklist</h2>
              <p className="muted">
                Tick each section when your resume includes it.
              </p>
            </div>
          </div>

          <div className="resume-score">
            <div className="resume-score-number">{score}%</div>
            <div className="resume-score-copy">
              <strong>Completeness score</strong>
              <span>
                {checklistItems.filter((item) => checklist[item.key]).length} of{" "}
                {checklistItems.length} sections completed
              </span>
            </div>
          </div>

          <div className="resume-progress-track">
            <div
              className="resume-progress-fill"
              style={{ width: `${score}%` }}
            />
          </div>

          <div className="resume-checklist">
            {checklistItems.map((item) => {
              const checked = Boolean(checklist[item.key]);

              return (
                <label className="resume-check-item" key={item.key}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      saveChecklist({
                        ...checklist,
                        [item.key]: e.target.checked,
                      });
                    }}
                  />
                  {checked ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <Circle size={20} />
                  )}
                  <span>{item.label}</span>
                </label>
              );
            })}
          </div>

          {suggestions.length > 0 && (
            <div className="resume-suggestions">
              <strong>Suggestions to improve</strong>
              <ul>
                {suggestions.map((suggestion) => (
                  <li key={suggestion}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="panel resume-builder-card">
          <div className="resume-section-heading">
            <div>
              <h2>Resume builder</h2>
              <p className="muted">
                Fill in your details and preview your resume.
              </p>
            </div>
          </div>

          <form className="resume-builder-form" onSubmit={saveBuilder}>
            <label>
              Full name
              <input
                value={builder.fullName}
                onChange={(e) => updateBuilder("fullName", e.target.value)}
                placeholder="Your full name"
              />
            </label>

            <div className="resume-input-row">
              <label>
                Email
                <input
                  type="email"
                  value={builder.email}
                  onChange={(e) => updateBuilder("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <label>
                Phone
                <input
                  value={builder.phone}
                  onChange={(e) => updateBuilder("phone", e.target.value)}
                  placeholder="Phone number"
                />
              </label>
            </div>

            <label>
              Location
              <input
                value={builder.location}
                onChange={(e) => updateBuilder("location", e.target.value)}
                placeholder="City, state"
              />
            </label>

            <label>
              Professional summary
              <textarea
                value={builder.summary}
                onChange={(e) => updateBuilder("summary", e.target.value)}
                placeholder="Write a short introduction about yourself"
                rows={3}
              />
            </label>

            <label>
              Education
              <textarea
                value={builder.education}
                onChange={(e) => updateBuilder("education", e.target.value)}
                placeholder="Degree, college, graduation year"
                rows={3}
              />
            </label>

            <label>
              Skills
              <textarea
                value={builder.skills}
                onChange={(e) => updateBuilder("skills", e.target.value)}
                placeholder="JavaScript, React, communication..."
                rows={2}
              />
            </label>

            <label>
              Projects
              <textarea
                value={builder.projects}
                onChange={(e) => updateBuilder("projects", e.target.value)}
                placeholder="Project name, technologies, what you built"
                rows={3}
              />
            </label>

            <label>
              Experience / internships
              <textarea
                value={builder.experience}
                onChange={(e) => updateBuilder("experience", e.target.value)}
                placeholder="Role, organization, responsibilities"
                rows={3}
              />
            </label>

            <label>
              Certifications
              <textarea
                value={builder.certifications}
                onChange={(e) =>
                  updateBuilder("certifications", e.target.value)
                }
                placeholder="Certification name and issuer"
                rows={2}
              />
            </label>

            <div className="resume-builder-actions">
              <button className="primary-button" type="submit" disabled={busy}>
                <Save size={17} />
                {busy ? "Saving..." : "Save details"}
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={() => setShowPreview((current) => !current)}
              >
                <Eye size={17} />
                {showPreview ? "Hide preview" : "Preview resume"}
              </button>
            </div>
          </form>

          {showPreview && (
            <div className="resume-preview">
              <h2>{builder.fullName || "Your Name"}</h2>
              <p>
                {[builder.email, builder.phone, builder.location]
                  .filter(Boolean)
                  .join(" · ") || "Your contact details"}
              </p>

              {[
                ["Professional Summary", builder.summary],
                ["Education", builder.education],
                ["Skills", builder.skills],
                ["Projects", builder.projects],
                ["Experience", builder.experience],
                ["Certifications", builder.certifications],
              ].map(([heading, value]) =>
                value.trim() ? (
                  <div className="resume-preview-section" key={heading}>
                    <h3>{heading}</h3>
                    <p>{value}</p>
                  </div>
                ) : null
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
