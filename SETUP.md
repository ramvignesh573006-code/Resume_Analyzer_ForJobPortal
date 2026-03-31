# Resume Analyzer - Setup Guide

Complete step-by-step guide to set up the Resume Analyzer application with Supabase.

## Prerequisites

- Node.js 18+ installed
- pnpm or npm package manager
- Supabase account (free tier available)
- GitHub account (optional, for deployment)

## Step 1: Supabase Project Setup

Your Supabase project details have been provided:
- **Project URL**: https://grvefbesswvdtsmochje.supabase.co
- **Publishable Key**: sb_publishable_rhefdJ-cewjyz4tkC_ajJQ_LPvolcxT
- **JWT Secret**: 8ed3339e-7785-4bc8-be5c-91718d67ee3a

These are already included in the `.env.local.example` file.

## Step 2: Environment Configuration

1. In the project root, rename `.env.local.example` to `.env.local`:
```bash
mv .env.local.example .env.local
```

Or create a new `.env.local` file with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://grvefbesswvdtsmochje.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rhefdJ-cewjyz4tkC_ajJQ_LPvolcxT
SUPABASE_JWT_SECRET=8ed3339e-7785-4bc8-be5c-91718d67ee3a
```

## Step 3: Database Setup

### Create Tables

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `/scripts/01-create-tables.sql`
6. Paste into the SQL editor
7. Click **Run**

The script will create:
- `users` table
- `resumes` table
- `analysis_results` table
- `resume_comparisons` table
- `role_keywords` table
- All required indexes and RLS policies
- Pre-populated role keywords

### Verify Tables Created

In the SQL Editor, run:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;
```

You should see:
- analysis_results
- resume_comparisons
- resumes
- role_keywords
- users

## Step 4: Storage Setup

### Create Resumes Bucket

1. In Supabase Dashboard, navigate to **Storage** (sidebar)
2. Click **New Bucket**
3. Name it: `resumes`
4. Uncheck "Public bucket" (keep it private)
5. Click **Create Bucket**

### Configure RLS Policy

1. Click on the `resumes` bucket
2. Go to **Policies** tab
3. Click **New Policy**
4. Select **For full customization, use custom policies**
5. Use this policy:

```sql
create policy "Allow users to upload resumes"
on storage.objects for insert
to authenticated
with check (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

create policy "Allow users to read their own resumes"
on storage.objects for select
to authenticated
using (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);

create policy "Allow users to delete their own resumes"
on storage.objects for delete
to authenticated
using (bucket_id = 'resumes' AND (storage.foldername(name))[1] = auth.uid()::text);
```

## Step 5: Authentication Setup

### Enable Email/Password Auth

1. In Supabase Dashboard, go to **Authentication** (sidebar)
2. Click **Providers**
3. Make sure **Email** is enabled (default)
4. Under Email, ensure "Confirm email" is set to your preference

### Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add your application URLs:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
3. Under "Redirect URLs", add:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`

## Step 6: Install Dependencies

```bash
# Install all required packages
pnpm install

# Or if using npm
npm install
```

This will install:
- Next.js and React
- Supabase client library
- PDF.js for PDF parsing
- Mammoth for Word document parsing
- Recharts for visualizations
- shadcn/ui components
- Tailwind CSS
- All other dependencies

## Step 7: Run Development Server

```bash
pnpm dev
```

The application will start at:
- **URL**: http://localhost:3000
- **API**: http://localhost:3000/api

## Step 8: Test the Application

### Create an Account

1. Visit http://localhost:3000
2. Click "Sign Up"
3. Enter:
   - Full Name
   - Email address
   - Password (minimum 6 characters)
4. Click "Create Account"
5. You'll be redirected to login page
6. Log in with your credentials

### Upload and Analyze a Resume

1. After logging in, click "Upload & Analyze Resume"
2. Upload a PDF or Word document with your resume
3. Select a job role from the dropdown or enter a custom role
4. Click "Analyze Resume"
5. View the detailed analysis with:
   - Overall score
   - Individual scores for each category
   - Keyword analysis
   - Skills detection
   - ATS compatibility report
   - Improvement suggestions

### Compare Resumes

1. After analyzing 2+ resumes, go to "Compare"
2. Select two resumes to compare
3. View side-by-side comparison of all metrics
4. See which resume is stronger

### View Dashboard

1. Go to "Dashboard" to see all your analyzed resumes
2. Click "View Results" to see full analysis again
3. Delete old analyses if needed

## Step 9: Deployment to Vercel

### Deploy with Vercel

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/resume-analyzer.git
git push -u origin main
```

2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "New Project"
4. Connect your GitHub repository
5. Vercel will detect it's a Next.js project
6. In "Environment Variables", add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_JWT_SECRET`
7. Click "Deploy"

### Post-Deployment

1. Update Supabase Auth URLs:
   - Add `https://your-vercel-url.vercel.app/auth/callback`
   - Keep localhost entries for local development

2. Test the deployed application

## Troubleshooting

### Issue: Tables Not Created
- **Solution**: Verify SQL executed successfully in Supabase editor
- Check for error messages in the SQL editor
- Ensure you're using the correct Supabase project

### Issue: File Upload Fails
- **Solution**: 
  - Verify `resumes` storage bucket exists
  - Check RLS policies are correctly set
  - Ensure you're logged in as authenticated user

### Issue: "Column does not exist" Error
- **Solution**: 
  - Re-run the SQL script to ensure tables exist
  - Refresh the browser page
  - Check browser console for specific column names

### Issue: Login Not Working
- **Solution**:
  - Verify email/password auth is enabled in Supabase
  - Check environment variables are loaded
  - Look for error messages in browser console

### Issue: PDF Upload Not Parsing
- **Solution**:
  - Ensure PDF is not corrupted
  - Try a different PDF file
  - Check browser console for parsing errors
  - File size should be < 10MB

### Issue: Analysis Takes Too Long
- **Solution**:
  - Large PDFs may take longer to parse
  - Check if network is slow
  - Try with a smaller resume

## Environment Variables Reference

```env
# Supabase Configuration (Public)
NEXT_PUBLIC_SUPABASE_URL=https://grvefbesswvdtsmochje.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rhefdJ-cewjyz4tkC_ajJQ_LPvolcxT

# Supabase Configuration (Private - Server-side only)
SUPABASE_JWT_SECRET=8ed3339e-7785-4bc8-be5c-91718d67ee3a
```

**IMPORTANT**: Never commit `.env.local` to version control. It's already in `.gitignore`.

## Project Structure Reminder

```
resume-analyzer/
├── app/
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main application
│   ├── layout.tsx
│   ├── page.tsx          # Home page
│   └── globals.css
├── components/
│   ├── header.tsx        # Navigation
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── auth/             # Auth utilities
│   ├── supabase/         # Supabase client
│   ├── pdf/              # PDF parsing
│   └── analysis/         # Analysis engine
├── scripts/
│   └── 01-create-tables.sql
├── public/               # Static assets
├── .env.local           # Environment variables (not in git)
├── .env.local.example   # Example env file
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── README.md
```

## Next Steps

After setup is complete:

1. **Test all features** thoroughly
2. **Customize branding** if needed (colors, logo, etc.)
3. **Add analytics** to track usage
4. **Configure email notifications** (optional)
5. **Deploy to production** when ready
6. **Monitor Supabase usage** and scale as needed

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review browser console for error messages
3. Check Supabase logs for database errors
4. Verify all environment variables are set
5. Ensure all database tables and storage buckets exist

---

Good luck with your Resume Analyzer deployment!
