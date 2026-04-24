# Agencies Dropdown Fix - Setup Guide

## Issues Fixed

1. **Authentication Issue**: Agency route required login, but signup page needs it before authentication
2. **Database Seeding**: Need to populate agencies in database

---

## Changes Made

### 1. Backend Route (agencyRoutes.js)
Added a public route for fetching agencies without authentication:

```javascript
// Public route for signup page (no authentication required)
router.get('/public', getAgencies);
```

### 2. Frontend SignupPage (SignupPage.jsx)
Updated API endpoint to use the public route:

```javascript
const response = await axios.get(`${API_URL}/agencies/public`);
```

---

## Database Setup

### Step 1: Seed the Database

The database needs to be populated with demo data including agencies. Run the seeder:

```powershell
# Navigate to server directory
cd d:\SIH\JanConnect\server

# Run the seeder
npm run seed
```

**Expected Output:**
```
✓ MongoDB Connected for Seeding
🌱 Starting data import...
📋 Importing agencies...
✓ Successfully imported 8 agencies
👥 Importing users...
✓ Successfully imported 5 users
📁 Importing projects...
✓ Successfully imported XX projects
✅ Data Import Complete!
```

### Step 2: Verify Agencies Were Created

You can verify by:

**Option A: Check MongoDB directly**
- Open MongoDB Compass or mongosh
- Connect to your database
- Look at the `agencies` collection
- Should see 8 agencies from different states

**Option B: Test API endpoint**
```powershell
# Test the public agencies endpoint
Invoke-RestMethod -Uri "http://localhost:5000/api/agencies/public" -Method GET | ConvertTo-Json
```

**Expected Response:**
```json
[
  {
    "_id": "...",
    "name": "Social Justice Department, Maharashtra",
    "type": "Implementing",
    "state": "Maharashtra",
    "district": "Mumbai",
    ...
  },
  ...
]
```

---

## Demo Agencies Available

After seeding, the following agencies will be available:

### Maharashtra
1. **Social Justice Department, Maharashtra** (Implementing)
2. **Pune Municipal Corporation** (Executing)
3. **Nagpur Zilla Parishad** (Executing)

### Uttar Pradesh
4. **Directorate of Social Welfare, Uttar Pradesh** (Implementing)
5. **Lucknow Nagar Nigam** (Executing)
6. **Varanasi Development Authority** (Executing)

### Tamil Nadu
7. **Adi Dravidar and Tribal Welfare Department, Tamil Nadu** (Implementing)
8. **Greater Chennai Corporation** (Executing)

---

## Complete Setup Checklist

### ✅ Backend Setup
- [ ] Backend server is running (`npm start` in server folder)
- [ ] MongoDB is connected
- [ ] Database has been seeded with `npm run seed`
- [ ] Public route `/api/agencies/public` is accessible

### ✅ Frontend Setup
- [ ] Client `.env` file exists with `REACT_APP_API_URL=http://localhost:5000/api`
- [ ] React dev server restarted after `.env` changes
- [ ] SignupPage updated to use `/agencies/public` endpoint

### ✅ Testing
- [ ] Navigate to `http://localhost:3000/signup`
- [ ] Select role as "Agency-User"
- [ ] Agency dropdown appears
- [ ] Agencies are listed in dropdown
- [ ] Can select an agency
- [ ] Form submits successfully

---

## Troubleshooting

### Issue 1: "npm run seed" fails
**Symptom**: Error when running seeder
**Solutions**:
1. Check MongoDB is running and connection string is correct in `.env`
2. Verify `.env` has `MONGODB_URI` variable
3. Check network connectivity to MongoDB

### Issue 2: Agencies dropdown is empty
**Symptom**: Dropdown shows but no agencies listed
**Solutions**:
1. Check browser console for errors (F12)
2. Check Network tab for `/api/agencies/public` request
3. Verify database was seeded: `npm run seed`
4. Restart backend server

### Issue 3: "Cannot GET /api/agencies/public"
**Symptom**: 404 error on agencies endpoint
**Solutions**:
1. Verify backend server is running
2. Check `agencyRoutes.js` has public route
3. Restart backend server to load new routes

