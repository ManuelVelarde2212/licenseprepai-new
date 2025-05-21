
"use client";

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon, UserCircle, Bell, Shield } from 'lucide-react'; // Changed import name
import { ThemeToggle } from '@/components/theme-toggle';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account and application preferences." icon={SettingsIcon} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="text-primary" />
              Profile Settings
            </CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Demo User" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="user@example.com" />
            </div>
            <Button>Save Profile</Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="text-primary" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Manage how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add notification settings components here */}
            <p className="text-sm text-muted-foreground">Notification settings will be available soon.</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Theme</Label>
              <ThemeToggle />
            </div>
             <p className="text-sm text-muted-foreground">More appearance settings coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
