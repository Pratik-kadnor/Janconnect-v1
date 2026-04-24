# ⚙️ Settings Page - Quick Reference

## 🎯 Quick Access

**URL**: `http://localhost:3000/settings`  
**Sidebar**: Click "Settings" menu item (bottom of list)  
**Access**: MoSJE-Admin only

---

## 📋 6 Main Tabs

### 1️⃣ Profile
**What**: Update admin profile information  
**Fields**: Name, Email, Phone, Designation, Organization  
**Action**: Save Profile button  
**API**: `PUT /api/users/me` ✅ Connected

### 2️⃣ Security
**What**: Change password & security settings  
**Features**:
- Change password form (current, new, confirm)
- Two-factor authentication toggle
- Password policies (expiry, min length, max attempts)
- Lockout settings

**Actions**: 
- Change Password button ✅ Connected
- Save Security Settings button ⚠️ Mock

### 3️⃣ Notifications
**What**: Configure email notification preferences  
**Options**:
- Master toggle (enable/disable all)
- Project Updates
- Agency Requests
- User Registrations
- System Alerts
- Weekly Reports
- Monthly Reports

**Action**: Save Notification Settings ⚠️ Mock

### 4️⃣ Email
**What**: Configure SMTP server for outgoing emails  
**Fields**: SMTP Host, Port, Username, Password, From Email, From Name  
**Actions**:
- Save Email Settings ⚠️ Mock
- Send Test Email 📝 Future

### 5️⃣ System
**What**: System-wide configuration  
**Toggles**:
- 🔴 Maintenance Mode (red = danger)
- Allow Public Registrations
- Require Admin Approval

**Settings**:
- Session Timeout (minutes)
- Max Upload Size (MB)
- Backup Frequency (dropdown)
- Log Level (dropdown)

**Action**: Save System Settings ⚠️ Mock

### 6️⃣ Advanced
**What**: Database management & critical operations  
**Info Display**:
- Database Size
- Last Backup timestamp

**Actions**:
- 🔵 Backup Database (initiates backup)
- 🟢 Import Data (restore from backup)
- 🟠 Clean Database (remove old logs)
- 🔴 Reset System (danger!)

**Extra**: IP Whitelist textarea

---

## 📊 Statistics Cards (Top of Page)

| Card | Color | Shows |
|------|-------|-------|
| Total Users | Blue | User count |
| Total Projects | Green | Project count |
| Total Agencies | Purple | Agency count |
| System Uptime | Orange | 99.9% |

---

## 🔄 Status Legend

