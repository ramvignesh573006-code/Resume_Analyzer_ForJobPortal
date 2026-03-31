import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  FileText,
  BarChart3,
  Zap,
  CheckCircle2,
  TrendingUp,
  Shield,
  ArrowRight,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-lg">
                RA
              </div>
              <span className="font-bold text-lg text-foreground">Resume Analyzer</span>
            </div>
            <div className="flex gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-foreground hover:bg-muted">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Land Your Dream Job with{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI-Powered Resume Analysis
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get comprehensive analysis of your resume including keyword matching, ATS compatibility
              checks, and actionable improvement suggestions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground gap-2">
                  Analyze Your Resume
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            <div className="relative group rounded-2xl p-[1px] bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300">
              <div className="rounded-2xl bg-[#0d0d1a] p-5 text-center h-full flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-1">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-indigo-400">98%</div>
                <p className="text-xs text-muted-foreground font-medium">ATS Pass Rate</p>
              </div>
            </div>
            <div className="relative group rounded-2xl p-[1px] bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300">
              <div className="rounded-2xl bg-[#0d0d1a] p-5 text-center h-full flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-1">
                  <Zap size={20} className="text-white" />
                </div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-400">500+</div>
                <p className="text-xs text-muted-foreground font-medium">Keywords Tracked</p>
              </div>
            </div>
            <div className="relative group rounded-2xl p-[1px] bg-gradient-to-br from-orange-500 to-pink-500 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300">
              <div className="rounded-2xl bg-[#0d0d1a] p-5 text-center h-full flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center mb-1">
                  <BarChart3 size={20} className="text-white" />
                </div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-pink-400">5</div>
                <p className="text-xs text-muted-foreground font-medium">Analysis Dimensions</p>
              </div>
            </div>
            <div className="relative group rounded-2xl p-[1px] bg-gradient-to-br from-sky-500 to-cyan-400 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all duration-300">
              <div className="rounded-2xl bg-[#0d0d1a] p-5 text-center h-full flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center mb-1">
                  <Shield size={20} className="text-white" />
                </div>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-sky-400 to-cyan-300">∞</div>
                <p className="text-xs text-muted-foreground font-medium">Free Analyses</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to optimize your resume and increase your chances of landing interviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FileText,    title: 'Smart Resume Analysis',  description: 'Upload your resume in PDF or DOC format and get comprehensive analysis instantly.',                                              color: 'from-violet-500 to-indigo-500',  glow: 'shadow-violet-500/30 hover:shadow-violet-500/60',  border: 'hover:border-violet-500/60' },
              { icon: BarChart3,   title: 'Multi-Criteria Scoring', description: 'Get detailed scores for keywords, formatting, structure, skills, and ATS compatibility.',                                        color: 'from-emerald-500 to-teal-500',   glow: 'shadow-emerald-500/30 hover:shadow-emerald-500/60', border: 'hover:border-emerald-500/60' },
              { icon: Zap,         title: 'Actionable Insights',    description: 'Receive specific, personalized suggestions to improve your resume and increase interview chances.',                              color: 'from-orange-500 to-pink-500',    glow: 'shadow-orange-500/30 hover:shadow-orange-500/60',  border: 'hover:border-orange-500/60' },
              { icon: TrendingUp,  title: 'Performance Tracking',   description: 'Track your improvements over time and monitor your progress towards better scores.',                                            color: 'from-sky-500 to-cyan-400',       glow: 'shadow-sky-500/30 hover:shadow-sky-500/60',        border: 'hover:border-sky-500/60' },
              { icon: Shield,      title: 'ATS Optimization',       description: 'Ensure your resume passes Applicant Tracking System filters with our ATS compatibility check.',                                  color: 'from-fuchsia-500 to-purple-600', glow: 'shadow-fuchsia-500/30 hover:shadow-fuchsia-500/60', border: 'hover:border-fuchsia-500/60' },
              { icon: CheckCircle2,title: 'Resume Comparison',      description: 'Compare multiple versions of your resume to find the best performing version.',                                                  color: 'from-rose-500 to-orange-400',   glow: 'shadow-rose-500/30 hover:shadow-rose-500/60',      border: 'hover:border-rose-500/60' },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`relative group rounded-2xl border border-border bg-card overflow-hidden
                    transition-all duration-500 shadow-lg ${feature.glow} ${feature.border}
                    hover:-translate-y-1 hover:scale-[1.02]`}
                >
                  {/* Shimmer sweep on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                    bg-[linear-gradient(135deg,transparent_40%,rgba(255,255,255,0.04)_50%,transparent_60%)]
                    bg-[length:200%_200%] group-hover:animate-[shimmer_1.2s_ease_forwards]" />

                  {/* Top gradient accent bar */}
                  <div className={`h-[3px] w-full bg-gradient-to-r ${feature.color} opacity-80 group-hover:opacity-100 transition-opacity`} />

                  <div className="p-6">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4
                      shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <Icon className="text-white" size={24} />
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* How It Works Section */}
      <section className="py-20 md:py-32 border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple three-step process to optimize your resume
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: '1', title: 'Sign Up', description: 'Create your free account in seconds with your email and password.' },
              { number: '2', title: 'Upload Resume', description: 'Upload your resume in PDF or Word format and select your target role.' },
              { number: '3', title: 'Get Analysis', description: 'Receive comprehensive analysis with scores and actionable suggestions.' },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-8">
                    <ArrowRight className="text-primary" size={32} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-0 bg-gradient-to-r from-primary to-secondary">
            <div className="p-12 text-center">
              <h2 className="text-4xl font-bold text-primary-foreground mb-4">
                Ready to Optimize Your Resume?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Start your journey to landing more interviews with our resume analysis tool.
              </p>
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-white gap-2 font-semibold"
                >
                  Get Started Now
                  <ArrowRight size={20} />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                RA
              </div>
              <span className="font-semibold text-foreground">Resume Analyzer</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Resume Analyzer. All rights reserved. | Built with Next.js & LocalStore
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
