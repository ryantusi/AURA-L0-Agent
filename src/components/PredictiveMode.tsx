import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  AlertTriangle,
  Check,
  CheckCircle,
  Loader2,
  ShieldCheck,
  Terminal,
  Database
} from "lucide-react";

interface PredictiveModeProps {
  mode4IsMonitoring: boolean;
  setMode4IsMonitoring: (val: boolean) => void;
  mode4StepIndex: number;
  setMode4StepIndex: React.Dispatch<React.SetStateAction<number>> | ((idx: number) => void);
  mode4LockoutCount: number;
  setMode4LockoutCount: React.Dispatch<React.SetStateAction<number>> | ((count: number) => void);
  mode4RemediationState: "idle" | "running" | "completed";
  setMode4RemediationState: (state: "idle" | "running" | "completed") => void;
  mode4RemediationProgress: number;
  setMode4RemediationProgress: (progress: number) => void;
  mode4ShowUserNotified: boolean;
  setMode4ShowUserNotified: (val: boolean) => void;
  mode4ShowAgentBriefed: boolean;
  setMode4ShowAgentBriefed: (val: boolean) => void;
}

export default function PredictiveMode({
  mode4IsMonitoring,
  setMode4IsMonitoring,
  mode4StepIndex,
  setMode4StepIndex,
  mode4LockoutCount,
  setMode4LockoutCount,
  mode4RemediationState,
  setMode4RemediationState,
  mode4RemediationProgress,
  setMode4RemediationProgress,
  mode4ShowUserNotified,
  setMode4ShowUserNotified,
  mode4ShowAgentBriefed,
  setMode4ShowAgentBriefed
}: PredictiveModeProps) {

  // Dynamic SVG Path Generator for Mode 4 lockout curve
  const getMode4Path = () => {
    if (!mode4IsMonitoring) {
      return "M 0 25 L 20 25 L 40 25 L 60 25 L 80 25 L 100 25";
    }
    
    const ratio = (mode4LockoutCount - 3) / 117; // normalizes count 3..120 to 0..1
    
    if (mode4RemediationState === "completed") {
      // Wave rose, but drops back down at the end to show it was prevented pre-emptively!
      const y20 = 25 - ratio * 4;
      const y40 = 25 - ratio * 12;
      const y60 = 25 - ratio * 16;
      const y80 = 25 - ratio * 10;
      const y100 = 25 - ratio * 1;
      return `M 0 25 C 20 ${y20}, 40 ${y40}, 60 ${y60}, 80 ${y80}, 100 ${y100}`;
    }
    
    // Rising wave: starts at 25, curves up to peak at 100
    const y20 = 25 - ratio * 2;
    const y40 = 25 - ratio * 6;
    const y60 = 25 - ratio * 12;
    const y80 = 25 - ratio * 18;
    const y100 = 25 - ratio * 22;
    
    return `M 0 25 C 20 ${y20}, 40 ${y40}, 60 ${y60}, 80 ${y80}, 100 ${y100}`;
  };

  return (
    <motion.div
      key="predictive"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[#141313] rounded-2xl border border-white/5 overflow-hidden p-6 space-y-6"
    >
      {/* Mode 4 Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-blue-400 text-[10px] uppercase font-mono tracking-widest font-semibold bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/10">
            MODE 4: PREDICTIVE OPERATIONS
          </span>
          <h2 className="text-2xl font-display font-semibold text-white mt-2.5">
            Telemetry Foresight
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            AURA continuously monitors global ticket telemetry, pre-empting high-correlation failure loops before a major P1/P2 incident unleashes.
          </p>
        </div>

        <div>
          {!mode4IsMonitoring ? (
            <button
              onClick={() => {
                setMode4IsMonitoring(true);
                setMode4StepIndex(1);
                setMode4LockoutCount(3);
                setMode4RemediationState("idle");
                setMode4RemediationProgress(0);
                setMode4ShowUserNotified(false);
                setMode4ShowAgentBriefed(false);
                
                // Start rising lockout ticket wave
                let current = 3;
                const interval = setInterval(() => {
                  current += Math.floor(Math.random() * 8) + 4;
                  if (current >= 120) {
                    current = 120;
                    clearInterval(interval);
                    // Move to step 2: pattern detected
                    setMode4StepIndex(2);
                  }
                  setMode4LockoutCount(current);
                }, 120);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-lg shadow-blue-500/15 border-glow hover:scale-[1.02] cursor-pointer"
            >
              Initiate Predictive Monitoring
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/20 px-3 py-1.5 rounded-lg border border-emerald-500/10 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Monitoring Engaged
              </span>
              <button
                onClick={() => {
                  setMode4IsMonitoring(false);
                  setMode4StepIndex(0);
                  setMode4LockoutCount(3);
                  setMode4RemediationState("idle");
                  setMode4RemediationProgress(0);
                  setMode4ShowUserNotified(false);
                  setMode4ShowAgentBriefed(false);
                }}
                className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/5 rounded-lg text-[10px] font-mono uppercase transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Line graph design wrapper */}
      <div className="bg-zinc-950 p-5 rounded-xl border border-white/5 relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xs font-semibold text-zinc-400 uppercase font-mono">
              Account Lockout Tickets Trend
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
              Real-time correlation analysis & anomaly threshold mapping
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Live Lockout Counter */}
            <div className="flex items-baseline gap-1.5 bg-zinc-900 border border-white/5 px-3 py-1 rounded-lg">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Lockouts:</span>
              <span className={`text-sm font-mono font-bold ${
                mode4LockoutCount > 90 ? "text-red-400 animate-pulse" :
                mode4LockoutCount > 30 ? "text-amber-400" :
                "text-emerald-400"
              }`}>
                {mode4LockoutCount}
              </span>
            </div>

            {/* Alert Badge */}
            {mode4IsMonitoring && (
              <div className={`flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded border ${
                mode4RemediationState === "completed"
                  ? "text-emerald-400 bg-emerald-950/20 border-emerald-500/10"
                  : mode4LockoutCount >= 100
                  ? "text-red-400 bg-red-950/20 border-red-500/10 animate-pulse"
                  : "text-amber-400 bg-amber-950/20 border-amber-500/10"
              }`}>
                {mode4RemediationState === "completed" ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Wave Flattened</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3" />
                    <span>{mode4LockoutCount >= 100 ? "Anomaly Peak" : "Trend Rising"}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Custom Simulated Graph via styled SVG */}
        <div className="h-36 w-full flex items-end">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="5" x2="100" y2="5" stroke="rgba(255,255,255,0.05)" strokeWidth="0.15" />
            <line x1="0" y1="15" x2="100" y2="15" stroke="rgba(255,255,255,0.05)" strokeWidth="0.15" />
            <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="0.15" />

            {/* Data curve path */}
            <path
              d={getMode4Path()}
              fill="none"
              stroke={
                mode4RemediationState === "completed"
                  ? "#10b981"
                  : mode4LockoutCount >= 100
                  ? "#ef4444"
                  : mode4LockoutCount >= 40
                  ? "#f59e0b"
                  : "#3b82f6"
              }
              strokeWidth="1.2"
              className="stroke-[1.5] transition-all duration-300"
            />

            {/* Shadow under curve */}
            {mode4IsMonitoring && (
              <path
                d={`${getMode4Path()} L 100 30 L 0 30 Z`}
                fill={`url(#gradient-${mode4RemediationState === "completed" ? "green" : "red"})`}
                opacity="0.08"
                className="transition-all duration-300"
              />
            )}

            {/* SVG Defs for gradients */}
            <defs>
              <linearGradient id="gradient-red" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
              <linearGradient id="gradient-green" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="flex justify-between text-[9px] text-zinc-500 font-mono mt-2.5 border-t border-white/5 pt-2">
          <span>04:00 AM (Standby)</span>
          <span>12:00 PM (Resets Peak)</span>
          <span>08:00 PM (Smartcard Lockout Wave)</span>
          <span className={mode4RemediationState === "completed" ? "text-emerald-400 font-medium" : mode4LockoutCount >= 100 ? "text-red-400 font-bold" : "text-zinc-400"}>
            {mode4RemediationState === "completed" ? "04:00 AM (WAVE PREVENTED)" : "04:00 AM (CRITICAL PEAK)"}
          </span>
        </div>
      </div>

      {/* Pattern Analysis & Threat Roster */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-display">
          Pattern Correlation Stream
        </h3>

        {!mode4IsMonitoring && (
          <div className="p-12 rounded-xl border border-dashed border-white/10 bg-zinc-950/20 text-center flex flex-col items-center justify-center space-y-3 select-none">
            <div className="w-10 h-10 rounded-full bg-blue-500/5 flex items-center justify-center border border-blue-500/10">
              <Activity className="w-4 h-4 text-blue-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono">
                Telemetry Scanner Standby
              </h3>
              <p className="text-xs text-zinc-500 max-w-md mt-1 leading-relaxed">
                Telemetry stream is running in passive background observation. Click <strong className="text-blue-400 font-medium">Initiate Predictive Monitoring</strong> to active-scan high-correlation trends.
              </p>
            </div>
          </div>
        )}

        {mode4IsMonitoring && mode4StepIndex === 1 && (
          <div className="p-12 rounded-xl border border-white/5 bg-zinc-950/40 text-center flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <div>
              <h3 className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
                Analyzing Correlation Space...
              </h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-md leading-relaxed font-light">
                AURA is cross-referencing ServiceNow ticket velocity logs, Microsoft Active Directory lockout audits, and smartcard authentication tokens in real time...
              </p>
            </div>
          </div>
        )}

        <AnimatePresence>
          {mode4IsMonitoring && mode4StepIndex >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-4 text-left"
            >
              <div
                className={`p-5 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all ${
                  mode4RemediationState === "completed"
                    ? "bg-emerald-950/5 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.03)]"
                    : mode4RemediationState === "running"
                    ? "bg-zinc-950/40 border-amber-500/20"
                    : "bg-zinc-950 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.03)]"
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                      mode4RemediationState === "completed"
                        ? "text-emerald-400 bg-emerald-950/20 border-emerald-500/10"
                        : "text-red-400 bg-red-950/20 border-red-500/10 animate-pulse"
                    }`}>
                      P2 DETECTED
                    </span>
                    <span className="text-xs font-semibold font-display text-zinc-300">
                      High-Correlation Outage Threat
                    </span>
                    <span
                      className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                        mode4RemediationState === "completed"
                          ? "text-emerald-400 bg-emerald-950/10"
                          : "text-red-400 bg-red-950/10"
                      }`}
                    >
                      RISK SCORE: {mode4RemediationState === "completed" ? "0" : "96"}%
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-semibold font-display text-white mt-1">
                    Smartcard Authentication Loop / Cached Lockout Wave
                  </h4>
                  
                  <p className="text-xs text-zinc-300 font-light leading-relaxed max-w-3xl">
                    A wave of password resets from the previous day is now producing a secondary wave of account lockouts, caused by previously-reset credentials conflicting with cached smartcard sessions on affected laptops.
                  </p>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1.5 text-[11px] font-mono">
                    <p className="text-zinc-500">
                      REMEDIATION: <span className="text-blue-400 font-semibold">Push Nexthink Remote Action</span>
                    </p>
                    <p className="text-zinc-500">
                      AFFECTED ACCOUNTS: <span className="text-indigo-400 font-semibold">120 Users (P2)</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-stretch md:items-end gap-2.5 min-w-[200px] w-full md:w-auto">
                  {mode4RemediationState === "idle" && (
                    <button
                      onClick={() => {
                        setMode4RemediationState("running");
                        let prog = 0;
                        const progInterval = setInterval(() => {
                          prog += 5;
                          if (prog >= 100) {
                            prog = 100;
                            clearInterval(progInterval);
                            setMode4RemediationState("completed");
                            setMode4StepIndex(4);
                            setMode4ShowUserNotified(true);
                            setMode4ShowAgentBriefed(true);
                            
                            // Drop Lockout count back to 3
                            let current = 120;
                            const dropInterval = setInterval(() => {
                              current -= Math.floor(Math.random() * 12) + 6;
                              if (current <= 3) {
                                current = 3;
                                clearInterval(dropInterval);
                              }
                              setMode4LockoutCount(current);
                            }, 80);
                          }
                          setMode4RemediationProgress(prog);
                        }, 150);
                      }}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold text-xs uppercase tracking-wider transition-all border-glow text-center cursor-pointer"
                    >
                      Push Nexthink Remote Action
                    </button>
                  )}

                  {mode4RemediationState === "running" && (
                    <div className="space-y-2 w-full">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1.5 animate-pulse">
                          <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
                          Syncing smartcard sessions — 120 accounts
                        </span>
                        <span>{mode4RemediationProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-amber-500 transition-all duration-100"
                          style={{ width: `${mode4RemediationProgress}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-zinc-500 block text-right">
                        Active sync payload dispatched
                      </span>
                    </div>
                  )}

                  {mode4RemediationState === "completed" && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2.5 text-emerald-400 font-mono text-xs font-bold shadow-inner">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>REMEDIATED PREVENTATIVELY</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sequence of Confirmation Notices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <AnimatePresence>
                  {mode4ShowUserNotified && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 bg-emerald-950/10 border border-emerald-500/20 rounded-xl flex items-start gap-3.5 relative overflow-hidden shadow-lg text-left"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-emerald-500" />
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold font-mono text-emerald-400 uppercase tracking-widest">
                          CREDENTIAL SYNC OK
                        </h4>
                        <p className="text-xs text-zinc-100 font-semibold font-display">
                          120 users notified — fix pre-applied
                        </p>
                        <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                          Background ticket sync completes. Local cache conflicts cleared remotely on devices. Users avoided lockout entirely.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {mode4ShowAgentBriefed && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 bg-blue-950/10 border border-blue-500/20 rounded-xl flex items-start gap-3.5 relative overflow-hidden shadow-lg text-left"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-500" />
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 flex-shrink-0">
                        <Terminal className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-semibold font-mono text-blue-400 uppercase tracking-widest">
                          TEAM DISPATCH SENT
                        </h4>
                        <p className="text-xs text-zinc-100 font-semibold font-display">
                          Agent Brief Sent: Expect a lighter-than-usual lockout wave
                        </p>
                        <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                          AURA compiled incident details & distributed proactive briefing report. GxpLearn team informed that preemptive correction has already run.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Predictive Incident Ticket (New Feature) */}
              <AnimatePresence>
                {mode4ShowAgentBriefed && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-950/60 p-5 rounded-xl border border-white/10 relative overflow-hidden space-y-4 shadow-xl select-none w-full text-left mt-4"
                  >
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500/30 via-indigo-500/45 to-blue-500/30" />
                    
                    <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Database className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest font-semibold">
                          PREDICTIVE INCIDENT TICKET
                        </span>
                      </div>
                      <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">
                        PREEMPTED EFFECTIVELY
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 text-xs">
                      <div>
                        <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider mb-0.5">Ticket Number</span>
                        <span className="text-white font-mono font-semibold text-[13px]">INC2222222</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider mb-0.5">Incident Severity</span>
                        <span className="text-red-400 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                          MP2 - High
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider mb-0.5">Affected Users</span>
                        <span className="text-white font-medium">120 Users</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider mb-0.5">Configuration Item</span>
                        <span className="text-indigo-400 font-mono font-semibold">Accounts & Permissions</span>
                      </div>
                      
                      <span className="col-span-full border-t border-white/5 my-0.5" />
                      
                      <div className="col-span-2">
                        <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider mb-0.5">Issue Title</span>
                        <span className="text-zinc-200 font-semibold">Multiple Account Lockouts detected</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider mb-0.5">Assignment Group</span>
                        <span className="text-zinc-200 font-light">Predictive Operations</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider mb-0.5">Assigned Agent</span>
                        <span className="text-zinc-200 font-light">AURA - L0</span>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3.5 text-xs grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                      <div className="md:col-span-3">
                        <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider mb-0.5">Description</span>
                        <p className="text-zinc-300 font-light leading-relaxed">
                          AURA predicted a high wave of lockout incidents forming a P2 incident.
                        </p>
                      </div>
                      <div className="md:col-span-1">
                        <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider mb-0.5">Status</span>
                        <div className="mt-1">
                          <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <span className="w-1 h-1 rounded-full bg-blue-400 animate-pulse" />
                            NEW
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3.5 text-xs">
                      <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider mb-2">Work Notes</span>
                      <div className="space-y-1.5">
                        {[
                          "AURA detected multiple user's lockout from Active Directory",
                          "Analyzed the cause and found that affected user's changed their password the day before",
                          "Analyzed ticket history and the solution is to run the Nexthink remote action for Smartcard sync",
                          "Pushed Nexthink remote actions to the affected user's devices",
                          "Prevented a P2 incident",
                          "Notified all users and agents regarding this incident"
                        ].map((note, noteIdx) => (
                          <div key={noteIdx} className="flex items-start gap-2 text-[11px] text-zinc-300">
                            <span className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                            <span>{note}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
