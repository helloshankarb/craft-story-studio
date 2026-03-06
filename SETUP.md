# Craft Story Studio - Gallery CRUD Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- Supabase Account
- npm or yarn

## Backend Setup (Express + Supabase)

### 1. Configure Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to **Settings > API** to get your credentials:
   - Project URL
   - `SUPABASE_ANON_KEY` (public)
   - `SUPABASE_SERVICE_ROLE_KEY` (secret - keep safe!)

3. Go to **Storage** and create a new bucket named `gallery-images`
   - Set it as public bucket

4. Go to **SQL Editor** and run the SQL from `server/src/database/schema.sql`

### 2. Configure Backend Environment

Edit `server/.env`:

```env
PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=gallery-images
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/gif
```

### 3. Start the Backend Server

```bash
cd server
npm install
npm run dev
```

The server will run on `http://localhost:3001`

## Frontend Setup

### 1. Configure Frontend Environment

Edit `.env` in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3001/api
```

### 2. Start the Frontend

```bash
npm run dev
```

The app will run on `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/gallery` | Get all products |
| GET | `/api/gallery/:id` | Get product by ID |
| POST | `/api/gallery` | Create new product |
| PUT | `/api/gallery/:id` | Update product |
| DELETE | `/api/gallery/:id` | Delete product (soft delete) |
| GET | `/api/gallery/categories` | Get all categories |

## Example: Creating a Product

```bash
curl -X POST http://localhost:3001/api/gallery \
  -F "title=Handcrafted Leather Wallet" \
  -F "description=Genuine leather wallet" \
  -F "price=1500" \
  -F "category=Leather Craft" \
  -F "image=@/path/to/image.jpg"
```
