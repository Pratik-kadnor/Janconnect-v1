const asyncHandler = require('express-async-handler');
const Project = require('../models/projectModel');
const Agency = require('../models/agencyModel');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/State-Admin or MoSJE-Admin
const createProject = asyncHandler(async (req, res) => {
  const {
    title,
    component,
    state,
    district,
    implementingAgency,
    executingAgency,
    financials,
    sanctionDate,
    expectedCompletionDate,
    description,
    beneficiaries,
    milestones
  } = req.body;

  // Validation
  if (!title || !component || !state || !district || !implementingAgency || !executingAgency) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Check if agencies exist
  const impAgency = await Agency.findById(implementingAgency);
  const execAgency = await Agency.findById(executingAgency);

  if (!impAgency || !execAgency) {
    res.status(404);
    throw new Error('One or both agencies not found');
  }

  // State Admin can only create projects in their state
  if (req.user.role === 'State-Admin' && req.user.state !== state) {
    res.status(403);
    throw new Error('Not authorized to create projects in this state');
  }

  const project = await Project.create({
    title,
    component,
    state,
    district,
    implementingAgency,
    executingAgency,
    financials: financials || {},
    sanctionDate,
    expectedCompletionDate,
    description,
    beneficiaries,
    milestones: milestones || [],
    createdBy: req.user._id,
  });

  const populatedProject = await Project.findById(project._id)
    .populate('implementingAgency')
    .populate('executingAgency')
    .populate('createdBy', 'name email');

  res.status(201).json(populatedProject);
});

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const { 
    state, 
    status, 
    component, 
    implementingAgency,
    executingAgency,
    search 
  } = req.query;

  let query = {};

  // Role-based filtering
  if (req.user.role === 'State-Admin') {
    query.state = req.user.state;
  } else if (req.user.role === 'Agency-User') {
    query.$or = [
      { implementingAgency: req.user.agency },
      { executingAgency: req.user.agency }
    ];
  }

  // Additional filters
  if (state && req.user.role === 'MoSJE-Admin') query.state = state;
  if (status) query.status = status;
  if (component) query.component = component;
  if (implementingAgency) query.implementingAgency = implementingAgency;
  if (executingAgency) query.executingAgency = executingAgency;
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  const projects = await Project.find(query)
    .populate('implementingAgency')
    .populate('executingAgency')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.json(projects);
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('implementingAgency')
    .populate('executingAgency')
    .populate('createdBy', 'name email')
    .populate('lastUpdatedBy', 'name email');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check access rights
  if (req.user.role === 'State-Admin' && project.state !== req.user.state) {
    res.status(403);
    throw new Error('Not authorized to view this project');
  }

  if (req.user.role === 'Agency-User') {
    const hasAccess = 
      project.implementingAgency._id.toString() === req.user.agency.toString() ||
      project.executingAgency._id.toString() === req.user.agency.toString();
    
    if (!hasAccess) {
      res.status(403);
      throw new Error('Not authorized to view this project');
    }
  }

  res.json(project);
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/State-Admin or MoSJE-Admin
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check access rights
  if (req.user.role === 'State-Admin' && project.state !== req.user.state) {
    res.status(403);
    throw new Error('Not authorized to update this project');
  }

  const {
    title,
    component,
    status,
    state,
    district,
    implementingAgency,
    executingAgency,
    financials,
    sanctionDate,
    expectedCompletionDate,
    actualCompletionDate,
    description,
    beneficiaries
  } = req.body;

  project.title = title || project.title;
  project.component = component || project.component;
  project.status = status || project.status;
  project.state = state || project.state;
  project.district = district || project.district;
  project.implementingAgency = implementingAgency || project.implementingAgency;
  project.executingAgency = executingAgency || project.executingAgency;
  project.financials = financials || project.financials;
  project.sanctionDate = sanctionDate || project.sanctionDate;
  project.expectedCompletionDate = expectedCompletionDate || project.expectedCompletionDate;
  project.actualCompletionDate = actualCompletionDate || project.actualCompletionDate;
  project.description = description !== undefined ? description : project.description;
  project.beneficiaries = beneficiaries !== undefined ? beneficiaries : project.beneficiaries;
  project.lastUpdatedBy = req.user._id;

  const updatedProject = await project.save();

  const populatedProject = await Project.findById(updatedProject._id)
    .populate('implementingAgency')
    .populate('executingAgency')
    .populate('createdBy', 'name email')
    .populate('lastUpdatedBy', 'name email');

  res.json(populatedProject);
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/MoSJE-Admin
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  await project.deleteOne();

  res.json({ message: 'Project removed' });
});

