# JanConnect - PM-AJAY Scheme Management Portal

![JanConnect](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![MERN](https://img.shields.io/badge/Stack-MERN-orange)

A comprehensive web portal for the Ministry of Social Justice & Empowerment to manage and monitor projects under the PM-AJAY (Pradhan Mantri Anusuchit Jaati Abhyuday Yojana) scheme.

## 🚀 Features

### Role-Based Access Control (RBAC)
- **MoSJE Admin**: National-level access with full control
- **State Admin**: State-specific project management
- **Agency User**: Project execution and milestone tracking

### Core Functionality
- ✅ JWT-based secure authentication
- ✅ Project lifecycle management (Sanctioned → In-Progress → Completed)
- ✅ Multi-agency project coordination (Implementing & Executing agencies)
- ✅ Milestone tracking with evidence uploads (Cloudinary integration)
- ✅ Real-time financial monitoring (Budget, Released, Utilized)
- ✅ Interactive dashboards with charts and analytics
- ✅ Advanced filtering and search capabilities
- ✅ Document management system

### Technology Stack
- **Frontend**: React 18, Redux Toolkit, TailwindCSS, Recharts
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **UI Components**: React Icons, Custom Tailwind Components

---

## � Project Screenshots

### 🏠 Landing Page & Authentication

#### Homepage - Hero Section
![Homepage Hero](./Pictures/Homepage1.png)
*Modern landing page with hero section showcasing the PM-AJAY scheme*

#### Homepage - About Section
![Homepage Features](./Pictures/Homepage2.png)
*Key features and benefits of the portal*

#### Homepage - Feature Section
![Homepage Statistics](./Pictures/Homepage3.png)
*Real-time statistics and scheme impact visualization*

#### Homepage - Objectives Section
![Homepage About](./Pictures/Homepage4.png)
*Information about the PM-AJAY scheme and its objectives*

#### Homepage - Footer
![Homepage Footer](./Pictures/Homepage5.png)
*Contact information and quick links*

#### Login Page
![Login Page](./Pictures/LoginPage.png)
*Secure login interface with homepage background and multiple navigation options*

#### Signup Page
![Signup Page](./Pictures/SignUpPage.png)
*User registration page with role-based signup and agency selection*

---

### 📊 Admin Dashboard & Analytics

#### Admin Dashboard - Overview
![Admin Dashboard](./Pictures/AdminDashboard1.png)
*Comprehensive dashboard with key metrics and real-time statistics*

#### Admin Dashboard - Charts
![Admin Dashboard Charts](./Pictures/AdminDashboard2.png)
*Interactive charts showing project distribution and financial analytics*

#### Analytics - Project Distribution
![Analytics Overview](./Pictures/AdminAnalytics1.png)
*State-wise project distribution and component analysis*

#### Analytics - Financial Metrics
![Analytics Financial](./Pictures/AdminAnalytics2.png)
*Budget allocation, fund utilization, and financial tracking*

#### Analytics - Performance Metrics
![Analytics Performance](./Pictures/AdminAnalytics3.png)
*Project completion rates and performance indicators*

---

### 📋 Project & User Management

#### Projects Management
![Admin Projects](./Pictures/AdminProject.png)
*Complete project listing with advanced filtering and search capabilities*

#### Agencies Management
![Admin Agencies](./Pictures/AdminAgencies.png)
*Implementing and executing agency management interface*

#### User Management
![Admin Users](./Pictures/AdminAllUsers.png)
*User administration with role-based access control and approval system*

---

### 📈 Reports & Analytics

#### Reports Dashboard
![Reports Overview](./Pictures/AdminReports1.png)
*Comprehensive reporting system with export capabilities*

#### Detailed Reports
![Detailed Reports](./Pictures/AdminReports2.png)
*In-depth project reports with milestone tracking and financial details*

---

### ⚙️ Settings & Configuration

#### Settings - Profile Management
![Settings Profile](./Pictures/Settings1.png)
*User profile settings with personal information and avatar management*

#### Settings - Security
![Settings Security](./Pictures/Settings2.png)
*Password management and security configuration*

#### Settings - Notifications
![Settings Notifications](./Pictures/Settings3.png)
*Notification preferences and alert configuration*

#### Settings - Email Configuration
![Settings Email](./Pictures/Settings4.png)
*Email settings and SMTP configuration*

#### Settings - System Settings
![Settings System](./Pictures/Settings5.png)
*System-wide configuration and maintenance options*

#### Settings - Advanced
![Settings Advanced](./Pictures/Settings6.png)
*Advanced settings including database management and security features*

---

### 🎨 Design Features

- ✨ **Dark Mode UI**: Modern dark theme with glassmorphism effects
- 🎯 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- 🚀 **Smooth Animations**: Subtle transitions and hover effects
- 📊 **Interactive Charts**: Real-time data visualization with Recharts
- 🎨 **Custom Components**: Tailwind CSS with custom design system
- 🔒 **Secure Authentication**: JWT-based authentication with role-based access
- 📱 **Mobile-First**: Touch-friendly interface with intuitive navigation

---

## �📁 Project Structure

```
JanConnect/
├── server/                      # Backend API
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── cloudinary.js       # Cloudinary configuration
│   ├── controllers/
│   │   ├── userController.js   # User & auth logic
│   │   ├── projectController.js # Project CRUD operations
│   │   └── agencyController.js # Agency management
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification & RBAC
│   │   └── errorMiddleware.js  # Error handling
│   ├── models/
│   │   ├── userModel.js        # User schema
│   │   ├── projectModel.js     # Project schema with milestones
│   │   └── agencyModel.js      # Agency schema
│   ├── routes/
│   │   ├── userRoutes.js       # User API routes
│   │   ├── projectRoutes.js    # Project API routes
│   │   └── agencyRoutes.js     # Agency API routes
│   ├── uploads/                # Temporary file storage
│   ├── .env                    # Environment variables
│   ├── .env.example            # Environment template
│   ├── server.js               # Express server entry point
│   └── package.json
│
├── client/                      # Frontend React App
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── assets/             # Images, logos
│   │   ├── components/
│   │   │   ├── Header.jsx      # Top navigation bar
│   │   │   ├── Sidebar.jsx     # Left sidebar navigation
│   │   │   ├── Layout.jsx      # Main layout wrapper
│   │   │   ├── PrivateRoute.jsx # Route protection
│   │   │   ├── StatCard.jsx    # Dashboard stat cards
│   │   │   ├── ProjectTable.jsx # Sortable project table
│   │   │   ├── MilestoneTracker.jsx # Milestone timeline
│   │   │   ├── FileUploadModal.jsx # File upload dialog
│   │   │   ├── BarChart.jsx    # Bar chart component
│   │   │   └── PieChart.jsx    # Pie chart component
│   │   ├── hooks/
│   │   │   └── useAuth.js      # Authentication hooks
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx   # Login interface
│   │   │   ├── DashboardPage.jsx # Role-based dashboard
│   │   │   ├── ProjectsListPage.jsx # All projects view
│   │   │   └── SingleProjectPage.jsx # Project details
│   │   ├── redux/
│   │   │   ├── store.js        # Redux store configuration
│   │   │   ├── authSlice.js    # Auth state management
│   │   │   └── projectSlice.js # Project state management
│   │   ├── utils/
│   │   │   └── helpers.js      # Utility functions
│   │   ├── App.js              # Main app with routing
│   │   ├── index.js            # React entry point
│   │   └── index.css           # Global styles
│   ├── .env                    # Frontend environment variables
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── postcss.config.js       # PostCSS configuration
│   └── package.json
│
├── Documentation/              # 📚 All project documentation
│   ├── INDEX.md               # Documentation index & navigation
│   ├── SETUP.md               # Detailed setup guide
│   ├── SEEDER.md              # Database seeding instructions
│   ├── PROJECT_SUMMARY.md     # Project overview
│   ├── SIGNUP-FEATURE.md      # User registration docs
│   ├── USER-APPROVAL-EMAIL-SYSTEM.md  # Admin approval system
│   ├── USER-PROFILE-FEATURE.md  # Profile management
│   ├── AGENCIES-SETUP.md      # Agency management
│   ├── flowchart.md           # System flowcharts
│   └── [17 more documentation files...]
│
└── README.md                   # This file
```

---

## � Documentation

All comprehensive project documentation has been organized in the **[Documentation/](./Documentation/)** folder.

### Quick Links
- **[Documentation Index](./Documentation/INDEX.md)** - Complete documentation navigation
- **[Setup Guide](./Documentation/SETUP.md)** - Detailed installation instructions
- **[User Approval System](./Documentation/USER-APPROVAL-EMAIL-SYSTEM.md)** - Admin approval workflow
- **[Profile Feature](./Documentation/USER-PROFILE-FEATURE.md)** - User profile management
- **[Database Seeder](./Documentation/SEEDER.md)** - Database population guide

### Documentation Categories
- 🚀 **Setup & Configuration** - Project setup, environment, database
- ✨ **Feature Documentation** - User registration, approval, profile, agencies
- 🔧 **Troubleshooting** - Common issues, bug fixes, solutions
- 📊 **Architecture** - Flowcharts, workflows, system design

**Total**: 18 comprehensive documentation files covering all aspects of the project.

→ **Start here**: [Documentation/INDEX.md](./Documentation/INDEX.md)

---

## �🛠️ Installation & Setup

> **Detailed setup instructions available in [Documentation/SETUP.md](./Documentation/SETUP.md)**

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager
- Cloudinary account (for file uploads)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd JanConnect
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Edit .env file with your credentials:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A strong secret key
# - CLOUDINARY credentials: Get from cloudinary.com

# Start MongoDB (if running locally)
mongod

# Start the development server
npm run dev
```

The backend API will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will run on `http://localhost:3000`

---

## 🔐 Environment Variables

### Server (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/janconnect
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
```

### Client (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST `/users/login`
Login user and get JWT token
```json
{
  "email": "admin@mosje.gov.in",
  "password": "admin123"
}
```

#### POST `/users/register` (Admin only)
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Agency-User",
  "agency": "64a1f2e3c4d5e6f7g8h9i0j1"
}
```

#### GET `/users/me`
Get current user profile (requires auth)

### Project Endpoints

#### GET `/projects`
Get all projects (filtered by role)

Query Parameters:
- `state`: Filter by state
- `status`: Filter by status (Sanctioned, In-Progress, Completed, Delayed)
- `component`: Filter by component (Adarsh Gram, GIA, Hostel)
- `search`: Search by title

#### POST `/projects` (State Admin+)
Create a new project
```json
{
  "title": "Rural Development Project",
  "component": "Adarsh Gram",
  "state": "Maharashtra",
  "district": "Pune",
  "implementingAgency": "64a1...",
  "executingAgency": "64a2...",
  "financials": {
    "totalBudget": 5000000,
    "fundsReleased": 2000000,
    "fundsUtilized": 1000000
  },
  "sanctionDate": "2024-01-15",
  "expectedCompletionDate": "2025-12-31",
  "beneficiaries": 500,
  "milestones": [
    {
      "description": "Land acquisition",
      "deadline": "2024-06-30"
    }
  ]
}
```

#### GET `/projects/:id`
Get single project details

#### PUT `/projects/:id` (State Admin+)
Update project

#### PUT `/projects/:id/milestone/:milestoneId`
Update milestone status

#### POST `/projects/:id/upload`
Upload evidence file (multipart/form-data)

#### GET `/projects/stats/summary`
Get aggregated statistics

### Agency Endpoints

#### GET `/agencies`
Get all agencies

#### POST `/agencies` (State Admin+)
Create an agency

#### PUT `/agencies/:id` (State Admin+)
Update agency

---

## 👥 Default User Roles & Access

### MoSJE Admin
- View all projects nationwide
- Create/edit/delete projects and agencies
- Access all analytics and reports
- User management

### State Admin
- View projects in their state only
- Create/edit projects in their state
- Manage state-level agencies
- State-specific reports

### Agency User
- View assigned projects only
- Update milestone progress
- Upload evidence documents
- Track pending tasks

---

## 🎨 UI Components

### Dashboard Views

#### MoSJE Admin Dashboard
- National-level statistics
- Charts: Projects by status, component, state
- Recent project updates
- Financial overview

#### State Admin Dashboard
- State-specific statistics
- Agency performance metrics
- Project list with filters
- Budget utilization charts

#### Agency User Dashboard
- Assigned projects
- Pending milestones (To-Do list)
- Progress tracking
- Quick upload actions

### Project Management
- Advanced filtering (status, component, search)
- Sortable columns (title, budget, date)
- Progress bars for milestones
- Real-time budget tracking
- Evidence document management

---

## 🚦 Getting Started - Quick Demo

### 1. Create Sample Data

You can use MongoDB Compass or the MongoDB shell to insert sample data:

#### Sample Admin User
```javascript
// Use bcrypt to hash password first
{
  "name": "MoSJE Administrator",
  "email": "admin@mosje.gov.in",
  "password": "$2a$10$...", // hashed "admin123"
  "role": "MoSJE-Admin",
  "isActive": true
}
```

#### Sample Agency
```javascript
{
  "name": "National Rural Development Agency",
  "type": "Implementing",
  "state": "Maharashtra",
  "district": "Mumbai",
  "nodalOfficer": {
    "name": "Rajesh Kumar",
    "email": "rajesh@nrda.gov.in",
    "phone": "9876543210"
  },
  "isActive": true
}
```

### 2. Test the Application

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000`
3. Login with demo credentials (shown on login page)
4. Explore the dashboard based on your role
5. Create a test project (if admin/state-admin)
6. Update milestones and upload files

---

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

---

## 📦 Build for Production

### Backend
```bash
cd server
NODE_ENV=production node server.js
```

### Frontend
```bash
cd client
npm run build
```

The optimized build will be in `client/build/` directory.

---

## 🐳 Docker Deployment (Optional)

Create `docker-compose.yml` in the root:
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
  
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/janconnect
    depends_on:
      - mongodb
  
  frontend:
    build: ./client
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongo-data:
```

Run: `docker-compose up`

---

## 🔧 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### CORS Issues
- Ensure `CLIENT_URL` in backend `.env` matches frontend URL
- Check CORS configuration in `server.js`

### File Upload Errors
- Verify Cloudinary credentials
- Check file size limits (max 10MB)
- Ensure allowed file formats: jpg, jpeg, png, pdf, doc, docx

### JWT Token Issues
- Check `JWT_SECRET` is set
- Clear browser localStorage and login again
- Verify token expiration settings

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Cloudinary Docs](https://cloudinary.com/documentation)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Support

For issues and questions:
- Open an issue on GitHub
- Contact: support@janconnect.gov.in (example)

---

## 🎯 Roadmap

### Phase 2 Features (Upcoming)
- [ ] Email notifications for milestone deadlines
- [ ] Mobile app (React Native)
- [ ] Advanced analytics with AI insights
- [ ] Bulk project import/export
- [ ] Real-time collaboration features
- [ ] Multi-language support (Hindi, regional languages)
- [ ] PDF report generation
- [ ] SMS alerts integration
- [ ] GIS mapping for project locations
- [ ] Offline mode support

---

**Built with ❤️ for the Ministry of Social Justice & Empowerment**

*Last Updated: October 11, 2025*
