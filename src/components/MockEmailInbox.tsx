import React from "react";
import { Mail, MailOpen, X, RefreshCw, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SimulatedEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  otp: string;
  timestamp: Date;
  onActionClick: () => void;
}

interface MockEmailInboxProps {
  emails: SimulatedEmail[];
  onClear: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function MockEmailInbox({ emails, onClear, isOpen, setIsOpen }: MockEmailInboxProps) {
  const [activeTab, setActiveTab] = React.useState<"inbox" | "security">("inbox");

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          id="toggle-mock-mailbox"
          className="relative flex items-center gap-2 bg-brand-accent border border-brand-border text-white hover:opacity-90 transition-opacity py-3 px-4 rounded-md shadow-lg group cursor-pointer focus:outline-none"
        >
          {emails.length > 0 && (
            <span className="absolute -top-1.5 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black border border-white text-[9px] font-bold text-white">
              {emails.length}
            </span>
          )}
          {isOpen ? <X className="h-4 w-4" /> : <Mail className="h-4 w-4 group-hover:scale-105 transition-transform" />}
          <span className="text-xs font-semibold tracking-wide">Developer Mailbox</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            className="fixed bottom-22 right-6 z-40 w-full max-w-sm sm:max-w-md bg-brand-surface border border-brand-border rounded-md shadow-xl overflow-hidden flex flex-col max-h-[480px]"
          >
            {/* Header */}
            <div className="bg-brand-accent text-white p-4 flex items-center justify-between border-b border-brand-border animate-none">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-neutral-900 border border-neutral-800 rounded text-white">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold tracking-wide uppercase">Secure Sandbox Mail</h3>
                  <p className="text-[10px] text-neutral-400 font-mono">Simulating delivery loop</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {emails.length > 0 && (
                  <button
                    onClick={onClear}
                    title="Clear Mailbox"
                    className="text-neutral-300 hover:text-white transition-colors p-1"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-300 hover:text-white transition-colors p-1 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content list */}
            <div className="flex-1 overflow-y-auto p-4 bg-brand-bg min-h-[300px]">
              {emails.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-12 px-6 text-center">
                  <div className="h-12 w-12 bg-white rounded-md flex items-center justify-center border border-brand-border text-brand-secondary mb-3">
                    <MailOpen className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-semibold text-brand-primary uppercase tracking-wide">Inbox is empty</h4>
                  <p className="text-xs text-brand-secondary mt-1.5 max-w-xs leading-relaxed">
                    Automated system emails will display here. Request a passcode using the secure password recovery flow above to test!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {emails.map((email) => (
                    <motion.div
                      key={email.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white border border-brand-border rounded-md p-4 shadow-xs"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold bg-brand-input text-brand-primary border border-brand-border font-mono">
                          to: {email.to}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-brand-secondary font-mono">
                          <Clock className="h-2.5 w-2.5" />
                          {email.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-brand-primary mb-1">{email.subject}</h4>
                      <p className="text-xs text-brand-secondary font-sans leading-relaxed whitespace-pre-line mb-3 bg-brand-input p-2.5 rounded-md border border-brand-border font-mono select-all">
                        {email.body}
                      </p>

                      <div className="pt-2 border-t border-brand-border flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-brand-secondary font-bold tracking-wider uppercase font-sans">OTP Code:</span>
                          <span className="text-xs font-bold font-mono text-brand-primary bg-brand-input px-2 py-0.5 rounded border border-brand-border">
                            {email.otp}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            email.onActionClick();
                            setIsOpen(false);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-accent hover:underline transition-all cursor-pointer"
                        >
                          Use Reset Link <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Sticky Tips Footer */}
            <div className="p-3 bg-white border-t border-brand-border text-[10px] text-brand-secondary font-sans leading-tight">
              <span className="font-semibold text-brand-primary">Recovery Helper:</span> Clicking <span className="italic font-medium text-brand-primary">"Use Reset Link"</span> automatically inserts the code to save manual entry steps.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
