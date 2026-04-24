// Content for server/data/demoData.js
const agencies = [
  // Maharashtra Agencies
  {
    name: 'Social Justice Department, Maharashtra',
    type: 'Implementing',
    state: 'Maharashtra',
    district: 'Mumbai',
    nodalOfficer: { name: 'Anjali Desai', email: 'anjali.d@mahgov.in', phone: '9876543210' }
  },
  {
    name: 'Pune Municipal Corporation',
    type: 'Executing',
    state: 'Maharashtra',
    district: 'Pune',
    nodalOfficer: { name: 'Rohan Patil', email: 'rohan.p@pmc.gov.in', phone: '9876543211' }
  },
  {
    name: 'Nagpur Zilla Parishad',
    type: 'Executing',
    state: 'Maharashtra',
    district: 'Nagpur',
    nodalOfficer: { name: 'Suresh Rao', email: 'suresh.r@nzp.gov.in', phone: '9876543212' }
  },
  // Uttar Pradesh Agencies
  {
    name: 'Directorate of Social Welfare, Uttar Pradesh',
    type: 'Implementing',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    nodalOfficer: { name: 'Vikram Singh', email: 'vikram.s@upgov.in', phone: '9876543213' }
  },
  {
    name: 'Lucknow Nagar Nigam',
    type: 'Executing',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    nodalOfficer: { name: 'Amit Kumar', email: 'amit.k@lnn.gov.in', phone: '9876543214' }
  },
  {
    name: 'Varanasi Development Authority',
    type: 'Executing',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    nodalOfficer: { name: 'Priya Tiwari', email: 'priya.t@vda.gov.in', phone: '9876543215' }
  },
   // Tamil Nadu Agencies
  {
    name: 'Adi Dravidar and Tribal Welfare Department, Tamil Nadu',
    type: 'Implementing',
    state: 'Tamil Nadu',
    district: 'Chennai',
    nodalOfficer: { name: 'Karthik Rajan', email: 'karthik.r@tngov.in', phone: '9876543216' }
  },
  {
    name: 'Greater Chennai Corporation',
    type: 'Executing',
    state: 'Tamil Nadu',
    district: 'Chennai',
    nodalOfficer: { name: 'Meena Iyer', email: 'meena.i@gcc.gov.in', phone: '9876543217' }
  },
];

const users = [
  {
    name: 'Admin User (MoSJE)',
    email: 'admin@example.com',
    password: 'password123',
    role: 'MoSJE-Admin',
  },
  {
    name: 'Priya Sharma (State Admin MH)',
    email: 'state.mh@example.com',
    password: 'password123',
    role: 'State-Admin',
    state: 'Maharashtra'
  },
  {
    name: 'Sanjay Verma (State Admin UP)',
    email: 'state.up@example.com',
    password: 'password123',
    role: 'State-Admin',
    state: 'Uttar Pradesh'
  },
  {
    name: 'Kavita Mohan (Agency User - Pune)',
    email: 'agency.pune@example.com',
    password: 'password123',
    role: 'Agency-User',
    agencyName: 'Pune Municipal Corporation' // Seeder script will find and link the agency's _id
  },
  {
    name: 'Rajesh Gupta (Agency User - Lucknow)',
    email: 'agency.lucknow@example.com',
    password: 'password123',
    role: 'Agency-User',
    agencyName: 'Lucknow Nagar Nigam'
  },
];

