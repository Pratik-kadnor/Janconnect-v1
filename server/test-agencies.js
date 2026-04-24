const mongoose = require('mongoose');
require('dotenv').config();

const Agency = require('./models/agencyModel');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('✓ Connected to MongoDB');
  
  const count = await Agency.countDocuments();
  console.log(`📊 Total agencies in database: ${count}`);
  
  if (count > 0) {
    const agencies = await Agency.find().limit(3);
    console.log('\n📋 Sample agencies:');
    agencies.forEach(ag => {
      console.log(`  - ${ag.name} (${ag.type}, ${ag.state})`);
    });
  } else {
    console.log('\n⚠️  No agencies found! Run: npm run seed');
  }
  
  process.exit(0);
})
.catch(err => {
  console.error('✗ Error:', err.message);
  process.exit(1);
});
