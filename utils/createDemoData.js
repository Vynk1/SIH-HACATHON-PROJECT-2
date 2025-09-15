// utils/createDemoData.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const HealthProfile = require('../models/HealthProfile');
const MedicalRecord = require('../models/MedicalRecord');
const File = require('../models/File');
const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');

// Create sample files for demo medical records
async function createSampleFile(userId, filename, content, mimetype = 'text/plain') {
  try {
    const buffer = Buffer.from(content, 'utf8');
    let result;
    let uploadMethod = 'local';

    // Try to use the same storage priority as the main app
    let supabaseStorage;
    try {
      supabaseStorage = require('./supabase');
    } catch (error) {
      supabaseStorage = null;
    }

    // Try Supabase first if configured
    if (supabaseStorage) {
      try {
        result = await supabaseStorage.uploadFile(buffer, filename, mimetype, userId);
        uploadMethod = 'supabase';
        console.log('  📦 Sample file uploaded to Supabase:', filename);
      } catch (supabaseError) {
        console.warn('  ⚠️  Supabase upload failed for sample file, using local:', supabaseError.message);
        supabaseStorage = null;
      }
    }

    // Fallback to local storage
    if (!result) {
      // Ensure uploads directory exists
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Create a unique filename
      const ext = path.extname(filename);
      const uniqueFilename = `${nanoid(12)}${ext}`;
      const filePath = path.join(uploadsDir, uniqueFilename);
      
      // Write the file
      fs.writeFileSync(filePath, content);
      
      result = {
        secure_url: `/uploads/${uniqueFilename}`,
        public_id: uniqueFilename.replace(ext, ''),
        original_filename: filename,
        bytes: buffer.length
      };
      uploadMethod = 'local';
      console.log('  💾 Sample file created locally:', filename);
    }
    
    // Create file record in database
    const fileDoc = await File.create({
      user_id: userId,
      url: result.secure_url,
      public_id: result.public_id,
      filename: filename,
      mime: mimetype,
      size: result.bytes,
      upload_method: uploadMethod
    });
    
    return {
      file_id: fileDoc._id,
      url: fileDoc.url,
      filename: fileDoc.filename,
      mime: fileDoc.mime,
      size: fileDoc.size
    };
  } catch (error) {
    console.error('Error creating sample file:', error);
    return null;
  }
}

