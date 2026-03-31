import { createBrowserClient } from '@supabase/ssr';

// Singleton pattern — reuse one client instance across the app.
// Creating multiple instances causes auth lock contention errors.
let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  // 1. Return safe dummy client instantly during Build/Server phase
  // This prevents build-time environment variable requirements.
  const dummyClient = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase project is not configured. Please add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your project settings.') }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase project is not configured. Please add your credentials.') }),
      resend: async () => ({ data: { user: null, session: null }, error: new Error('Supabase project is not configured. Please add your credentials.') }),
      signOut: async () => ({ error: null }),

      getUser: async () => ({ data: { user: null }, error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: () => ({ data: [], error: null }),
          select: () => ({ single: async () => ({ data: null, error: null }) })
        }),
        single: async () => ({ data: null, error: null }),
        order: () => ({ data: [], error: null })
      }),
      insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
      update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
      delete: () => ({ eq: async () => ({ error: null }) }),
      upsert: () => ({ select: async () => ({ error: null }) }),
    }),
  } as any;


  if (typeof window === 'undefined') {
    return dummyClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 2. Return safe dummy client if environment variables are missing
  if (!url || !key) {
    console.warn('Supabase env variables are missing. Check your Vercel Project Settings for NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
    return dummyClient;
  }

  if (!client) {
    client = createBrowserClient(url, key);
  }
  return client;
}

// Convenient export for client-side usage, keeping it dynamic
export const supabase = typeof window !== 'undefined' ? createClient() : ({} as any);



