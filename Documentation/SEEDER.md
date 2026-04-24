# Database Seeder Documentation

## Overview
The JanConnect project includes a comprehensive database seeder that populates MongoDB with realistic demo data for testing and development purposes.

## What Data is Seeded?

### 1. Agencies (8 total)
**Maharashtra (3 agencies):**
- Social Justice Department Maharashtra (Implementing)
- Municipal Corporation Pune (Executing)
- Zilla Parishad Nagpur (Executing)

**Uttar Pradesh (3 agencies):**
- Directorate of Social Welfare UP (Implementing)
- Nagar Nigam Lucknow (Executing)
- District Administration Varanasi (Executing)

**Tamil Nadu (2 agencies):**
- Adi Dravidar and Tribal Welfare Department (Implementing)
- Greater Chennai Corporation (Executing)

### 2. Users (5 total)
All users have the password: `password123`

| Email | Role | State | Access Level |
|-------|------|-------|--------------|
| admin@example.com | MoSJE-Admin | - | Full system access |
| state.mh@example.com | State-Admin | Maharashtra | Maharashtra projects only |
| state.up@example.com | State-Admin | Uttar Pradesh | UP projects only |
| agency.pune@example.com | Agency-User | Maharashtra | Pune MC projects only |
| agency.lucknow@example.com | Agency-User | Uttar Pradesh | Lucknow NN projects only |

### 3. Projects (10 total)
- Distributed across Maharashtra, Uttar Pradesh, and Tamil Nadu
- Mix of Adarsh Gram, GIA, and Hostel components
- Various statuses: Sanctioned, In-Progress, Completed, Delayed
- Each project includes:
  - Complete financial details (sanctioned, released, utilized amounts)
  - Multiple milestones with deadlines and completion status
  - Beneficiary information
  - Linked implementing and executing agencies

## How to Use the Seeder

### Prerequisites
1. MongoDB must be running
2. Environment variables must be configured (`.env` file in server directory)
3. Required packages must be installed (`npm install` in server directory)

### Import Demo Data
```bash
cd server
npm run seed
```

**Expected Output:**
```
🚀 Starting Database Seeder...
📦 MongoDB Connected...
✅ Step 1: 8 Agencies inserted
✅ Step 2: 5 Users inserted
✅ Step 3: 10 Projects inserted
✅ Data imported successfully!
```

### Delete All Data (Clean Reset)
```bash
cd server
npm run seed:destroy
```

**Expected Output:**
```
🚀 Starting Database Cleanup...
📦 MongoDB Connected...
✅ Projects deleted
✅ Users deleted
✅ Agencies deleted
✅ All data destroyed successfully!
```

## Login Credentials for Testing

After running the seeder, you can login with any of these accounts:

### MoSJE Admin (Full Access)
- **Email:** admin@example.com
- **Password:** password123
- **Access:** All states, all projects, full CRUD operations

### State Admin - Maharashtra
- **Email:** state.mh@example.com
- **Password:** password123
- **Access:** Maharashtra projects only, can create/edit/delete state projects

### State Admin - Uttar Pradesh
- **Email:** state.up@example.com
- **Password:** password123
- **Access:** UP projects only, can create/edit/delete state projects

### Agency User - Pune
- **Email:** agency.pune@example.com
- **Password:** password123
- **Access:** View and update milestones for Pune MC projects

### Agency User - Lucknow
- **Email:** agency.lucknow@example.com
- **Password:** password123
- **Access:** View and update milestones for Lucknow NN projects

## Technical Details

### File Structure
```
server/
├── data/
│   └── demoData.js       # Demo data definitions
├── utils/
│   └── seeder.js         # Seeder script logic
└── package.json          # Contains seed scripts
```

### Seeding Process
The seeder follows a specific order to maintain referential integrity:

1. **Agencies First**: Inserts all agencies and stores their ObjectIds
2. **Users Second**: 
   - Hashes passwords using bcrypt
   - Links Agency-Users to their agencies using `agencyName`
   - Stores user ObjectIds for project linking
3. **Projects Last**:
   - Links to implementing and executing agencies
   - Links to created-by users
   - Includes complete milestone and financial data

### Destruction Process
Data is deleted in reverse order to avoid reference errors:
1. Projects (depends on agencies and users)
2. Users (depends on agencies)
3. Agencies (no dependencies)

## Troubleshooting

### "MongoDB connection error"
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Verify network connectivity

### "Cannot find module"
- Run `npm install` in the server directory
- Ensure you're in the correct directory

### "Duplicate key error"
- Run `npm run seed:destroy` first to clean existing data
- Then run `npm run seed` again

### "Agency not found" during seeding
- This indicates the agency names in users/projects don't match
- Check `demoData.js` for consistency

## Best Practices

1. **Development**: Run seeder whenever you need fresh data
2. **Testing**: Use `seed:destroy` then `seed` for clean test environment
3. **Production**: Never run seeder on production databases
4. **Git**: The `.env` file is gitignored - configure it locally

## Related Documentation
- [README.md](./README.md) - Complete project documentation
- [SETUP.md](./SETUP.md) - Quick start guide
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Project overview
