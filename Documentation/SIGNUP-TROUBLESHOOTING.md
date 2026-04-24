# Fixing "Not Found - /api/users/register-public" Error

## Problem
The signup page shows "Not Found - /api/users/register-public" error after filling the form.

## Root Cause
The React client needs to be restarted after the `.env` file is created or modified for environment variables to be loaded.

## Solution Steps

### Step 1: Stop the Client Development Server
1. Go to the terminal running the client (`npm start` in `client` folder)
2. Press `Ctrl + C` to stop the server

### Step 2: Verify Backend Server is Running
1. Open a new terminal
2. Navigate to server directory:
   ```powershell
   cd d:\SIH\JanConnect\server
   ```
3. Start the backend server (if not running):
   ```powershell
   npm start
   ```
4. You should see: `Server is running on port 5000`
5. If you get "address already in use" error, the server is already running (which is good!)

### Step 3: Restart the Client Development Server
1. Open a new terminal (keep backend running)
2. Navigate to client directory:
   ```powershell
   cd d:\SIH\JanConnect\client
   ```
3. Start the client server:
   ```powershell
   npm start
   ```
4. Wait for "Compiled successfully!" message
5. Browser should open automatically at `http://localhost:3000`

### Step 4: Test the Signup Feature
1. Navigate to `http://localhost:3000/signup`
2. Fill out the signup form:
   - Full Name
   - Email Address
   - Select Role (Agency-User, State-Admin, or MoSJE-Admin)
   - Select Agency (if Agency-User) or State (if State-Admin)
   - Password (min 6 characters)
   - Confirm Password
3. Click "Create Account"
4. You should see success message: "Registration successful! Please wait for admin approval."

---

## Verification Checklist

### ✅ Backend Server
- [ ] Backend server is running on port 5000
- [ ] No errors in backend terminal
- [ ] Can access `http://localhost:5000/api` (should see "Cannot GET /api" which is normal)

### ✅ Frontend Server
- [ ] React client is running on port 3000
- [ ] Client restarted AFTER `.env` file was created
- [ ] No compilation errors in client terminal
- [ ] Can access `http://localhost:3000`

### ✅ Environment Configuration
- [ ] File `client/.env` exists
- [ ] File contains: `REACT_APP_API_URL=http://localhost:5000/api`
- [ ] No typos in the URL

### ✅ API Endpoint
- [ ] Backend route exists in `server/routes/userRoutes.js`
- [ ] Route definition: `router.post('/register-public', registerUserPublic);`
- [ ] Controller function exists in `server/controllers/userController.js`

---

## Quick Debug Commands

### Check Backend Server
```powershell
# Test if backend is responding
Invoke-WebRequest -Uri "http://localhost:5000/api/users/login" -Method POST -ContentType "application/json" -Body '{"email":"test@test.com","password":"test123"}' -ErrorAction SilentlyContinue
```

### Check Environment Variables (in React)
Add this to `SignupPage.jsx` temporarily to debug:
```javascript
console.log('API_URL:', API_URL);
console.log('ENV:', process.env.REACT_APP_API_URL);
```

### Check Network Request
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Submit signup form
4. Look for request to `/api/users/register-public`
5. Check:
   - Request URL (should be `http://localhost:5000/api/users/register-public`)
   - Status Code (should be 201 for success, or error details)
   - Response data

---

## Common Issues and Solutions

### Issue 1: "Cannot POST /api/users/register-public"
**Cause**: Backend server not running or crashed
**Solution**: Start/restart backend server

### Issue 2: "Network Error" or "ERR_CONNECTION_REFUSED"
**Cause**: Backend server not running on port 5000
**Solution**: 
```powershell
cd d:\SIH\JanConnect\server
npm start
```

### Issue 3: Environment variable not loaded
**Cause**: Client not restarted after `.env` file creation
**Solution**: Stop client (Ctrl+C) and run `npm start` again

### Issue 4: "404 Not Found" but backend is running
**Cause**: Route not registered properly
**Solution**: 
1. Check `server/routes/userRoutes.js` for the route
2. Check `server/server.js` that routes are mounted: `app.use('/api/users', userRoutes)`
3. Restart backend server

### Issue 5: CORS errors
**Cause**: Backend not allowing requests from frontend origin
**Solution**: Check `server/server.js` has CORS enabled:
```javascript
const cors = require('cors');
app.use(cors());
```

---

## Expected API Response

### Success Response (201 Created)
```json
{
  "message": "Registration successful! Your account is pending admin approval.",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Agency-User",
    "isActive": false
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "message": "User already exists with this email"
}
```

---

## Testing the Complete Flow

1. **Register a new user**:
   - Go to `/signup`
   - Fill form and submit
   - Should see success message and redirect to `/login`

2. **Try to login (should fail)**:
   - Go to `/login`
   - Enter the email/password you just registered
   - Should see error: "User account is inactive"

3. **Activate user (as admin)**:
   - Login as admin (use demo credentials)
   - Go to Users Management
   - Find the pending user
   - Update `isActive` to `true`

4. **Login with activated account**:
   - Go to `/login`
   - Enter credentials
   - Should successfully login and see dashboard

---

## Files to Check

### Client Files
```
client/.env                           # Environment variables
client/src/pages/SignupPage.jsx       # Signup form component
client/src/App.js                     # Route definition
```

### Server Files
```
server/routes/userRoutes.js           # API routes
server/controllers/userController.js  # registerUserPublic function
server/server.js                      # Express app setup
```

