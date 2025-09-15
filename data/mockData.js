// data/mockData.js - Mock data for demo
const { nanoid } = require('nanoid');

// Mock Users
const mockUsers = [
  {
    _id: 'user1',
    full_name: 'Dr. Rajesh Kumar',
    email: 'rajesh@demo.com',
    phone: '+91 9876543210',
    password: 'demo123', // In real app, this would be hashed
    role: 'patient',
    public_emergency_id: 'EMG001',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: 'user2',
    full_name: 'Priya Sharma',
    email: 'priya@demo.com',
    phone: '+91 9876543211',
    password: 'demo123',
    role: 'patient',
    public_emergency_id: 'EMG002',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-16')
  },
  {
    _id: 'user3',
    full_name: 'Dr. Amit Verma',
    email: 'amit@demo.com',
    phone: '+91 9876543212',
    password: 'demo123',
    role: 'provider',
    public_emergency_id: 'EMG003',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-17')
  }
];

// Mock Health Profiles
const mockHealthProfiles = [
  {
    _id: 'profile1',
    user_id: 'user1',
    dob: new Date('1985-03-15'),
    gender: 'male',
    blood_group: 'O+',
    weight_kg: 75,
    height_cm: 175,
    allergies: ['Peanuts', 'Dust'],
    chronic_conditions: ['Hypertension', 'Diabetes Type 2'],
    medications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' }
    ],
    emergency_contacts: [
      { name: 'Sunita Kumar', relationship: 'Wife', phone: '+91 9876543213' },
      { name: 'Rohit Kumar', relationship: 'Son', phone: '+91 9876543214' }
    ],
    primary_physician: {
      name: 'Dr. Kavya Reddy',
      specialization: 'Internal Medicine',
      phone: '+91 9876543215',
      hospital: 'Apollo Hospital'
    },
    public_emergency_summary: 'Diabetic patient with hypertension. Allergic to peanuts and dust. Emergency contact: Sunita Kumar (+91 9876543213)',
    public_emergency_id: 'EMG001'
  },
  {
    _id: 'profile2',
    user_id: 'user2',
    dob: new Date('1992-08-22'),
    gender: 'female',
    blood_group: 'A+',
    weight_kg: 60,
    height_cm: 165,
    allergies: ['Shellfish'],
    chronic_conditions: ['Asthma'],
    medications: [
      { name: 'Ventolin Inhaler', dosage: '100mcg', frequency: 'As needed' }
    ],
    emergency_contacts: [
      { name: 'Rakesh Sharma', relationship: 'Father', phone: '+91 9876543216' }
    ],
    primary_physician: {
      name: 'Dr. Sarah Johnson',
      specialization: 'Pulmonology',
      phone: '+91 9876543217',
      hospital: 'Fortis Hospital'
    },
    public_emergency_summary: 'Asthma patient. Allergic to shellfish. Emergency contact: Rakesh Sharma (+91 9876543216)',
    public_emergency_id: 'EMG002'
  }
];

// Mock Medical Records
const mockMedicalRecords = [
  {
    _id: 'record1',
    user_id: 'user1',
    uploaded_by: 'user1',
    type: 'report',
    title: 'Annual Blood Test Results',
    description: 'Complete blood count and metabolic panel. Glucose levels slightly elevated.',
    date_of_visit: new Date('2024-01-10'),
    files: [],
    tags: ['blood-test', 'annual-checkup', 'diabetes'],
    verified_by_provider: true,
    visibility: 'private',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    _id: 'record2',
    user_id: 'user1',
    uploaded_by: 'user3',
    type: 'prescription',
    title: 'Diabetes Medication Update',
    description: 'Adjusted Metformin dosage based on recent HbA1c results. Continue current BP medication.',
    date_of_visit: new Date('2024-01-15'),
    files: [],
    tags: ['prescription', 'diabetes', 'medication-adjustment'],
    verified_by_provider: true,
    visibility: 'private',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    _id: 'record3',
    user_id: 'user2',
    uploaded_by: 'user2',
    type: 'diagnosis',
    title: 'Asthma Control Assessment',
    description: 'Breathing test shows good asthma control. Continue current inhaler regimen.',
    date_of_visit: new Date('2024-01-12'),
    files: [],
    tags: ['asthma', 'breathing-test', 'follow-up'],
    verified_by_provider: false,
    visibility: 'shared',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    _id: 'record4',
    user_id: 'user1',
    uploaded_by: 'user1',
    type: 'report',
    title: 'Chest X-Ray Report',
    description: 'Normal chest X-ray. No signs of pneumonia or other abnormalities.',
    date_of_visit: new Date('2024-01-08'),
    files: [],
    tags: ['x-ray', 'chest', 'normal'],
    verified_by_provider: true,
    visibility: 'public_emergency',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  }
];