// @desc    Update milestone status
// @route   PUT /api/projects/:id/milestone/:milestoneId
// @access  Private
const updateMilestone = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check access rights
  if (req.user.role === 'State-Admin' && project.state !== req.user.state) {
    res.status(403);
    throw new Error('Not authorized to update this project');
  }

  if (req.user.role === 'Agency-User') {
    const hasAccess = 
      project.implementingAgency.toString() === req.user.agency.toString() ||
      project.executingAgency.toString() === req.user.agency.toString();
    
    if (!hasAccess) {
      res.status(403);
      throw new Error('Not authorized to update this project');
    }
  }

  const milestone = project.milestones.id(req.params.milestoneId);

  if (!milestone) {
    res.status(404);
    throw new Error('Milestone not found');
  }

  const { status, evidenceUrl, remarks } = req.body;

  milestone.status = status || milestone.status;
  milestone.evidenceUrl = evidenceUrl || milestone.evidenceUrl;
  milestone.remarks = remarks !== undefined ? remarks : milestone.remarks;

  if (status === 'Completed' && !milestone.completedDate) {
    milestone.completedDate = new Date();
  }

  project.lastUpdatedBy = req.user._id;
  await project.save();

  res.json(project);
});

// @desc    Add milestone to project
// @route   POST /api/projects/:id/milestone
// @access  Private/State-Admin or MoSJE-Admin
const addMilestone = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check access rights
  if (req.user.role === 'State-Admin' && project.state !== req.user.state) {
    res.status(403);
    throw new Error('Not authorized to update this project');
  }

  const { description, deadline } = req.body;

  if (!description || !deadline) {
    res.status(400);
    throw new Error('Please provide description and deadline');
  }

  project.milestones.push({
    description,
    deadline,
  });

  project.lastUpdatedBy = req.user._id;
  await project.save();

  res.json(project);
});

// @desc    Get project statistics
// @route   GET /api/projects/stats/summary
// @access  Private
const getProjectStats = asyncHandler(async (req, res) => {
  let matchQuery = {};

  // Role-based filtering
  if (req.user.role === 'State-Admin') {
    matchQuery.state = req.user.state;
  } else if (req.user.role === 'Agency-User') {
    matchQuery.$or = [
      { implementingAgency: req.user.agency },
      { executingAgency: req.user.agency }
    ];
  }

  const stats = await Project.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        totalProjects: { $sum: 1 },
        totalBudget: { $sum: '$financials.totalBudget' },
        totalReleased: { $sum: '$financials.fundsReleased' },
        totalUtilized: { $sum: '$financials.fundsUtilized' },
        sanctioned: {
          $sum: { $cond: [{ $eq: ['$status', 'Sanctioned'] }, 1, 0] }
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ['$status', 'In-Progress'] }, 1, 0] }
        },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
        },
        delayed: {
          $sum: { $cond: [{ $eq: ['$status', 'Delayed'] }, 1, 0] }
        }
      }
    }
  ]);

  const componentStats = await Project.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$component',
        count: { $sum: 1 },
        budget: { $sum: '$financials.totalBudget' }
      }
    }
  ]);

  res.json({
    summary: stats[0] || {
      totalProjects: 0,
      totalBudget: 0,
      totalReleased: 0,
      totalUtilized: 0,
      sanctioned: 0,
      inProgress: 0,
      completed: 0,
      delayed: 0
    },
    byComponent: componentStats
  });
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateMilestone,
  addMilestone,
  getProjectStats,
};
