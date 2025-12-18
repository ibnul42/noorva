const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "CV_RESUME",
        "NID_COPY",
        "PASSPORT_PHOTO",
        "EMPLOYMENT_AGREEMENT",
        "CERTIFICATE",
        "OTHERS",
      ],
      required: true,
    },

    file: {
      type: String, // stored file path or URL
      required: true,
    },

    mimeType: {
      type: String, // e.g. image/png, application/pdf
    },

    fileSize: {
      type: Number, // bytes
    },

    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin / HR
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

module.exports = mongoose.model("Document", documentSchema);
