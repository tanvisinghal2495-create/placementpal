
import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    fileName: {
      type: String,
      default: "",
    },

    storedFileName: {
      type: String,
      default: "",
    },

    fileType: {
      type: String,
      default: "",
    },

    checklist: {
      contactDetails: { type: Boolean, default: false },
      education: { type: Boolean, default: false },
      skills: { type: Boolean, default: false },
      projects: { type: Boolean, default: false },
      internships: { type: Boolean, default: false },
      certifications: { type: Boolean, default: false },
    },

    builder: {
      fullName: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      location: { type: String, default: "" },
      summary: { type: String, default: "" },
      education: { type: String, default: "" },
      skills: { type: String, default: "" },
      projects: { type: String, default: "" },
      experience: { type: String, default: "" },
      certifications: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
