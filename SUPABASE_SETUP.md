# How to Create Supabase Project and Get Credentials

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project" or "Sign In"
3. Sign up with GitHub, Google, or Email

## Step 2: Create New Project

1. After login, click "New Project"
2. Fill in the details:
   - **Name**: `craft-story-studio` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Select closest to you (e.g., Asia - Singapore)
3. Click "Create new project"
4. Wait 1-2 minutes for project to be ready

## Step 3: Get Your Credentials

Once project is ready:

1. Go to **Settings** (gear icon) → **API**
2. You'll see:
   - **Project URL**: Copy this → `https://your-project-id.supabase.co`
   - **anon public** (under "Project API keys"): Copy this
   - **service_role** (under "Project API keys"): Copy this (⚠️ keep secret!)

## Step 4: Configure Storage

1. Go to **Storage** in left sidebar
2. Click **New bucket**
3. Fill in:
   - **Name**: `gallery-images`
   - **Public bucket**: ✅ Check "Make public"
4. Click "Create bucket"

## Step 5: Create Database Table

1. Go to **SQL Editor** in left sidebar
2. Copy and paste the content from [`server/src/database/schema.sql`](server/src/database/schema.sql)
3. Click "Run" to execute

## Step 6: Update Your Environment Files

### Update `server/.env`:
```env
PORT=3001
SUPABASE_URL=https://cnwzeqfvowznrvrwlzrm.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=gallery-images
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/gif
```

### Update root `.env`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3001/api
```

## Step 7: Start the Server

```bash
cd server
npm run dev
```

The server will run at `http://localhost:3001`

## Troubleshooting

- **CORS errors**: Make sure your Supabase project allows requests from your frontend URL
- **Image upload fails**: Check that the storage bucket is set to "Public"
- **Database errors**: Run the SQL in SQL Editor again

Your Supabase project is now ready to store gallery products with images!
