# 👤 User Profile Feature Documentation

## Overview

Users can now view and edit their profile information by clicking on their name in the header. This feature provides a secure way for users to update their personal information and change their password.

---

## ✨ Features

### 1. **Clickable Profile Button**
- User's name in the header is now a clickable button
- Hover effect for visual feedback
- Redirects to `/profile` page

### 2. **Profile Display**
- Large avatar with user icon
- Name and role badge
- Email address
- Role-specific information:
  - **State-Admin**: Shows assigned state
  - **Agency-User**: Shows agency name and state
- Account status (Active/Pending)

### 3. **Edit Profile**
- Click "Edit Profile" button to enter edit mode
- Update name and email
- Optional password change
- Real-time validation
- Success/error messages

### 4. **Password Change**
- Requires current password verification
- New password must be at least 6 characters
- Password confirmation field
- Optional (leave blank to keep current password)

### 5. **Security Features**
- Current password verification required for password changes
- Email uniqueness validation
- Protected route (authentication required)
- JWT token refresh on update

---

## 🎨 User Interface

### Profile Header
```
┌─────────────────────────────────────────────────────┐
│  [Avatar Icon]  User Name                           │
│                 MoSJE-Admin                          │
│                             [Edit Profile Button]   │
└─────────────────────────────────────────────────────┘
```

### Profile Form Sections

#### 1. Personal Information
- Full Name (editable)
- Email Address (editable)

#### 2. Role Information (Read-only)
- State (for State-Admin)
- Agency & State (for Agency-User)

#### 3. Change Password (Optional)
- Current Password
- New Password
- Confirm New Password

---

## 🔌 API Endpoints

### Get Current User Profile
```http
GET /api/users/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Agency-User",
  "agency": "agency_id",
  "state": "Maharashtra"
}
```

### Update Current User Profile
```http
PUT /api/users/me
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (Update name and email only):**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Request Body (Update with password change):**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "currentPassword": "oldpass123",
  "password": "newpass123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "Agency-User",
  "agency": "agency_id",
  "state": "Maharashtra",
  "token": "new_jwt_token"
}
```

**Error Responses:**
```json
// Current password incorrect
{
  "message": "Current password is incorrect"
}

// Email already in use
{
  "message": "Email is already in use"
}

// Missing current password when changing password
{
  "message": "Current password is required to set a new password"
}

// Password too short
{
  "message": "New password must be at least 6 characters"
}
```

---

## 🔒 Security Measures

### Authentication
- All profile endpoints require JWT authentication
- Token passed in Authorization header
- User can only update their own profile (not others)

### Password Change Security
1. **Current password verification**: User must provide correct current password
2. **Minimum length**: New password must be at least 6 characters
3. **Password confirmation**: Frontend validates password match
4. **Password hashing**: Passwords hashed with bcrypt before storing
5. **Token refresh**: New JWT token issued after successful update

### Email Validation
- Checks if email is already in use by another user
- Prevents duplicate email addresses
- Case-insensitive email checking

---

## 📱 Frontend Implementation

### Files Modified/Created

#### 1. ProfilePage.jsx (NEW)
**Location**: `client/src/pages/ProfilePage.jsx`

**Features**:
- Display mode and edit mode
- Form validation
- Password change section
- Agency details fetching (for Agency-User)
- Success/error alerts
- Loading states

#### 2. Header.jsx (MODIFIED)
**Location**: `client/src/components/Header.jsx`

**Changes**:
- Converted user info section from `<div>` to `<button>`
- Added click handler to navigate to `/profile`
- Added hover effects and transition animations

#### 3. App.js (MODIFIED)
**Location**: `client/src/App.js`

**Changes**:
- Added ProfilePage import
- Added `/profile` route with PrivateRoute wrapper

---

## 🖥️ Backend Implementation

### Files Modified

#### 1. userController.js (MODIFIED)
**Location**: `server/controllers/userController.js`

**New Function**: `updateMe`
- Validates current password if changing password
- Checks email uniqueness
- Updates user information
- Returns new JWT token

**Features**:
- Password verification using `matchPassword` method
- Email duplicate checking
- Selective field updates (only update provided fields)
- Error handling for all validation cases

#### 2. userRoutes.js (MODIFIED)
**Location**: `server/routes/userRoutes.js`

**Changes**:
- Added `PUT /api/users/me` route
- Protected with `protect` middleware
- Available to all authenticated users

---

## 🎯 User Flow

### Viewing Profile
```
1. User logs in
2. Clicks on their name in header
3. Redirected to /profile
4. Sees profile information displayed
```

### Editing Profile
```
1. User on profile page
2. Clicks "Edit Profile" button
3. Form fields become editable
4. Makes changes
5. Clicks "Save Changes"
6. Profile updated
7. Success message shown
8. Edit mode disabled
```

### Changing Password
```
1. User clicks "Edit Profile"
2. Scrolls to "Change Password" section
3. Enters current password
4. Enters new password
5. Confirms new password
6. Clicks "Save Changes"
7. Backend verifies current password
8. New password saved
9. User receives new JWT token
10. Success message shown
```

### Canceling Edit
```
1. User in edit mode
2. Clicks "Cancel" button
3. All changes discarded
4. Form reset to original values
5. Edit mode disabled
```

---

## 🎨 UI Components

### Role Badges
Color-coded badges for visual clarity:
- **MoSJE-Admin**: Purple background
- **State-Admin**: Blue background
- **Agency-User**: Green background

### Buttons
1. **Edit Profile**: White button with primary text
2. **Save Changes**: Gradient primary button
3. **Cancel**: Neutral gray button
4. **Name Button (Header)**: Transparent with hover effect

