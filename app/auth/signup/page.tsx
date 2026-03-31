'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/useAuth';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus, Mail, Lock as LockIcon, User, ArrowRight, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    // Already logged in? Redirect to dashboard
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // 1. Sign up user in Supabase Auth
      const { data, error: signupError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.name.trim(),
          },
        },
      });

      if (signupError) {
        if (signupError.message.includes('rate limit')) {
          setError('Email rate limit exceeded. Please wait a few minutes.');
        } else {
          setError(signupError.message);
        }
        setLoading(false);
        return;
      }
      
      const hasSession = !!data.session;
      setSuccess(true);
      
      // Navigate after a short delay
      setTimeout(() => {
        if (hasSession) {
          router.push('/dashboard');
        } else {
          const params = new URLSearchParams({
            email: formData.email,
            signup: 'success',
            confirmed: 'false'
          });
          router.push(`/auth/login?${params.toString()}`);
        }
      }, 1000);

    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred. Please try again.');
      console.error('Signup error:', err);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
        {/* Abstract Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px]"></div>
        </div>

        <Card className="w-full max-w-md border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
          <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-inner">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-3xl font-black text-foreground mb-4 tracking-tight">Account Created!</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Your account for <span className="font-bold text-foreground">{formData.email}</span> has been created. 
              {" If you haven't disabled 'Email Confirmation' in Supabase, please check your inbox to verify your account before logging in."}
            </p>
            <div className="space-y-4">
              <Button 
                onClick={() => router.push('/auth/login')}
                className="w-full h-12 bg-primary hover:opacity-90 text-primary-foreground font-bold rounded-xl shadow-lg transition-all"
              >
                Go to Login
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Abstract Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px]"></div>
      </div>

      <Card className="w-full max-w-md border border-border bg-card shadow-2xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <UserPlus size={32} />
            </div>
          </div>
          
          <h1 className="text-4xl font-black text-center text-foreground mb-2 tracking-tight">
            Join Us
          </h1>
          <p className="text-center text-muted-foreground text-sm mb-8">
            Create your account to start analyzing resumes
          </p>

          {error && (
            <Alert variant="destructive" className="mb-6 animate-in fade-in slide-in-from-top-2">
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <User size={16} className="text-muted-foreground" />
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                className="h-12 border-border focus-visible:ring-primary"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Mail size={16} className="text-muted-foreground" />
                Email Address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="h-12 border-border focus-visible:ring-primary"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <LockIcon size={16} className="text-muted-foreground" />
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 border-border focus-visible:ring-primary"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <ShieldCheck size={16} className="text-muted-foreground" />
                  Confirm
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 border-border focus-visible:ring-primary"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-primary hover:opacity-90 text-primary-foreground font-bold text-lg rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={20} />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-4">
            <p className="text-muted-foreground text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:underline font-bold transition-all">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </Card>
      
      {/* Footer Info */}
      <div className="absolute bottom-6 text-center w-full text-muted-foreground/40 text-xs font-medium uppercase">
        Secure Data Storage • AI Powered Analysis
      </div>
    </div>
  );
}
