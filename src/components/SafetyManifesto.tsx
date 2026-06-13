import React, { useState } from "react";
import { ShieldAlert, CheckCircle, Smartphone, KeyRound, ArrowRight, X, AlertTriangle, Cpu, Globe } from "lucide-react";
import { motion } from "motion/react";

interface SafetyManifestoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SafetyManifesto({ isOpen, onClose }: SafetyManifestoProps) {
  // Mini checklist state
  const [reusePw, setReusePw] = useState<boolean | null>(null);
  const [mfaActive, setMfaActive] = useState<boolean | null>(null);
  const [deviceReview, setDeviceReview] = useState<boolean | null>(null);

  if (!isOpen) return null;

  // Compute live threat category
  const calculateResult = () => {
    if (reusePw === null || mfaActive === null || deviceReview === null) {
      return {
        label: "Pending Checklist Completion",
        color: "text-neutral-400 bg-neutral-900 border-neutral-800",
        desc: "Answer the 3 dynamic diagnostics on the right to audit your active vulnerability coefficient."
      };
    }

    let vulnerability = 0;
    // Password reuse is bad
    if (reusePw) vulnerability += 45;
    // Lack of MFA is highly critical
    if (!mfaActive) vulnerability += 40;
    // Unreviewed devices
    if (!deviceReview) vulnerability += 15;

    if (vulnerability >= 80) {
      return {
        label: "CRITICAL SECURITY EXPOSURE (High Risk)",
        color: "text-red-500 bg-red-950/40 border-red-900/60 shadow-sm",
        desc: "You are highly susceptible to simple dictionary attacks and automated bot-net takeovers. Password reuse linked with single-factor auth is the #1 cause of major data compromises."
      };
    } else if (vulnerability >= 40) {
      return {
        label: "MODERATE THREAT LEVEL (Medium Risk)",
        color: "text-amber-500 bg-amber-950/40 border-amber-900/50 shadow-sm",
        desc: "Though some security protocols are followed, standard network exposure remains. A single credential leak on an external site could chain compromise into your main nodes."
      };
    } else {
      return {
        label: "SECURE POSTURE ESTABLISHED (Low Risk)",
        color: "text-emerald-500 bg-emerald-950/40 border-emerald-900/60 shadow-sm",
        desc: "Excellent configuration! Segregated credentials and dynamic MFA verification act as reliable blockades against distributed credential stuffing attacks."
      };
    }
  };

  const result = calculateResult();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-neutral-950 border border-neutral-800 rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden relative"
      >
        {/* Absolute Header with close button */}
        <div className="absolute right-4 top-4 z-40">
          <button
            onClick={onClose}
            className="p-1 px-2 border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded text-xs font-mono flex items-center gap-1 transition-all duration-300"
            id="close-manifesto-btn"
          >
            <X className="h-3.5 w-3.5" /> Close
          </button>
        </div>

        {/* Dynamic Dual Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* LEFT STORYTELLING COLUMN */}
          <div className="md:col-span-7 p-6 sm:p-10 border-b md:border-b-0 md:border-r border-neutral-800 space-y-6">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-teal-400 bg-teal-950 border border-teal-900/50 px-2 py-0.5 rounded">
                CORE SYSTEM ADVISORY
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-white leading-tight">
                Why Security & Verification Matter
              </h2>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Modern digital threat models show that credential leakage is no longer a matter of "if", but "when". Integrated defense blocks unauthorized access at every checkpoint.
              </p>
            </div>

