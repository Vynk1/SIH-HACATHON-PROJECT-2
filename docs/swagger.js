// docs/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Swasthya Health Card API',
    version: '1.0.0',
    description: `
    # Swasthya Health Card API Documentation
    
    A comprehensive digital health card system that allows users to store, manage, and share their medical information securely.
    
    ## Features
    - 🔐 **Secure Authentication** - JWT-based authentication system
    - 👤 **User Management** - Patient, Provider, and Admin roles
    - 🏥 **Health Profiles** - Comprehensive health information storage
    - 📋 **Medical Records** - CRUD operations for medical records
    - 🆘 **Emergency Access** - Public emergency information access
    - 📎 **File Upload** - Cloudinary integration for file storage
    - 🔒 **Privacy Controls** - Granular visibility settings
    
    ## Getting Started
    1. Register a new account using \`/api/auth/register\`
    2. Login to get your JWT token using \`/api/auth/login\`
    3. Use the token in the Authorization header for protected endpoints
    
    ## Authentication
    Most endpoints require a JWT token in the Authorization header:
    \`\`\`
    Authorization: Bearer <your-jwt-token>
    \`\`\`
    `,
    contact: {
      name: 'Swasthya Team',
      email: 'support@swasthya.com',
      url: 'https://swasthya.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production' 
        ? 'https://your-production-api.com' 
        : 'http://localhost:5000',
      description: process.env.NODE_ENV === 'production' 
        ? 'Production Server' 
        : 'Development Server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token'
      }
    },
    schemas: {
      User: {
        type: 'object',
        required: ['full_name', 'email', 'password'],
        properties: {
          _id: {
            type: 'string',
            description: 'User ID',
            example: '64f8b123456789abc'
          },
          full_name: {
            type: 'string',
            description: 'User full name',
            example: 'John Doe'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
            example: 'john.doe@example.com'
          },
          phone: {
            type: 'string',
            description: 'User phone number',
            example: '+1234567890'
          },
          role: {
            type: 'string',
            enum: ['patient', 'provider', 'admin'],
            description: 'User role',
            example: 'patient'
          },
          public_emergency_id: {
            type: 'string',
            description: 'Public emergency ID for QR code access',
            example: 'emrg_abc123'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Account creation timestamp'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp'
          }
        }
      },
      HealthProfile: {
        type: 'object',
        properties: {
          user_id: {
            type: 'string',
            description: 'Associated user ID'
          },
          dob: {
            type: 'string',
            format: 'date',
            description: 'Date of birth',
            example: '1990-01-15'
          },
          gender: {
            type: 'string',
            enum: ['male', 'female', 'other'],
            description: 'Gender'
          },
          blood_group: {
            type: 'string',
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
            description: 'Blood group',
            example: 'O+'
          },
          weight_kg: {
            type: 'number',
            description: 'Weight in kilograms',
            example: 70.5
          },
          height_cm: {
            type: 'number',
            description: 'Height in centimeters',
            example: 175
          },
          allergies: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'List of allergies',
            example: ['peanuts', 'shellfish']
          },
          chronic_conditions: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'List of chronic conditions',
            example: ['hypertension', 'diabetes']
          },
          medications: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Lisinopril' },
                dosage: { type: 'string', example: '10mg' },
                frequency: { type: 'string', example: 'Once daily' }
              }
            },
            description: 'Current medications'
          },
          emergency_contacts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Jane Doe' },
                relationship: { type: 'string', example: 'Spouse' },
                phone: { type: 'string', example: '+1234567891' }
              }
            },
            description: 'Emergency contacts'
          },
          primary_physician: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'Dr. Smith' },
              specialization: { type: 'string', example: 'Internal Medicine' },
              phone: { type: 'string', example: '+1234567892' },
              hospital: { type: 'string', example: 'City Hospital' }
            }
          },
          public_emergency_summary: {
            type: 'string',
            description: 'Summary for emergency access',
            example: 'Diabetic, allergic to peanuts. Emergency contact: Jane Doe +1234567891'
          }
        }
      },
      MedicalRecord: {
        type: 'object',
        required: ['title', 'description'],
        properties: {
          _id: {
            type: 'string',
            description: 'Record ID'
          },
          user_id: {
            type: 'string',
            description: 'Patient ID'
          },
          uploaded_by: {
            type: 'string',
            description: 'ID of user who uploaded the record'
          },
          type: {
            type: 'string',
            enum: ['prescription', 'report', 'diagnosis', 'treatment', 'other'],
            description: 'Type of medical record',
            example: 'report'
          },
          title: {
            type: 'string',
            description: 'Record title',
            example: 'Blood Test Results'
          },
          description: {
            type: 'string',
            description: 'Detailed description',
            example: 'Annual blood work showing normal glucose levels'
          },
          date_of_visit: {
            type: 'string',
            format: 'date-time',
            description: 'Date of medical visit/test'
          },
          files: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Array of file IDs attached to this record'
          },
          tags: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Tags for categorization',
            example: ['blood-test', 'annual-checkup']
          },
          verified_by_provider: {
            type: 'boolean',
            description: 'Whether the record is verified by a healthcare provider'
          },
          visibility: {
            type: 'string',
            enum: ['private', 'shared', 'public_emergency'],
            description: 'Record visibility setting',
            example: 'private'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            description: 'JWT authentication token'
          },
          user: {
            $ref: '#/components/schemas/User'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Error message'
          },
          stack: {
            type: 'string',
            description: 'Error stack trace (development only)'
          }
        }
      },
      ValidationError: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Validation error message'
          },
          errors: {
            type: 'object',
            description: 'Field-specific validation errors'
          }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: [
    './routes/*.js',
    './controller/*.js',
    './models/*.js',
    './docs/paths/*.yaml'
  ]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;