import React, { useState, useEffect } from "react";
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import { evaluatePasswordStrength } from "../utils/authUtils";
import { PasswordStrength } from "../types";

interface SignUpProps {
  onSignUpSuccess: (email: string, name: string) => void;
  onNavigateToSignIn: () => void;
}

export default function SignUp({ onSignUpSuccess, onNavigateToSignIn }: SignUpProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");

  const [strength, setStrength] = useState<PasswordStrength | null>(null);

  // Dynamic strength checks
  useEffect(() => {
    if (password) {
      setStrength(evaluatePasswordStrength(password));
    } else {
      setStrength(null);
    }
  }, [password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please complete all registry fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!strength || strength.score < 3) {
      setError("Please satisfy minimum password security standards.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Confirmation password does not match.");
      return;
    }

    if (!agreeTerms) {
      setError("You must read and agree to our system Terms & Privacy Policies.");
      return;
    }

    // Check email collision from localStorage
    const storedUsers = localStorage.getItem("auth_portal_users");
    if (storedUsers) {
      try {
        const users = JSON.parse(storedUsers);
        const collision = users.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
        if (collision) {
          setError("This email address is already associated with an existing account.");
          return;
        }
      } catch (e) {
        // parsing error
      }
    }

    // All clear! Parent component will perform registry write and log in
    onSignUpSuccess(email, name);
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
          Register account
        </h2>
        <p className="text-sm text-brand-secondary mt-1.5">
          Establish your secure identity credentials.
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

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="signup-name" className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
            Full display name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-secondary">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              id="signup-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              className="w-full bg-brand-input text-brand-primary placeholder:text-brand-secondary border border-brand-border rounded-md py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-accent transition-colors font-medium"
              placeholder="e.g. John Doe"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="signup-email" className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
            Clearance email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-secondary font-sans animate-none">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              id="signup-email"
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
          <label htmlFor="signup-password" className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
            Choose password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-secondary">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="signup-password"
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

        {/* Password confirmation */}
        <div className="space-y-1.5">
          <label htmlFor="signup-confirm-password" className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
            Confirm password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-secondary">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="signup-confirm-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError("");
              }}
              className="w-full bg-brand-input text-brand-primary placeholder:text-brand-secondary border border-brand-border rounded-md py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-brand-accent transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Password strength checklist */}
        {password && strength && (
          <div className="p-3.5 bg-brand-input border border-brand-border rounded-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-brand-secondary uppercase tracking-wider">Strength assessment:</span>
              <span className={`text-xs font-bold ${
                strength.label === "Excellent" || strength.label === "Strong" 
                  ? "text-emerald-600" 
                  : strength.label === "Fair" 
                  ? "text-amber-500" 
                  : "text-red-500"
              }`}>
                {strength.label}
              </span>
            </div>
            
            {/* Visual strength bar with segmented progress */}
            <div className="h-1.5 w-full bg-neutral-200 rounded-md overflow-hidden flex gap-0.5">
              {[1, 2, 3, 4, 5].map((step) => {
                const satisfiedCount = strength.label === "Excellent" ? 5 : strength.label === "Strong" ? 4 : strength.label === "Fair" ? 3 : strength.label === "Weak" ? 2 : 1;
                return (
                  <div
                    key={step}
                    className={`h-full flex-1 transition-all duration-300 ${
                      step <= satisfiedCount ? strength.color : "bg-neutral-200"
                    }`}
                  />
                );
              })}
            </div>

            {/* Visual Criteria Checklist */}
            <div className="space-y-2 pt-1 text-[11px] font-sans">
              <div className="flex items-center gap-2">
                <span className={`flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                  strength.hasMinLength ? "bg-black text-white" : "bg-neutral-200 text-neutral-400"
                }`}>
                  {strength.hasMinLength ? "✓" : "―"}
                </span>
                <span className={strength.hasMinLength ? "text-brand-primary font-medium" : "text-brand-secondary/60"}>
                  Minimum length (8+ characters)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                  strength.hasUppercase ? "bg-black text-white" : "bg-neutral-200 text-neutral-400"
                }`}>
                  {strength.hasUppercase ? "✓" : "―"}
                </span>
                <span className={strength.hasUppercase ? "text-brand-primary font-medium" : "text-brand-secondary/60"}>
                  Uppercase letter (A-Z)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                  strength.hasLowercase ? "bg-black text-white" : "bg-neutral-200 text-neutral-400"
                }`}>
                  {strength.hasLowercase ? "✓" : "―"}
                </span>
                <span className={strength.hasLowercase ? "text-brand-primary font-medium" : "text-brand-secondary/60"}>
                  Lowercase letter (a-z)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                  strength.hasNumber ? "bg-black text-white" : "bg-neutral-200 text-neutral-400"
                }`}>
                  {strength.hasNumber ? "✓" : "―"}
                </span>
                <span className={strength.hasNumber ? "text-brand-primary font-medium" : "text-brand-secondary/60"}>
                  Numeric digit (0-9)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                  strength.hasSymbol ? "bg-black text-white" : "bg-neutral-200 text-neutral-400"
                }`}>
                  {strength.hasSymbol ? "✓" : "―"}
                </span>
                <span className={strength.hasSymbol ? "text-brand-primary font-medium" : "text-brand-secondary/60"}>
                  Special symbol (e.g., !@#$%)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Terms agreement */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="agree-terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="h-4 w-4 rounded border-brand-border text-brand-accent focus:ring-0 bg-brand-input mt-0.5 cursor-pointer"
          />
          <label htmlFor="agree-terms" className="ml-2.5 text-xs text-brand-secondary leading-snug select-none cursor-pointer">
            I certify that I agree to the workspace&apos;s{" "}
            <span className="font-semibold text-brand-primary hover:underline">Clearance Policies</span> and{" "}
            <span className="font-semibold text-brand-primary hover:underline">Encryption Terms</span>.
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          id="signup-submit-btn"
          className="w-full bg-brand-accent hover:opacity-90 text-white font-semibold py-3 px-4 rounded-md text-sm transition-opacity shadow-sm cursor-pointer select-none"
        >
          Create Account
        </button>
      </form>

      {/* Switch to login */}
      <p className="text-center text-xs text-brand-secondary">
        Already registered?{" "}
        <button
          onClick={onNavigateToSignIn}
          className="font-semibold text-brand-accent hover:underline cursor-pointer"
        >
          Sign in here
        </button>
      </p>
    </motion.div>
  );
}
