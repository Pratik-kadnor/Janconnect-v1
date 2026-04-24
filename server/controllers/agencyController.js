const asyncHandler = require('express-async-handler');
const Agency = require('../models/agencyModel');

// @desc    Create a new agency
// @route   POST /api/agencies
// @access  Private/Admin
const createAgency = asyncHandler(async (req, res) => {
  const { name, type, state, district, nodalOfficer, address } = req.body;

  // Validation
  if (!name || !type || !state || !nodalOfficer) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  const agency = await Agency.create({
    name,
    type,
    state,
    district,
    nodalOfficer,
    address,
  });

  res.status(201).json(agency);
});

// @desc    Get all agencies
// @route   GET /api/agencies
// @access  Private
const getAgencies = asyncHandler(async (req, res) => {
  const { type, state, isActive } = req.query;

  let query = {};

  if (type) query.type = type;
  if (state) query.state = state;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  // State Admin can only see agencies in their state
  if (req.user && req.user.role === 'State-Admin') {
    query.state = req.user.state;
  }

  const agencies = await Agency.find(query).sort({ name: 1 });

  res.json(agencies);
});

// @desc    Get all agencies (public - for signup)
// @route   GET /api/agencies/public
// @access  Public
const getAgenciesPublic = asyncHandler(async (req, res) => {
  const { type, state } = req.query;

  let query = { isActive: true }; // Only show active agencies

  if (type) query.type = type;
  if (state) query.state = state;

  const agencies = await Agency.find(query).sort({ name: 1 });

  res.json(agencies);
});

// @desc    Get single agency
// @route   GET /api/agencies/:id
// @access  Private
const getAgencyById = asyncHandler(async (req, res) => {
  const agency = await Agency.findById(req.params.id);

  if (!agency) {
    res.status(404);
    throw new Error('Agency not found');
  }

  res.json(agency);
});

// @desc    Update agency
// @route   PUT /api/agencies/:id
// @access  Private/Admin
const updateAgency = asyncHandler(async (req, res) => {
  const agency = await Agency.findById(req.params.id);

  if (!agency) {
    res.status(404);
    throw new Error('Agency not found');
  }

  const { name, type, state, district, nodalOfficer, address, isActive } = req.body;

  agency.name = name || agency.name;
  agency.type = type || agency.type;
  agency.state = state || agency.state;
  agency.district = district || agency.district;
  agency.nodalOfficer = nodalOfficer || agency.nodalOfficer;
  agency.address = address !== undefined ? address : agency.address;
  agency.isActive = isActive !== undefined ? isActive : agency.isActive;

  const updatedAgency = await agency.save();

  res.json(updatedAgency);
});

// @desc    Delete agency
// @route   DELETE /api/agencies/:id
// @access  Private/Admin
const deleteAgency = asyncHandler(async (req, res) => {
  const agency = await Agency.findById(req.params.id);

  if (!agency) {
    res.status(404);
    throw new Error('Agency not found');
  }

  await agency.deleteOne();

  res.json({ message: 'Agency removed' });
});

module.exports = {
  createAgency,
  getAgencies,
  getAgenciesPublic,
  getAgencyById,
  updateAgency,
  deleteAgency,
};
