import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useApp } from "@/lib/store";
import { PaywallDialog } from "@/components/PaywallDialog";
import { toast } from "sonner";
import { track, Events } from "@/lib/events";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Bell, 
  BellOff, 
  Sparkles, 
  Trash2,
  AlertTriangle
} from "lucide-react";

export default function Settings() {
  const { user, settings, updateUser, updateSettings, resetDemoData } = useApp();
  const navigate = useNavigate();
  const [showPaywall, setShowPaywall] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSaveProfile = () => {
    updateUser({ name, email });
    toast.success("Profile updated!");
  };

  const handleToggleNotifications = () => {
    const newPermission = settings.notificationPermission === "allowed" ? "denied" : "allowed";
    updateSettings({ notificationPermission: newPermission });
    
    if (newPermission === "allowed") {
      toast.success("Notifications enabled!");
    } else {
      toast.info("Notifications disabled");
    }
  };

  const handleResetData = () => {
    // TODO: Analytics - demo data reset
    track(Events.DEMO_DATA_RESET);
    resetDemoData();
    toast.success("Demo data cleared");
    navigate("/auth/sign-in");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button onClick={handleSaveProfile}>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Plan Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-orange-400">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">Plan</CardTitle>
              <CardDescription>Your current subscription</CardDescription>
            </div>
            <Badge 
              className={
                user?.plan === "pro" 
                  ? "bg-gradient-to-r from-primary to-orange-400 text-primary-foreground border-0" 
                  : ""
              }
            >
              {user?.plan === "pro" ? "Pro" : "Free"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {user?.plan === "pro" ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                You have access to all Pro features including unlimited habits and deep insights.
              </p>
              <Button variant="outline" disabled>
                Manage Subscription (Demo)
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Upgrade to Pro for unlimited habits, deep insights, and more.
              </p>
              <Button onClick={() => setShowPaywall(true)}>
                Upgrade to Pro
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              {settings.notificationPermission === "allowed" ? (
                <Bell className="h-5 w-5" />
              ) : (
                <BellOff className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-base">Notifications</CardTitle>
              <CardDescription>
                {settings.notificationPermission === "unknown" 
                  ? "Not configured" 
                  : settings.notificationPermission === "allowed"
                  ? "Enabled"
                  : "Disabled"
                }
              </CardDescription>
            </div>
            <Switch
              checked={settings.notificationPermission === "allowed"}
              onCheckedChange={handleToggleNotifications}
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Get daily reminders to log your habits and celebrate your streaks.
          </p>
          {settings.reminderTime && (
            <p className="text-sm text-muted-foreground mt-2">
              Reminder time: {settings.reminderTime}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-base">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Reset all demo data including habits, logs, and settings. This cannot be undone.
          </p>
          <Button 
            variant="destructive" 
            onClick={() => setShowResetDialog(true)}
          >
            Reset Demo Data
          </Button>
        </CardContent>
      </Card>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <DialogTitle>Reset Demo Data?</DialogTitle>
            </div>
            <DialogDescription>
              This will permanently delete all your habits, logs, and settings. 
              You'll need to sign in and set up again. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleResetData}>
              Yes, Reset Everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PaywallDialog 
        open={showPaywall} 
        onOpenChange={setShowPaywall}
        trigger="upgrade_card"
      />
    </div>
  );
}
