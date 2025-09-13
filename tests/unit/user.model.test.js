const User = require('../../models/User');
const mongoose = require('mongoose');

describe('User Model', () => {
  beforeEach(() => {
    // Clear any existing model compilation
    delete mongoose.models.User;
    delete mongoose.modelSchemas.User;
  });

  it('should create a valid user', async () => {
    const userData = {
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      password: 'hashedpassword123',
      role: 'patient'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.full_name).toBe(userData.full_name);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.phone).toBe(userData.phone);
    expect(savedUser.role).toBe(userData.role);
    expect(savedUser.createdAt).toBeDefined();
    expect(savedUser.updatedAt).toBeDefined();
  });

  it('should require full_name field', async () => {
    const userData = {
      email: 'john.doe@example.com',
      password: 'hashedpassword123'
    };

    const user = new User(userData);
    
    await expect(user.save()).rejects.toThrow('User validation failed');
  });

  it('should require email field', async () => {
    const userData = {
      full_name: 'John Doe',
      password: 'hashedpassword123'
    };

    const user = new User(userData);
    
    await expect(user.save()).rejects.toThrow('User validation failed');
  });

  it('should require password field', async () => {
    const userData = {
      full_name: 'John Doe',
      email: 'john.doe@example.com'
    };

    const user = new User(userData);
    
    await expect(user.save()).rejects.toThrow('User validation failed');
  });

  it('should default role to patient', async () => {
    const userData = {
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword123'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser.role).toBe('patient');
  });

  it('should enforce unique email', async () => {
    const userData1 = {
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword123'
    };

    const userData2 = {
      full_name: 'Jane Doe',
      email: 'john.doe@example.com', // Same email
      password: 'hashedpassword456'
    };

    const user1 = new User(userData1);
    await user1.save();

    const user2 = new User(userData2);
    await expect(user2.save()).rejects.toThrow();
  });

  it('should validate role enum', async () => {
    const userData = {
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword123',
      role: 'invalid_role'
    };

    const user = new User(userData);
    
    await expect(user.save()).rejects.toThrow('User validation failed');
  });

  it('should accept valid roles', async () => {
    const validRoles = ['patient', 'caregiver', 'provider', 'admin'];

    for (const role of validRoles) {
      const userData = {
        full_name: 'John Doe',
        email: `john.${role}@example.com`,
        password: 'hashedpassword123',
        role: role
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.role).toBe(role);
    }
  });

  it('should trim and lowercase email', async () => {
    const userData = {
      full_name: 'John Doe',
      email: '  JOHN.DOE@EXAMPLE.COM  ',
      password: 'hashedpassword123'
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser.email).toBe('john.doe@example.com');
  });

  it('should store meta field', async () => {
    const userData = {
      full_name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword123',
      meta: {
        preferences: {
          notifications: true,
          theme: 'dark'
        },
        lastLogin: new Date()
      }
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser.meta).toBeDefined();
    expect(savedUser.meta.preferences.notifications).toBe(true);
    expect(savedUser.meta.preferences.theme).toBe('dark');
  });
});