const projects = [
  // Maharashtra Projects
  {
    title: 'Development of Model Village in Pune District',
    component: 'Adarsh Gram',
    status: 'In-Progress',
    state: 'Maharashtra',
    district: 'Pune',
    implementingAgency: 'Social Justice Department, Maharashtra',
    executingAgency: 'Pune Municipal Corporation',
    financials: { totalBudget: 8000000, fundsReleased: 4000000, fundsUtilized: 3500000 },
    sanctionDate: new Date('2025-01-15'),
    expectedCompletionDate: new Date('2026-03-31'),
    beneficiaries: 250,
    description: 'Comprehensive village development with focus on infrastructure and community welfare',
    milestones: [
      { description: 'Initial survey and plan approval', deadline: new Date('2025-07-01'), status: 'Completed', completedDate: new Date('2025-06-25') },
      { description: 'Drainage and sanitation work', deadline: new Date('2025-12-31'), status: 'Pending' },
      { description: 'Community hall construction', deadline: new Date('2026-03-31'), status: 'Pending' },
    ]
  },
  {
    title: 'Hostel Construction in Nagpur',
    component: 'Hostel',
    status: 'Completed',
    state: 'Maharashtra',
    district: 'Nagpur',
    implementingAgency: 'Social Justice Department, Maharashtra',
    executingAgency: 'Nagpur Zilla Parishad',
    financials: { totalBudget: 12000000, fundsReleased: 12000000, fundsUtilized: 11850000 },
    sanctionDate: new Date('2024-04-01'),
    expectedCompletionDate: new Date('2025-06-30'),
    actualCompletionDate: new Date('2025-06-28'),
    beneficiaries: 150,
    description: 'Modern hostel facility for SC/ST students with 150 bed capacity',
    milestones: [
        { description: 'Land acquisition and approval', deadline: new Date('2024-05-20'), status: 'Completed', completedDate: new Date('2024-05-18') },
        { description: 'Structural construction', deadline: new Date('2025-01-15'), status: 'Completed', completedDate: new Date('2025-01-10') },
        { description: 'Finishing and handover', deadline: new Date('2025-06-30'), status: 'Completed', completedDate: new Date('2025-06-28') }
    ]
  },
  {
    title: 'GIA to NGO for Skill Development in Pune',
    component: 'GIA',
    status: 'Sanctioned',
    state: 'Maharashtra',
    district: 'Pune',
    implementingAgency: 'Social Justice Department, Maharashtra',
    executingAgency: 'Pune Municipal Corporation',
    financials: { totalBudget: 2500000, fundsReleased: 500000, fundsUtilized: 0 },
    sanctionDate: new Date('2025-09-01'),
    expectedCompletionDate: new Date('2026-08-31'),
    beneficiaries: 100,
    description: 'Grant-in-Aid to local NGO for vocational training programs',
    milestones: [
      { description: 'First tranche of funds released', deadline: new Date('2025-11-15'), status: 'Pending' },
      { description: 'Mid-term report submission', deadline: new Date('2026-02-15'), status: 'Pending' },
    ]
  },
  // Uttar Pradesh Projects
  {
    title: 'Integrated Development of Rampur Village',
    component: 'Adarsh Gram',
    status: 'Completed',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    implementingAgency: 'Directorate of Social Welfare, Uttar Pradesh',
    executingAgency: 'Lucknow Nagar Nigam',
    financials: { totalBudget: 9500000, fundsReleased: 9500000, fundsUtilized: 9450000 },
    sanctionDate: new Date('2024-03-01'),
    expectedCompletionDate: new Date('2025-05-31'),
    actualCompletionDate: new Date('2025-05-15'),
    beneficiaries: 500,
    description: 'Complete village transformation with roads, sanitation, and community facilities',
    milestones: [
      { description: 'Approval and fund sanction', deadline: new Date('2024-04-01'), status: 'Completed', completedDate: new Date('2024-03-28') },
      { description: 'Infrastructure development', deadline: new Date('2025-02-28'), status: 'Completed', completedDate: new Date('2025-02-20') },
      { description: 'Project completion report', deadline: new Date('2025-05-10'), status: 'Completed', completedDate: new Date('2025-05-08') }
    ]
  },
  {
    title: 'Girls Hostel in Varanasi',
    component: 'Hostel',
    status: 'In-Progress',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    implementingAgency: 'Directorate of Social Welfare, Uttar Pradesh',
    executingAgency: 'Varanasi Development Authority',
    financials: { totalBudget: 15000000, fundsReleased: 7000000, fundsUtilized: 6500000 },
    sanctionDate: new Date('2025-02-01'),
    expectedCompletionDate: new Date('2026-05-30'),
    beneficiaries: 200,
    description: 'Girls hostel facility with modern amenities near educational institutions',
    milestones: [
      { description: 'Architectural plan finalized', deadline: new Date('2025-06-10'), status: 'Completed', completedDate: new Date('2025-06-08') },
      { description: 'Main building construction', deadline: new Date('2026-01-20'), status: 'Pending' },
      { description: 'Interior furnishing', deadline: new Date('2026-05-30'), status: 'Pending' }
    ]
  },
  {
    title: 'Grant for Elderly Care Center in Lucknow',
    component: 'GIA',
    status: 'Delayed',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    implementingAgency: 'Directorate of Social Welfare, Uttar Pradesh',
    executingAgency: 'Lucknow Nagar Nigam',
    financials: { totalBudget: 4000000, fundsReleased: 1000000, fundsUtilized: 1000000 },
    sanctionDate: new Date('2025-06-01'),
    expectedCompletionDate: new Date('2026-05-31'),
    beneficiaries: 75,
    description: 'Support to NGO running elderly care and day care center',
    milestones: [
      { description: 'UC submission for first tranche', deadline: new Date('2025-09-30'), status: 'Completed', completedDate: new Date('2025-09-28') },
      { description: 'Release of second tranche', deadline: new Date('2025-12-01'), status: 'Pending' },
    ]
  },
  // Tamil Nadu Projects
  {
    title: 'Smart Village Project in Madurai',
    component: 'Adarsh Gram',
    status: 'Sanctioned',
    state: 'Tamil Nadu',
    district: 'Madurai',
    implementingAgency: 'Adi Dravidar and Tribal Welfare Department, Tamil Nadu',
    executingAgency: 'Greater Chennai Corporation',
    financials: { totalBudget: 11000000, fundsReleased: 0, fundsUtilized: 0 },
    sanctionDate: new Date('2025-10-01'),
    expectedCompletionDate: new Date('2026-09-30'),
    beneficiaries: 400,
    description: 'Smart village initiative with digital infrastructure and modern amenities',
    milestones: [
        { description: 'Project sanction and G.O. issued', deadline: new Date('2025-12-15'), status: 'Pending' },
        { description: 'Tender process initiation', deadline: new Date('2026-02-01'), status: 'Pending' }
    ]
  },
  {
    title: 'Working Women Hostel in Chennai',
    component: 'Hostel',
    status: 'In-Progress',
    state: 'Tamil Nadu',
    district: 'Chennai',
    implementingAgency: 'Adi Dravidar and Tribal Welfare Department, Tamil Nadu',
    executingAgency: 'Greater Chennai Corporation',
    financials: { totalBudget: 20000000, fundsReleased: 10000000, fundsUtilized: 8000000 },
    sanctionDate: new Date('2025-01-01'),
    expectedCompletionDate: new Date('2026-07-31'),
    beneficiaries: 300,
    description: 'Modern working women hostel with 300 bed capacity in central Chennai',
    milestones: [
      { description: 'Site clearance and bhoomi pujan', deadline: new Date('2025-04-14'), status: 'Completed', completedDate: new Date('2025-04-14') },
      { description: 'Completion of 3 floors', deadline: new Date('2026-03-31'), status: 'Pending' },
      { description: 'Electrical and plumbing work', deadline: new Date('2026-07-31'), status: 'Pending' }
    ]
  },
  {
    title: 'Grant to "Hope Foundation" for Education',
    component: 'GIA',
    status: 'In-Progress',
    state: 'Tamil Nadu',
    district: 'Chennai',
    implementingAgency: 'Adi Dravidar and Tribal Welfare Department, Tamil Nadu',
    executingAgency: 'Greater Chennai Corporation',
    financials: { totalBudget: 3000000, fundsReleased: 1500000, fundsUtilized: 1200000 },
    sanctionDate: new Date('2025-07-01'),
    expectedCompletionDate: new Date('2026-06-30'),
    beneficiaries: 150,
    description: 'Educational support program for underprivileged students',
    milestones: [
      { description: 'MoU signed and first payment', deadline: new Date('2025-08-20'), status: 'Completed', completedDate: new Date('2025-08-18') },
      { description: 'Quarterly progress report due', deadline: new Date('2025-11-20'), status: 'Pending' }
    ]
  },
  {
    title: 'Sanitation & Water Supply in UP Village Cluster',
    component: 'Adarsh Gram',
    status: 'In-Progress',
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    implementingAgency: 'Directorate of Social Welfare, Uttar Pradesh',
    executingAgency: 'Varanasi Development Authority',
    financials: { totalBudget: 7500000, fundsReleased: 3000000, fundsUtilized: 2500000 },
    sanctionDate: new Date('2025-05-01'),
    expectedCompletionDate: new Date('2026-04-30'),
    beneficiaries: 350,
    description: 'Water supply and sanitation infrastructure for cluster of 5 villages',
    milestones: [
      { description: 'Community mobilization meetings', deadline: new Date('2025-09-01'), status: 'Completed', completedDate: new Date('2025-08-30') },
      { description: 'Installation of water pipelines', deadline: new Date('2026-02-28'), status: 'Pending' }
    ]
  },
];

module.exports = { agencies, users, projects };
