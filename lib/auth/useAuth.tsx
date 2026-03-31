'use client';

import * as React from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { db } from '@/lib/supabase/db';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthInternalContext = React.createContext<AuthContextType | undefined>(undefined);

const supabase = createClient();

export function AuthProvider({ children }: { children: React.ReactNode }): any {
  const [user, setUser] = React.useState<User | null>(null);
  const [profile, setProfile] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(() => {
    // If we have a hint that we're logged in, start with loading: false
    // to avoid the full-screen splash during route transitions.
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('auth_hint');
    }
    return true;
  });

  const fetchProfile = async (userId: string) => {
    try {
      const data = await db.getProfile(userId);
      setProfile(data);
      if (typeof window !== 'undefined' && data) {
        localStorage.setItem('auth_profile_hint', JSON.stringify(data));
      }
    } catch (err: any) {
      if (!err?.message?.includes('Lock')) {
        console.error('Error fetching profile:', err);
      }
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  React.useEffect(() => {
    let mounted = true;

    // Load profile hint instantly if available
    if (typeof window !== 'undefined') {
      const hint = localStorage.getItem('auth_profile_hint');
      if (hint) {
        try {
          setProfile(JSON.parse(hint));
        } catch (e) {}
      }
    }

    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          localStorage.setItem('auth_hint', 'true');
          await fetchProfile(currentUser.id);
        } else {
          localStorage.removeItem('auth_hint');
          localStorage.removeItem('auth_profile_hint');
        }
      } catch (err) {
        console.error('Error getting initial session:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (!mounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        localStorage.setItem('auth_hint', 'true');
        await fetchProfile(currentUser.id);
      } else {
        localStorage.removeItem('auth_hint');
        localStorage.removeItem('auth_profile_hint');
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    localStorage.removeItem('auth_hint');
    localStorage.removeItem('auth_profile_hint');
    await supabase.auth.signOut();
  };

  return (
    <AuthInternalContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthInternalContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthInternalContext);
  if (context === undefined) {
    // If we have an auth hint, return loading: false to keep the UI visible
    const hasHint = typeof window !== 'undefined' && !!localStorage.getItem('auth_hint');
    return { user: null, profile: null, loading: !hasHint, signOut: async () => {}, refreshProfile: async () => {} };
  }
  return context;
}
