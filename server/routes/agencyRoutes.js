const express = require('express');
const router = express.Router();
const {
  createAgency,
  getAgencies,
  getAgenciesPublic,
  getAgencyById,
  updateAgency,
  deleteAgency,
} = require('../controllers/agencyController');
const { protect, adminOnly, stateAdminOnly } = require('../middleware/authMiddleware');

// Public route for signup page
router.get('/public', getAgenciesPublic);

router.route('/')
  .get(protect, getAgencies)
  .post(protect, stateAdminOnly, createAgency);

router.route('/:id')
  .get(protect, getAgencyById)
  .put(protect, stateAdminOnly, updateAgency)
  .delete(protect, adminOnly, deleteAgency);

module.exports = router;
