const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateMilestone,
  addMilestone,
  getProjectStats,
} = require('../controllers/projectController');
const { protect, stateAdminOnly, adminOnly } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Get project statistics
router.get('/stats/summary', protect, getProjectStats);

// Base routes
router.route('/')
  .get(protect, getProjects)
  .post(protect, stateAdminOnly, createProject);

// Single project routes
router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, stateAdminOnly, updateProject)
  .delete(protect, adminOnly, deleteProject);

// Milestone routes
router.post('/:id/milestone', protect, stateAdminOnly, addMilestone);
router.put('/:id/milestone/:milestoneId', protect, updateMilestone);

// File upload route
router.post('/:id/upload', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
      message: 'File uploaded successfully',
      url: req.file.path,
      filename: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

module.exports = router;
