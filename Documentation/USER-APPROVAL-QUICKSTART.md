# 🎉 User Approval & Email Notification - Quick Setup

## ✅ What's Been Implemented

### Backend
- ✅ Email service utility (`server/utils/emailService.js`)
- ✅ Approval/Rejection endpoints
- ✅ Automatic email notifications on approval
- ✅ HTML email templates (professional design)
- ✅ Development mode (console logging)
- ✅ Production mode (SMTP ready)

### Frontend
- ✅ Pending Users page (`/pending-users`)
- ✅ Admin-only access control
- ✅ Approve/Reject buttons
- ✅ Rejection reason modal
- ✅ Navigation link in sidebar
- ✅ Real-time list updates

---

## 🚀 Quick Start

### 1. Install Nodemailer (If Not Installed)

```powershell
cd d:\SIH\JanConnect\server
npm install nodemailer
```

### 2. Restart Backend Server

```powershell
cd d:\SIH\JanConnect\server
node server.js
```

### 3. Restart Frontend Client

```powershell
cd d:\SIH\JanConnect\client
npm start
```

---

## 🎯 How to Use

### For End Users:
1. Register at `/signup`
2. Fill registration form
3. Submit and wait for admin approval
4. Receive email when approved
5. Login with credentials

### For Admins:
1. Login as admin
2. Click "Pending Users" in sidebar
3. Review pending registrations
4. Click "✅ Approve" or "❌ Reject"
5. User receives email notification automatically

---

## 📧 Email Configuration (Optional)

### Development Mode (Default)
Emails logged to console - **No configuration needed!**

### Production Mode (When deploying)
Add to `server/.env`:

```bash
# Gmail Example
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="JanConnect <noreply@janconnect.gov.in>"
```

---

## 🧪 Test the System

### 1. Register a Test User
- Go to `/signup`
- Fill form: Test User / test@example.com
- Select role: Agency-User
- Choose an agency
- Password: test123
- Submit

### 2. Admin Approves
- Login as admin: `admin@example.com` / `password123`
- Click "Pending Users" in sidebar
- See test user in list
- Click "✅ Approve"

### 3. Check Email (Dev Mode)
- Look at backend terminal
- Should see email notification logged:
```
📧 ========== EMAIL NOTIFICATION ==========
To: test@example.com
Subject: 🎉 Your JanConnect Account Has Been Approved
...
```

### 4. User Can Login
- Go to `/login`
- Login: test@example.com / test123
- Should work! ✅

---

## 🎨 What You'll See

### Pending Users Page
- **Header**: "Pending User Approvals"
- **Stats Card**: Count of pending users
- **User Cards**: Each user with:
  - Avatar (first letter)
  - Name, email, role
  - Agency/State info
  - Registration date
  - Approve/Reject buttons

### Email Templates
- **Approval Email**:
  - Professional HTML design
  - Green gradient header with ✅
  - Account details
  - Login button
  - Support info

- **Rejection Email**:
  - Professional HTML design
  - Red gradient header with ❌
  - Rejection reason
  - Contact information

---

## 📍 Important URLs

| URL | Description | Access |
|-----|-------------|--------|
| `/signup` | User registration | Public |
| `/pending-users` | Approve/reject users | Admin only |
| `/login` | User login | Public |

---

## 🔧 Troubleshooting

### Backend won't start?
```powershell
# Install nodemailer
cd d:\SIH\JanConnect\server
npm install nodemailer
node server.js
```

### Frontend errors?
```powershell
# Restart client
cd d:\SIH\JanConnect\client
npm start
```

### Can't see "Pending Users" link?
- Must be logged in as MoSJE-Admin
- Check user role in database

### Emails not showing in console?
- Check backend terminal output
- Should see logs when approve/reject clicked

---

## ✨ Key Features

1. **One-Click Approval**: Admin approves with single click
2. **Auto Email**: Professional email sent automatically
3. **Rejection Reason**: Admin can provide feedback
4. **Real-Time Updates**: List refreshes after actions
5. **Beautiful UI**: Modern design with cards and badges
6. **Secure**: Only admins can approve/reject
7. **Non-Blocking**: Email failure won't break approval
8. **Dev-Friendly**: Console logging in development

---

## 📚 Full Documentation

See [USER-APPROVAL-EMAIL-SYSTEM.md](./USER-APPROVAL-EMAIL-SYSTEM.md) for complete details.

---

**Ready to Test!** 🎉

Run both servers → Register user → Admin approves → Email sent → User logs in!

