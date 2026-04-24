# State-Admin Access to Reports & Analytics - Troubleshooting Guide

## 🔍 Issue: State-Admin Cannot Access Reports/Analytics

If a State-Admin user is getting redirected or seeing "Not Authorized" messages when trying to access Reports or Analytics pages, follow this troubleshooting guide.

---

## ✅ Quick Verification Steps

### Step 1: Verify User Role in Browser Console

1. Open the page in browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Type and execute:
```javascript
JSON.parse(localStorage.getItem('user'))
```

**Expected Output:**
```javascript
{
  _id: "...",
  name: "Your Name",
  email: "email@example.com",
  role: "State-Admin",  // ← Should be exactly "State-Admin"
  state: "YourState",
  isActive: true,
  token: "eyJhbG..."
}
```

**Check:**
- ✅ `role` field exists
- ✅ `role` value is exactly `"State-Admin"` (case-sensitive)
- ✅ `isActive` is `true`
- ✅ `token` exists and is not empty

### Step 2: Check Browser Console Logs

When you try to access `/reports` or `/analytics`, check the console for these messages:

**Success Messages:**
```
ReportsPage: Authorization successful
// OR
AnalyticsPage: Authorization successful
```

**Error Messages to Look For:**
```
ReportsPage: No user found, redirecting to login
// OR
AnalyticsPage: Unauthorized role, redirecting to dashboard
```

---

## 🔧 Common Issues & Solutions

### Issue 1: Role Value Mismatch

**Symptom:** Role shows as "state-admin" (lowercase) or "StateAdmin" (no hyphen)

**Solution:** Update the user in database with correct role value:

```javascript
// Using MongoDB shell or Compass
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "State-Admin" } }
)
```

**Valid Role Values:**
- ✅ `"State-Admin"` (correct)
- ❌ `"state-admin"` (wrong - lowercase)
- ❌ `"StateAdmin"` (wrong - no hyphen)
- ❌ `"State Admin"` (wrong - space instead of hyphen)

### Issue 2: User Not Active

**Symptom:** `isActive` is `false`

**Solution:** Activate the user account:

```javascript
// Using MongoDB shell or Compass
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { isActive: true } }
)
```

Then logout and login again.

### Issue 3: Stale Redux State

**Symptom:** LocalStorage has correct role but Redux state has old data

**Solution:**
1. Logout completely
2. Clear browser cache
3. Close all browser tabs
4. Login again

**Alternative Quick Fix:**
```javascript
// In browser console
localStorage.clear();
// Then reload page and login again
```

### Issue 4: Token Expired

**Symptom:** API calls fail with 401 Unauthorized

**Solution:**
1. Logout
2. Login again (generates new token)

### Issue 5: PrivateRoute Not Working

**Symptom:** Getting redirected even though role is correct

**Check App.js Routes:**
```javascript
// Should be:
<Route
  path="/reports"
  element={
    <PrivateRoute roles={['State-Admin', 'MoSJE-Admin']}>
      <ReportsPage />
    </PrivateRoute>
  }
/>
```

**Verify:**
- ✅ `roles` array includes `'State-Admin'`
- ✅ Role name matches exactly (case-sensitive)

---

## 🧪 Testing State-Admin Access

### Test Checklist

1. **Login Test**
   ```
   - [ ] Login as State-Admin user
   - [ ] Check localStorage has correct role
   - [ ] Check Redux state has user object
   ```

2. **Sidebar Test**
   ```
   - [ ] "Reports" menu item is visible
   - [ ] "Analytics" menu item is visible
   - [ ] Both menu items are clickable
   ```

3. **Navigation Test**
   ```
   - [ ] Click "Reports" - should navigate to /reports
   - [ ] Page loads without redirect
   - [ ] Click "Analytics" - should navigate to /analytics
   - [ ] Page loads without redirect
   ```

4. **Direct Access Test**
   ```
   - [ ] Type /reports in URL bar
   - [ ] Should not redirect
   - [ ] Type /analytics in URL bar
   - [ ] Should not redirect
   ```

5. **Data Fetch Test**
   ```
   - [ ] Reports page shows statistics
   - [ ] No "unauthorized" errors in console
   - [ ] Analytics page shows charts
   - [ ] No "unauthorized" errors in console
   ```

---

## 🔍 Debug Mode

Add this code temporarily to debug:

### In ReportsPage.jsx (after imports):

```javascript
const ReportsPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // DEBUG: Log user info
  console.log('=== REPORTS PAGE DEBUG ===');
  console.log('User object:', user);
  console.log('User role:', user?.role);
  console.log('Role type:', typeof user?.role);
  console.log('Is State-Admin?', user?.role === 'State-Admin');
  console.log('Is MoSJE-Admin?', user?.role === 'MoSJE-Admin');
  console.log('========================');

  // Rest of the code...
}
```

