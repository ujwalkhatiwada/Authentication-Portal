import React, { useState, useEffect } from "react";
import { Shield, Cpu, Zap, Activity } from "lucide-react";
import { motion } from "motion/react";

export default function InteractiveEntropyMatrix() {
  const [testPassword, setTestPassword] = useState("");
  const [crackTime, setCrackTime] = useState("Instantaneous");
  const [crackColor, setCrackColor] = useState("text-red-500");
  const [crackBarColor, setCrackBarColor] = useState("bg-red-500");
  const [hashRate, setHashRate] = useState(10); // in Billion hashes per second
  const [activeCell, setActiveCell] = useState<number | null>(null);

  // Calculate combinations and estimate cracking time under distributed attacks
  useEffect(() => {
    if (!testPassword) {
      setCrackTime("Instantaneous");
      setCrackColor("text-neutral-500");
      setCrackBarColor("bg-neutral-800");
      return;
    }

    let pool = 0;
    if (/[a-z]/.test(testPassword)) pool += 26;
    if (/[A-Z]/.test(testPassword)) pool += 26;
    if (/[0-9]/.test(testPassword)) pool += 10;
    if (/[^A-Za-z0-9]/.test(testPassword)) pool += 33;

    if (pool === 0) pool = 10; // Default fallback

    const combinations = Math.pow(pool, testPassword.length);
    // Hash guesses per second = hashRate * 1,000,000,000
    const guessesPerSec = hashRate * 1e9;
    const secondsToCrack = combinations / guessesPerSec;

    // Readable translation
    if (secondsToCrack < 1) {
      setCrackTime("Instantaneous (< 1s)");
      setCrackColor("text-red-500");
      setCrackBarColor("bg-red-500");
    } else if (secondsToCrack < 60) {
      setCrackTime(`${Math.round(secondsToCrack)} seconds`);
      setCrackColor("text-red-400");
      setCrackBarColor("bg-red-400");
    } else if (secondsToCrack < 3600) {
      setCrackTime(`${Math.round(secondsToCrack / 60)} minutes`);
      setCrackColor("text-orange-500");
      setCrackBarColor("bg-orange-500");
    } else if (secondsToCrack < 86400) {
      setCrackTime(`${Math.round(secondsToCrack / 3600)} hours`);
      setCrackColor("text-amber-500");
      setCrackBarColor("bg-amber-500");
    } else if (secondsToCrack < 31536000) {
      setCrackTime(`${Math.round(secondsToCrack / 86400)} days`);
      setCrackColor("text-yellow-500");
      setCrackBarColor("bg-yellow-500");
    } else if (secondsToCrack < 3153600000) {
      const years = Math.round(secondsToCrack / 31536000);
      setCrackTime(`${years.toLocaleString()} ${years === 1 ? 'year' : 'years'}`);
      setCrackColor("text-emerald-500");
      setCrackBarColor("bg-emerald-500");
    } else {
      const centuries = secondsToCrack / 31536000 / 100;
      if (centuries < 1000) {
        setCrackTime(`${Math.round(centuries).toLocaleString()} centuries`);
      } else {
        setCrackTime("Trillions of Years 🌌");
      }
      setCrackColor("text-teal-400 font-bold");
      setCrackBarColor("bg-teal-400");
    }
  }, [testPassword, hashRate]);

  return (
    <div className="lg:col-span-5 bg-neutral-950 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-neutral-900 select-none">
      {/* Background Interactive Dot Matrix Overlay */}
      <div className="absolute inset-0 bg-dots-dark opacity-10 pointer-events-none" />
      
      {/* Visual Top Branding */}
      <div className="space-y-5 z-10">
        <div className="flex items-center gap-1.5 justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900/60 border border-neutral-800 rounded-md text-white text-[10px] font-semibold tracking-wider uppercase font-mono shadow-sm">
            <Activity className="h-3.5 w-3.5 text-teal-400 animate-pulse" /> Sandbox Entropy Engine
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">Ver. 2.4</span>
        </div>

        <div>
          <h2 className="text-base font-semibold text-white tracking-tight leading-tight">
            Cryptographic Integrity Simulator
          </h2>
          <p className="text-[11px] text-neutral-400 leading-normal mt-1">
            Standard brute-forcing rigs can check billions of variants per second. Test your key complexity below.
          </p>
        </div>

        {/* INTERACTIVE COMPONENT 1: Password Brute-Force Clock */}
        <div className="bg-neutral-900/80 border border-neutral-800/80 rounded-lg p-3.5 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span>Passphrase Simulator</span>
            <span>Est. Crack Time</span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              placeholder="Type any test pass word..."
              className="w-full bg-black/50 border border-neutral-800 focus:border-teal-500 rounded px-2.5 py-1.5 text-xs text-teal-300 font-mono outline-hidden placeholder-neutral-600 tracking-wide"
              id="entropy-test-input"
            />
            {testPassword && (
              <button
                onClick={() => setTestPassword("")}
                className="absolute right-2 top-1.5 text-[10px] text-neutral-500 hover:text-white font-mono hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-mono text-neutral-500">GPU Attack Rate:</span>
            <div className="flex items-center gap-1">
              <input
                type="range"
                min="1"
                max="100"
                value={hashRate}
                onChange={(e) => setHashRate(Number(e.target.value))}
                className="w-16 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
                id="gpu-hashrate-slider"
              />
              <span className="text-[10px] font-mono text-teal-400 font-semibold w-10 text-right">
                {hashRate}B/s
              </span>
            </div>
          </div>

          {/* Dynamic visual crack indicator */}
          <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between">
            <span className="text-[10px] font-mono text-neutral-400">Time to unlock:</span>
            <span className={`text-xs font-mono font-bold tracking-tight ${crackColor}`}>
              {crackTime}
            </span>
          </div>

          <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${crackBarColor}`}
              style={{
                width: testPassword 
                  ? `${Math.min(Math.max((testPassword.length * 7), 10), 100)}%` 
                  : "0%"
              }}
            />
          </div>
        </div>

        {/* INTERACTIVE COMPONENT 2: Defensive Grid Sandbox */}
        <div className="bg-neutral-900/40 border border-neutral-800/40 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-neutral-400">Firewall Node Array:</span>
            <span className="text-[9px] font-mono text-neutral-500">Hover nodes to lock state</span>
          </div>

          {/* Grid display */}
          <div className="grid grid-cols-8 gap-1 p-1 bg-black/40 rounded border border-neutral-900">
            {Array.from({ length: 24 }).map((_, idx) => {
              const isLocked = activeCell === idx || (testPassword.length > 0 && idx % 3 === 0);
              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveCell(idx)}
                  className={`h-4 rounded-xs transition-all duration-300 ${
                    isLocked 
                      ? "bg-teal-500/70 border border-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.4)]" 
                      : "bg-neutral-950 border border-neutral-900 hover:bg-neutral-800"
                  }`}
                  id={`field-node-${idx}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer System Spec */}
      <div className="space-y-3 z-10 pt-6 lg:pt-0 border-t border-neutral-900/60 mt-4 lg:mt-0">
        <div className="flex gap-2 text-[10px] leading-normal font-sans">
          <div className="p-0.5 text-teal-400"><Shield className="h-3.5 w-3.5 shrink-0" /></div>
          <div className="text-neutral-400">
            <strong className="text-white font-medium">Symmetric Axiom:</strong> Passphrases are completely tested inside your local browser storage context, preventing transport eavesdropping.
          </div>
        </div>
        
        <div className="flex gap-2 text-[10px] leading-normal font-sans">
          <div className="p-0.5 text-amber-400"><Cpu className="h-3.5 w-3.5 shrink-0" /></div>
          <div className="text-neutral-400">
            <strong className="text-white font-medium">Distributed Proofing:</strong> Verification tokens require strict multi-device approval before decryption access is permitted.
          </div>
        </div>
      </div>
    </div>
  );
}
