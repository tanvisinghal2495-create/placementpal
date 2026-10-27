

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Resume from "./Resume.js";
import Application from "./Application.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => console.error("MongoDB connection error:", error.message));

app.use(cors());
app.use(express.json());

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

const User =
  mongoose.models.User || mongoose.model("User", userSchema);
  function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required. Please sign in.",
    });
  }


  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token. Please sign in again.",
    });
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resumeUploadDir = path.join(__dirname, "uploads", "resumes");

fs.mkdirSync(resumeUploadDir, { recursive: true });

const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeUploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      `${req.userId}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`;

    cb(null, uniqueName);
  },
});

const resumeUpload = multer({
  storage: resumeStorage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const allowedExtensions = [".pdf", ".docx"];

    if (!allowedExtensions.includes(extension)) {
      return cb(new Error("Only PDF and DOCX files are allowed."));
    }

    cb(null, true);
  },
});

const allowedChecklistFields = [
  "contactDetails",
  "education",
  "skills",
  "projects",
  "internships",
  "certifications",
];

// Get the current user's resume
app.get("/api/resume", authenticateToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });

    if (!resume) {
      return res.json({
        fileName: "",
        fileType: "",
        checklist: {},
        builder: {},
      });
    }

    res.json({
      fileName: resume.fileName,
      fileType: resume.fileType,
      checklist: resume.checklist,
      builder: resume.builder,
    });
  } catch (error) {
    console.error("Get resume error:", error.message);
    res.status(500).json({ message: "Could not load resume." });
  }
});

// Upload a resume
app.post(
  "/api/resume/upload",
  authenticateToken,
  resumeUpload.single("resume"),
  async (req, res) => {
    let previousFilePath = null;

    try {
      if (!req.file) {
        return res.status(400).json({ message: "Please select a file." });
      }

      const extension = path.extname(req.file.originalname).toLowerCase();

      let resume = await Resume.findOne({ userId: req.userId });

      if (resume?.storedFileName) {
        previousFilePath = path.join(
          resumeUploadDir,
          path.basename(resume.storedFileName)
        );
      }

      if (!resume) {
        resume = new Resume({ userId: req.userId });
      }

      resume.fileName = path.basename(req.file.originalname);
      resume.storedFileName = req.file.filename;
      resume.fileType = extension;
      await resume.save();

      if (previousFilePath && previousFilePath !== req.file.path) {
        await fs.promises.unlink(previousFilePath).catch(() => {});
      }

      res.status(200).json({
        message: "Resume uploaded successfully!",
        fileName: resume.fileName,
        fileType: resume.fileType,
      });
    } catch (error) {
      await fs.promises.unlink(req.file.path).catch(() => {});
      console.error("Upload resume error:", error.message);
      res.status(500).json({ message: "Could not upload resume." });
    }
  }
);

// Download the current user's resume
app.get("/api/resume/download", authenticateToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });

    if (!resume?.storedFileName) {
      return res.status(404).json({ message: "No resume uploaded yet." });
    }

    const filePath = path.join(
      resumeUploadDir,
      path.basename(resume.storedFileName)
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Resume file not found." });
    }

    res.download(filePath, resume.fileName);
  } catch (error) {
    console.error("Download resume error:", error.message);
    res.status(500).json({ message: "Could not download resume." });
  }
});

// Delete the current user's uploaded resume
app.delete("/api/resume/upload", authenticateToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });

    if (!resume?.storedFileName) {
      return res.status(404).json({ message: "No resume uploaded yet." });
    }

    const filePath = path.join(
      resumeUploadDir,
      path.basename(resume.storedFileName)
    );

    await fs.promises.unlink(filePath).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });

    resume.storedFileName = "";
    resume.fileName = "";
    resume.fileType = "";
    await resume.save();

    res.json({ message: "Uploaded resume deleted." });
  } catch (error) {
    console.error("Delete resume error:", error.message);
    res.status(500).json({ message: "Could not delete resume." });
  }
});

