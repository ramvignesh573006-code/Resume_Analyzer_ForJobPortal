'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import { extractTextFromFile } from '@/lib/pdf/parser';
import { analyzeResume } from '@/lib/analysis/analyzer';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { db } from '@/lib/supabase/db';
import { Upload, Zap } from 'lucide-react';

const PREDEFINED_ROLES = [
  'Software Engineer',
  'Data Scientist',
  'Product Manager',
  'DevOps Engineer',
  'UI/UX Designer',
  'Full Stack Developer',
  'Backend Developer',
  'Frontend Developer',
];

const ROLE_KEYWORDS: Record<string, string[]> = {
  'Software Engineer': [
    'javascript',
    'typescript',
    'react',
    'node.js',
    'python',
    'java',
    'sql',
    'api',
    'rest',
    'git',
  ],
  'Data Scientist': [
    'python',
    'machine learning',
    'tensorflow',
    'pandas',
    'sql',
    'data analysis',
    'statistics',
    'tableau',
  ],
  'Product Manager': [
    'product management',
    'market research',
    'agile',
    'leadership',
    'analytics',
    'roadmap',
    'strategy',
    'storytelling',
  ],
  'DevOps Engineer': ['docker', 'kubernetes', 'aws', 'ci/cd', 'terraform', 'jenkins', 'linux'],
  'UI/UX Designer': [
    'figma',
    'prototyping',
    'user research',
    'interaction design',
    'responsive design',
    'accessibility',
  ],
  'Full Stack Developer': [
    'javascript',
    'react',
    'node.js',
    'mongodb',
    'postgresql',
    'html',
    'css',
    'api',
    'rest',
  ],
  'Backend Developer': ['node.js', 'java', 'python', 'sql', 'database', 'api', 'microservices'],
  'Frontend Developer': ['react', 'javascript', 'html', 'css', 'responsive', 'testing'],
};

interface AnalysisState {
  resumeFile: File | null;
  selectedRole: string;
  customRole: string;
  isUsingCustomRole: boolean;
  loading: boolean;
  error: string | null;
  success: boolean;
  extractedText: string | null;
  analysisId: string | null;
}

