# JanConnect Project Setup

This file provides quick setup instructions for the JanConnect project.

## Quick Start Commands

### Terminal 1 - Backend Server
```bash
cd server
npm install
npm run dev
```

### Terminal 2 - Frontend Client
```bash
cd client
npm install
npm start
```

### Terminal 3 - MongoDB (if running locally)
```bash
mongod
```

## First Time Setup Checklist

- [ ] Install Node.js (v16+)
- [ ] Install MongoDB (v5+)
- [ ] Create Cloudinary account
- [ ] Copy `server/.env.example` to `server/.env`
- [ ] Update environment variables in `server/.env`
- [ ] Install backend dependencies: `cd server && npm install`
- [ ] Install frontend dependencies: `cd client && npm install`
- [ ] Start MongoDB
- [ ] Start backend server
- [ ] Start frontend client
- [ ] Navigate to http://localhost:3000

## Default Ports

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: mongodb://localhost:27017

## Need Help?

See the complete README.md for detailed documentation.
