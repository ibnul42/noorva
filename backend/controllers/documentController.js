const Document = require("../models/Document");
const { Error, handleError } = require("../lib/errors");

// Upload a new document
const uploadDocument = async (req, res) => {
  try {
    const { title, type, employeeId } = req.body;

    if (!req.file) return Error(res, 400, "File is required");
    if (!title || !type || !employeeId)
      return Error(res, 400, "title, type and employeeId required");

    const document = new Document({
      title,
      type,
      file: req.file.path,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      employee: employeeId,
      uploadedBy: req.user?.id,
    });

    await document.save();
    res.status(201).json(document);
  } catch (err) {
    handleError(res, err);
  }
};

// Get all documents (optionally filter by employee)
const getDocuments = async (req, res) => {
  try {
    const { employeeId } = req.query;

    const query = { isActive: true };
    if (employeeId) query.employee = employeeId;

    const documents = await Document.find(query)
      .populate("employee", "name email")
      .populate("uploadedBy", "name email");

    res.json(documents);
  } catch (err) {
    handleError(res, err);
  }
};

// Get single document by ID
const getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate("employee", "name email")
      .populate("uploadedBy", "name email");

    if (!document) return Error(res, 404, "Document not found");
    res.json(document);
  } catch (err) {
    handleError(res, err);
  }
};

// Update document title/type
const updateDocument = async (req, res) => {
  try {
    const { title, type } = req.body;

    const document = await Document.findById(req.params.id);
    if (!document) return Error(res, 404, "Document not found");

    if (title) document.title = title;
    if (type) document.type = type;

    await document.save();
    res.json(document);
  } catch (err) {
    handleError(res, err);
  }
};

// Soft delete document
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return Error(res, 404, "Document not found");

    document.isActive = false;
    await document.save();
    res.json({ message: "Document deleted" });
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
};
