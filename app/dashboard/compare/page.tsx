'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/useAuth';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, ArrowRight, Scale, Files, Trophy } from 'lucide-react';
import { db } from '@/lib/supabase/db';

interface ResumeWithAnalysis {
  id: string;
  file_name: string;
  selected_role: string;
  analysis?: any;
}

export default function ComparePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [resumes, setResumes] = useState<ResumeWithAnalysis[]>([]);
  const [selectedId1, setSelectedId1] = useState<string>('');
  const [selectedId2, setSelectedId2] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comparing, setComparing] = useState(false);
  const [comparisonData, setComparisonData] = useState<any>(null);

  // Initialize from cache
  useEffect(() => {
    const cachedResumes = localStorage.getItem('dashboard_resumes');
    if (cachedResumes) {
      try {
        const validResumes = JSON.parse(cachedResumes).filter((r: any) => r.analysis !== undefined);
        setResumes(validResumes);
        if (validResumes.length >= 2) {
          setSelectedId1(validResumes[0].id);
          setSelectedId2(validResumes[1].id);
        }
        setLoading(false);
      } catch (e) {
        console.error('Error parsing cached resumes for comparison:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchResumesData = async () => {
      try {
        if (resumes.length === 0) setLoading(true);
        const data = await db.getResumes(user.id);
        
        // Map data to our local interface
        const validResumes: ResumeWithAnalysis[] = data
          .map((r: any) => {
            const analysis = Array.isArray(r.analysis) ? r.analysis[0] : r.analysis;
            return {
              ...r,
              analysis: analysis || undefined
            };
          })
          .filter((r: ResumeWithAnalysis) => r.analysis !== undefined);

        setResumes(validResumes);

        if (validResumes.length >= 2 && !selectedId1 && !selectedId2) {
          setSelectedId1(validResumes[0].id);
          setSelectedId2(validResumes[1].id);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading resumes');
      } finally {
        setLoading(false);
      }
    };

    fetchResumesData();
  }, [user, authLoading, router]);

  const handleCompare = async () => {
    if (!selectedId1 || !selectedId2) {
      setError('Please select two resumes to compare');
      return;
    }

    if (selectedId1 === selectedId2) {
      setError('Please select two different resumes');
      return;
    }

    setComparing(true);
    setError(null);

    try {
      const resume1 = resumes.find((r) => r.id === selectedId1);
      const resume2 = resumes.find((r) => r.id === selectedId2);

      if (!resume1 || !resume2) {
        setError('Selected resumes not found');
        return;
      }

      const analysis1 = resume1.analysis;
      const analysis2 = resume2.analysis;

      if (!analysis1 || !analysis2) {
        setError('Analysis data not found for one or both resumes');
        return;
      }

      // Create comparison data
      const comparison = {
        resume1: {
          name: resume1.file_name,
          role: resume1.selected_role,
          ...analysis1,
          id: resume1.id,
        },
        resume2: {
          name: resume2.file_name,
          role: resume2.selected_role,
          ...analysis2,
          id: resume2.id,
        },
      };

      setComparisonData(comparison);
    } catch (err) {
      setError('An error occurred during comparison');
    } finally {
      setComparing(false);
    }
  };

  if ((loading || authLoading) && resumes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading resumes...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mt-16 md:mt-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Compare Resumes</h1>
            <p className="text-muted-foreground">
              Side-by-side comparison of your resume analyses to find the best version
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {resumes.length < 2 ? (
            <Card className="border border-border bg-card shadow-lg">
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 text-primary">
                  <Files size={32} />
                </div>
                <p className="text-foreground text-xl font-bold mb-2">Need more data</p>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  You need at least 2 analyzed resumes to perform a side-by-side comparison.
                </p>
                <Link href="/dashboard/analyze">
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-bold px-8 py-6 rounded-xl text-lg">
                    Analyze Another Resume
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <>
              {/* Selection Section */}
              <Card className="border border-border bg-card shadow-lg mb-8 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Scale size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Select Resumes to Compare</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Resume 1 */}
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        First Version
                      </label>
                      <div className="relative">
                        <select
                          value={selectedId1}
                          onChange={(e) => setSelectedId1(e.target.value)}
                          className="w-full h-14 pl-4 pr-10 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary appearance-none font-medium transition-all"
                        >
                          <option value="">Select a resume</option>
                          {resumes.map((resume) => (
                            <option key={resume.id} value={resume.id}>
                              {resume.file_name} ({resume.analysis?.overall_score || 0}/100)
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                          <Files size={20} />
                        </div>
                      </div>
                    </div>

                    {/* Resume 2 */}
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        Second Version
                      </label>
                      <div className="relative">
                        <select
                          value={selectedId2}
                          onChange={(e) => setSelectedId2(e.target.value)}
                          className="w-full h-14 pl-4 pr-10 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary appearance-none font-medium transition-all"
                        >
                          <option value="">Select a resume</option>
                          {resumes.map((resume) => (
                            <option key={resume.id} value={resume.id}>
                              {resume.file_name} ({resume.analysis?.overall_score || 0}/100)
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                          <Files size={20} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleCompare}
                    disabled={comparing || !selectedId1 || !selectedId2 || selectedId1 === selectedId2}
                    className="w-full h-14 bg-primary hover:opacity-90 text-primary-foreground font-black text-lg rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                  >
                    {comparing ? (
                      <div className="h-6 w-6 border-3 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Run Comparative Analysis
                        <ArrowRight size={20} />
                      </>
                    )}
                  </Button>
                </div>
              </Card>

              {/* Comparison Results */}
              {comparisonData && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                  {/* Overall Score Comparison */}
                  <Card className="border border-border bg-card shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Trophy size={160} />
                    </div>
                    <div className="p-8 relative">
                      <h2 className="text-2xl font-bold text-foreground mb-10 text-center uppercase tracking-widest">
                        Score Battle
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Resume 1 */}
                        <div className="text-center group">
                          <h3 className="font-extrabold text-foreground mb-6 transition-all group-hover:text-primary">
                            {comparisonData.resume1.name}
                          </h3>
                          <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-primary/10 border-4 border-primary/20 shadow-inner group-hover:scale-105 transition-transform">
                            <div className="text-center">
                              <div className="text-6xl font-black text-primary">
                                {comparisonData.resume1.overall_score}
                              </div>
                              <div className="text-muted-foreground font-bold text-xs uppercase">Overall</div>
                            </div>
                          </div>
                        </div>

                        {/* Resume 2 */}
                        <div className="text-center group">
                          <h3 className="font-extrabold text-foreground mb-6 transition-all group-hover:text-secondary">
                            {comparisonData.resume2.name}
                          </h3>
                          <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-secondary/10 border-4 border-secondary/20 shadow-inner group-hover:scale-105 transition-transform">
                            <div className="text-center">
                              <div className="text-6xl font-black text-secondary">
                                {comparisonData.resume2.overall_score}
                              </div>
                              <div className="text-muted-foreground font-bold text-xs uppercase">Overall</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Winner Verdict */}
                      <div className="mt-12 text-center pt-8 border-t border-border">
                        {comparisonData.resume1.overall_score > comparisonData.resume2.overall_score ? (
                          <p className="text-2xl font-black text-green-600 flex items-center justify-center gap-3">
                            <CheckCircle2 size={32} />
                            {comparisonData.resume1.name} WINS!
                          </p>
                        ) : comparisonData.resume2.overall_score > comparisonData.resume1.overall_score ? (
                          <p className="text-2xl font-black text-green-600 flex items-center justify-center gap-3">
                            <CheckCircle2 size={32} />
                            {comparisonData.resume2.name} WINS!
                          </p>
                        ) : (
                          <p className="text-2xl font-black text-amber-600">IT'S A DEAD HEAT!</p>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Detailed Metric Matrix */}
                  <Card className="border border-border bg-card shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-foreground mb-10 text-center uppercase tracking-widest">
                      Metric Matrix
                    </h2>
                    <div className="space-y-10">
                      {[
                        { label: 'Keyword Match', key: 'keyword_score' },
                        { label: 'Formatting Integrity', key: 'format_score' },
                        { label: 'Structural Logic', key: 'structure_score' },
                        { label: 'Skill Density', key: 'skills_score' },
                        { label: 'ATS Compliance', key: 'ats_score' },
                      ].map((metric) => (
                        <div key={metric.key} className="space-y-4">
                          <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border-l-4 border-primary">
                            <span className="font-black text-foreground uppercase tracking-widest text-sm">
                              {metric.label}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-4 bg-muted/20 rounded-xl">
                              <div className="flex justify-between items-center mb-3">
                                <p className="text-xs font-bold text-muted-foreground truncate max-w-[150px]">
                                  {comparisonData.resume1.name}
                                </p>
                                <span className="text-sm font-black text-primary">
                                  {comparisonData.resume1[metric.key]}/100
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-3 overflow-hidden shadow-inner">
                                <div
                                  className="h-full rounded-full bg-primary transition-all duration-1000"
                                  style={{ width: `${comparisonData.resume1[metric.key]}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="p-4 bg-muted/20 rounded-xl">
                              <div className="flex justify-between items-center mb-3">
                                <p className="text-xs font-bold text-muted-foreground truncate max-w-[150px]">
                                  {comparisonData.resume2.name}
                                </p>
                                <span className="text-sm font-black text-secondary">
                                  {comparisonData.resume2[metric.key]}/100
                                </span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-3 overflow-hidden shadow-inner">
                                <div
                                  className="h-full rounded-full bg-secondary transition-all duration-1000"
                                  style={{ width: `${comparisonData.resume2[metric.key]}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pb-12">
                    <Button
                      variant="outline"
                      onClick={() => setComparisonData(null)}
                      className="px-8 py-6 rounded-xl font-bold text-lg border-primary/20 hover:bg-primary/5 transition-all"
                    >
                      Reset Comparison
                    </Button>
                    <Link href="/dashboard">
                      <Button className="px-8 py-6 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/20 transition-all">
                        Back to Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