### Form Fields
- Disabled state: Gray background, not editable
- Enabled state: White background, primary focus ring
- Labels with icons for visual clarity

### Alert Messages
- **Error**: Red background and border
- **Success**: Green background and border

---

## 🔧 Code Examples

### Frontend - Navigating to Profile
```jsx
// In Header.jsx
const navigate = useNavigate();

<button onClick={() => navigate('/profile')}>
  {/* User info */}
</button>
```

### Frontend - Updating Profile
```javascript
const response = await axios.put(
  `${API_URL}/users/me`,
  {
    name: formData.name,
    email: formData.email,
    currentPassword: formData.currentPassword, // if changing password
    password: formData.newPassword,            // if changing password
  },
  {
    headers: { Authorization: `Bearer ${token}` },
  }
);

// Update Redux store
dispatch(setCredentials(response.data));

// Update localStorage
localStorage.setItem('user', JSON.stringify({
  ...storedUser,
  ...response.data
}));
```

### Backend - Updating Profile Controller
```javascript
const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  // Verify current password if changing password
  if (password && currentPassword) {
    const isPasswordValid = await user.matchPassword(currentPassword);
    if (!isPasswordValid) {
      throw new Error('Current password is incorrect');
    }
    user.password = password;
  }
  
  // Update fields
  if (name) user.name = name;
  if (email) user.email = email;
  
  const updatedUser = await user.save();
  
  res.json({
    ...updatedUser,
    token: generateToken(updatedUser._id),
  });
});
```

---

## 🧪 Testing Checklist

### Profile Display
- [ ] Click name in header redirects to profile page
- [ ] Profile page shows correct user information
- [ ] Role badge displays with correct color
- [ ] Agency details shown for Agency-User
- [ ] State shown for State-Admin
- [ ] Account status displayed correctly

### Edit Profile
- [ ] Edit Profile button enables form fields
- [ ] Name field can be edited
- [ ] Email field can be edited
- [ ] Role-specific fields are read-only
- [ ] Cancel button restores original values
- [ ] Save button submits form

### Update Name/Email Only
- [ ] Can update name without changing password
- [ ] Can update email without changing password
- [ ] Email uniqueness validated
- [ ] Success message shown
- [ ] Header updates with new name
- [ ] JWT token refreshed

### Password Change
- [ ] Current password field required for password change
- [ ] Password confirmation validated
- [ ] Minimum 6 characters enforced
- [ ] Incorrect current password rejected
- [ ] Successful password change updates password
- [ ] New JWT token issued
- [ ] Password fields cleared after save

### Error Handling
- [ ] Invalid current password shows error
- [ ] Duplicate email shows error
- [ ] Password mismatch shows error
- [ ] Short password shows error
- [ ] Network errors handled gracefully

### UI/UX
- [ ] Hover effect on name button in header
- [ ] Loading state during save
- [ ] Success/error alerts visible
- [ ] Form validation messages clear
- [ ] Responsive on mobile devices
- [ ] Dark mode styling correct

---

## 🚀 Deployment Notes

### No Additional Configuration Required
- Uses existing authentication system
- No new environment variables needed
- No database migrations required
- Compatible with existing user model

### Server Restart Required
After adding the new endpoint, restart the backend server:
```bash
cd server
node server.js
```

---

## 📝 Future Enhancements

### Potential Features
1. **Profile Photo Upload**
   - Image upload functionality
   - Avatar customization
   - Storage integration (AWS S3, etc.)

2. **Email Verification**
   - Send verification email on email change
   - Confirm new email before updating

3. **Two-Factor Authentication**
   - Enable 2FA for accounts
   - QR code generation
   - Backup codes

4. **Activity Log**
   - Show recent profile changes
   - Login history
   - Security events

5. **Preferences**
   - Theme preference
   - Notification settings
   - Language preference

6. **Password Strength Indicator**
   - Visual password strength meter
   - Password suggestions
   - Complexity requirements

---

## 🐛 Troubleshooting

### Profile Page Not Loading
**Issue**: Clicking name doesn't navigate to profile

**Solution**:
1. Check if route is added in `App.js`
2. Verify `ProfilePage` component is imported
3. Check browser console for errors

### Update Fails with 401 Error
**Issue**: "Current password is incorrect" even with correct password

**Solution**:
1. Verify user model has `matchPassword` method
2. Check password is being hashed correctly
3. Ensure bcrypt is installed: `npm install bcrypt`

### Email Update Fails
**Issue**: "Email is already in use" error

**Solution**:
1. Check if email is actually used by another user
2. Verify email validation logic excludes current user
3. Test with a unique email address

### Token Not Refreshing
**Issue**: Updated user data not reflected in header

**Solution**:
1. Verify Redux store is updated after save
2. Check localStorage is updated with new token
3. Ensure `setCredentials` action is dispatched

---

## 📊 Summary

### Files Created (1)
```
client/src/pages/ProfilePage.jsx
```

### Files Modified (4)
```
client/src/components/Header.jsx
client/src/App.js
server/controllers/userController.js
server/routes/userRoutes.js
```

### New Routes
- Frontend: `GET /profile`
- Backend: `PUT /api/users/me`

### Key Features
✅ Clickable profile button in header  
✅ View profile information  
✅ Edit name and email  
✅ Change password securely  
✅ Real-time validation  
✅ Success/error feedback  
✅ JWT token refresh  

---

**Implementation Complete!** 🎉

Users can now easily manage their profile information with a beautiful, secure, and user-friendly interface.