function AnalyzeContent() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = useState<AnalysisState>({
    resumeFile: null,
    selectedRole: PREDEFINED_ROLES[0],
    customRole: '',
    isUsingCustomRole: false,
    loading: false,
    error: null,
    success: false,
    extractedText: null,
    analysisId: null,
  });

  const [activePath, setActivePath] = useState<'resume' | 'role' | null>(null);

  useEffect(() => {
    const path = searchParams.get('path');
    if (path === 'resume') setActivePath('resume');
    if (path === 'role') setActivePath('role');
  }, [searchParams]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!validTypes.includes(file.type)) {
        setState((prev) => ({
          ...prev,
          error: 'Please upload a PDF or Word document',
        }));
        return;
      }
      setState((prev) => ({
        ...prev,
        resumeFile: file,
        error: null,
      }));
      if (!activePath) setActivePath('resume');
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setState((prev) => ({
        ...prev,
        isUsingCustomRole: true,
        selectedRole: '',
      }));
    } else {
      setState((prev) => ({
        ...prev,
        selectedRole: value,
        isUsingCustomRole: false,
        customRole: '',
      }));
    }
    if (!activePath) setActivePath('role');
  };

  const handleCustomRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({
      ...prev,
      customRole: e.target.value,
    }));
    if (!activePath) setActivePath('role');
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, error: null }));

    if (!state.resumeFile || !user) {
      setState((prev) => ({ ...prev, error: 'Please upload a resume' }));
      return;
    }

    const currentRole = state.isUsingCustomRole ? state.customRole : state.selectedRole;
    if (!currentRole.trim()) {
      setState((prev) => ({ ...prev, error: 'Please select or enter a role' }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    try {
      const extractedText = await extractTextFromFile(state.resumeFile);
      setState((prev) => ({ ...prev, extractedText }));

      const keywords = state.isUsingCustomRole
        ? []
        : ROLE_KEYWORDS[currentRole as keyof typeof ROLE_KEYWORDS] || [];

      const analysisResult = analyzeResume(extractedText, currentRole, keywords);

      await db.ensureProfile(
        user.id,
        user.email ?? '',
        profile?.name ?? user.email ?? ''
      );

      const resumeData = await db.saveResume({
        user_id: user.id,
        user_name: profile?.name ?? user.email ?? '',
        user_email: user.email ?? '',
        file_name: state.resumeFile.name,
        file_content: extractedText,
        selected_role: currentRole,
        is_custom_role: state.isUsingCustomRole,
      });

      const analysisData = await db.saveAnalysis({
        resume_id: resumeData.id,
        user_id: user.id,
        user_name: profile?.name ?? user.email ?? '',
        user_email: user.email ?? '',
        keyword_score: analysisResult.scores.keywordScore,
        format_score: analysisResult.scores.formatScore,
        structure_score: analysisResult.scores.structureScore,
        skills_score: analysisResult.scores.skillsScore,
        ats_score: analysisResult.scores.atsScore,
        overall_score: analysisResult.scores.overallScore,
        keyword_details: analysisResult.details.keyword_details,
        format_details: analysisResult.details.format_details,
        structure_details: analysisResult.details.structure_details,
        skills_details: analysisResult.details.skills_details,
        ats_details: analysisResult.details.ats_details,
        suggestions: analysisResult.details.suggestions,
      });

      setState((prev) => ({
        ...prev,
        success: true,
        analysisId: analysisData.id,
        loading: false,
      }));

      // Cache for instant loading on the results page
      try {
        localStorage.setItem(`analysis_${analysisData.id}`, JSON.stringify(analysisData));
      } catch (e) {
        console.warn('Failed to cache analysis result:', e);
      }

      setTimeout(() => {
        router.push(`/dashboard/results/${analysisData.id}`);
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during analysis';
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
    }
  };

  const isReady = state.resumeFile && (state.isUsingCustomRole ? state.customRole.trim() : state.selectedRole);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-64 p-4 md:p-8">
        <div className="max-w-3xl mx-auto mt-16 md:mt-0">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-black text-foreground mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              New Analysis
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Follow your own path: upload your resume first or pick a target role first.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Path 1: Resume First */}
            <Card className={`relative border-2 transition-all duration-300 overflow-hidden ${
              activePath === 'resume' ? 'border-primary shadow-[0_0_20px_rgba(var(--primary),0.1)]' : 'border-border grayscale-[0.5] hover:grayscale-0'
            }`}>
              {state.resumeFile && (
                <div className="absolute top-4 right-4 bg-green-500 text-white p-1 rounded-full">
                  <Check size={16} />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Upload size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Upload Resume</h3>
                    <p className="text-xs text-muted-foreground">Select your document for analysis</p>
                  </div>
                </div>

                <div className={`space-y-4 transition-all ${activePath === 'role' && !state.resumeFile ? 'opacity-50' : 'opacity-100'}`}>
                  <label htmlFor="file-input" className="group cursor-pointer block">
                    <div className="border-2 border-dashed border-border group-hover:border-primary rounded-xl p-8 text-center transition-all bg-muted/20 hover:bg-primary/5">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-input"
                        disabled={state.loading}
                      />
                      <FileText className={`mx-auto h-10 w-10 mb-3 transition-colors ${state.resumeFile ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                      <p className="font-bold text-sm block truncate max-w-full">
                        {state.resumeFile ? state.resumeFile.name : 'Choose Resume'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">PDF or Word</p>
                    </div>
                  </label>
                </div>
              </div>
            </Card>

            {/* Path 2: Role First */}
            <Card className={`relative border-2 transition-all duration-300 overflow-hidden ${
              activePath === 'role' ? 'border-secondary shadow-[0_0_20px_rgba(var(--secondary),0.1)]' : 'border-border grayscale-[0.5] hover:grayscale-0'
            }`}>
              {(state.isUsingCustomRole ? state.customRole.trim() : state.selectedRole) && (
                <div className="absolute top-4 right-4 bg-green-500 text-white p-1 rounded-full">
                  <Check size={16} />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <ArrowRight size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Choose the Role</h3>
                    <p className="text-xs text-muted-foreground">Set your target job position</p>
                  </div>
                </div>

                <div className={`space-y-4 transition-all ${activePath === 'resume' && !(state.isUsingCustomRole ? state.customRole.trim() : state.selectedRole) ? 'opacity-50' : 'opacity-100'}`}>
                  <div className="space-y-3">
                    <select
                      id="role"
                      value={state.isUsingCustomRole ? 'custom' : state.selectedRole}
                      onChange={handleRoleChange}
                      disabled={state.loading}
                      className="w-full px-4 py-3 border border-input rounded-xl bg-background text-foreground font-medium focus:ring-2 focus:ring-secondary outline-none transition-all"
                    >
                      {PREDEFINED_ROLES.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                      <option value="custom">Custom Role...</option>
                    </select>

                    {state.isUsingCustomRole && (
                      <Input
                        type="text"
                        placeholder="Type job title..."
                        className="h-12 border-secondary/30 focus:border-secondary"
                        value={state.customRole}
                        onChange={handleCustomRoleChange}
                        disabled={state.loading}
                      />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Final Action Area */}
          <Card className="border border-border bg-card shadow-xl overflow-hidden">
            <div className={`h-1.5 bg-muted overflow-hidden`}>
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" 
                style={{ width: isReady ? '100%' : state.resumeFile || (state.isUsingCustomRole ? state.customRole : state.selectedRole) ? '50%' : '0%' }}
              />
            </div>
            
            <div className="p-8">
              {state.error && (
                <Alert variant="destructive" className="mb-6 animate-in slide-in-from-top-1">
                  <AlertCircle size={18} />
                  <AlertDescription className="font-medium ml-2">{state.error}</AlertDescription>
                </Alert>
              )}

              {state.success && (
                <Alert className="mb-6 bg-green-50 border-green-200 animate-in zoom-in-95">
                  <CheckCircle2 className="text-green-600" size={18} />
                  <AlertDescription className="text-green-800 font-bold ml-2">
                    Analysis complete! Preparing your results...
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleAnalyze}
                disabled={state.loading || !isReady}
                className={`w-full h-16 text-lg font-black rounded-2xl transition-all duration-300 gap-3 shadow-xl ${
                  isReady 
                    ? 'bg-gradient-to-r from-primary via-secondary to-accent text-white hover:scale-[1.01] active:scale-[0.99] shadow-primary/20' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {state.loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white/30 border-t-white"></div>
                    Processing Resume...
                  </>
                ) : (
                  <>
                    <Zap size={22} className={isReady ? 'animate-pulse' : ''} />
                    {isReady ? 'Confirm & Analyze' : 'Complete Both Steps to Start'}
                  </>
                )}
              </Button>
              
              <p className="text-center text-xs text-muted-foreground mt-4 font-medium uppercase tracking-[0.2em] opacity-50">
                AI Powered ATS Optimization Engine
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={null}>
      <AnalyzeContent />
    </Suspense>
  );
}

// Adding missing imports
import { AlertCircle, Check, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
