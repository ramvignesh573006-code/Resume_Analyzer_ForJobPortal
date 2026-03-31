# Resume Analyzer - AI-Powered Resume Analysis Tool

A comprehensive web application that analyzes resumes using AI-powered algorithms to provide detailed insights, improvement suggestions, and job role compatibility scoring.

## Features

### Core Features
- **User Authentication**: Secure signup and login with Supabase Auth
- **Resume Upload**: Support for PDF and Word documents
- **Multi-Criteria Analysis**: Analyzes 5 key dimensions:
  - **Keyword Matching (25%)**: Detects job-relevant keywords
  - **Format & Styling (15%)**: Evaluates formatting quality
  - **Structure (20%)**: Checks resume sections and organization
  - **Skills Analysis (20%)**: Identifies technical and soft skills
  - **ATS Compatibility (20%)**: Verifies compatibility with Applicant Tracking Systems

### Advanced Features
- **Detailed Insights**: Charts, visualizations, and comprehensive breakdowns
- **Actionable Suggestions**: Specific recommendations for improvement
- **Analysis History**: Track all previous resume analyses
- **Resume Comparison**: Side-by-side comparison of multiple resumes
- **Role-Specific Analysis**: Pre-defined roles or custom job titles

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **PDF Parsing**: pdf.js, mammoth.js
- **Visualizations**: Recharts
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS

## Project Structure

```
├── app/
│   ├── auth/
│   │   ├── login/          # Login page
│   │   └── signup/         # Sign up page
│   ├── dashboard/
│   │   ├── page.tsx        # Main dashboard
│   │   ├── analyze/        # Resume upload & analysis
│   │   ├── results/        # Analysis results with visualizations
│   │   └── compare/        # Resume comparison
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home/landing page
│   └── globals.css         # Global styles
├── components/
│   ├── header.tsx          # Navigation header
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── auth/
│   │   └── useAuth.ts      # Authentication hook
│   ├── supabase/
│   │   ├── client.ts       # Client-side Supabase
│   │   └── server.ts       # Server-side Supabase
│   ├── pdf/
│   │   └── parser.ts       # PDF/DOC parsing utilities
│   └── analysis/
│       └── analyzer.ts     # Resume analysis engine
├── scripts/
│   └── 01-create-tables.sql # Database schema
└── package.json            # Dependencies
```

## Installation & Setup

### 1. Clone and Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Environment Setup
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://grvefbesswvdtsmochje.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_rhefdJ-cewjyz4tkC_ajJQ_LPvolcxT
SUPABASE_JWT_SECRET=8ed3339e-7785-4bc8-be5c-91718d67ee3a
```

### 3. Database Setup
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Create a new query and copy-paste the contents of `/scripts/01-create-tables.sql`
4. Run the query to create all tables and set up RLS policies

### 4. Storage Setup (Supabase)
1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `resumes`
3. Set the bucket to private for security

### 5. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Database Schema

### Tables

**users**
- Extends Supabase auth.users
- Stores user profile information

**resumes**
- Stores uploaded resume files and extracted text
- Links to users table

**analysis_results**
- Stores analysis scores and detailed insights
- Links to both resumes and users tables

**resume_comparisons**
- Stores comparison data between two resumes
- Links to users and resumes tables

**role_keywords**
- Pre-populated with job role keywords for analysis
- Used for keyword matching scoring

## Analysis Engine

The analysis engine (`lib/analysis/analyzer.ts`) provides:

### Scoring Algorithm
- **Keyword Matching**: Compares resume content against role-specific keywords
- **Format Analysis**: Evaluates presence of standard resume sections
- **Structure Check**: Verifies presence of contact info, summary, experience, education, and skills
- **Skills Analysis**: Detects technical and soft skills with diversity scoring
- **ATS Compatibility**: Checks for ATS-unfriendly elements

### Output
- Numerical scores (0-100) for each dimension
- Overall composite score
- Detailed analysis data in JSON format
- Actionable improvement suggestions

## User Flows

### Signup/Login
1. User registers with name, email, and password
2. Credentials stored securely in Supabase Auth
3. User profile created in users table
4. Redirected to dashboard on successful login

### Resume Analysis
1. User uploads PDF or Word document
2. Text extracted and stored
3. User selects job role (predefined or custom)
4. Analysis engine processes resume
5. Results saved to database
6. User views comprehensive analysis with visualizations

### Resume Comparison
1. User selects two analyzed resumes
2. Comparison data generated
3. Side-by-side score breakdown displayed
4. Winner determined and highlighted

### Dashboard
1. Displays all previous analyses
2. Shows overall scores and quick stats
3. Provides links to full analysis results
4. Allows deletion of old analyses

## Key Features Explained

### Multi-Criteria Scoring
The overall score is calculated as a weighted average:
- Keyword Score × 0.25
- Format Score × 0.15
- Structure Score × 0.20
- Skills Score × 0.20
- ATS Score × 0.20

### Role-Specific Keywords
Each job role has a predefined keyword list. Custom roles can be analyzed without specific keywords, using general technical and soft skill detection.

### ATS Compatibility
Checks for:
- Special characters that might not parse
- Table usage (many ATS systems struggle)
- Document complexity
- Formatting compatibility

## Security Features

- **Row Level Security (RLS)**: Database policies ensure users can only access their own data
- **Authentication**: Secure password hashing via Supabase Auth
- **Private Storage**: Resume files stored in private Supabase storage bucket
- **SQL Injection Prevention**: Parameterized queries via Supabase client
- **CORS Protection**: Proper origin settings configured

## Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Connect GitHub repository to Vercel
3. Add environment variables in Vercel project settings
4. Deploy with `vercel deploy`

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Database tables created
- [ ] Storage bucket created and configured
- [ ] CORS properly configured in Supabase
- [ ] Redirect URLs set in Supabase Auth settings

## API Routes

The application uses client-side Supabase integration, so API calls are made directly from the browser to Supabase. No custom API routes are required for core functionality.

## Future Enhancements

- Export analysis results as PDF
- Email notifications for analysis completion
- Integration with job boards
- Resume templates and builder
- Video guidance on improvements
- Mobile app version
- Advanced NLP analysis
- Job market insights

## Troubleshooting

### PDF Upload Issues
- Ensure PDF is valid and not corrupted
- Check file size (recommend < 10MB)
- Try converting Word doc to PDF if issues persist

### Authentication Errors
- Verify credentials are correct
- Check environment variables are loaded
- Clear browser cookies and try again

### Database Errors
- Confirm SQL script was executed successfully
- Verify RLS policies are enabled
- Check Supabase connection in browser console

## Support

For issues or questions:
1. Check the console for error messages
2. Review Supabase logs in dashboard
3. Verify all environment variables are set correctly
4. Ensure database tables and storage bucket exist

## License

MIT License - Feel free to use this project for personal or commercial purposes.

---

Built with Next.js, React, Supabase, and Tailwind CSS
