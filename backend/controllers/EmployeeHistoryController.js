const EmployeeHistory = require("../models/EmployeeHistory");

/**
 * Create history
 */
createHistory = async (req, res) => {
  try {
    const history = await EmployeeHistory.create(req.body);
    res.status(201).json(history);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Get all history by employee
 */
getHistoryByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const history = await EmployeeHistory.find({
      employee: employeeId,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update history
 */
updateHistory = async (req, res) => {
  try {
    const history = await EmployeeHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }

    res.json(history);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Soft delete history
 */
deleteHistory = async (req, res) => {
  try {
    const history = await EmployeeHistory.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }

    res.json({ message: "History removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createHistory,
  getHistoryByEmployee,
  updateHistory,
  deleteHistory,
};