// Mock Emergency Access Logs
const mockEmergencyLogs = [
  {
    _id: 'log1',
    user_id: 'user1',
    accessed_at: new Date('2024-01-16'),
    method: 'qr',
    ip: '192.168.1.100',
    device_info: 'Mozilla/5.0 (Mobile) Emergency Scanner',
    data_returned: ['name', 'blood_group', 'allergies', 'emergency_contacts']
  }
];

// In-memory data store
let users = [...mockUsers];
let healthProfiles = [...mockHealthProfiles];
let medicalRecords = [...mockMedicalRecords];
let emergencyLogs = [...mockEmergencyLogs];

// Helper functions to simulate database operations
const db = {
  // Users
  users: {
    find: (query = {}) => {
      if (Object.keys(query).length === 0) return users;
      return users.filter(user => {
        return Object.keys(query).every(key => user[key] === query[key]);
      });
    },
    findOne: (query) => {
      return users.find(user => {
        return Object.keys(query).every(key => user[key] === query[key]);
      });
    },
    findById: (id) => users.find(user => user._id === id),
    create: (data) => {
      const newUser = { _id: nanoid(), ...data, createdAt: new Date(), updatedAt: new Date() };
      users.push(newUser);
      return newUser;
    }
  },

  // Health Profiles
  healthProfiles: {
    find: (query = {}) => {
      if (Object.keys(query).length === 0) return healthProfiles;
      return healthProfiles.filter(profile => {
        return Object.keys(query).every(key => profile[key] === query[key]);
      });
    },
    findOne: (query) => {
      return healthProfiles.find(profile => {
        return Object.keys(query).every(key => profile[key] === query[key]);
      });
    },
    create: (data) => {
      const newProfile = { _id: nanoid(), ...data };
      healthProfiles.push(newProfile);
      return newProfile;
    },
    update: (query, updateData) => {
      const index = healthProfiles.findIndex(profile => {
        return Object.keys(query).every(key => profile[key] === query[key]);
      });
      if (index !== -1) {
        healthProfiles[index] = { ...healthProfiles[index], ...updateData };
        return healthProfiles[index];
      }
      return null;
    }
  },

  // Medical Records
  medicalRecords: {
    find: (query = {}) => {
      if (Object.keys(query).length === 0) return medicalRecords;
      return medicalRecords.filter(record => {
        return Object.keys(query).every(key => record[key] === query[key]);
      });
    },
    findById: (id) => medicalRecords.find(record => record._id === id),
    create: (data) => {
      const newRecord = { 
        _id: nanoid(), 
        ...data, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      };
      medicalRecords.push(newRecord);
      return newRecord;
    },
    update: (id, updateData) => {
      const index = medicalRecords.findIndex(record => record._id === id);
      if (index !== -1) {
        medicalRecords[index] = { 
          ...medicalRecords[index], 
          ...updateData, 
          updatedAt: new Date() 
        };
        return medicalRecords[index];
      }
      return null;
    },
    delete: (id) => {
      const index = medicalRecords.findIndex(record => record._id === id);
      if (index !== -1) {
        return medicalRecords.splice(index, 1)[0];
      }
      return null;
    }
  },

  // Emergency Logs
  emergencyLogs: {
    create: (data) => {
      const newLog = { _id: nanoid(), ...data };
      emergencyLogs.push(newLog);
      return newLog;
    }
  }
};

// Demo login credentials
const demoCredentials = {
  'rajesh@demo.com': { password: 'demo123', name: 'Dr. Rajesh Kumar', role: 'patient' },
  'priya@demo.com': { password: 'demo123', name: 'Priya Sharma', role: 'patient' },
  'amit@demo.com': { password: 'demo123', name: 'Dr. Amit Verma', role: 'provider' }
};

module.exports = {
  db,
  mockUsers,
  mockHealthProfiles,
  mockMedicalRecords,
  demoCredentials
};