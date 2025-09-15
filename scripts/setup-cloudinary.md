# Setting up Cloudinary for File Uploads

## Steps to get Cloudinary credentials:

1. **Sign up for a free Cloudinary account**:
   - Go to https://cloudinary.com/users/register/free
   - Create a free account using your email

2. **Get your credentials from the dashboard**:
   - After logging in, go to your Dashboard
   - You'll see your Account Details:
     - Cloud name: (e.g., `dqzxyzabc`)
     - API Key: (e.g., `123456789012345`)
     - API Secret: (e.g., `AbCdEfGhIjKlMnOpQrStUvWxYz`)

3. **Update the .env file**:
   ```bash
   # Cloudinary Configuration (for file uploads)
   CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
   CLOUDINARY_API_KEY=your-actual-api-key
   CLOUDINARY_API_SECRET=your-actual-api-secret
   ```

4. **Test the connection**:
   ```bash
   npm run test-cloudinary
   ```

## Demo Cloudinary Account Setup

I'll create a demo account for this project:

### Demo Credentials (for testing):
```
Cloud Name: swasthya-demo
API Key: 123456789012345  
API Secret: demo-secret-key
```

**Note**: These are example credentials. For production, you should use your own Cloudinary account.

## Local Storage Fallback

If Cloudinary is not configured, the system automatically falls back to local file storage:
- Files are stored in `/uploads` directory
- Files are served via `/uploads/filename` endpoint
- Same API interface as Cloudinary

## Testing File Upload

Run the test script to verify both Cloudinary and local storage:
```bash
npm run test-upload
```