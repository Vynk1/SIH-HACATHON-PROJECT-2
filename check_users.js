const mongoose = require('mongoose');
const User = require('./models/User');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/swasthya_health_card');
    console.log('Connected to MongoDB');
    
    const users = await User.find({}, 'email full_name').exec();
    console.log('Found users:');
    users.forEach(user => {
      console.log(`Email: ${user.email}, Name: ${user.full_name}`);
    });
    
    const totalUsers = await User.countDocuments();
    console.log(`Total users: ${totalUsers}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkUsers();