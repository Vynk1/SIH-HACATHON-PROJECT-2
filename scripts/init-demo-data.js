#!/usr/bin/env node
// scripts/init-demo-data.js

require('dotenv').config();
const mongoose = require('mongoose');
const { createDemoData } = require('../utils/createDemoData');

async function main() {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI;
    const MONGO_DB = process.env.MONGO_DB;
    
    if (!MONGO_URI || !MONGO_DB) {
      throw new Error('MONGO_URI and MONGO_DB environment variables are required');
    }

    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(`${MONGO_URI}${MONGO_DB}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Create demo data
    await createDemoData();
    
    console.log('🎯 Demo data initialization complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('👋 MongoDB connection closed');
    process.exit(0);
  }
}

// Run the script
main();