'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/useAuth';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart3, FileText, TrendingUp, Clock, Trash2, Eye, Plus, Upload, Zap, ArrowRight, Target } from 'lucide-react';
import { db } from '@/lib/supabase/db';

interface DashboardStats {
  totalResumes: number;
  averageScore: number;
  latestAnalysis: string | null;
}

interface ResumeWithAnalysis {
  id: string;
  file_name: string;
  selected_role: string;
  created_at: string;
  analysis?: {
    id: string;
    overall_score: number;
  };
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [resumes, setResumes] = useState<ResumeWithAnalysis[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalResumes: 0,
    averageScore: 0,
    latestAnalysis: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from cache
  useEffect(() => {
    const cachedResumes = localStorage.getItem('dashboard_resumes');
    const cachedStats = localStorage.getItem('dashboard_stats');
    
    if (cachedResumes) {
      try {
        setResumes(JSON.parse(cachedResumes));
        if (cachedStats) setStats(JSON.parse(cachedStats));
        setLoading(false);
      } catch (e) {
        console.error('Error parsing cached dashboard data:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Only show loading if we don't have records yet
        if (resumes.length === 0) setLoading(true);
        
        const data = await db.getResumes(user.id);
        
        // Map data to our local interface
        const resumesWithAnalysis = data.map((r: any) => {
          // Supabase returns analysis as an array due to one-to-many relationship
          // although it's one-to-one in our logic, so we take the first element.
          const analysis = Array.isArray(r.analysis) ? r.analysis[0] : r.analysis;
          return {
            ...r,
            analysis: analysis ? { id: analysis.id, overall_score: analysis.overall_score } : undefined
          };
        });

        setResumes(resumesWithAnalysis);
        localStorage.setItem('dashboard_resumes', JSON.stringify(resumesWithAnalysis));

        // Calculate stats
        if (resumesWithAnalysis.length > 0) {
          const scores = resumesWithAnalysis
            .map((r: any) => r.analysis?.overall_score)
            .filter((s: any) => s !== undefined) as number[];

          const avgScore =
            scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0;

          const newStats = {
            totalResumes: resumesWithAnalysis.length,
            averageScore: avgScore,
            latestAnalysis: resumesWithAnalysis[0]?.created_at || null,
          };
          setStats(newStats);
          localStorage.setItem('dashboard_stats', JSON.stringify(newStats));
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading data');
        console.error('Fetch dashboard data error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, authLoading, router]);

  const handleDelete = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      await db.deleteResume(resumeId);

      setResumes((prev) => {
        const updatedResumes = prev.filter((r) => r.id !== resumeId);
        localStorage.setItem('dashboard_resumes', JSON.stringify(updatedResumes));
        
        // Update stats
        if (updatedResumes.length > 0) {
          const scores = updatedResumes
            .map((r) => r.analysis?.overall_score)
            .filter((s) => s !== undefined) as number[];

          const avgScore =
            scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

          const newStats = {
            totalResumes: updatedResumes.length,
            averageScore: avgScore,
            latestAnalysis: updatedResumes[0]?.created_at || null,
          };
          setStats(newStats);
          localStorage.setItem('dashboard_stats', JSON.stringify(newStats));
        } else {
          setStats({ totalResumes: 0, averageScore: 0, latestAnalysis: null });
          localStorage.removeItem('dashboard_stats');
        }
        
        return updatedResumes;
      });

    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting the resume');
    }
  };

  // Only show full loading if we have no data and auth is still thinking or data is fetching
  if ((authLoading || loading) && resumes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user && !authLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <main className="md:ml-64 p-4 md:p-8">
        {/* Quick Actions Header */}
        <div className="mb-8 mt-16 md:mt-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">My Dashboard</h1>
              <p className="text-muted-foreground font-medium tracking-wide italic">"Success is where preparation and opportunity meet."</p>
            </div>
            <Link href="/dashboard/analyze">
              <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-black px-6 py-6 rounded-2xl shadow-xl shadow-primary/20 gap-2 transition-transform hover:scale-[1.02]">
                <Plus size={24} />
                Start New Analysis
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link href="/dashboard/analyze?path=resume">
              <Card className="p-8 border-2 border-primary/20 hover:border-primary bg-card hover:shadow-2xl transition-all group overflow-hidden relative">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Upload size={120} />
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-2 tracking-tight">Upload Resume</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      Upload your resume file and we'll analyze it for your target role.
                    </p>
                    <span className="text-primary font-black flex items-center gap-2 group-hover:gap-3 transition-all text-sm uppercase tracking-widest">
                      Go to Upload <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>

            <Link href="/dashboard/analyze?path=role">
              <Card className="p-8 border-2 border-secondary/20 hover:border-secondary bg-card hover:shadow-2xl transition-all group overflow-hidden relative">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap size={120} />
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                    <Target size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-2 tracking-tight">Choose the Role</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      Select your target role first and we'll compare your resume against it.
                    </p>
                    <span className="text-secondary font-black flex items-center gap-2 group-hover:gap-3 transition-all text-sm uppercase tracking-widest">
                      Choose Role <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards - 3 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Total Resumes Card */}
          <Card className="border border-border bg-card hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Total Resumes
                </h3>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <FileText className="text-primary" size={24} />
                </div>
              </div>
              <p className="text-4xl font-bold text-foreground mb-2">{stats.totalResumes}</p>
              <p className="text-xs text-muted-foreground">Resumes uploaded</p>
            </div>
          </Card>

          {/* Average Score Card */}
          <Card className="border border-border bg-card hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp size={80} />
            </div>
            <div className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                  Average Score
                </h3>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/20">
                  <TrendingUp className="text-green-500" size={24} />
                </div>
              </div>
              <div className="flex flex-col">
                <p className={`text-5xl font-black mb-3 tracking-tighter ${
                  stats.averageScore >= 80 ? 'text-green-500' : stats.averageScore >= 60 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {stats.averageScore}%
                </p>
                <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden mb-2">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      stats.averageScore >= 80 ? 'bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 
                      stats.averageScore >= 60 ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)]' : 
                      'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]'
                    }`}
                    style={{ width: `${stats.averageScore}%` }}
                  />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Overall performance ranking</p>
              </div>
            </div>
          </Card>

          {/* Latest Analysis Card */}
          <Card className="border border-border bg-card hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Latest
                </h3>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
                  <Clock className="text-secondary" size={24} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground mb-2">
                {stats.latestAnalysis
                  ? new Date(stats.latestAnalysis).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground">Analysis date</p>
            </div>
          </Card>
        </div>

        {/* Resumes Table */}
        <Card className="border border-border bg-card">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground">Analysis History</h2>
            <p className="text-sm text-muted-foreground mt-1">
              View all your uploaded resumes and analysis results
            </p>
          </div>

          {resumes.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-primary" size={32} />
              </div>
              <p className="text-foreground font-semibold text-lg mb-2">No resumes yet</p>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                Upload your first resume to get comprehensive analysis including keyword matching, ATS
                compatibility, and improvement suggestions.
              </p>
              <Link href="/dashboard/analyze">
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground">
                  Upload & Analyze
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      File Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Target Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Uploaded
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {resumes.map((resume) => {
                    const analysis = resume.analysis;
                    const score = analysis?.overall_score || 0;
                    const analysisId = analysis?.id;

                    return (
                      <tr
                        key={resume.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                              <FileText size={20} className="text-primary" />
                            </div>
                            <span className="truncate">{resume.file_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary font-medium">
                            {resume.selected_role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {analysis ? (
                            <div className="flex items-center gap-2">
                              <div className="text-right">
                                <div
                                  className={`text-sm font-bold ${
                                    score >= 80
                                      ? 'text-green-600'
                                      : score >= 60
                                        ? 'text-amber-600'
                                        : 'text-red-600'
                                  }`}
                                >
                                  {score}/100
                                </div>
                              </div>
                              <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    score >= 80
                                      ? 'bg-green-500'
                                      : score >= 60
                                        ? 'bg-amber-500'
                                        : 'bg-red-500'
                                  }`}
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">No analysis</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(resume.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {analysisId && (
                              <Link href={`/dashboard/results/${analysisId}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2 border-primary/20 text-primary hover:bg-primary/5"
                                >
                                  <Eye size={16} />
                                  View
                                </Button>
                              </Link>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 border-destructive/20 text-destructive hover:bg-destructive/5"
                              onClick={() => handleDelete(resume.id)}
                            >
                              <Trash2 size={16} />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
