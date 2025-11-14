import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Webhook, Save, Linkedin, User } from "lucide-react";

const Settings = () => {
  const [webhookUrl, setWebhookUrl] = useState(
    "https://n8n.gignaati.com/webhook-test/07e74f76-8ca8-4b43-87f9-0d95a0ee8bae"
  );
  const [linkedinId, setLinkedinId] = useState("");
  const [linkedinPassword, setLinkedinPassword] = useState("");
  const [username, setUsername] = useState("john_doe");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  const handleSaveWebhook = () => {
    toast({
      title: "Webhook Updated",
      description: "Your webhook URL has been saved successfully",
    });
  };

  const handleUpdateProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your username has been updated successfully",
    });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-muted-foreground">
            Configure your application settings and monitor user activity
          </p>
        </div>

        {/* User Profile */}
        <Card className="border-border/50 shadow-xl animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <User className="h-5 w-5 text-accent" />
              </div>
              User Profile
            </CardTitle>
            <CardDescription>
              Update your account information and password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                />
              </div>
              <Button
                onClick={handleUpdateProfile}
                className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-primary-glow"
              >
                <Save className="h-4 w-4" />
                Update Username
              </Button>
            </div>

            <div className="border-t border-border/50 pt-6 space-y-4">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              <Button
                onClick={handleChangePassword}
                className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-primary-glow"
              >
                <Save className="h-4 w-4" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Webhook Configuration */}
        <Card className="border-border/50 shadow-xl animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Webhook className="h-5 w-5 text-primary" />
              </div>
              Webhook Configuration
            </CardTitle>
            <CardDescription>
              Update your webhook endpoint for receiving prompt data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook">Webhook URL</Label>
              <Input
                id="webhook"
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-webhook-url.com/endpoint"
                className="font-mono text-sm"
              />
            </div>
            <Button
              onClick={handleSaveWebhook}
              className="w-full sm:w-auto gap-2 bg-gradient-to-r from-primary to-primary-glow"
            >
              <Save className="h-4 w-4" />
              Save Webhook
            </Button>
          </CardContent>
        </Card>

        {/* LinkedIn Configuration */}
        <Card className="border-border/50 shadow-xl animate-slide-up relative overflow-hidden" style={{ animationDelay: "200ms" }}>
          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="bg-primary/10 border-2 border-primary/50 px-6 py-3 rounded-lg">
              <p className="text-lg font-bold text-primary">🚧 Coming Soon</p>
            </div>
          </div>
          
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-[#0077B5]/10 flex items-center justify-center">
                <Linkedin className="h-5 w-5 text-[#0077B5]" />
              </div>
              LinkedIn Configuration
            </CardTitle>
            <CardDescription>
              Connect your LinkedIn account for automated posting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin-id">LinkedIn Email/ID</Label>
              <Input
                id="linkedin-id"
                type="email"
                value={linkedinId}
                onChange={(e) => setLinkedinId(e.target.value)}
                placeholder="your.email@example.com"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin-password">LinkedIn Password</Label>
              <Input
                id="linkedin-password"
                type="password"
                value={linkedinPassword}
                onChange={(e) => setLinkedinPassword(e.target.value)}
                placeholder="••••••••"
                disabled
              />
            </div>
            <Button
              disabled
              className="w-full sm:w-auto gap-2 bg-gradient-to-r from-[#0077B5] to-[#00A0DC]"
            >
              <Save className="h-4 w-4" />
              Connect LinkedIn
            </Button>
          </CardContent>
        </Card>


      </div>
    </div>
  );
};

export default Settings;
