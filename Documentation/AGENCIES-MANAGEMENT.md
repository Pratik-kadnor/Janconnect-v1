# 🏢 Agencies Management Documentation

## Overview

The Agencies Management feature provides a comprehensive interface for managing implementing and executing agencies under the PM-AJAY scheme. This feature allows administrators to create, view, edit, and manage agencies across different states.

---

## ✨ Features

### 1. **Comprehensive Agency List**
- Grid layout with agency cards
- Real-time statistics dashboard
- Search and filter capabilities
- Role-based access control
- Responsive design for all devices

### 2. **CRUD Operations**
- **Create**: Add new agencies with full details
- **Read**: View all agencies with filtering
- **Update**: Edit agency information
- **Delete**: Remove agencies (MoSJE-Admin only)

### 3. **Advanced Filtering**
- Search by agency name
- Filter by type (Implementing/Executing)
- Filter by state
- Filter by status (Active/Inactive)

### 4. **Role-Based Access**
- **MoSJE-Admin**: Full access (create, edit, delete, view all)
- **State-Admin**: Create & edit agencies in their state, view all
- **Agency-User**: View only (read-only access)

### 5. **Statistics Dashboard**
- Total agencies count
- Implementing agencies count
- Executing agencies count
- Active agencies count

---

## 🎨 UI Components

### Agency Card
Each agency is displayed in a beautiful card with:
- Agency name
- Type badge (Implementing/Executing)
- Status badge (Active/Inactive)
- Location (State and District)
- Address
- Nodal Officer details (Name, Email, Phone)
- Action buttons (Edit, Delete)

### Stats Cards
Four stat cards showing:
1. **Total Agencies** - Blue icon
2. **Implementing** - Green icon
3. **Executing** - Purple icon
4. **Active** - Emerald icon

### Create/Edit Modal
Full-screen modal with form sections:
1. Basic Information
   - Agency Name
   - Agency Type
   - State & District
   - Address
2. Nodal Officer Details
   - Name
   - Email
   - Phone (10-digit validation)
3. Status (Active checkbox)

---

## 📊 Data Model

### Agency Schema
```javascript
{
  _id: ObjectId,
  name: String (required),
  type: 'Implementing' | 'Executing' (required),
  state: String (required),
  district: String (optional),
  nodalOfficer: {
    name: String (required),
    email: String (required, validated),
    phone: String (required, 10 digits)
  },
  address: String (optional),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 API Endpoints

### Get All Agencies
```
GET /api/agencies
Authorization: Bearer <token>
Query Parameters:
  - type: 'Implementing' | 'Executing'
  - state: String
  - isActive: Boolean
```

### Get Single Agency
```
GET /api/agencies/:id
Authorization: Bearer <token>
```

### Create Agency
```
POST /api/agencies
Authorization: Bearer <token>
Roles: State-Admin, MoSJE-Admin
Body: {
  name, type, state, district,
  nodalOfficer: { name, email, phone },
  address, isActive
}
```

### Update Agency
```
PUT /api/agencies/:id
Authorization: Bearer <token>
Roles: State-Admin, MoSJE-Admin
Body: Same as create
```

### Delete Agency
```
DELETE /api/agencies/:id
Authorization: Bearer <token>
Roles: MoSJE-Admin only
```

### Get Public Agencies (for signup)
```
GET /api/agencies/public
No authorization required
Returns only active agencies
```

---

## 🎯 Redux State Management

### State Structure
```javascript
{
  agencies: [],
  selectedAgency: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: ''
}
```

### Actions
- `getAgencies(filters)` - Fetch all agencies with optional filters
- `getAgencyById(id)` - Fetch single agency
- `createAgency(agencyData)` - Create new agency
- `updateAgency({ id, agencyData })` - Update existing agency
- `deleteAgency(id)` - Delete agency
- `reset()` - Reset state
- `clearSelectedAgency()` - Clear selected agency

### Usage Example
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { getAgencies } from '../redux/agencySlice';

const { agencies, isLoading } = useSelector((state) => state.agencies);

// Fetch all implementing agencies
dispatch(getAgencies({ type: 'Implementing' }));

// Fetch agencies in Maharashtra
dispatch(getAgencies({ state: 'Maharashtra' }));

// Fetch only active agencies
dispatch(getAgencies({ isActive: true }));
```

---

## 🔐 Access Control

### Permission Matrix

