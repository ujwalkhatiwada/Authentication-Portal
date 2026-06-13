import React, { useState } from "react";
import { X, ShieldCheck, Mail, User, Info, ArrowRight, Chrome, Github } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface OAuthModalProps {
  isOpen: boolean;
  provider: "google" | "github" | "microsoft" | null;
  onCancel: () => void;
  onConsentSuccess: (email: string, name: string) => void;
}

export default function OAuthModal({ isOpen, provider, onCancel, onConsentSuccess }: OAuthModalProps) {
  const [customEmail, setCustomEmail] = useState("ujwalkhatiwada2021@gmail.com");
  const [customName, setCustomName] = useState("Ujwal Khatiwada");
  const [mode, setMode] = useState<"fast" | "custom">("fast");

  const [errorInput, setErrorInput] = useState("");

  const handleAuthorize = () => {
    setErrorInput("");
    
    let finalEmail = customEmail.trim();
    let finalName = customName.trim();

    if (mode === "fast") {
      finalEmail = "ujwalkhatiwada2021@gmail.com";
      finalName = "Ujwal Khatiwada";
    } else {
      if (!finalEmail || !finalName) {
        setErrorInput("All credentials are required to complete authorization.");
        return;
      }
      if (!/\S+@\S+\.\S+/.test(finalEmail)) {
        setErrorInput("Please provide a valid email format.");
        return;
      }
    }

    onConsentSuccess(finalEmail, finalName);
  };

  const getProviderConfig = () => {
    switch (provider) {
      case "google":
        return {
          title: "Google Accounts SSO",
          icon: <Chrome className="h-5 w-5 text-neutral-800" />,
          bgColor: "bg-brand-input text-brand-primary border-brand-border",
          domain: "accounts.google.com"
        };
      case "github":
        return {
          title: "GitHub Developer OAuth",
          icon: <Github className="h-5 w-5 text-neutral-800" />,
          bgColor: "bg-brand-input text-brand-primary border-brand-border",
          domain: "github.com/login/oauth"
        };
      case "microsoft":
        return {
          title: "Microsoft Entra Azure AD",
          icon: (
            <svg className="h-5 w-5" viewBox="0 0 23 23">
              <path fill="#222222" d="M0 0h11v11H0z" />
              <path fill="#444444" d="M12 0h11v11H12z" />
              <path fill="#666666" d="M0 12h11v11H0z" />
              <path fill="#888888" d="M12 12h11v11H12z" />
            </svg>
          ),
          bgColor: "bg-brand-input text-brand-primary border-brand-border",
          domain: "login.microsoftonline.com"
        };
      default:
        return {
          title: "OAuth Secure Flow",
          icon: <ShieldCheck className="h-5 w-5 text-brand-primary" />,
          bgColor: "bg-brand-input text-brand-primary border-brand-border",
          domain: "oauth.identity.provider"
        };
    }
  };

  const cfg = getProviderConfig();

  if (!isOpen || !provider) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop glass blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-y-0 inset-x-0 bg-black/40 backdrop-blur-xs"
        />

        {/* Modal Card container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative bg-brand-surface border border-brand-border w-full max-w-md rounded-md shadow-xl overflow-hidden flex flex-col z-50 animate-none"
        >
          {/* SSL Lock header */}
          <div className="bg-brand-input px-4 py-2 flex items-center justify-between border-b border-brand-border font-mono text-[9px] text-brand-secondary">
            <span className="flex items-center gap-1.5 text-black font-bold font-sans uppercase">
              <ShieldCheck className="h-3.5 w-3.5" /> SECURE CONGESTION TERMINAL (TLS 1.3)
            </span>
            <span>{cfg.domain}</span>
          </div>

          <div className="p-6 space-y-5">
            {/* Logo and Brand Title Header */}
            <div className="flex items-start gap-3">
              <div className={`p-3 rounded-md border ${cfg.bgColor} flex-shrink-0 shadow-sm`}>
                {cfg.icon}
              </div>
              <div className="space-y-0.5">
                <h3 className="text-[10px] font-bold text-brand-secondary font-mono tracking-wider uppercase">SSO authorization</h3>
                <h2 className="text-base font-semibold text-brand-primary tracking-tight font-sans">{cfg.title}</h2>
              </div>
            </div>

            <div className="space-y-2 text-xs text-brand-secondary">
              <p className="leading-relaxed">
                <span className="font-semibold text-brand-primary">Authentication Portal</span> requests secure clearance to read your profile variable assertions:
              </p>
              
              <div className="bg-brand-input border border-brand-border rounded-md p-3 space-y-2 text-[11px] font-sans">
                <div className="flex items-center gap-2 text-brand-primary font-medium">
                  <User className="h-3.5 w-3.5" />
                  <span>Public profile properties (Display Name verification)</span>
                </div>
                <div className="flex items-center gap-2 text-brand-primary font-medium">
                  <Mail className="h-3.5 w-3.5" />
                  <span>Verified identifier email address ({customEmail})</span>
                </div>
              </div>
            </div>

            {/* Selector: Fast login vs Custom credentials */}
            <div className="space-y-3 pt-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-brand-secondary block">Identity Selection</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => { setMode("fast"); setErrorInput(""); }}
                  className={`py-2 px-3 border rounded-md font-semibold transition-colors cursor-pointer ${
                    mode === "fast"
                      ? "border-brand-accent bg-brand-accent text-white"
                      : "border-brand-border bg-white text-brand-primary hover:bg-brand-input"
                  }`}
                >
                  Quick Test Account
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("custom"); setErrorInput(""); }}
                  className={`py-2 px-3 border rounded-md font-semibold transition-colors cursor-pointer ${
                    mode === "custom"
                      ? "border-brand-accent bg-brand-accent text-white"
                      : "border-brand-border bg-white text-brand-primary hover:bg-brand-input"
                  }`}
                >
                  Custom Identity
                </button>
              </div>

              {/* Input for Custom Option */}
              {mode === "custom" ? (
                <div className="space-y-2.5 p-3.5 bg-brand-input border border-brand-border rounded-md text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-brand-secondary">Verify Email Address</label>
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full bg-white text-brand-primary placeholder:text-brand-secondary border border-brand-border rounded-md py-2 px-3 focus:outline-none focus:border-brand-accent font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-brand-secondary">Verify Full Name</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="e.g. Ujwal Khatiwada"
                      className="w-full bg-white text-brand-primary placeholder:text-brand-secondary border border-brand-border rounded-md py-2 px-3 focus:outline-none focus:border-brand-accent font-sans"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-brand-input border border-brand-border rounded-md flex items-center justify-between text-xs font-sans">
                  <div>
                    <p className="font-bold text-brand-primary">{customName}</p>
                    <p className="text-brand-secondary text-[11px] font-mono mt-0.5">{customEmail}</p>
                  </div>
                  <span className="text-[9px] font-bold text-brand-primary bg-white px-2 py-0.5 rounded border border-brand-border uppercase tracking-widest">
                    Preloaded
                  </span>
                </div>
              )}

              {errorInput && (
                <p className="text-xs text-red-600 font-sans">{errorInput}</p>
              )}
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="p-4 bg-brand-input border-t border-brand-border flex items-center justify-between gap-3 text-xs">
            <button
               onClick={onCancel}
              className="py-2.5 px-4 bg-white border border-brand-border hover:bg-brand-input rounded-md font-semibold text-brand-primary transition-colors cursor-pointer"
            >
              Cancel Consent
            </button>
            <button
              onClick={handleAuthorize}
              className="py-2.5 px-5 bg-brand-accent hover:opacity-90 text-white font-bold rounded-md transition-opacity inline-flex items-center gap-1.5 cursor-pointer"
            >
              Consent and Autologin <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
