# File Storage Configuration

This application supports multiple file storage options for medical records, prioritized in the following order:

1. **Supabase Storage** (Recommended - Free tier with generous limits)
2. **Cloudinary** (Alternative cloud storage)
3. **Local Storage** (Fallback - files stored on server)

## Option 1: Supabase Storage (Recommended)

### Why Supabase?
- **Free tier**: 1GB storage with 2GB bandwidth
- **Easy to set up**: Simple authentication and storage buckets
- **Reliable**: Built on PostgreSQL and proven infrastructure
- **Integrated**: Works seamlessly with existing database systems

### Setup Steps:

1. **Create a Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for the project to be ready

2. **Create a storage bucket**:
   - In your Supabase dashboard, go to Storage
   - Create a new bucket called `medical-records`
   - Set it as public or configure appropriate policies

3. **Get your credentials**:
   - Go to Settings → API
   - Copy your `Project URL` and `anon/public key`
   https://sskmosynylcmvaodpfsq.supabase.co
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNza21vc3lueWxjbXZhb2RwZnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3OTk3NzIsImV4cCI6MjA3MzM3NTc3Mn0.oh6ZAKvxTs-pIQUzP8lp3DPfpgEl6_vJ4PV4r0MNKmg
   


4. **Update your .env file**:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

5. **Configure bucket policies** (optional):
   ```sql
   -- Allow authenticated users to upload files
   CREATE POLICY "Allow authenticated uploads" ON storage.objects
   FOR INSERT WITH CHECK (auth.role() = 'authenticated');
   
   -- Allow public access to files
   CREATE POLICY "Allow public access" ON storage.objects
   FOR SELECT USING (bucket_id = 'medical-records');
   ```

## Option 2: Cloudinary (Alternative)

### Setup Steps:

1. **Create a Cloudinary account**:
   - Go to [cloudinary.com](https://cloudinary.com)
   - Sign up for a free account

2. **Get your credentials**:
   - From your dashboard, copy Cloud Name, API Key, and API Secret

3. **Update your .env file**:
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

## Option 3: Local Storage (Fallback)

Files are automatically stored locally in the `/uploads` directory if cloud storage is not configured. This works out of the box but:

- Files are stored on your server
- Not suitable for production deployments with multiple servers
- Files may be lost if server storage is cleared

## Testing Your Configuration

1. **Start the server**:
   ```bash
   npm start
   ```

2. **Check the logs**: You should see one of these messages:
   - `✅ Supabase storage initialized` (if Supabase is configured)
   - `⚠️ Supabase not configured, using local storage for file uploads` (if falling back)

3. **Test file upload**: Use the medical records page to upload a file and verify it works.

## File Types Supported

The system accepts the following file types for security:
- **PDF**: `application/pdf`
- **JPEG**: `image/jpeg`
- **PNG**: `image/png`
- **WebP**: `image/webp`

Maximum file size: 5MB (configurable via `MAX_UPLOAD_MB` environment variable)

## Environment Variables Summary

```env
# Supabase Storage (Primary)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Cloudinary (Secondary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Local Storage (Automatic fallback)
MAX_UPLOAD_MB=5
```

## Troubleshooting

### Files not uploading to cloud storage
- Check your environment variables are correctly set
- Verify your cloud storage credentials are valid
- Check server logs for error messages
- Ensure storage bucket exists and has proper permissions

### Files uploaded locally instead of cloud
- This indicates cloud storage configuration failed
- Check the server startup logs for error messages
- Verify your credentials and bucket/folder names

### Upload fails completely
- Check file type is supported (PDF, JPEG, PNG, WebP)
- Verify file size is under the limit (default 5MB)
- Ensure proper authentication token is being sent