| Action | MoSJE-Admin | State-Admin | Agency-User |
|--------|-------------|-------------|-------------|
| View All Agencies | ✅ | ✅ | ✅ |
| View State Agencies | ✅ | ✅ (own state) | ✅ |
| Create Agency | ✅ | ✅ (own state) | ❌ |
| Edit Agency | ✅ | ✅ (own state) | ❌ |
| Delete Agency | ✅ | ❌ | ❌ |
| View Statistics | ✅ | ✅ | ✅ |

### Backend Filtering
- **State-Admin**: Automatically filtered to show only agencies in their state
- **MoSJE-Admin**: Can view and manage agencies across all states
- **Agency-User**: Read-only access to all agencies

---

## 📱 Responsive Design

### Desktop (lg: 1024px+)
- 2-column grid for agency cards
- Full navbar with all options
- Modal with 2-column form layout
- All stats cards in single row

### Tablet (md: 768px)
- 2-column grid for agency cards
- 2-column form in modal
- Stats cards in 2x2 grid

### Mobile (< 768px)
- Single column layout
- Stacked form fields
- Scrollable modal
- Stacked stats cards

---

## 🎨 Color Scheme

### Type Badges
- **Implementing**: Blue (`bg-blue-100 text-blue-800`)
- **Executing**: Purple (`bg-purple-100 text-purple-800`)

### Status Badges
- **Active**: Green (`bg-green-100 text-green-800`)
- **Inactive**: Red (`bg-red-100 text-red-800`)

### Action Buttons
- **Edit**: Blue (`text-blue-600 hover:bg-blue-50`)
- **Delete**: Red (`text-red-600 hover:bg-red-50`)
- **Create**: Primary (`bg-primary-600`)

---

## 🔍 Search & Filter

### Search
- Real-time search by agency name
- Case-insensitive
- Updates as you type

### Filters
1. **Type Filter**: All Types, Implementing, Executing
2. **State Filter**: All States + 28 Indian states
3. **Status Filter**: All Status, Active, Inactive

### Combined Filtering
- All filters work together
- Backend filtering for type, state, isActive
- Frontend filtering for search term
- Efficient and performant

---

## 📝 Form Validation

### Required Fields
- Agency Name ✅
- Agency Type ✅
- State ✅
- Nodal Officer Name ✅
- Nodal Officer Email ✅
- Nodal Officer Phone ✅

### Optional Fields
- District
- Address

### Validation Rules
- **Email**: Must be valid email format
- **Phone**: Must be exactly 10 digits
- **Name**: Cannot be empty
- **State**: Must select from dropdown

---

## 🎬 User Workflows

### Create New Agency
1. Click "Add Agency" button
2. Fill in agency details
   - Basic info (name, type, state, district, address)
   - Nodal officer details (name, email, phone)
   - Set active status
3. Click "Create"
4. Success message shown
5. Modal closes
6. Agency appears in list

### Edit Existing Agency
1. Click edit icon on agency card
2. Modal opens with pre-filled data
3. Modify fields as needed
4. Click "Update"
5. Success message shown
6. Modal closes
7. Agency card updates

### Delete Agency
1. Click delete icon (MoSJE-Admin only)
2. Confirmation modal appears
3. Confirm deletion
4. Agency removed from list
5. Success message shown

### Filter Agencies
1. Use search box for name search
2. Select type from dropdown
3. Select state from dropdown
4. Select status from dropdown
5. List updates automatically

---

## 🚀 Integration with Other Features

### Projects Integration
- Agencies are referenced in projects
- `implementingAgency` field links to agency
- `executingAgency` field links to agency
- Projects show agency details

### User Management
- Agency-Users are linked to specific agencies
- State-Admins manage agencies in their state
- Signup page uses public agencies API

### Seeder Integration
- Demo agencies created during seeding
- Used for sample projects
- Pre-populated nodal officers

---

## 🧪 Testing Guide

### Manual Testing Checklist

#### Viewing Agencies
- [ ] All agencies displayed correctly
- [ ] Stats cards show correct counts
- [ ] Agency cards show all information
- [ ] Badges display correct colors
- [ ] Nodal officer details visible

#### Creating Agency
- [ ] Modal opens on "Add Agency" click
- [ ] All fields present
- [ ] State dropdown populated
- [ ] Form validation works
- [ ] Success message shown
- [ ] Agency added to list

#### Editing Agency
- [ ] Edit button visible (admins only)
- [ ] Modal pre-fills with existing data
- [ ] Changes save correctly
- [ ] Success message shown
- [ ] Card updates immediately