const demoUsers = [
  {
    full_name: "Dr. Rajesh Kumar",
    email: "rajesh.kumar@demo.com",
    phone: "9876543210",
    password: "demo123",
    health_profile: {
      dob: new Date('1985-03-15'),
      gender: "male",
      blood_group: "B+",
      weight_kg: 75,
      height_cm: 175,
      allergies: ["Peanuts", "Shellfish"],
      chronic_conditions: ["Hypertension"],
      medications: [
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily" }
      ],
      emergency_contacts: [
        { name: "Priya Kumar", relation: "Wife", phone: "9876543211", notes: "Primary emergency contact" },
        { name: "Arjun Kumar", relation: "Son", phone: "9876543212", notes: "Secondary contact" }
      ],
      primary_physician: { name: "Dr. Sharma", phone: "9876543213" },
      public_emergency_summary: "Hypertensive patient on daily medication. Allergic to peanuts and shellfish."
    },
    medicalRecords: [
      {
        type: "prescription",
        title: "Hypertension Management",
        description: "Regular medication for blood pressure control",
        date_of_visit: new Date('2024-01-15'),
        tags: ["hypertension", "cardiology"],
        visibility: "private"
      },
      {
        type: "report",
        title: "Annual Health Checkup",
        description: "Complete blood count, lipid profile, and cardiac assessment",
        date_of_visit: new Date('2024-02-20'),
        tags: ["checkup", "blood test"],
        visibility: "private"
      },
      {
        type: "diagnosis",
        title: "Type 2 Diabetes Diagnosis",
        description: "Recently diagnosed with Type 2 diabetes mellitus",
        date_of_visit: new Date('2024-03-10'),
        tags: ["diabetes", "endocrinology"],
        visibility: "private"
      }
    ]
  },
  {
    full_name: "Ms. Anita Sharma",
    email: "anita.sharma@demo.com",
    phone: "9876543220",
    password: "demo123",
    health_profile: {
      dob: new Date('1990-07-22'),
      gender: "female",
      blood_group: "A+",
      weight_kg: 62,
      height_cm: 165,
      allergies: ["Aspirin", "Latex"],
      chronic_conditions: ["Asthma"],
      medications: [
        { name: "Salbutamol Inhaler", dosage: "100mcg", frequency: "As needed" },
        { name: "Montelukast", dosage: "10mg", frequency: "Once daily at bedtime" }
      ],
      emergency_contacts: [
        { name: "Vikram Sharma", relation: "Husband", phone: "9876543221", notes: "Primary emergency contact" },
        { name: "Meera Sharma", relation: "Mother", phone: "9876543222", notes: "Lives nearby" }
      ],
      primary_physician: { name: "Dr. Gupta", phone: "9876543223" },
      public_emergency_summary: "Asthmatic patient with aspirin allergy. Carries rescue inhaler."
    },
    medicalRecords: [
      {
        type: "prescription",
        title: "Asthma Management",
        description: "Bronchodilator and controller therapy for asthma",
        date_of_visit: new Date('2024-01-08'),
        tags: ["asthma", "respiratory"],
        visibility: "private"
      },
      {
        type: "report",
        title: "Pulmonary Function Test",
        description: "Spirometry results showing mild obstruction",
        date_of_visit: new Date('2024-02-12'),
        tags: ["pulmonary", "breathing test"],
        visibility: "private"
      }
    ]
  },
  {
    full_name: "Mr. Amit Patel",
    email: "amit.patel@demo.com",
    phone: "9876543230",
    password: "demo123",
    health_profile: {
      dob: new Date('1978-11-05'),
      gender: "male",
      blood_group: "O-",
      weight_kg: 82,
      height_cm: 180,
      allergies: ["Penicillin"],
      chronic_conditions: ["Arthritis", "High Cholesterol"],
      medications: [
        { name: "Ibuprofen", dosage: "400mg", frequency: "As needed for pain" },
        { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily" }
      ],
      emergency_contacts: [
        { name: "Ritu Patel", relation: "Wife", phone: "9876543231", notes: "Works from home" },
        { name: "Kiran Patel", relation: "Brother", phone: "9876543232", notes: "Doctor" }
      ],
      primary_physician: { name: "Dr. Mehta", phone: "9876543233" },
      public_emergency_summary: "Allergic to Penicillin. Has arthritis and high cholesterol."
    },
    medicalRecords: [
      {
        type: "treatment",
        title: "Arthritis Management Plan",
        description: "Physical therapy and anti-inflammatory treatment",
        date_of_visit: new Date('2024-01-22'),
        tags: ["arthritis", "orthopedics"],
        visibility: "private"
      },
      {
        type: "report",
        title: "Lipid Profile",
        description: "Cholesterol levels monitoring",
        date_of_visit: new Date('2024-03-05'),
        tags: ["cholesterol", "cardiology"],
        visibility: "private"
      }
    ]
  },
  {
    full_name: "Mrs. Sunita Verma",
    email: "sunita.verma@demo.com",
    phone: "9876543240",
    password: "demo123",
    health_profile: {
      dob: new Date('1982-09-18'),
      gender: "female",
      blood_group: "AB+",
      weight_kg: 68,
      height_cm: 162,
      allergies: [],
      chronic_conditions: ["Migraine"],
      medications: [
        { name: "Sumatriptan", dosage: "50mg", frequency: "As needed for migraine" },
        { name: "Propranolol", dosage: "40mg", frequency: "Twice daily for prevention" }
      ],
      emergency_contacts: [
        { name: "Rohit Verma", relation: "Husband", phone: "9876543241", notes: "Software engineer" },
        { name: "Kavita Verma", relation: "Sister", phone: "9876543242", notes: "Nurse" }
      ],
      primary_physician: { name: "Dr. Singh", phone: "9876543243" },
      public_emergency_summary: "Suffers from chronic migraines. No known allergies."
    },
    medicalRecords: [
      {
        type: "diagnosis",
        title: "Chronic Migraine Diagnosis",
        description: "Diagnosed with chronic migraine, prescribed preventive medication",
        date_of_visit: new Date('2024-01-30'),
        tags: ["migraine", "neurology"],
        visibility: "private"
      },
      {
        type: "prescription",
        title: "Migraine Prevention",
        description: "Prophylactic treatment for migraine prevention",
        date_of_visit: new Date('2024-02-28'),
        tags: ["migraine", "prevention"],
        visibility: "private"
      }
    ]
  },
  {
    full_name: "Mr. Sanjay Gupta",
    email: "sanjay.gupta@demo.com",
    phone: "9876543250",
    password: "demo123",
    health_profile: {
      dob: new Date('1995-12-08'),
      gender: "male",
      blood_group: "A-",
      weight_kg: 70,
      height_cm: 172,
      allergies: ["Dust", "Pollen"],
      chronic_conditions: ["Allergic Rhinitis"],
      medications: [
        { name: "Cetirizine", dosage: "10mg", frequency: "Once daily" },
        { name: "Fluticasone Nasal Spray", dosage: "2 sprays", frequency: "Twice daily" }
      ],
      emergency_contacts: [
        { name: "Pooja Gupta", relation: "Wife", phone: "9876543251", notes: "Teacher" },
        { name: "Ramesh Gupta", relation: "Father", phone: "9876543252", notes: "Retired" }
      ],
      primary_physician: { name: "Dr. Jain", phone: "9876543253" },
      public_emergency_summary: "Allergic to dust and pollen. Has seasonal allergies."
    },
    medicalRecords: [
      {
        type: "prescription",
        title: "Allergy Management",
        description: "Antihistamine and nasal spray for allergic rhinitis",
        date_of_visit: new Date('2024-02-14'),
        tags: ["allergies", "rhinitis"],
        visibility: "private"
      },
      {
        type: "other",
        title: "Allergy Testing",
        description: "Skin prick test results showing dust and pollen sensitivity",
        date_of_visit: new Date('2024-01-20'),
        tags: ["allergy test", "immunology"],
        visibility: "private"
      }
    ]
  }
];

async function createDemoData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://alumni_admin:SPECTRA-X@alumni001.csb34gd.mongodb.net/', {
      dbName: process.env.MONGO_DB || 'swasthya_health_card'
    });
    console.log('✅ Connected to MongoDB');
    
    console.log('🌱 Creating demo data...');

    // Clear existing demo users and their health profiles
    const demoEmails = demoUsers.map(u => u.email);
    const demoUserIds = await User.find({ email: { $in: demoEmails } }).select('_id');
    await User.deleteMany({ email: { $in: demoEmails } });
    await HealthProfile.deleteMany({ user_id: { $in: demoUserIds.map(u => u._id) } });
    await MedicalRecord.deleteMany({ user_id: { $in: demoUserIds.map(u => u._id) } });
    console.log('✅ Cleaned existing demo users and profiles');

    for (const userData of demoUsers) {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Generate public emergency ID
      const publicEmergencyId = nanoid(12);
      
      // Create user
      const user = new User({
        full_name: userData.full_name,
        email: userData.email,
        phone: userData.phone,
        password: hashedPassword
      });
      
      await user.save();
      console.log(`👤 Created user: ${user.full_name}`);
      
      // Create health profile
      const healthProfile = new HealthProfile({
        user_id: user._id,
        ...userData.health_profile,
        public_emergency_id: publicEmergencyId
      });
      
      await healthProfile.save();
      console.log(`💊 Created health profile for: ${user.full_name}`);
      
      // Create medical records for this user with sample files
      for (const [index, recordData] of userData.medicalRecords.entries()) {
        const files = [];
        
        // Add sample files to some records
        if (index === 0) {
          // Add a sample prescription file
          const prescriptionFile = await createSampleFile(
            user._id,
            'prescription.txt',
            `PRESCRIPTION\n\nPatient: ${user.full_name}\nDate: ${recordData.date_of_visit}\n\nMedication:\n- ${recordData.title}\n\nInstructions:\n${recordData.description}\n\nPrescribed by: Dr. Smith\nLicense: MD12345`,
            'text/plain'
          );
          if (prescriptionFile) files.push(prescriptionFile);
        }
        
        if (index === 1) {
          // Add a sample lab report
          const labReportFile = await createSampleFile(
            user._id,
            'lab_report.txt',
            `LAB REPORT\n\nPatient: ${user.full_name}\nTest Date: ${recordData.date_of_visit}\nReport: ${recordData.title}\n\nResults:\n- All values within normal range\n- Follow-up recommended\n\nTested by: City Lab\nReport ID: LAB${Math.floor(Math.random() * 10000)}`,
            'text/plain'
          );
          if (labReportFile) files.push(labReportFile);
        }
        
        const record = new MedicalRecord({
          ...recordData,
          user_id: user._id,
          files: files
        });
        
        await record.save();
        console.log(`📋 Created record: ${record.title} ${files.length > 0 ? 'with ' + files.length + ' file(s)' : ''}`);
      }
    }
    
    console.log('🎉 Demo data created successfully!');
    console.log('\n📧 Demo Users:');
    demoUsers.forEach(user => {
      console.log(`   Email: ${user.email} | Password: ${user.password}`);
    });
    console.log('\nYou can now login with any of these credentials!\n');
    
  } catch (error) {
    console.error('❌ Error creating demo data:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  createDemoData().then(() => {
    process.exit(0);
  }).catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = { createDemoData, demoUsers };
