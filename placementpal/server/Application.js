
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    platform: {
      type: String,
      enum: ["LinkedIn", "Naukri", "Indeed", "Other"],
      default: "Other",
    },

    jobUrl: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["Saved", "Applied", "Interview", "Offer", "Rejected"],
      default: "Saved",
    },

    applicationDate: {
      type: Date,
      default: null,
    },

    deadline: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },

    sourceType: {
      type: String,
      enum: ["manual", "import"],
      default: "manual",
    },
  },
  { timestamps: true }
);

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);

export default Application;
