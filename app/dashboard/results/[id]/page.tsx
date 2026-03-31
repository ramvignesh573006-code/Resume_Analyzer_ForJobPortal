'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import { Sidebar } from '@/components/sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { db } from '@/lib/supabase/db';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ResultsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();

  const [analysis, setAnalysis] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from cache
  useEffect(() => {
    const id = params.id as string;
    if (!id) return;
    
    const cachedData = localStorage.getItem(`analysis_${id}`);
    if (cachedData) {
      try {
        setAnalysis(JSON.parse(cachedData));
        setLoading(false);
      } catch (e) {
        console.error('Error parsing cached analysis:', e);
      }
    }
  }, [params.id]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchAnalysis = async () => {
      try {
        const id = params.id as string;
        // Only show loading if we don't have analysis yet
        if (!analysis) setLoading(true);
        
        const data = await db.getAnalysisById(id);

        if (!data) {
          setError('Analysis results not found');
          return;
        }

        if (data.user_id !== user.id) {
          setError('Unauthorized access');
          return;
        }

        setAnalysis(data);
        // Cache the data
        localStorage.setItem(`analysis_${id}`, JSON.stringify(data));
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading results');
        console.error('Fetch analysis error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [user, authLoading, params.id, router]);

  // Only show full loading if we have no analysis data and we are still loading
  if ((loading || authLoading) && !analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analysis results...</p>
        </div>
      </div>
    );
  }

  if (error && !analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md border border-border bg-card shadow-lg">
          <div className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Analysis not found</p>
            <Button onClick={() => router.push('/dashboard/analyze')} className="bg-primary hover:opacity-90">
              Back to Upload
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const scoreData = [
    { name: 'Keyword Match', value: analysis.keyword_score },
    { name: 'Format', value: analysis.format_score },
    { name: 'Structure', value: analysis.structure_score },
    { name: 'Skills', value: analysis.skills_score },
    { name: 'ATS Score', value: analysis.ats_score },
  ];

  const pieData = [
    { name: 'Keyword Match', value: analysis.keyword_score },
    { name: 'Format', value: analysis.format_score },
    { name: 'Structure', value: analysis.structure_score },
    { name: 'Skills', value: analysis.skills_score },
    { name: 'ATS Score', value: analysis.ats_score },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'from-green-500/20 via-emerald-500/10 to-transparent border-green-500/30 shadow-[0_0_50px_-12px_rgba(34,197,94,0.4)]';
    if (score >= 60) return 'from-amber-500/20 via-orange-500/10 to-transparent border-amber-500/30 shadow-[0_0_50px_-12px_rgba(245,158,11,0.4)]';
    return 'from-red-500/20 via-rose-500/10 to-transparent border-red-500/30 shadow-[0_0_50px_-12px_rgba(239,68,68,0.4)]';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]';
    if (score >= 60) return 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]';
    return 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]';
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="md:ml-64 p-4 md:p-8">
        <div className="max-w-7xl mx-auto mt-16 md:mt-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Resume Analysis Results</h1>
            <p className="text-muted-foreground">Detailed insights and recommendations for your resume</p>
          </div>

          {/* Overall Score */}
          <Card className="mb-8 border border-border bg-card shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <TrendingUp size={120} />
            </div>
            <div className="p-8 relative">
              <div className="text-center mb-6">
                <div className={`relative inline-flex items-center justify-center w-56 h-56 rounded-full bg-gradient-to-br ${getScoreBgColor(analysis.overall_score)} border-2 backdrop-blur-md transition-all duration-1000`}>
                  <div className="absolute inset-0 rounded-full animate-pulse-slow opacity-20 bg-current"></div>
                  <div className="text-center relative z-10">
                    <div className={`text-8xl font-black tracking-tighter ${getScoreTextColor(analysis.overall_score)}`}>
                      {analysis.overall_score}
                    </div>
                    <div className="text-muted-foreground font-bold text-xs mt-1 uppercase tracking-[0.2em]">Overall Score</div>
                  </div>
                </div>
              </div>
              <div className="text-center max-w-lg mx-auto">
                {analysis.overall_score >= 80 && (
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 font-black text-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    Excellent! Your resume is highly competitive.
                  </p>
                )}
                {analysis.overall_score >= 60 && analysis.overall_score < 80 && (
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 font-black text-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    Good! Consider the suggestions below to improve.
                  </p>
                )}
                {analysis.overall_score < 60 && (
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600 font-black text-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    Needs improvement. Follow the recommendations below.
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Scores Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="border border-border bg-card shadow-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-8">Score Breakdown</h2>
              <div className="space-y-6">
                {scoreData.map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-foreground font-semibold">{item.name}</span>
                      <span className={`font-bold text-lg ${getScoreColor(item.value)}`}>{item.value}/100</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          item.value >= 80
                            ? 'bg-green-500'
                            : item.value >= 60
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border border-border bg-card shadow-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-8">Score Distribution</h2>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Keywords */}
            <Card className="border border-border bg-card shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground">Keyword Analysis</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Matched Keywords</span>
                  <p className="font-bold text-green-600 text-lg">
                    {analysis.keyword_details.matched_keywords.length}/{analysis.keyword_details.matched_keywords.length + (analysis.keyword_details.missing_keywords?.length || 0)}
                  </p>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Match Percentage</span>
                  <p className="font-bold text-lg">{analysis.keyword_details.match_percentage}%</p>
                </div>
                {analysis.keyword_details.matched_keywords.length > 0 && (
                  <div>
                    <span className="text-sm font-semibold text-foreground block mb-3">Found Highlights</span>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keyword_details.matched_keywords.slice(0, 8).map((keyword: string) => (
                        <span
                          key={keyword}
                          className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
                        >
                          {keyword}
                        </span>
                      ))}
                      {analysis.keyword_details.matched_keywords.length > 8 && (
                        <span className="text-muted-foreground text-xs self-center font-medium">
                          +{analysis.keyword_details.matched_keywords.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Skills */}
            <Card className="border border-border bg-card shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-secondary/10 text-secondary">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground">Skills Analysis</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Total Skills Found</span>
                  <p className="font-bold text-lg">{analysis.skills_details.skills_count}</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Technical Matrix</span>
                  <p className="font-bold">{analysis.skills_details.technical_skills_found.length} items</p>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Soft Skills</span>
                  <p className="font-bold">{analysis.skills_details.soft_skills_found.length} items</p>
                </div>
              </div>
            </Card>

            {/* Structure */}
            <Card className="border border-border bg-card shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <Lightbulb size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground">Structure Integrity</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Contact Info', status: analysis.structure_details.has_contact_info },
                  { label: 'Professional Summary', status: analysis.structure_details.has_summary },
                  { label: 'Work Experience', status: analysis.structure_details.has_experience },
                  { label: 'Education History', status: analysis.structure_details.has_education },
                  { label: 'Skills Section', status: analysis.structure_details.has_skills },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{item.label}</span>
                    <div className="flex items-center gap-2">
                       {item.status ? (
                         <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded text-xs uppercase">Complete</span>
                       ) : (
                         <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded text-xs uppercase">Missing</span>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* ATS Compatibility */}
            <Card className="border border-border bg-card shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-foreground">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-xl font-bold text-foreground">ATS Compliance</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Compatibility Score</span>
                  <p className={`font-bold text-lg ${getScoreColor(analysis.ats_details.ats_compatibility_score)}`}>
                    {analysis.ats_details.ats_compatibility_score}/100
                  </p>
                </div>
                {analysis.ats_details.issues.length > 0 && (
                  <div>
                    <span className="text-sm font-semibold text-foreground block mb-2">Compliance Warnings:</span>
                    <ul className="space-y-2">
                      {analysis.ats_details.issues.map((issue: string, idx: number) => (
                        <li key={idx} className="flex gap-2 text-sm text-foreground bg-muted/50 p-3 rounded-lg border border-border/50">
                          <span className="font-bold text-primary">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Suggestions */}
          <Card className="border border-border bg-card shadow-lg mb-12 p-8">
            <h3 className="text-2xl font-bold text-foreground mb-6"> Strategic Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.suggestions.map((suggestion: string, idx: number) => (
                <div key={idx} className="flex gap-4 p-4 bg-muted hover:bg-muted/80 transition-colors rounded-xl border border-border">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-foreground leading-relaxed font-medium">{suggestion}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pb-12">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="px-8 py-6 rounded-xl font-bold text-lg border-primary/20 hover:bg-primary/5 transition-all"
            >
              Return to Dashboard
            </Button>
            <Button
              onClick={() => router.push('/dashboard/analyze')}
              className="px-8 py-6 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/20 transition-all"
            >
              Analyze New Resume
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
