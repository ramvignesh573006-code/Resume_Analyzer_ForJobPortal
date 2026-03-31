# Quick Start Guide - Resume Analyzer

Get up and running in 5 minutes!

## 1. Install Dependencies (1 minute)
```bash
pnpm install
```

## 2. Setup Environment Variables (1 minute)

Create `.env.local` file in project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://grvefbesswvdtsmochje.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rhefdJ-cewjyz4tkC_ajJQ_LPvolcxT
SUPABASE_JWT_SECRET=8ed3339e-7785-4bc8-be5c-91718d67ee3a
```

## 3. Create Database Tables (2 minutes)

1. Go to https://app.supabase.com → Your Project → SQL Editor
2. Click "New Query"
3. Copy-paste contents of `/scripts/01-create-tables.sql`
4. Click "Run"
5. Done! ✓

## 4. Create Storage Bucket (1 minute)

1. Go to Supabase Dashboard → Storage
2. Click "New Bucket" → Name: `resumes` → Create
3. Bucket is now ready ✓

## 5. Start Development Server

```bash
pnpm dev
```

App runs at: **http://localhost:3000**

## 6. Test It Out

1. **Sign up** at http://localhost:3000/auth/signup
2. **Upload** a resume at http://localhost:3000/dashboard/analyze
3. **View results** with detailed analysis
4. **Compare** multiple resumes if you upload more

## Done! 🎉

Your Resume Analyzer is now running locally!

---

## What Each Page Does

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page & feature overview |
| Sign Up | `/auth/signup` | Create new account |
| Login | `/auth/login` | Sign in to account |
| Dashboard | `/dashboard` | View all analyzed resumes |
| Analyze | `/dashboard/analyze` | Upload & analyze resume |
| Results | `/dashboard/results/[id]` | View detailed analysis |
| Compare | `/dashboard/compare` | Compare two resumes |

## Features at a Glance

✅ **Signup/Login** - Secure authentication with Supabase
✅ **PDF/Word Upload** - Support for resume file formats
✅ **Multi-Criteria Analysis** - 5 scoring dimensions
✅ **Visual Results** - Charts and detailed breakdowns
✅ **Suggestions** - Improvement recommendations
✅ **History** - Track all analyses
✅ **Compare** - Side-by-side comparison

## Database Tables Created

- `users` - User profiles
- `resumes` - Uploaded resume files
- `analysis_results` - Detailed analysis scores
- `resume_comparisons` - Comparison data
- `role_keywords` - Job role keyword definitions

## File Structure

```
Key Files You'll Work With:
├── .env.local          ← Your credentials (created manually)
├── app/page.tsx        ← Home page
├── app/auth/           ← Login/signup pages
├── app/dashboard/      ← Main app features
├── lib/                ← Utilities and helpers
└── scripts/            ← Database setup
```

## Next Steps

After getting it running:

1. **Customize the design** - Edit colors, fonts in `globals.css`
2. **Add your branding** - Update logo and text
3. **Deploy to Vercel** - Free hosting
4. **Add features** - Database is ready to extend

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Tables not found | Run SQL script again in Supabase |
| File upload fails | Check `resumes` bucket exists in Storage |
| Login doesn't work | Verify `.env.local` variables are correct |
| Blank page | Check browser console (F12) for errors |
| PDF won't parse | Try a different PDF file, max 10MB |

## Important Files to Know

- **Authentication**: `lib/auth/useAuth.ts`
- **PDF Parsing**: `lib/pdf/parser.ts`
- **Analysis Engine**: `lib/analysis/analyzer.ts`
- **Database Schema**: `scripts/01-create-tables.sql`
- **UI Components**: `components/ui/`

## Key Endpoints

- Login: `POST /auth/signin` (via Supabase)
- Upload: `POST /storage/resumes` (via Supabase Storage)
- Analysis: Runs client-side, saves to Supabase

## What's Next?

✓ Local development is ready
→ Next: Deploy to Vercel (5 minutes)
→ Then: Customize branding
→ Finally: Share with users!

## Deployment Quick Steps

1. Push to GitHub
2. Go to vercel.com
3. Import your repository
4. Add environment variables
5. Deploy!

See `SETUP.md` for detailed deployment guide.

---

**Questions?** Check `README.md` for full documentation or `SETUP.md` for detailed setup.

Happy analyzing! 🚀
