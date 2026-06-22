"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('bloomy-users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      // Store user token
      localStorage.setItem('user-token', JSON.stringify({
        email: user.email,
        name: user.name,
        timestamp: Date.now()
      }));
      router.push('/chat');
    } else {
      setError("Invalid email or password");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/chat" });
    } catch (error) {
      setError("Google login failed. Please try again.");
    }
  };

  const handleAppleLogin = async () => {
    try {
      await signIn("apple", { callbackUrl: "/chat" });
    } catch (error) {
      setError("Apple login failed. Please try again.");
    }
  };

  const handleDiscordLogin = async () => {
    try {
      await signIn("discord", { callbackUrl: "/chat" });
    } catch (error) {
      setError("Discord login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8"
      >
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <img src="/logo.png" alt="Bloomy AI" className="w-12 h-12 rounded-full" />
            <span className="text-2xl font-bold gradient-text">Bloomy AI</span>
          </div>

          {/* Header */}
          <h1 className="text-2xl font-bold mb-2 text-center">Welcome Back</h1>
          <p className="text-dark-text-secondary text-center mb-8">Sign in to your account</p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-dark-text">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-secondary" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-10 py-3 text-dark-text placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-bloomy-purple/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-dark-text">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-text-secondary" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-10 py-3 text-dark-text placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-bloomy-purple/50"
                  required
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-dark-text-secondary">
                <input type="checkbox" className="rounded" />
                Remember me
              </label>
              <a href="#" className="text-bloomy-purple hover:underline">Forgot password?</a>
            </div>

            <button type="submit" className="w-full btn-primary py-3 text-lg">
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-dark-border" />
            <span className="text-dark-text-secondary text-sm">or continue with</span>
            <div className="flex-1 border-t border-dark-border" />
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button onClick={handleGoogleLogin} className="btn-secondary py-3 flex items-center justify-center">
              <i className="fa-brands fa-google"></i>
            </button>
            <button onClick={handleAppleLogin} className="btn-secondary py-3 flex items-center justify-center">
              <i className="fa-brands fa-apple"></i>
            </button>
            <button onClick={handleDiscordLogin} className="btn-secondary py-3 flex items-center justify-center">
              <i className="fa-brands fa-discord"></i>
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-dark-text-secondary mt-8">
            Don't have an account?{" "}
            <a href="/signup" className="text-bloomy-purple hover:underline font-medium">
              Sign up
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
