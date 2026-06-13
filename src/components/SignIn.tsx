import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Chrome, Github, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

interface SignInProps {
  onSignInSuccess: (email: string, name: string, isOAuth?: boolean, provider?: "google" | "github" | "microsoft") => void;
  onNavigateToSignUp: () => void;
  onNavigateToRecovery: (initialEmail?: string) => void;
  onOAuthTrigger: (provider: "google" | "github" | "microsoft") => void;
}

export default function SignIn({
  onSignInSuccess,
  onNavigateToSignUp,
  onNavigateToRecovery,
  onOAuthTrigger
}: SignInProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all security fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Attempt credentials validation from localStorage
    const storedUsers = localStorage.getItem("auth_portal_users");
    if (storedUsers) {
      try {
        const users = JSON.parse(storedUsers);
        const match = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        
        if (match) {
          if (match.isOAuth) {
            setError(`This account is registered via ${match.oauthProvider} OAuth. Please click the respective provider button below to sign in.`);
            return;
          }
          if (match.password === password) {
            // Success!
            onSignInSuccess(match.email, match.name, false);
            return;
          }
        }
      } catch (e) {
        // err parsing
      }
    }

    setError("Invalid email address or passcode. Please try again.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-semibold text-brand-primary tracking-tight">
          Welcome back
        </h2>
        <p className="text-sm text-brand-secondary mt-1.5">
          Secure authentication for your secure clearance.
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-red-50/55 border border-red-100 rounded-md flex items-start gap-2.5"
        >
          <AlertCircle className="h-4.5 w-4.5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-700 leading-normal font-medium">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="signin-email" className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-secondary">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              id="signin-email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className="w-full bg-brand-input text-brand-primary placeholder:text-brand-secondary border border-brand-border rounded-md py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-accent transition-colors"
              placeholder="name@company.com"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="signin-password" className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
              Password
            </label>
            <button
              type="button"
              onClick={() => onNavigateToRecovery(email)}
              className="text-xs font-medium text-brand-secondary hover:text-brand-accent hover:underline cursor-pointer"
            >
              Forgot?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-secondary">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="signin-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              className="w-full bg-brand-input text-brand-primary placeholder:text-brand-secondary border border-brand-border rounded-md py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-brand-accent transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-secondary hover:text-brand-primary cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember-me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 rounded border-brand-border text-brand-accent focus:ring-0 bg-brand-input"
          />
          <label htmlFor="remember-me" className="ml-2.5 text-xs text-brand-secondary font-medium select-none cursor-pointer">
            Remember me on this terminal
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          id="signin-submit-btn"
          className="w-full bg-brand-accent hover:opacity-90 text-white font-semibold py-3 px-4 rounded-md text-sm transition-opacity shadow-sm cursor-pointer select-none"
        >
          Sign in to Dashboard
        </button>
      </form>

      {/* Separator */}
      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-brand-border"></div>
        <span className="flex-shrink mx-3 text-[11px] font-semibold text-brand-secondary uppercase tracking-wider font-sans">
          Or continue with
        </span>
        <div className="flex-grow border-t border-brand-border"></div>
      </div>

      {/* OAuth Button Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Google */}
        <button
          onClick={() => onOAuthTrigger("google")}
          id="oauth-google-btn"
          title="Google Single Sign-On"
          className="flex items-center justify-center gap-2 py-2.5 px-4 border border-brand-border hover:bg-brand-input bg-white rounded-md transition-colors shadow-sm cursor-pointer text-brand-primary"
        >
          <Chrome className="h-4 w-4 text-red-500" />
          <span className="text-xs font-semibold">Google</span>
        </button>

        {/* GitHub */}
        <button
          onClick={() => onOAuthTrigger("github")}
          id="oauth-github-btn"
          title="GitHub Single Sign-On"
          className="flex items-center justify-center gap-2 py-2.5 px-4 border border-brand-border hover:bg-brand-input bg-white rounded-md transition-colors shadow-sm cursor-pointer text-brand-primary"
        >
          <Github className="h-4 w-4 text-black" />
          <span className="text-xs font-semibold">GitHub</span>
        </button>

        {/* Microsoft */}
        <button
          onClick={() => onOAuthTrigger("microsoft")}
          id="oauth-microsoft-btn"
          title="Microsoft Single Sign-On"
          className="flex items-center justify-center gap-2 py-2.5 px-4 border border-brand-border hover:bg-brand-input bg-white rounded-md transition-colors shadow-sm cursor-pointer text-brand-primary"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 23 23">
            <path fill="#f35022" d="M0 0h11v11H0z" />
            <path fill="#80bb0a" d="M12 0h11v11H12z" />
            <path fill="#00a1f1" d="M0 12h11v11H0z" />
            <path fill="#ffb900" d="M12 12h11v11H12z" />
          </svg>
          <span className="text-xs font-semibold">Azure</span>
        </button>
      </div>

      {/* Register switch */}
      <p className="text-center text-xs text-brand-secondary">
        New here?{" "}
        <button
          onClick={onNavigateToSignUp}
          className="font-semibold text-brand-accent hover:underline cursor-pointer"
        >
          Create an account
        </button>
      </p>
    </motion.div>
  );
}
