'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock as LockIcon, LogIn, ArrowRight } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  useEffect(() => {
    // Already logged in? Redirect to dashboard
    if (!authLoading && user) {
      router.push('/dashboard');
    }

    const signupSuccess = searchParams.get('signup') === 'success';
    const emailParam = searchParams.get('email');
    const confirmedParam = searchParams.get('confirmed');

    if (signupSuccess) {
      setSuccess(true);
      if (confirmedParam === 'false') {
        setNeedsConfirmation(true);
      }
      const timer = setTimeout(() => setSuccess(false), 8000);
      
      if (emailParam) {
        setFormData((prev) => ({
          ...prev,
          email: emailParam,
        }));
      }
      
      return () => clearTimeout(timer);
    }
  }, [user, authLoading, searchParams, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResendEmail = async () => {
    if (!formData.email) {
      setError('Please enter your email first');
      return;
    }
    
    setResending(true);
    setError(null);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
      });
      
      if (resendError) {
        setError(resendError.message);
      } else {
        setResendSuccess(true);
      }
    } catch (err) {
      setError('Failed to resend email');
    } finally {
      setResending(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendSuccess(false);

    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!formData.password) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }

      // Successful login - navigation will be handled by the useEffect watching 'user'
      // but we can also push here for immediate response
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred');
      console.error('Login error:', err);
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border border-border bg-card shadow-2xl overflow-hidden relative z-10">
      <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent"></div>
      <div className="p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <LogIn size={32} />
          </div>
        </div>
        
        <h1 className="text-4xl font-black text-center text-foreground mb-2 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-center text-muted-foreground text-sm mb-8">
          Sign in to continue your resume analysis
        </p>

        {success && (
          <Alert className={`mb-6 animate-in fade-in slide-in-from-top-2 ${needsConfirmation ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
            <AlertDescription className={`${needsConfirmation ? 'text-amber-800' : 'text-green-800'} font-medium text-center`}>
              {needsConfirmation 
                ? "Account created! Please check your email to confirm your account before logging in." 
                : "Account created successfully! Please log in with your credentials."}
            </AlertDescription>
          </Alert>
        )}

        {resendSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200 animate-in fade-in slide-in-from-top-2">
            <AlertDescription className="text-green-800 font-medium text-center">
              Verification email resent! Please check your inbox.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <div className="space-y-4 mb-6">
            <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
              <AlertDescription className="font-medium">{error}</AlertDescription>
            </Alert>
            
            {(error.includes('confirmation link') || error.includes('not confirmed')) && (
              <Button
                variant="outline"
                onClick={handleResendEmail}
                disabled={resending}
                className="w-full border-primary/20 hover:bg-primary/5 text-primary font-bold transition-all"
              >
                {resending ? 'Resending...' : 'Resend Confirmation Email'}
              </Button>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
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

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary hover:opacity-90 text-primary-foreground font-bold text-lg rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
            ) : (
              <>
                Sign In
                <ArrowRight size={20} />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-sm text-center">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-primary hover:underline font-bold transition-all">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[100px]"></div>
      </div>

      <Suspense fallback={
        <Card className="w-full max-w-md p-8 border border-border bg-card animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mx-auto mb-4" />
          <div className="h-4 w-64 bg-muted rounded mx-auto mb-8" />
          <div className="space-y-4">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
          </div>
        </Card>
      }>
        <LoginForm />
      </Suspense>
      
      <div className="absolute bottom-6 text-center w-full text-muted-foreground/40 text-xs font-medium uppercase">
        Secure Data Storage • AI Powered Analysis
      </div>
    </div>
  );
}