### Expected Console Output for State-Admin:

```
=== REPORTS PAGE DEBUG ===
User object: {_id: "...", name: "...", email: "...", role: "State-Admin", ...}
User role: State-Admin
Role type: string
Is State-Admin? true
Is MoSJE-Admin? false
========================
```

---

## 🛠️ Manual Fix Script

If you need to manually fix a State-Admin user in the database:

```javascript
// MongoDB shell script
use janconnect; // or your database name

// Find the user
db.users.find({ email: "state-admin@example.com" });

// Update role and activate
db.users.updateOne(
  { email: "state-admin@example.com" },
  { 
    $set: { 
      role: "State-Admin",
      isActive: true 
    } 
  }
);

// Verify update
db.users.find({ email: "state-admin@example.com" });
```

---

## 📋 Authorization Flow Diagram

```
State-Admin tries to access /reports
            ↓
1. App.js <PrivateRoute> Check
   - Is user logged in? ✅
   - Is role in ['State-Admin', 'MoSJE-Admin']? ✅
   - Continue to page
            ↓
2. ReportsPage useEffect Check
   - Does user object exist? ✅
   - Continue rendering
            ↓
3. API Calls with Token
   - GET /api/projects with Bearer token
   - Backend validates token ✅
   - Returns data
            ↓
   ✅ Page displays successfully
```

---

## 🔐 Current Authorization Settings

### Allowed Roles:

**Reports Page:**
- ✅ MoSJE-Admin
- ✅ State-Admin
- ❌ Agency-User

**Analytics Page:**
- ✅ MoSJE-Admin
- ✅ State-Admin
- ❌ Agency-User

### Code Locations:

**PrivateRoute Check:**
```javascript
// File: client/src/App.js
<PrivateRoute roles={['State-Admin', 'MoSJE-Admin']}>
```

**Sidebar Visibility:**
```javascript
// File: client/src/components/Sidebar.jsx
show: canManageProjects  // true for both MoSJE-Admin and State-Admin
```

**useRole Hook:**
```javascript
// File: client/src/hooks/useAuth.js
const canManageProjects = isAdmin || isStateAdmin;
// isStateAdmin = user?.role === 'State-Admin'
```

---

## ✅ Verification Checklist

Before concluding State-Admin cannot access, verify:

- [ ] User role is exactly `"State-Admin"` (case-sensitive)
- [ ] User `isActive` is `true`
- [ ] User has a valid token
- [ ] localStorage and Redux state are in sync
- [ ] No browser cache issues
- [ ] No console errors about unauthorized
- [ ] Sidebar shows "Reports" and "Analytics" menu items
- [ ] PrivateRoute roles array includes `'State-Admin'`
- [ ] Backend routes allow State-Admin role
- [ ] No network errors (check Network tab)

---

## 🎯 Expected Behavior

### For State-Admin:

1. **Login:** ✅ Can login successfully
2. **Dashboard:** ✅ Can access dashboard
3. **Projects:** ✅ Can view/create/edit projects in their state
4. **Agencies:** ✅ Can manage agencies in their state
5. **Reports:** ✅ **Should have access** to generate reports
6. **Analytics:** ✅ **Should have access** to view analytics
7. **All Users:** ❌ Cannot access (MoSJE-Admin only)
8. **Settings:** ❌ Cannot access (MoSJE-Admin only)

---

## 📞 Still Not Working?

If State-Admin still cannot access Reports/Analytics after all checks:

### Collect This Information:

1. **User Object from Console:**
   ```javascript
   JSON.parse(localStorage.getItem('user'))
   ```

2. **Redux State:**
   ```javascript
   // In Redux DevTools or console
   store.getState().auth.user
   ```

3. **Console Errors:**
   - Screenshot of browser console
   - Any error messages in red

4. **Network Tab:**
   - Check if API calls are failing
   - Look for 401/403 responses

5. **Browser Info:**
   - Browser name and version
   - Private/Incognito mode or normal?

### Last Resort: Hard Reset

```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
// Reload page
location.reload();
// Login again
```

---

## 🎉 Success Criteria

State-Admin access is working correctly when:

1. ✅ Can see "Reports" and "Analytics" in sidebar
2. ✅ Can click and navigate to both pages
3. ✅ Pages load without redirecting
4. ✅ Statistics/charts display properly
5. ✅ Can generate and download reports
6. ✅ Can export analytics data
7. ✅ No "unauthorized" messages anywhere
8. ✅ Console shows no errors

---

**Document Version**: 1.0  
**Last Updated**: October 13, 2024  
**Issue Status**: Under Investigation  

If the issue persists after following this guide, there may be a deeper configuration or database issue that needs code-level debugging.