#### Deleting Agency
- [ ] Delete button visible (MoSJE-Admin only)
- [ ] Confirmation modal appears
- [ ] Cancel works
- [ ] Delete removes agency
- [ ] Success message shown

#### Filters
- [ ] Search filters by name
- [ ] Type filter works
- [ ] State filter works
- [ ] Status filter works
- [ ] Combined filters work
- [ ] Clear filters shows all

#### Permissions
- [ ] MoSJE-Admin has full access
- [ ] State-Admin can manage own state
- [ ] Agency-User has read-only access
- [ ] Delete only for MoSJE-Admin

#### Responsive
- [ ] Desktop view works
- [ ] Tablet view works
- [ ] Mobile view works
- [ ] Modal scrollable on small screens

---

## 🐛 Common Issues & Solutions

### Issue: Agencies not loading
**Solution**: Check if backend is running and API route is correct

### Issue: State-Admin sees all agencies
**Solution**: Backend automatically filters by state in `getAgencies` controller

### Issue: Phone validation failing
**Solution**: Ensure phone number is exactly 10 digits, no spaces or dashes

### Issue: Delete not working
**Solution**: Check if user is MoSJE-Admin (only they can delete)

### Issue: Modal not closing after save
**Solution**: Check if success message contains "successfully"

---

## 📈 Performance Considerations

### Optimizations
1. **Backend Pagination**: Can add pagination for large datasets
2. **Debounced Search**: Search debounced to reduce re-renders
3. **Memoization**: Consider memoizing filtered results
4. **Lazy Loading**: Modal components lazy loaded
5. **Index Usage**: MongoDB indexes on state, type, name

### Current Limits
- No pagination (loads all agencies)
- Suitable for up to ~500 agencies
- Consider adding pagination if more

---

## 🔮 Future Enhancements

### Planned Features
1. **Bulk Import**: CSV/Excel import for agencies
2. **Bulk Export**: Download agencies as CSV
3. **Advanced Analytics**: Agency-wise project statistics
4. **Email Notifications**: Notify nodal officers on assignment
5. **Document Uploads**: Store agency documents
6. **Contact History**: Track communications with agencies
7. **Performance Ratings**: Rate agency performance
8. **Geo-mapping**: Map view of agencies
9. **Audit Log**: Track all agency changes
10. **Multi-language**: Support for regional languages

---

## 📁 File Structure

```
client/src/
├── pages/
│   └── AgenciesPage.jsx        # Main agencies page (765 lines)
├── redux/
│   ├── agencySlice.js          # Redux slice for agencies (200 lines)
│   └── store.js                # Redux store (updated)
└── App.js                      # Route configuration (updated)

server/
├── controllers/
│   └── agencyController.js     # Agency CRUD operations
├── models/
│   └── agencyModel.js          # Agency schema
└── routes/
    └── agencyRoutes.js         # Agency API routes
```

---

## 🔗 Related Documentation

- [User Management](./USER-MANAGEMENT.md)
- [Project Management](./PROJECT-MANAGEMENT.md)
- [Role-Based Access Control](./RBAC.md)
- [API Documentation](./API-DOCUMENTATION.md)

---

## 📞 Nodal Officer Contact Info

Each agency card displays:
- 👤 **Name**: Direct contact person
- 📧 **Email**: Clickable `mailto:` link
- 📞 **Phone**: Clickable `tel:` link

All contact information is validated and required.

---

## 🎓 Usage Examples

### Example 1: Create Implementing Agency
```javascript
const agencyData = {
  name: "Maharashtra Social Welfare Department",
  type: "Implementing",
  state: "Maharashtra",
  district: "Mumbai",
  nodalOfficer: {
    name: "Rajesh Kumar",
    email: "rajesh.k@mahagov.in",
    phone: "9876543210"
  },
  address: "Mantralaya, Mumbai - 400032",
  isActive: true
};

dispatch(createAgency(agencyData));
```

### Example 2: Filter Agencies by State
```javascript
// Get all implementing agencies in Maharashtra
dispatch(getAgencies({
  type: 'Implementing',
  state: 'Maharashtra',
  isActive: true
}));
```

### Example 3: Update Agency Status
```javascript
const updatedData = {
  ...existingAgency,
  isActive: false
};

dispatch(updateAgency({
  id: agencyId,
  agencyData: updatedData
}));
```

---

**Status**: ✅ Complete & Production Ready  
**Created**: October 13, 2025  
**Version**: 1.0.0  
**Lines of Code**: ~965 (Page: 765, Slice: 200)

🎉 Full-featured Agencies Management ready for production use!
