import React, { useState, useEffect } from "react";
import { ShieldCheck, Server, Key, Lock, Globe, Mail, Code, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { User, AuthScreen } from "./types";
import { getInitialUsers, saveUsers } from "./utils/authUtils";

import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import PasswordRecovery from "./components/PasswordRecovery";
import Dashboard from "./components/Dashboard";
import MockEmailInbox from "./components/MockEmailInbox";
import OAuthModal from "./components/OAuthModal";
import InteractiveEntropyMatrix from "./components/InteractiveEntropyMatrix";
import SafetyManifesto from "./components/SafetyManifesto";

interface SimulatedEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  otp: string;
  timestamp: Date;
  onActionClick: () => void;
}

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [screen, setScreen] = useState<AuthScreen>("signin");

  // Mailbox state
  const [emails, setEmails] = useState<SimulatedEmail[]>([]);
  const [mailboxOpen, setMailboxOpen] = useState(false);

  // Recovery transitional state
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryOTP, setRecoveryOTP] = useState("");

  // Active OAuth provider trigger
  const [activeOAuth, setActiveOAuth] = useState<"google" | "github" | "microsoft" | null>(null);
  const [manifestoOpen, setManifestoOpen] = useState(false);

  // Initialize mock accounts database on bootup
  useEffect(() => {
    const list = getInitialUsers();
    setUsers(list);

    // Auto load current session if present in sessionStorage (reloads gracefully)
    const activeSession = sessionStorage.getItem("auth_portal_session");
    if (activeSession) {
      try {
        const u = JSON.parse(activeSession);
        setCurrentUser(u);
        setScreen("dashboard");
      } catch (e) {
        // err loading session
      }
    }
  }, []);

  // Save current login session to sessionStorage
  const handleLoginSessionStart = (userRecord: User) => {
    setCurrentUser(userRecord);
    sessionStorage.setItem("auth_portal_session", JSON.stringify(userRecord));
    setScreen("dashboard");
  };

  // Sign out
  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem("auth_portal_session");
    setScreen("signin");
  };

  // Synchronize changes on user (like terminates devices, etc.)
  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    sessionStorage.setItem("auth_portal_session", JSON.stringify(updatedUser));

    const updatedList = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedList);
    saveUsers(updatedList);
  };

  // Handlers for credential validations
  const handleSignInSuccess = (email: string, name: string) => {
    const userMatch = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (userMatch) {
      const loginStampUser = {
        ...userMatch,
        lastLoginAt: new Date().toISOString()
      };
      handleUpdateUser(loginStampUser);
      handleLoginSessionStart(loginStampUser);
    }
  };

  // Handler for registry creation (SignUp)
  const handleSignUpSuccess = (email: string, name: string) => {
    const freshUser: User = {
      id: `user-${Date.now()}`,
      email,
      password: "Password@123", // Dummy representation representing hash
      name,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isOAuth: false,
      devices: [
        {
          id: `device-${Date.now()}`,
          deviceName: "Apple MacBook Pro 16\"",
          browser: "Chrome 122.0",
          ipAddress: "192.168.1.45 (Local) / 73.140.92.12",
          location: "San Jose, CA, USA",
          lastActive: "Active now",
          isCurrent: true,
        }
      ]
    };

    const updatedList = [...users, freshUser];
    setUsers(updatedList);
    saveUsers(updatedList);

    // Direct Login automatically
    handleLoginSessionStart(freshUser);
  };

  // Triggering OTP generation for Password Recovery
  const handleRequestOTP = (email: string) => {
    const userMatch = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!userMatch) {
      return { exists: false, code: "" };
    }

    // Generate unique 6-digit token
    const generatedOTP = Math.floor(100000 + Math.random() * 90000).toString();
    setRecoveryEmail(email);
    setRecoveryOTP(generatedOTP);

    // Push secure automated email notification to Inbox drawer
    const newEmail: SimulatedEmail = {
      id: `mail-${Date.now()}`,
      to: email,
      subject: "🔒 SECURE PORTAL: Request to reset account passcode",
      body: `You requested a password recovery token for Authentication Portal.

Your unique 6-digit secure identity verification OTP is:
${generatedOTP}

This passcode remains active for 120 seconds. If you did not make this request, please login immediately to verify active terminal decryptions.`,
      otp: generatedOTP,
      timestamp: new Date(),
      onActionClick: () => {
        // Direct click link: prefills OTP and guides them automatically
        setRecoveryEmail(email);
        setRecoveryOTP(generatedOTP);
        setScreen("recovery");
      }
    };

    setEmails((prev) => [newEmail, ...prev]);
    
    // Auto toggle mailbox open to guarantee they see the received mail!
    setMailboxOpen(true);

    return { exists: true, code: generatedOTP };
  };

  const handleVerifyOTP = (code: string) => {
    return code === recoveryOTP;
  };

  const handleResetPasswordCommit = (newPassword: string) => {
    // Write new passcode back to local DB
    const updatedList = users.map((u) => {
      if (u.email.toLowerCase() === recoveryEmail.toLowerCase()) {
        return {
          ...u,
          password: newPassword
        };
      }
      return u;
    });

    setUsers(updatedList);
    saveUsers(updatedList);

    // Flush temporary validation states
    setRecoveryEmail("");
    setRecoveryOTP("");
  };

  // Handlers for OAuth mock trigger
  const handleOAuthConsentSuccess = (email: string, name: string) => {
    if (!activeOAuth) return;

    let userMatch = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!userMatch) {
      // Automatic silent JIT account registration via OAuth Standard
      userMatch = {
        id: `user-${Date.now()}`,
        email,
        name,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isOAuth: true,
        oauthProvider: activeOAuth,
        devices: [
          {
            id: `device-${Date.now()}`,
            deviceName: "Active Browser Session",
            browser: "Chrome Mobile 122.0",
            ipAddress: "73.140.92.12 (Public Gateway)",
            location: "San Jose, CA, USA",
            lastActive: "Active now",
            isCurrent: true,
          }
        ]
      };

      const updatedList = [...users, userMatch];
      setUsers(updatedList);
      saveUsers(updatedList);
    } else {
      // User exists, tag SSO provider logging
      userMatch = {
        ...userMatch,
        lastLoginAt: new Date().toISOString(),
        isOAuth: true,
        oauthProvider: activeOAuth
      };
      
      const updatedList = users.map((u) => (u.id === userMatch!.id ? userMatch! : u));
      setUsers(updatedList);
      saveUsers(updatedList);
    }

    setActiveOAuth(null);
    handleLoginSessionStart(userMatch);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-primary flex flex-col font-sans antialiased relative bg-dots">
      {/* Upper Subtle Server Status Header */}
      <header className="border-b border-brand-border bg-brand-surface px-6 py-4 flex items-center justify-between shadow-xs z-35 sticky top-0">
        <button 
          onClick={() => setManifestoOpen(true)}
          className="flex items-center gap-2.5 hover:opacity-85 text-left outline-hidden group cursor-pointer"
          title="Click to learn why safety is required"
        >
          <div className="bg-brand-accent text-white p-2 rounded-md group-hover:scale-105 transition-transform duration-300">
            <ShieldCheck className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-widest font-mono">Decryption Node</span>
              <span className="text-[8px] sm:text-[9px] bg-teal-500/10 text-teal-600 font-bold px-1.5 py-0.2 rounded font-mono select-none animate-pulse">INFO</span>
            </div>
            <h1 className="text-sm font-semibold text-brand-primary tracking-tight font-sans border-b border-transparent group-hover:border-neutral-300 transition-all duration-300">
              Authentication Portal
            </h1>
          </div>
        </button>
      </header>

      {/* Main Framework Stage */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center z-20">
        {screen === "dashboard" ? (
          /* DASHBOARD: Expands to show successful login with stats */
          <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <Dashboard user={currentUser!} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
          </motion.div>
        ) : (
          /* OAUTH & INITIAL SIGN-IN FLOW: Clean unified split columns */
          <div className="glass-panel border border-brand-border w-full max-w-4xl rounded-xl shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            {/* LEFT COLUMN: Interactive and Responsive security analyzer block */}
            <InteractiveEntropyMatrix />

            {/* RIGHT COLUMN: Interactive login screens */}
            <div className="lg:col-span-7 p-8 sm:p-10 bg-brand-surface flex flex-col justify-center relative">
              <AnimatePresence mode="wait">
                {screen === "signin" && (
                  <SignIn
                    onSignInSuccess={handleSignInSuccess}
                    onNavigateToSignUp={() => setScreen("signup")}
                    onNavigateToRecovery={(email) => {
                      setRecoveryEmail(email);
                      setScreen("recovery");
                    }}
                    onOAuthTrigger={(provider) => setActiveOAuth(provider)}
                  />
                )}

                {screen === "signup" && (
                  <SignUp
                    onSignUpSuccess={handleSignUpSuccess}
                    onNavigateToSignIn={() => setScreen("signin")}
                  />
                )}

                {screen === "recovery" && (
                  <PasswordRecovery
                    onBackToSignIn={() => setScreen("signin")}
                    onRequestOTP={handleRequestOTP}
                    onVerifyOTP={handleVerifyOTP}
                    onResetPassword={handleResetPasswordCommit}
                    prefilledOTP={recoveryOTP}
                    prefilledEmail={recoveryEmail}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>

      {/* Developer helper tip */}
      {screen !== "dashboard" && (
        <div className="pb-8 text-center text-xs text-brand-secondary font-mono flex items-center justify-center gap-1.5 px-4">
          <HelpCircle className="h-3.5 w-3.5 text-brand-primary shrink-0" />
          <span>Click the bottom right mailbox anytime to inspect simulated verification emails!</span>
        </div>
      )}

      {/* Persistent Footer */}
      <footer className="border-t border-brand-border bg-brand-surface py-5 text-center text-[11px] text-brand-secondary font-sans z-10 font-medium relative">
        <span>© 2026 Authentication Portal. Clean Minimalism SSO and Token Recovery Framework.</span>
        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[8px] sm:text-[9px] text-brand-secondary/15 hover:text-brand-primary/80 transition-all duration-700 font-mono select-none tracking-widest cursor-default hidden sm:block">
          DESIGNED BY UJWAL K
        </span>
      </footer>

      {/* Simulation Widgets */}
      <MockEmailInbox
        emails={emails}
        onClear={() => setEmails([])}
        isOpen={mailboxOpen}
        setIsOpen={setMailboxOpen}
      />

      <OAuthModal
        isOpen={activeOAuth !== null}
        provider={activeOAuth}
        onCancel={() => setActiveOAuth(null)}
        onConsentSuccess={handleOAuthConsentSuccess}
      />

      <SafetyManifesto
        isOpen={manifestoOpen}
        onClose={() => setManifestoOpen(false)}
      />
    </div>
  );
}
