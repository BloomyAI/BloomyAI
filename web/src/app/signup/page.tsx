"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simple validation
      if (!name || !email || !password) {
        setError("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        setIsLoading(false);
        return;
      }

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('bloomy-users') || '[]');
      const existingUser = users.find((u: any) => u.email === email);

      if (existingUser) {
        setError("User with this email already exists");
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser = {
        name,
        email,
        password,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('bloomy-users', JSON.stringify(users));

      // Auto-login after signup
      localStorage.setItem('user-token', JSON.stringify({
        email: newUser.email,
        name: newUser.name,
        timestamp: Date.now()
      }));

      router.push("/chat");
    } catch (error) {
      console.error("Signup failed:", error);
      setError("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signIn("google", { callbackUrl: "/chat" });
    } catch (error) {
      setError("Google signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-bloomy-pink/10 rounded-full blur-3xl float-animation" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-bloomy-purple/10 rounded-full blur-3xl float-animation" style={{ animationDelay: "2s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-dark-card rounded-2xl border border-dark-border p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="Bloomy AI" className="w-16 h-16 rounded-full" />
          </div>

          <h1 className="text-2xl font-bold text-dark-text text-center mb-2">Create Account</h1>
          <p className="text-dark-text-secondary text-center mb-8">Join Bloomy AI and start building</p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Social Signup */}
          <button
            onClick={handleGoogleSignup}
            className="w-full bg-white text-black rounded-lg px-4 py-3 font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-3 mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-card text-dark-text-secondary">or</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm text-dark-text-secondary mb-2">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-secondary" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 pl-10 text-dark-text placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-bloomy-purple/50"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-dark-text-secondary mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 pl-10 text-dark-text placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-bloomy-purple/50"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-dark-text-secondary mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-secondary" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 pl-10 pr-10 text-dark-text placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-bloomy-purple/50"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text-secondary hover:text-dark-text"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-dark-text-secondary mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-bloomy-purple hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
