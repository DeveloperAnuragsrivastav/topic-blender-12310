import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await login(email, password);
        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Logged in successfully',
        });

        navigate('/');
      } else {
        if (!username.trim()) {
          toast({
            title: 'Error',
            description: 'Please enter a username',
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        const { error } = await signup(email, password, username);
        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Account created successfully',
        });

        navigate('/');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: 'Error',
        description:
          error?.message || 'Authentication failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {isLogin ? 'Welcome back' : 'Get started'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {isLogin ? 'Sign in to continue' : 'Create your account'}
            </p>
          </div>

          <Card className="border-border shadow-sf-lg">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 border-input"
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="text-sm font-semibold"
                    >
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required={!isLogin}
                      disabled={isLoading}
                      className="h-12 border-input"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-12 border-input"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold shadow-sf-md hover:shadow-sf-lg transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setEmail('');
                      setPassword('');
                      setUsername('');
                    }}
                    disabled={isLoading}
                    className="text-sm text-primary hover:text-primary-dark font-medium transition-colors disabled:opacity-50"
                  >
                    {isLogin
                      ? "Don't have an account? Sign up"
                      : 'Already have an account? Sign in'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Full Background Image Section */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Full background image */}
        <img
          src="/1.png"
          alt="Tech background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay to keep text readable */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm= from-background/60 via-background/30 to-background/80" />


        {/* Content on top of image */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 w-full">
          <div className="max-w-xl w-full space-y-8 animate-fade-in">
            <div className="space-y-4 text-center">
              <h2 className="text-5xl font-bold text-white text-foreground leading-tight drop-shadow-xl">
                LinkedIn Post Manager
              </h2>
              <p className="text-xl text-white text-muted-foreground leading-relaxed drop-shadow max-w-lg mx-auto">
                Streamline your LinkedIn content creation with AI-powered
                templates and analytics
              </p>
            </div>

            <div className="space-y-4 pt-4 max-w-md mx-auto">
              <div className="flex items-start gap-4 bg-background/50 backdrop-blur rounded-xl p-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div >
                  <h3 className="font-semibold text-foreground mb-1 text-white">
                    AI-Powered Templates
                  </h3>
                  <p className="text-sm text-muted-foreground text-white">
                    Create professional content in seconds
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-background/50 backdrop-blur rounded-xl p-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 text-white">
                    Advanced Analytics
                  </h3>
                  <p className="text-sm text-muted-foreground text-white">
                    Track performance and optimize reach
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-background/50 backdrop-blur rounded-xl p-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 text-white">
                    Lightning Fast
                  </h3>
                  <p className="text-sm text-muted-foreground text-white">
                    Deploy content anytime, anywhere
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
