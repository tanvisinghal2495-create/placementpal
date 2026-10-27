
import { useState } from "react";
import {
  Search,
  ExternalLink,
  BriefcaseBusiness,
  MapPin,
} from "lucide-react";

const sampleJobs = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "Example Technologies",
    location: "Remote",
    platform: "LinkedIn",
    type: "Internship",
    url: "https://www.linkedin.com/jobs/",
  },
  {
    id: 2,
    title: "React Developer",
    company: "Example Software",
    location: "Bengaluru, India",
    platform: "Naukri",
    type: "Full-time",
    url: "https://www.naukri.com/",
  },
  {
    id: 3,
    title: "Software Developer Intern",
    company: "Example Innovations",
    location: "Remote",
    platform: "Indeed",
    type: "Internship",
    url: "https://in.indeed.com/",
  },
  {
    id: 4,
    title: "Junior MERN Stack Developer",
    company: "Example Digital",
    location: "India",
    platform: "Other",
    type: "Full-time",
    url: "https://www.google.com/search?q=MERN+stack+developer+jobs",
  },
];

export default function JobOpportunities({ onSaveJob }) {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("All");
  const [savedJobs, setSavedJobs] = useState([]);

  const filteredJobs = sampleJobs.filter((job) => {
    const searchMatch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());

    const platformMatch =
      platform === "All" || job.platform === platform;

    return searchMatch && platformMatch;
  });

  function handleSave(job) {
    if (savedJobs.includes(job.id)) {
      return;
    }

    if (onSaveJob) {
      onSaveJob({
        company: job.company,
        role: job.title,
        platform: job.platform,
        jobUrl: job.url,
        status: "Saved",
      });
    }

    setSavedJobs((previous) => [...previous, job.id]);
  }

  return (
    <section className="job-opportunities">
      <div className="jobs-heading">
        <div>
          <h1>Job Opportunities</h1>
          <p>
            Find opportunities and keep your job search organized.
          </p>
        </div>

        <BriefcaseBusiness size={32} />
      </div>

      <div className="jobs-search">
        <Search size={20} />

        <input
          type="text"
          placeholder="Search job title or company..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="jobs-filters">
        {["All", "LinkedIn", "Naukri", "Indeed", "Other"].map(
          (item) => (
            <button
              key={item}
              type="button"
              className={
                platform === item ? "filter-active" : "filter-button"
              }
              onClick={() => setPlatform(item)}
            >
              {item}
            </button>
          )
        )}
      </div>

      <p className="jobs-count">
        {filteredJobs.length} opportunities found
      </p>

      <div className="jobs-list">
        {filteredJobs.map((job) => (
          <article className="job-card" key={job.id}>
            <div className="job-card-top">
              <div>
                <h3>{job.title}</h3>
                <p className="job-company">{job.company}</p>
              </div>

              <span className="job-platform">{job.platform}</span>
            </div>

            <div className="job-details">
              <span>
                <MapPin size={15} />
                {job.location}
              </span>

              <span>{job.type}</span>
            </div>

            <div className="job-actions">
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="job-apply-link"
              >
                Visit job site <ExternalLink size={15} />
              </a>

              <button
                type="button"
                className="job-save-button"
                disabled={savedJobs.includes(job.id)}
                onClick={() => handleSave(job)}
              >
                {savedJobs.includes(job.id)
                  ? "Saved"
                  : "Save job"}
              </button>
            </div>
          </article>
        ))}

        {filteredJobs.length === 0 && (
          <div className="jobs-empty">
            <h3>No jobs found</h3>
            <p>Try another search term or platform.</p>
          </div>
        )}
      </div>
    </section>
  );
}
