'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import { Button } from './ui/button';

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Don't show header on auth pages
  if (pathname?.includes('/auth/')) {
    return null;
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Resume Analyzer
        </Link>

        {user && (
          <nav className="flex gap-8 items-center">
            <Link
              href="/dashboard"
              className={`transition-colors ${
                pathname === '/dashboard'
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/analyze"
              className={`transition-colors ${
                pathname === '/dashboard/analyze'
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Analyze
            </Link>
            <Link
              href="/dashboard/compare"
              className={`transition-colors ${
                pathname === '/dashboard/compare'
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Compare
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
