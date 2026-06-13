import React, { useState, useEffect } from "react";
import { ArrowLeft, KeyRound, Mail, CheckCircle2, ShieldAlert, ShieldCheck, Lock, Eye, EyeOff, AlertCircle, Clock } from "lucide-react";
import { motion } from "motion/react";
import { evaluatePasswordStrength } from "../utils/authUtils";
import { PasswordStrength } from "../types";

interface PasswordRecoveryProps {
  onBackToSignIn: () => void;
  onRequestOTP: (email: string) => { exists: boolean; code: string };
  onVerifyOTP: (code: string) => boolean;
  onResetPassword: (password: string) => void;
  prefilledOTP?: string;
  prefilledEmail?: string;
}

type Mode = "email" | "otp" | "password" | "success";

export default function PasswordRecovery({
  onBackToSignIn,
  onRequestOTP,
  onVerifyOTP,
  onResetPassword,
  prefilledOTP,
  prefilledEmail
}: PasswordRecoveryProps) {
  const [email, setEmail] = useState(prefilledEmail || "");
  const [emailError, setEmailError] = useState("");
  
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength | null>(null);
  const [passwordError, setPasswordError] = useState("");

  const [mode, setMode] = useState<Mode>("email");

  // Catch pre-filled OTP from our system email actions (Developer auto-fill)
  useEffect(() => {
    if (prefilledOTP) {
      const chars = prefilledOTP.split("").slice(0, 6);
      const newOtp = Array(6).fill("");
      chars.forEach((c, i) => { if (i < 6) newOtp[i] = c; });
      setOtp(newOtp);
      setMode("otp");
      setOtpError("");
    }
  }, [prefilledOTP]);

  useEffect(() => {
    if (prefilledEmail) {
      setEmail(prefilledEmail);
    }
  }, [prefilledEmail]);

  // Interval timer for OTP expiry
  useEffect(() => {
    let interval: any = null;
    if (mode === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [mode, timer]);

  // Dynamic password strength checks
  useEffect(() => {
    if (password) {
      setStrength(evaluatePasswordStrength(password));
    } else {
      setStrength(null);
    }
  }, [password]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!email) {
      setEmailError("Please enter your email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    // Requests OTP - our App parent will mock-send an email to the inbox drawer
    const result = onRequestOTP(email);
    
    if (result.exists) {
      setMode("otp");
      setTimer(120);
      setCanResend(false);
    } else {
      setEmailError("This email address is not registered in our secure database.");
    }
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus next field
    if (element.value !== "" && element.nextElementSibling) {
      (element.nextElementSibling as HTMLInputElement).focus();
    }
    setOtpError("");
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const target = e.target as HTMLInputElement;
      if (target.value === "" && target.previousElementSibling) {
        const prevTarget = target.previousElementSibling as HTMLInputElement;
        prevTarget.focus();
        
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (pasteData.length === 6 && /^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      // focus last item
      const inputs = document.querySelectorAll(".otp-field-input");
      if (inputs.length > 0) {
        (inputs[inputs.length - 1] as HTMLInputElement).focus();
      }
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");

    const fullCode = otp.join("");
    if (fullCode.length < 6) {
      setOtpError("Please enter all 6 digits of the OTP code.");
      return;
    }

    const verified = onVerifyOTP(fullCode);
    if (verified) {
      setMode("password");
    } else {
      setOtpError("Incorrect or expired recovery code. Please try again.");
    }
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    onRequestOTP(email);
    setTimer(120);
    setCanResend(false);
    setOtp(Array(6).fill(""));
    setOtpError("A fresh OTP code has been logged to the Developer Mailbox.");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!strength || strength.score < 3) {
      setPasswordError("Password is too weak. Please satisfy the security requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    onResetPassword(password);
    setMode("success");
  };

  // Convert timer seconds to readable MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="w-full">
      {/* Back link */}
      {mode !== "success" && (
        <button
          onClick={onBackToSignIn}
          id="recovery-back-btn"
          className="mb-6 flex items-center gap-2 text-xs font-semibold text-brand-secondary hover:text-brand-accent transition-colors group cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Login
        </button>
      )}

      {/* STEP 1: EMAIL REQUEST */}
      {mode === "email" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <div className="inline-flex p-3 bg-brand-input border border-brand-border rounded-md text-brand-primary mb-4">
              <KeyRound className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-brand-primary">
              Recover password
            </h2>
            <p className="text-sm text-brand-secondary mt-1.5 leading-relaxed">
              Enter your registered email below, and we will dispatch a secure 6-digit passcode.
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="recovery-email" className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-secondary">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  id="recovery-email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  placeholder="name@company.com"
                  className={`w-full bg-brand-input text-brand-primary placeholder:text-brand-secondary border rounded-md py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-accent transition-colors ${
                    emailError ? "border-red-300" : "border-brand-border"
                  }`}
                />
              </div>
              {emailError && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 font-sans mt-1">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{emailError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              id="request-otp-button"
              className="w-full bg-brand-accent hover:opacity-90 text-white font-semibold py-3 px-4 rounded-md text-sm transition-opacity shadow-sm cursor-pointer select-none"
            >
              Send Security Code
            </button>
          </form>

          <div className="p-3.5 bg-brand-input border border-brand-border rounded-md flex items-start gap-2.5">
            <ShieldAlert className="h-4.5 w-4.5 text-brand-secondary mt-0.5 flex-shrink-0" />
            <div className="text-[11px] leading-relaxed text-brand-secondary">
              <span className="font-semibold text-brand-primary">Secure Protocol:</span> This sandbox simulates mail delivery locally. Please use <span className="font-semibold text-brand-primary font-mono text-xs">ujwalkhatiwada2021@gmail.com</span> to test, then check the simulated incoming mail drawer!
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 2: ENTER OTP CODE */}
      {mode === "otp" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <div className="inline-flex p-3 bg-brand-input border border-brand-border rounded-md text-brand-primary mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-brand-primary">
              Verify security code
            </h2>
            <p className="text-sm text-brand-secondary mt-1.5 leading-relaxed">
              We dispatched a 6-digit recovery code to <span className="font-semibold text-brand-primary">{email}</span>.
            </p>
          </div>

          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-secondary block text-center mb-1">
                Security Code (OTP)
              </label>
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    onPaste={handleOtpPaste}
                    className="otp-field-input w-11 h-12 sm:w-12 sm:h-14 text-center text-lg font-bold font-mono text-brand-primary bg-brand-input border border-brand-border rounded-md focus:outline-none focus:border-brand-accent transition-colors shadow-sm"
                  />
                ))}
              </div>
              {otpError && (
                <p className="text-xs text-center text-red-600 font-sans mt-2">{otpError}</p>
              )}
            </div>

            <button
              type="submit"
              id="verify-otp-button"
              className="w-full bg-brand-accent hover:opacity-90 text-white font-semibold py-3 px-4 rounded-md text-sm transition-opacity shadow-sm cursor-pointer select-none"
            >
              Verify Code
            </button>
          </form>

          {/* Timer and Resend */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs text-brand-secondary">
              <Clock className="h-3.5 w-3.5 text-brand-secondary" />
              <span>Expires in:</span>
              <span className={`font-mono font-bold ${timer < 30 ? "text-red-500 animate-pulse" : "text-brand-primary"}`}>
                {formatTime(timer)}
              </span>
            </div>
            <div>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend}
                className={`text-xs font-semibold transition-colors ${
                  canResend
                    ? "text-brand-accent hover:underline cursor-pointer"
                    : "text-brand-secondary/40 cursor-not-allowed"
                }`}
              >
                Resend recovery code
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 3: RESET PASSWORD ENTRY */}
      {mode === "password" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <div className="inline-flex p-3 bg-brand-input border border-brand-border rounded-md text-brand-primary mb-4">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-brand-primary">
              Establish new password
            </h2>
            <p className="text-sm text-brand-secondary mt-1.5">
              Create a new secure credentials credentials. Done reuse previous codes.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="new-password" className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                New Secure Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-secondary">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError("");
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label htmlFor="confirm-new-password" className="text-xs font-semibold uppercase tracking-wider text-brand-secondary">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brand-secondary">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirm-new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError("");
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
                  <div className="flex items-center gap-2 font-sans">
                    <span className={`flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                      strength.hasMinLength ? "bg-black text-white" : "bg-neutral-200 text-neutral-400"
                    }`}>
                      {strength.hasMinLength ? "✓" : "―"}
                    </span>
                    <span className={strength.hasMinLength ? "text-brand-primary font-medium font-sans" : "text-brand-secondary/60 font-sans"}>
                      Minimum length (8+ characters)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-sans">
                    <span className={`flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                      strength.hasUppercase ? "bg-black text-white" : "bg-neutral-200 text-neutral-400"
                    }`}>
                      {strength.hasUppercase ? "✓" : "―"}
                    </span>
                    <span className={strength.hasUppercase ? "text-brand-primary font-medium font-sans" : "text-brand-secondary/60 font-sans"}>
                      Uppercase letter (A-Z)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-sans">
                    <span className={`flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                      strength.hasLowercase ? "bg-black text-white" : "bg-neutral-200 text-neutral-400"
                    }`}>
                      {strength.hasLowercase ? "✓" : "―"}
                    </span>
                    <span className={strength.hasLowercase ? "text-brand-primary font-medium font-sans" : "text-brand-secondary/60 font-sans"}>
                      Lowercase letter (a-z)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-sans">
                    <span className={`flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                      strength.hasNumber ? "bg-black text-white" : "bg-neutral-200 text-neutral-400"
                    }`}>
                      {strength.hasNumber ? "✓" : "―"}
                    </span>
                    <span className={strength.hasNumber ? "text-brand-primary font-medium font-sans" : "text-brand-secondary/60 font-sans"}>
                      Numeric digit (0-9)
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-sans">
                    <span className={`flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                      strength.hasSymbol ? "bg-black text-white" : "bg-neutral-200 text-neutral-400"
                    }`}>
                      {strength.hasSymbol ? "✓" : "―"}
                    </span>
                    <span className={strength.hasSymbol ? "text-brand-primary font-medium font-sans" : "text-brand-secondary/60 font-sans"}>
                      Special symbol (e.g., !@#$%)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {passwordError && (
              <p className="text-xs text-red-600 font-sans">{passwordError}</p>
            )}

            <button
              type="submit"
              id="confirm-reset-password-btn"
              className="w-full bg-brand-accent hover:opacity-90 text-white font-semibold py-3 px-4 rounded-md text-sm transition-opacity shadow-sm cursor-pointer select-none"
            >
              Reset Password
            </button>
          </form>
        </motion.div>
      )}

      {/* STEP 4: SUCCESS */}
      {mode === "success" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4 space-y-6"
        >
          <div className="inline-flex p-4 bg-brand-input border border-brand-border rounded-md text-brand-primary">
            <CheckCircle2 className="h-8 w-8 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-brand-primary tracking-tight">
              Password successfully reset
            </h2>
            <p className="text-sm text-brand-secondary mt-1.5 leading-relaxed">
              Your security credentials have been updated. You can now access your profile with your new secure password.
            </p>
          </div>

          <button
            onClick={onBackToSignIn}
            id="recovery-completed-return-btn"
            className="w-full bg-brand-accent hover:opacity-90 text-white font-semibold py-3 px-4 rounded-md text-sm transition-opacity shadow-sm cursor-pointer select-none"
          >
            Return to Sign In
          </button>
        </motion.div>
      )}
    </div>
  );
}
