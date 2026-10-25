

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
        message: "Enter your name, a valid email, and a password of at least 8 characters.",
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

let applications = [];

app.get("/", (req, res) => {
  res.json({ message: "PlacementPal backend is running!" });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is healthy" });
});

// Get all applications
app.get("/api/applications", (req, res) => {
  res.json(applications);
});

// Add an application
app.post("/api/applications", (req, res) => {
  const { company, role } = req.body;

  if (!company?.trim() || !role?.trim()) {
    return res.status(400).json({
      message: "Company and role are required",
    });
  }

  const newApplication = {
    id: Date.now().toString(),
    company: company.trim(),
    role: role.trim(),
    status: "Saved",
  };

  applications.push(newApplication);
  res.status(201).json(newApplication);
});

app.listen(PORT, () => {
  console.log(`PlacementPal server running on port ${PORT}`);
});