### Issue 4: Agency dropdown shows "Loading..." forever
**Symptom**: Dropdown never populates
**Solutions**:
1. Check browser console for CORS errors
2. Verify backend URL in `.env`: `REACT_APP_API_URL=http://localhost:5000/api`
3. Restart React client after `.env` changes
4. Check backend server is responding: `Invoke-RestMethod -Uri "http://localhost:5000/api/health"`

---

## Testing the Complete Signup Flow

### Test Case 1: Agency-User Signup
1. Go to `/signup`
2. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Role: **Agency-User**
   - Agency: Select "Pune Municipal Corporation"
   - Password: "test123"
   - Confirm Password: "test123"
3. Click "Create Account"
4. Should see: "Registration successful! Please wait for admin approval."
5. Redirected to login page

### Test Case 2: State-Admin Signup
1. Go to `/signup`
2. Fill in:
   - Name: "State Admin Test"
   - Email: "stateadmin@example.com"
   - Role: **State-Admin**
   - State: Select "Maharashtra"
   - Password: "test123"
   - Confirm Password: "test123"
3. Click "Create Account"
4. Should see success message

### Test Case 3: MoSJE-Admin Signup
1. Go to `/signup`
2. Fill in:
   - Name: "MoSJE Admin Test"
   - Email: "mosjeadmin@example.com"
   - Role: **MoSJE-Admin**
   - (No agency or state field should appear)
   - Password: "test123"
   - Confirm Password: "test123"
3. Click "Create Account"
4. Should see success message

---

## API Endpoints Summary

### Public Endpoints (No Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agencies/public` | Get all agencies (for signup) |
| POST | `/api/users/register-public` | Register new user (pending approval) |
| POST | `/api/users/login` | User authentication |

### Protected Endpoints (Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/agencies` | Get agencies (authenticated) |
| POST | `/api/agencies` | Create agency (State-Admin+) |
| GET | `/api/agencies/:id` | Get single agency |
| PUT | `/api/agencies/:id` | Update agency (State-Admin+) |
| DELETE | `/api/agencies/:id` | Delete agency (Admin only) |

---

## Quick Commands Reference

### Seed Database
```powershell
cd d:\SIH\JanConnect\server
npm run seed
```

### Clear and Re-seed Database
```powershell
cd d:\SIH\JanConnect\server
npm run seed:destroy  # Clear all data
npm run seed          # Import fresh data
```

### Start Backend
```powershell
cd d:\SIH\JanConnect\server
npm start
```

### Start Frontend
```powershell
cd d:\SIH\JanConnect\client
npm start
```

### Test Agency Endpoint
```powershell
# PowerShell
Invoke-RestMethod -Uri "http://localhost:5000/api/agencies/public" -Method GET

# Output should show array of agencies
```

### Check Database Connection
```powershell
# Test health endpoint
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET

# Should return: { "status": "OK", "message": "JanConnect API is running" }
```

---

## Files Modified

### Backend
```
server/routes/agencyRoutes.js          # Added public route
```

### Frontend
```
client/src/pages/SignupPage.jsx        # Updated to use /agencies/public
```

### No Changes Needed
- `server/controllers/agencyController.js` (uses existing getAgencies function)
- `server/models/agencyModel.js` (model unchanged)
- `server/data/demoData.js` (already has agencies)
- `server/utils/seeder.js` (already seeds agencies)

---

## Next Steps After Setup

1. **Seed the database**: `npm run seed`
2. **Restart backend server**: Stop (Ctrl+C) and run `npm start` in server folder
3. **Restart frontend**: Stop (Ctrl+C) and run `npm start` in client folder
4. **Test signup page**: Go to `http://localhost:3000/signup`
5. **Verify agencies dropdown**: Select "Agency-User" role and check dropdown

---

## Important Notes

- Public agency endpoint is **read-only** (no authentication required)
- Original authenticated endpoint `/api/agencies` still exists for admin operations
- Agency creation still requires State-Admin or higher authentication
- Seeder provides 8 demo agencies across 3 states
- Users can only see **all** agencies (no filtering on signup page)