// Save checklist and resume-builder information
app.put("/api/resume", authenticateToken, async (req, res) => {
  try {
    const { checklist, builder } = req.body;
    const updates = {};

    if (checklist !== undefined) {
      if (
        !checklist ||
        typeof checklist !== "object" ||
        Array.isArray(checklist)
      ) {
        return res.status(400).json({ message: "Invalid checklist." });
      }

      for (const key of Object.keys(checklist)) {
        if (
          !allowedChecklistFields.includes(key) ||
          typeof checklist[key] !== "boolean"
        ) {
          return res.status(400).json({
            message: "Invalid checklist field or value.",
          });
        }
      }

      updates.checklist = checklist;
    }

    if (builder !== undefined) {
      if (
        !builder ||
        typeof builder !== "object" ||
        Array.isArray(builder)
      ) {
        return res.status(400).json({ message: "Invalid resume details." });
      }

      const allowedBuilderFields = [
        "fullName",
        "email",
        "phone",
        "location",
        "summary",
        "education",
        "skills",
        "projects",
        "experience",
        "certifications",
      ];

      for (const key of Object.keys(builder)) {
        if (
          !allowedBuilderFields.includes(key) ||
          typeof builder[key] !== "string"
        ) {
          return res.status(400).json({
            message: "Invalid resume detail field or value.",
          });
        }
      }

      updates.builder = builder;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No resume changes provided." });
    }

    const resume = await Resume.findOneAndUpdate(
      { userId: req.userId },
      { $set: updates },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.json({
      message: "Resume details saved successfully!",
      checklist: resume.checklist,
      builder: resume.builder,
    });
  } catch (error) {
    console.error("Save resume error:", error.message);
    res.status(500).json({ message: "Could not save resume details." });
  }
});

// Calculate a transparent checklist-based resume score
app.get("/api/resume/score", authenticateToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });

    const checklist = resume?.checklist || {};
    const fields = [
      "contactDetails",
      "education",
      "skills",
      "projects",
      "internships",
      "certifications",
    ];

    const completed = fields.filter((field) => checklist[field] === true).length;
    const score = Math.round((completed / fields.length) * 100);

    const suggestions = {
      contactDetails: "Add your contact details.",
      education: "Complete your education section.",
      skills: "List relevant technical and soft skills.",
      projects: "Add projects and describe your contributions.",
      internships: "Add relevant internship or work experience.",
      certifications: "List relevant certifications.",
    };

    res.json({
      score,
      completed,
      total: fields.length,
      suggestions: fields
        .filter((field) => checklist[field] !== true)
        .map((field) => suggestions[field]),
    });
  } catch (error) {
    console.error("Resume score error:", error.message);
    res.status(500).json({ message: "Could not calculate resume score." });
  }
});
// Register a new user
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      password.length < 8
    ) {
      return res.status(400).json({
        message:
          "Enter your name, a valid email, and a password of at least 8 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    return res.status(201).json({
      message: "Account created successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    console.error("Signup error:", error.message);

    return res.status(500).json({
      message: "Unable to create your account. Please try again.",
    });
  }
});

// Sign in an existing user
app.post("/api/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Please enter your email and password.",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
  { userId: user._id.toString() },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

return res.status(200).json({
  message: "Signin successful!",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});
  } catch (error) {
    console.error("Signin error:", error.message);

    return res.status(500).json({
      message: "Unable to sign in. Please try again.",
    });
  }
});


let applications = [];

app.get("/", (req, res) => {
  res.json({ message: "PlacementPal backend is running!" });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is healthy" });
});


const allowedApplicationStatuses = [
  "Saved",
  "Applied",
  "Interview",
  "Offer",
  "Rejected",
];

// Get applications for the signed-in user
app.get("/api/applications", authenticateToken, async (req, res) => {
  try {
    const applications = await Application.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Get applications error:", error.message);
    res.status(500).json({
      message: "Could not load applications.",
    });
  }
});

// Add a new application
app.post("/api/applications", authenticateToken, async (req, res) => {
  try {
    const { company, role, platform, jobUrl, status, notes } = req.body;

    if (
      typeof company !== "string" ||
      typeof role !== "string" ||
      !company.trim() ||
      !role.trim()
    ) {
      return res.status(400).json({
        message: "Company and role are required.",
      });
    }

    const validPlatforms = ["LinkedIn", "Naukri", "Indeed", "Other"];

    if (platform !== undefined && !validPlatforms.includes(platform)) {
      return res.status(400).json({
        message: "Invalid job platform.",
      });
    }

    if (
      status !== undefined &&
      !allowedApplicationStatuses.includes(status)
    ) {
      return res.status(400).json({
        message: "Invalid application status.",
      });
    }

    if (jobUrl !== undefined && typeof jobUrl !== "string") {
      return res.status(400).json({
        message: "Job URL must be text.",
      });
    }

    if (
      jobUrl?.trim() &&
      !/^https?:\/\/\S+$/i.test(jobUrl.trim())
    ) {
      return res.status(400).json({
        message: "Please enter a valid HTTP or HTTPS job URL.",
      });
    }

    const newApplication = await Application.create({
      userId: req.userId,
      company: company.trim(),
      role: role.trim(),
      platform: platform || "Other",
      jobUrl: jobUrl?.trim() || "",
      status: status || "Saved",
      notes: typeof notes === "string" ? notes.trim() : "",
    });

    res.status(201).json(newApplication);
  } catch (error) {
    console.error("Add application error:", error.message);
    res.status(500).json({
      message: "Could not save the application.",
    });
  }
});

 // Update an application's status
app.patch("/api/applications/:id/status", authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!allowedApplicationStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status.",
      });
    }

    const application = await Application.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
      });
    }

    res.json(application);
  } catch (error) {
    console.error("Update application status error:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid application ID.",
      });
    }

    res.status(500).json({
      message: "Could not update application status.",
    });
  }
});
// Delete an application
app.delete("/api/applications/:id", authenticateToken, async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
      });
    }

    res.json({
      message: "Application deleted successfully.",
    });
  } catch (error) {
    console.error("Delete application error:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid application ID.",
      });
    }

    res.status(500).json({
      message: "Could not delete the application.",
    });
  }
});


app.listen(PORT, () => {
  console.log(`PlacementPal server running on port ${PORT}`);
});
