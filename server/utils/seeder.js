const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/userModel');
const Agency = require('../models/agencyModel');
const Project = require('../models/projectModel');

// Import demo data
const { agencies, users, projects } = require('../data/demoData');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('\x1b[36m%s\x1b[0m', '✓ MongoDB Connected for Seeding');
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `✗ Error: ${error.message}`);
    process.exit(1);
  }
};

// Import data into database
const importData = async () => {
  try {
    console.log('\x1b[33m%s\x1b[0m', '\n🌱 Starting data import...\n');

    // Step 1: Insert Agencies
    console.log('\x1b[36m%s\x1b[0m', '📋 Importing agencies...');
    const createdAgencies = await Agency.insertMany(agencies);
    console.log('\x1b[32m%s\x1b[0m', `✓ Successfully imported ${createdAgencies.length} agencies\n`);

    // Step 2: Process and Insert Users
    console.log('\x1b[36m%s\x1b[0m', '👥 Importing users...');
    
    // Map users and handle relationships
    const mappedUsers = await Promise.all(
      users.map(async (user) => {
        const userData = { ...user };

        // Hash password
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(user.password, salt);

        // Link agency if user is Agency-User
        if (user.agencyName) {
          const agency = createdAgencies.find(
            (ag) => ag.name === user.agencyName
          );
          if (agency) {
            userData.agency = agency._id;
          } else {
            console.warn('\x1b[33m%s\x1b[0m', `⚠ Warning: Agency "${user.agencyName}" not found for user "${user.name}"`);
          }
          // Remove agencyName as it's not part of the schema
          delete userData.agencyName;
        }

        return userData;
      })
    );

    const createdUsers = await User.insertMany(mappedUsers);
    console.log('\x1b[32m%s\x1b[0m', `✓ Successfully imported ${createdUsers.length} users\n`);

    // Step 3: Process and Insert Projects
    console.log('\x1b[36m%s\x1b[0m', '📁 Importing projects...');

    // Map projects and link agencies
    const mappedProjects = projects.map((project) => {
      const projectData = { ...project };

      // Find and link implementing agency
      const implementingAgency = createdAgencies.find(
        (ag) => ag.name === project.implementingAgency
      );
      if (implementingAgency) {
        projectData.implementingAgency = implementingAgency._id;
      } else {
        console.warn('\x1b[33m%s\x1b[0m', `⚠ Warning: Implementing agency "${project.implementingAgency}" not found for project "${project.title}"`);
      }

      // Find and link executing agency
      const executingAgency = createdAgencies.find(
        (ag) => ag.name === project.executingAgency
      );
      if (executingAgency) {
        projectData.executingAgency = executingAgency._id;
      } else {
        console.warn('\x1b[33m%s\x1b[0m', `⚠ Warning: Executing agency "${project.executingAgency}" not found for project "${project.title}"`);
      }

      // Assign createdBy to the first admin user
      if (createdUsers.length > 0) {
        const adminUser = createdUsers.find(u => u.role === 'MoSJE-Admin');
        projectData.createdBy = adminUser ? adminUser._id : createdUsers[0]._id;
      }

      return projectData;
    });

    const createdProjects = await Project.insertMany(mappedProjects);
    console.log('\x1b[32m%s\x1b[0m', `✓ Successfully imported ${createdProjects.length} projects\n`);

    // Summary
    console.log('\x1b[32m%s\x1b[0m', '═══════════════════════════════════════════');
    console.log('\x1b[32m%s\x1b[0m', '✓ Data Import Completed Successfully!');
    console.log('\x1b[32m%s\x1b[0m', '═══════════════════════════════════════════');
    console.log('\x1b[36m%s\x1b[0m', `\nTotal Records Imported:`);
    console.log(`  • Agencies: ${createdAgencies.length}`);
    console.log(`  • Users: ${createdUsers.length}`);
    console.log(`  • Projects: ${createdProjects.length}`);
    console.log('\n\x1b[33m%s\x1b[0m', 'Demo Login Credentials:');
    console.log('\x1b[0m', '  Admin: admin@example.com / password123');
    console.log('\x1b[0m', '  State Admin (MH): state.mh@example.com / password123');
    console.log('\x1b[0m', '  State Admin (UP): state.up@example.com / password123');
    console.log('\x1b[0m', '  Agency User (Pune): agency.pune@example.com / password123');
    console.log('\x1b[0m', '  Agency User (Lucknow): agency.lucknow@example.com / password123\n');

    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `\n✗ Error importing data: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

// Destroy all data from database
const destroyData = async () => {
  try {
    console.log('\x1b[33m%s\x1b[0m', '\n🗑️  Starting data destruction...\n');

    // Delete all data
    console.log('\x1b[36m%s\x1b[0m', '🔄 Deleting all projects...');
    await Project.deleteMany();
    console.log('\x1b[32m%s\x1b[0m', '✓ Projects deleted\n');

    console.log('\x1b[36m%s\x1b[0m', '🔄 Deleting all users...');
    await User.deleteMany();
    console.log('\x1b[32m%s\x1b[0m', '✓ Users deleted\n');

    console.log('\x1b[36m%s\x1b[0m', '🔄 Deleting all agencies...');
    await Agency.deleteMany();
    console.log('\x1b[32m%s\x1b[0m', '✓ Agencies deleted\n');

    console.log('\x1b[32m%s\x1b[0m', '═══════════════════════════════════════════');
    console.log('\x1b[32m%s\x1b[0m', '✓ All Data Destroyed Successfully!');
    console.log('\x1b[32m%s\x1b[0m', '═══════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `\n✗ Error destroying data: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
};

// Main execution
const runSeeder = async () => {
  // Connect to database
  await connectDB();

  // Check command line arguments
  if (process.argv[2] === '-d') {
    // Destroy data
    await destroyData();
  } else {
    // Import data
    await importData();
  }
};

// Run the seeder
runSeeder();