            {/* Core Explainer Topics */}
            <div className="space-y-5 pt-2">
              <div className="flex gap-3.5 items-start">
                <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-teal-400 flex-shrink-0">
                  <KeyRound className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">1. Entropy and Brute-Forcing</h3>
                  <p className="text-[11px] text-neutral-400 leading-relaxed mt-1">
                    Hackers routinely run thousands of low-cost graphics cards simultaneously to check over <strong className="text-white font-medium">90 billion guesses per second</strong>. Simple passwords disappear in fractions of a millisecond. Character diversity forces combinations into millions of years.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-teal-400 flex-shrink-0">
                  <Smartphone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">2. Dynamic Multi-Factor Handshakes</h3>
                  <p className="text-[11px] text-neutral-400 leading-relaxed mt-1">
                    Even perfect passwords can get phished. Interactive secondary handshakes (OTP, app alerts) verify physical device proximity—confirming that the person typing the key holds the actual verification hardware.
                  </p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-teal-400 flex-shrink-0">
                  <Globe className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">3. Session Tracking Integrity</h3>
                  <p className="text-[11px] text-neutral-400 leading-relaxed mt-1">
                    Active sessions must constantly monitor for background tampering. Registering device location and IP consistency ensures that sessions cannot be hijacked or cloned mid-use from distant servers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CHECKLIST DIAGNOSTIC COLUMN */}
          <div className="md:col-span-5 p-6 sm:p-10 bg-neutral-900/30 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider font-mono">Threat Diagnostics</h3>
                <p className="text-[11px] text-neutral-500 font-sans mt-0.5">Determine your vulnerability index below.</p>
              </div>

              {/* Questionnaire */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[11px] text-neutral-300 font-medium leading-tight">Q1. Do you reuse the same secure password across accounts?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setReusePw(true)}
                      className={`flex-1 py-1 px-2.5 rounded border text-xs font-mono transition-all duration-200 ${
                        reusePw === true
                          ? "bg-red-500/20 border-red-500 text-red-400 font-bold"
                          : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800"
                      }`}
                      id="q1-yes"
                    >
                      Yes, frequently
                    </button>
                    <button
                      onClick={() => setReusePw(false)}
                      className={`flex-1 py-1 px-2.5 rounded border text-xs font-mono transition-all duration-200 ${
                        reusePw === false
                          ? "bg-teal-500/20 border-teal-500 text-teal-400 font-bold"
                          : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800"
                      }`}
                      id="q1-no"
                    >
                      No, never
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] text-neutral-300 font-medium leading-tight">Q2. Is dynamic MFA (such as OTP) active on your host email?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMfaActive(true)}
                      className={`flex-1 py-1 px-2.5 rounded border text-xs font-mono transition-all duration-200 ${
                        mfaActive === true
                          ? "bg-teal-500/20 border-teal-500 text-teal-400 font-bold"
                          : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800"
                      }`}
                      id="q2-yes"
                    >
                      Yes, enabled
                    </button>
                    <button
                      onClick={() => setMfaActive(false)}
                      className={`flex-1 py-1 px-2.5 rounded border text-xs font-mono transition-all duration-200 ${
                        mfaActive === false
                          ? "bg-red-500/20 border-red-500 text-red-400 font-bold"
                          : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800"
                      }`}
                      id="q2-no"
                    >
                      No
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] text-neutral-300 font-medium leading-tight">Q3. Do you inspect your authorized login sessions monthly?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeviceReview(true)}
                      className={`flex-1 py-1 px-2.5 rounded border text-xs font-mono transition-all duration-200 ${
                        deviceReview === true
                          ? "bg-teal-500/20 border-teal-500 text-teal-400 font-bold"
                          : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800"
                      }`}
                      id="q3-yes"
                    >
                      Yes, regulary
                    </button>
                    <button
                      onClick={() => setDeviceReview(false)}
                      className={`flex-1 py-1 px-2.5 rounded border text-xs font-mono transition-all duration-200 ${
                        deviceReview === false
                          ? "bg-red-500/20 border-red-500 text-red-400 font-bold"
                          : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:bg-neutral-800"
                      }`}
                      id="q3-no"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment results box */}
            <div className={`p-4 border rounded-lg space-y-2 ${result.color}`}>
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span className="text-[10px] font-bold font-mono tracking-wider">
                  {result.label}
                </span>
              </div>
              <p className="text-[10px] font-sans leading-relaxed opacity-90">
                {result.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Backing footer */}
        <div className="bg-neutral-950 border-t border-neutral-900 py-3.5 px-6 flex justify-between items-center text-[10px] font-mono text-neutral-500">
          <span>IDENTITY SYSTEM STANDARDS</span>
          <span>ESTABLISHRY 2026</span>
        </div>
      </motion.div>
    </div>
  );
}
