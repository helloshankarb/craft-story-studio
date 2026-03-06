# How to Find Your Supabase API Keys

## Step 1: Go to Your Supabase Dashboard

1. Open https://supabase.com
2. Sign in to your account
3. Click on your project (it should be listed on your dashboard)

## Step 2: Find the API Keys

Once you're in your project:

### Option A: Settings Page
1. Click the **Settings** icon (gear/cog icon) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see a page with your API credentials

### Option B: Quick Link
Look for "API" in your left sidebar - it's usually under "Project Settings"

## What You're Looking For

On the API settings page, you will see:

### 1. Project URL
- This is at the top: `https://xxxxxx.supabase.co`
- Copy this URL

### 2. anon public (API Key)
- Under "Project API keys" section
- Click the copy button or select and copy
- This is your **SUPABASE_ANON_KEY**

### 3. service_role (API Key)
- Also under "Project API keys" section  
- Click "Reveal" to show it, then copy
- This is your **SUPABASE_SERVICE_ROLE_KEY** (keep this secret!)

## Screenshot Guide

```
┌─────────────────────────────────────────────────┐
│  Project Settings                               │
├─────────────────────────────────────────────────┤
│                                                 │
│  Project URL                                     │
│  https://abc123.supabase.co  ← COPY THIS       │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Project API keys                               │
│                                                 │
│  anon public                                    │
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  ← COPY
│                                                 │
│  service_role                         [Reveal] │
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  ← COPY (click Reveal first!)
│                                                 │
└─────────────────────────────────────────────────┘
```

## Copy These Values

Once you have them, fill in your files:

### server/.env
```
SUPABASE_URL=https://abc123.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### .env (root folder)
```
VITE_SUPABASE_URL=https://abc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:3001/api
```

## Still Can't Find It?

1. Make sure you're logged into Supabase
2. Select the correct project from the dropdown (top left)
3. The settings icon is at the bottom of the left sidebar
4. Click "API" in the settings menu

If you see "Project not found" or blank page, try refreshing the browser.
