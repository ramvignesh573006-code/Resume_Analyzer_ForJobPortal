'use client';

import { useAuth } from '@/lib/auth/useAuth';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, Bell, Lock, LogOut } from 'lucide-react';
import { db } from '@/lib/supabase/db';

export default function SettingsPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/auth/login');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (confirm('Are you sure you want to delete your account? This action is permanent and all your data will be removed.')) {
      try {
        await db.deleteUserData(user.id);
        await signOut();
        router.push('/auth/signup');
      } catch (err: any) {
        alert('Error deleting account: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
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
        <div className="max-w-3xl mt-16 md:mt-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and settings</p>
          </div>

          {/* Profile Section */}
          <Card className="border border-border bg-card mb-6">
            <div className="p-6 border-b border-border flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Account Profile</h2>
                  <p className="text-muted-foreground text-sm">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    value={user.email || ''}
                    disabled
                    className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-foreground cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">User ID</label>
                  <input
                    type="text"
                    value={user.id}
                    disabled
                    className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-foreground cursor-not-allowed text-xs font-mono"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Your profile information is read-only. To update your email, please contact support.</p>
            </div>
          </Card>

          {/* Security Section */}
          <Card className="border border-border bg-card mb-6">
            <div className="p-6 border-b border-border flex items-center gap-3">
              <Lock className="text-primary" size={24} />
              <h2 className="text-2xl font-bold text-foreground">Security</h2>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-muted-foreground">Manage your password and security settings</p>
              <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted">
                Change Password
              </Button>
            </div>
          </Card>

          {/* Notifications Section */}
          <Card className="border border-border bg-card mb-6">
            <div className="p-6 border-b border-border flex items-center gap-3">
              <Bell className="text-secondary" size={24} />
              <h2 className="text-2xl font-bold text-foreground">Notifications</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates about your resume analyses</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Analysis Complete Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified when your resume analysis is done</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="border border-destructive/20 bg-destructive/5">
            <div className="p-6 border-b border-destructive/20 flex items-center gap-3">
              <LogOut className="text-destructive" size={24} />
              <h2 className="text-2xl font-bold text-foreground">Danger Zone</h2>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-muted-foreground">
                Deleting your account is permanent and cannot be undone. All your data will be deleted.
              </p>
              <Button
                variant="destructive"
                className="w-full bg-destructive hover:bg-destructive/90"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
