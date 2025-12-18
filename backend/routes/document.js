const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const { requireAuth } = require("../middleware/authMiddleware");
const documentUpload = require("../middleware/multerDocumentUpload");
const Document = require("../models/Document");

const {
  uploadDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
} = require("../controllers/documentController");

// Upload document
router.post("/", requireAuth, documentUpload.single("file"), uploadDocument);

// Get all documents (optionally by employee)
router.get("/", requireAuth, getDocuments);

// Get single document
router.get("/:id", requireAuth, getDocument);

// Update document
router.patch("/:id", requireAuth, updateDocument);

// Soft delete document
router.delete("/:id", requireAuth, deleteDocument);

// Download document
router.get("/download/:id", requireAuth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc || !doc.isActive) {
      return res.status(404).json({ message: "Document not found" });
    }

    const filePath = path.resolve(doc.file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(filePath, doc.title + path.extname(doc.file));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to download file" });
  }
});

// View document
router.get("/view/:id", requireAuth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc || !doc.isActive) {
      return res.status(404).json({ message: "Document not found" });
    }

    const filePath = path.resolve(doc.file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${path.basename(doc.file)}"`
    );
    res.setHeader("Content-Type", doc.mimeType);

    res.sendFile(filePath);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to view file" });
  }
});

module.exports = router;