- ✅ **Connected** = Working with backend API
- ⚠️ **Mock** = Simulated (shows success but doesn't persist)
- 📝 **Future** = Planned feature (not yet implemented)

---

## 🚀 Quick Tasks

### Change Your Password
1. Settings > Security tab
2. Enter current password
3. Enter new password (8+ chars)
4. Confirm new password
5. Click "Change Password"
6. Done! ✅

### Enable Maintenance Mode
1. Settings > System tab
2. Toggle "Maintenance Mode" ON (🔴 red)
3. Click "Save System Settings"
4. Public access now disabled

### Backup Database
1. Settings > Advanced tab
2. Click "Backup Now" button
3. Check email for backup link

### Update Email Notifications
1. Settings > Notifications tab
2. Enable "Email Notifications"
3. Select notification types
4. Click "Save Notification Settings"

---

## ⚠️ Important Notes

### Admin Only
- Only MoSJE-Admin can access
- State-Admin redirected to dashboard
- Agency-User redirected to dashboard

### Data Persistence
- **Profile updates** = Real (persisted) ✅
- **Password changes** = Real (persisted) ✅
- **Other settings** = Mock (not persisted yet) ⚠️

### Dangerous Actions
- Maintenance Mode = Disables public access
- Reset System = Resets all settings
- Clean Database = Removes data
- Always double-check before confirming!

---

## 🎨 UI Features

### Interactive Elements
- **Toggle Switches** - Slide to enable/disable
- **Password Visibility** - Eye icon to show/hide
- **Tabs** - Click to switch sections
- **Success Messages** - Green, auto-dismiss in 3s
- **Error Messages** - Red, stay until next action

### Responsive
- Desktop: 4-column stats, 2-column forms
- Tablet: 2-column stats, 2-column forms
- Mobile: Single column stacked

### Dark Mode
- Full dark mode support
- Automatic theme detection
- All elements styled for both themes

---

## 🔍 Testing Checklist

Quick test for each role:

**MoSJE-Admin:**
- [ ] Can see "Settings" in sidebar
- [ ] Can access /settings page
- [ ] All 6 tabs work
- [ ] Can update profile
- [ ] Can change password
- [ ] Stats cards show numbers

**State-Admin:**
- [ ] Cannot see "Settings" in sidebar
- [ ] Redirects from /settings to /dashboard

**Agency-User:**
- [ ] Cannot see "Settings" in sidebar
- [ ] Redirects from /settings to /dashboard

---

## 📞 Troubleshooting

### "Settings" not showing in sidebar
- Check user role: Must be MoSJE-Admin
- Check Sidebar.jsx: should have `show: isAdmin`
- Logout and login again

### Redirected when accessing /settings
- Check user role in localStorage: `JSON.parse(localStorage.getItem('user')).role`
- Must be exactly "MoSJE-Admin"
- Check PrivateRoute in App.js

### Profile update fails
- Check backend server is running
- Check token is valid
- Check API endpoint `/api/users/me` exists
- Check network tab for errors

### Password change fails
- Current password must be correct
- New password must be 8+ characters
- Passwords must match
- Check backend endpoint `/api/users/password`

---

## 🎯 Common Use Cases

### 1. First Time Setup
1. Login as admin
2. Go to Settings > Profile
3. Update your information
4. Go to Email tab
5. Configure SMTP settings
6. Go to System tab
7. Review default settings
8. Save all tabs

### 2. Security Hardening
1. Settings > Security
2. Change default password
3. Enable 2FA toggle
4. Set password expiry to 90 days
5. Set max login attempts to 5
6. Enable special characters requirement
7. Save settings

### 3. Before System Update
1. Settings > Advanced
2. Click "Backup Database"
3. Wait for email confirmation
4. Download backup file
5. Proceed with update

### 4. Troubleshooting Emails
1. Settings > Email tab
2. Verify SMTP settings
3. Click "Send Test Email"
4. Check inbox
5. Adjust settings if needed

---

## 📊 Statistics Explained

**Total Users**: All registered users (all roles)  
**Total Projects**: All projects (all states, all statuses)  
**Total Agencies**: All registered agencies (active + inactive)  
**System Uptime**: Server availability percentage (99.9% target)

---

## 🔐 Security Best Practices

1. **Change default password** immediately after first login
2. **Enable 2FA** when feature is available
3. **Set password expiry** to 90 days or less
4. **Limit login attempts** to prevent brute force
5. **Use IP whitelist** in production environments
6. **Regular backups** (at least daily)
7. **Test email** functionality regularly
8. **Review logs** via log level settings
9. **Maintenance mode** during critical updates
10. **Never share** admin credentials

---

## 🚦 Status Indicators

### Toggle Switch Colors
- **Gray** = OFF
- **Blue** = ON (normal settings)
- **Red** = ON (dangerous settings like Maintenance Mode)

### Message Colors
- **Green** = Success ✅
- **Red** = Error ❌
- **Blue** = Info ℹ️
- **Orange** = Warning ⚠️

### Button States
- **Normal** = Ready to click
- **Disabled** = Gray, cannot click (usually while saving)
- **Hover** = Darker shade

---

## 📝 Quick Commands

### Check User Role (Browser Console)
```javascript
JSON.parse(localStorage.getItem('user')).role
// Should return: "MoSJE-Admin"
```

### Check All User Data
```javascript
JSON.parse(localStorage.getItem('user'))
// Shows: {_id, name, email, role, token, ...}
```

### Force Logout
```javascript
localStorage.clear();
window.location.reload();
```

---

## 🎓 Feature Matrix

| Feature | Status | Backend Needed |
|---------|--------|----------------|
| Profile Update | ✅ Working | No (exists) |
| Password Change | ✅ Working | No (exists) |
| 2FA | 📝 UI Only | Yes |
| Notifications | ⚠️ Mock | Yes |
| Email Config | ⚠️ Mock | Yes |
| Test Email | 📝 Planned | Yes |
| System Settings | ⚠️ Mock | Yes |
| Backup Database | 🔵 Simulated | Yes |
| Import Data | 📝 Planned | Yes |
| Clean Database | 🟠 Simulated | Yes |
| Reset System | 🔴 Not Safe | Yes |
| IP Whitelist | 📝 UI Only | Yes (middleware) |

---

## 📚 Related Pages

- **Dashboard** - Overview of system
- **All Users** - Manage all users (admin only)
- **Projects** - Manage projects
- **Agencies** - Manage agencies
- **Reports** - Generate reports
- **Analytics** - View analytics

---

## 🎯 Key Takeaways

1. **Admin Only** - Settings page is exclusive to MoSJE-Admin
2. **6 Sections** - Profile, Security, Notifications, Email, System, Advanced
3. **Real + Mock** - Profile & Password work; others are simulated
4. **Safe to Test** - All actions show feedback; nothing breaks
5. **Future Ready** - UI complete; backend APIs needed for full functionality
6. **Security Focused** - Multiple layers of access control
7. **Professional UX** - Loading states, messages, validation
8. **Responsive** - Works on desktop, tablet, mobile
9. **Dark Mode** - Full support for dark theme
10. **Well Documented** - Comprehensive guides available

---

**Quick Links:**
- 📖 Full Documentation: `Documentation/SETTINGS-PAGE.md`
- 🔧 Component File: `client/src/pages/SettingsPage.jsx`
- 🛣️ Route Config: `client/src/App.js`
- 🔐 Auth Middleware: `server/middleware/authMiddleware.js`

---

**Version**: 1.0  
**Last Updated**: October 13, 2025  
**Status**: ✅ Frontend Complete | ⚠️ Backend APIs Needed
