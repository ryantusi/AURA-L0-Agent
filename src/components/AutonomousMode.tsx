import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Volume2,
  Mic,
  RotateCcw,
  Pause,
  Play,
  ShieldCheck,
  ShieldAlert,
  Database
} from "lucide-react";
import MicVisualizer from "./MicVisualizer";
import { VALIDATED_CALL_SCRIPT, FAILED_CALL_SCRIPT } from "../data";

interface AutonomousModeProps {
  mode1Tab: "validated" | "failed";
  setMode1Tab: (tab: "validated" | "failed") => void;
  mode1IsPlaying: boolean;
  setMode1IsPlaying: (playing: boolean) => void;
  mode1StepIndex: number;
  setMode1StepIndex: React.Dispatch<React.SetStateAction<number>> | ((idx: number) => void);
  mode1Timer: number;
  setMode1Timer: React.Dispatch<React.SetStateAction<number>> | ((timer: number) => void);
  mode1Speed: number;
  setMode1Speed: (speed: number) => void;
  tutorialStep: string | null;
}

export default function AutonomousMode({
  mode1Tab,
  setMode1Tab,
  mode1IsPlaying,
  setMode1IsPlaying,
  mode1StepIndex,
  setMode1StepIndex,
  mode1Timer,
  setMode1Timer,
  mode1Speed,
  setMode1Speed,
  tutorialStep
}: AutonomousModeProps) {
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom of voice transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mode1StepIndex, mode1IsPlaying]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const currentScript = mode1Tab === "validated" ? VALIDATED_CALL_SCRIPT : FAILED_CALL_SCRIPT;

  return (
    <motion.div
      key="autonomous"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[#141313] rounded-2xl border border-white/5 overflow-hidden flex flex-col"
    >
      {/* Top Bar Navigation (Validated vs Failed tab toggle) */}
      <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-zinc-950/40">
        <div>
          <span className="text-blue-400 text-[10px] uppercase font-mono tracking-widest font-semibold bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/10">
            MODE 1: AUTONOMOUS RESOLUTION
          </span>
          <h2 className="text-2xl font-display font-semibold text-white mt-2.5">
            Autonomous Voice Resolution
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Experience AURA's live Level 0 Voice Support flow with deep biometrics, dynamic identity validation, and self-healing.
          </p>
        </div>

        {/* Two Tabs Selector */}
        <div className="flex bg-zinc-900/80 p-1.5 rounded-xl border border-white/5 w-full md:w-auto">
          <button
            onClick={() => {
              setMode1Tab("validated");
              setMode1IsPlaying(false);
              setMode1StepIndex(0);
              setMode1Timer(0);
            }}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              mode1Tab === "validated"
                ? "bg-zinc-800 text-white border border-white/10 shadow-lg"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Validated Call
          </button>
          <button
            onClick={() => {
              setMode1Tab("failed");
              setMode1IsPlaying(false);
              setMode1StepIndex(0);
              setMode1Timer(0);
            }}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              mode1Tab === "failed"
                ? "bg-zinc-800 text-white border border-white/10 shadow-lg"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            Failed Verification
          </button>
        </div>
      </div>

      {/* Main Simulator Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 p-6 bg-zinc-950/10">
        
        {/* LEFT COLUMN: Call Visualizer & Controller */}
        <div className="bg-zinc-950/40 rounded-xl border border-white/5 p-6 flex flex-col items-center justify-between min-h-[480px] text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          
          <div className="w-full flex flex-col items-center">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
              AURA LIVE ORB
            </span>
            
            {/* Giant Liquid Voice Orb (Responsive) */}
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center bg-white/[0.01] rounded-full border border-white/5 shadow-inner mt-6">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <MicVisualizer
                  isListening={false}
                  isSpeaking={mode1IsPlaying && currentScript[mode1StepIndex]?.speaking}
                />
              </div>
              
              {/* Microphone Overlay / Status Icon (Sized perfectly down as requested) */}
              <div className={`relative z-10 w-11 h-11 rounded-full border flex items-center justify-center bg-zinc-950/90 backdrop-blur-md shadow-lg transition-all duration-500 ${
                mode1IsPlaying
                  ? "border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                  : "border-white/10"
              }`}>
                {mode1IsPlaying && currentScript[mode1StepIndex]?.speaking ? (
                  <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                ) : (
                  <Mic className={`w-4 h-4 ${mode1IsPlaying ? "text-purple-400 animate-pulse" : "text-zinc-500"}`} />
                )}
              </div>
            </div>
            
            {/* Call Timer Display */}
            <div className="mt-6 space-y-1">
              <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">CALL DURATION</p>
              <p className="text-3xl font-mono font-bold tracking-tight text-white">
                {formatTimer(mode1Timer)}
              </p>
            </div>

            {/* Active Validation Tracker Badge */}
            <div className="mt-4 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-white/5 inline-flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${mode1IsPlaying ? "bg-emerald-400 animate-ping" : "bg-zinc-600"}`} />
              <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-300">
                {currentScript[Math.min(mode1StepIndex, currentScript.length - 1)]?.progress || "Security Questions: --"}
              </span>
            </div>
          </div>

          {/* Control Actions Frame */}
          <div className="w-full pt-6 border-t border-white/5 flex flex-col gap-4 mt-6">
            
            {/* Play / Pause & Reset buttons */}
            <div className="flex justify-center items-center gap-3">
              <button
                onClick={() => {
                  if (mode1StepIndex >= currentScript.length) {
                    setMode1StepIndex(0);
                    setMode1Timer(0);
                  }
                  setMode1IsPlaying(!mode1IsPlaying);
                }}
                className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  mode1IsPlaying
                    ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20"
                    : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/10 border-glow"
                }`}
              >
                {mode1IsPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pause Call
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" /> {mode1StepIndex === 0 ? "Start Call Simulation" : "Resume Call"}
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setMode1IsPlaying(false);
                  setMode1StepIndex(0);
                  setMode1Timer(0);
                }}
                className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/5 rounded-lg transition-colors cursor-pointer"
                title="Restart Call"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Playback speed multiplier (Allows judges to view fast if needed) */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase">SIMULATION SPEED</span>
              <div className="flex gap-1 bg-zinc-900 p-0.5 rounded-md border border-white/5">
                {[1, 2, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setMode1Speed(s)}
                    className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded transition-all cursor-pointer ${
                      mode1Speed === s
                        ? "bg-blue-500 text-white"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Scrolling Call Transcript Viewport */}
        <div className="bg-zinc-950/40 border border-white/5 rounded-xl flex flex-col h-[520px] overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          
          {/* Transcript Header */}
          <div className="px-4 py-3 bg-zinc-950 border-b border-white/5 flex justify-between items-center text-xs select-none">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${mode1IsPlaying ? "bg-emerald-500 animate-pulse" : "bg-zinc-600"}`} />
              <span className="font-mono text-[9px] tracking-widest text-zinc-400 uppercase">
                SECURE VOICE TRACE
              </span>
            </div>
            <span className="text-[9px] font-mono text-zinc-500 uppercase">
              CALLER ID EXAMPLE: <strong className="text-zinc-300 font-medium">RYAN</strong>
            </span>
          </div>

          {/* Chat Bubbles Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin flex flex-col">
            
            {/* Empty State before simulation triggers */}
            {mode1StepIndex === 0 && !mode1IsPlaying && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3 my-auto">
                <div className="w-10 h-10 rounded-full bg-blue-500/5 flex items-center justify-center border border-blue-500/10 animate-pulse">
                  <Mic className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Ready to Establish Call</p>
                  <p className="text-[11px] text-zinc-500 mt-1.5 max-w-[280px] leading-relaxed">
                    Click <strong className="text-blue-400 font-medium">Start Call Simulation</strong> to initiate the interactive dialogue sequence.
                  </p>
                </div>
              </div>
            )}

            {/* Dialogue list render */}
            {currentScript
              .slice(0, mode1IsPlaying || mode1StepIndex > 0 ? mode1StepIndex + 1 : 0)
              .map((step, idx) => {
                if (step.type === "system") {
                  return (
                    <div
                      key={`mode1-sys-step-${step.id || idx}`}
                      className="flex flex-col items-center text-center my-2.5 animate-fade-in"
                    >
                      <span className="text-[10px] italic font-mono text-zinc-500 leading-relaxed">
                        // {step.text}
                      </span>
                      {step.badge && (
                        <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono font-medium border ${
                          step.badge.status === "pass"
                            ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]"
                            : "bg-red-950/40 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.05)]"
                        }`}>
                          {step.badge.status === "pass" ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                          )}
                          {step.badge.text}
                        </div>
                      )}
                    </div>
                  );
                } else if (step.type === "ticket") {
                  return (
                    <div
                      key={`mode1-ticket-step-${step.id || idx}`}
                      className="my-4 animate-fade-in"
                    >
                      <div className="p-4 rounded-xl border border-white/10 bg-zinc-950/80 flex flex-col gap-3.5 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-blue-500/20 via-indigo-500/25 to-blue-500/20" />
                        
                        <div className="flex justify-between items-start border-b border-white/5 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 bg-blue-500/10 rounded border border-blue-500/10">
                              <Database className="w-3.5 h-3.5 text-blue-400" />
                            </span>
                            <div>
                              <h4 className="text-xs font-bold text-white font-display uppercase tracking-wider">
                                {step.ticketData.number}
                              </h4>
                              <p className="text-[9px] text-zinc-500 uppercase font-mono tracking-widest mt-0.5">
                                {step.ticketData.category}
                              </p>
                            </div>
                          </div>
                          <span className={`text-[9px] px-2.5 py-0.5 font-mono font-semibold rounded-full border tracking-wider ${
                            step.ticketData.status === "RESOLVED"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}>
                            {step.ticketData.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2.5 text-[11px] leading-relaxed">
                          <div>
                            <span className="text-[8.5px] text-zinc-500 font-mono block uppercase tracking-widest font-semibold">IDENTITY VERIFICATION LOG</span>
                            <span className="text-zinc-300 font-light mt-0.5 block">{step.ticketData.verificationNotes}</span>
                          </div>
                          <div>
                            <span className="text-[8.5px] text-zinc-500 font-mono block uppercase tracking-widest font-semibold">AUTOMATED RESOLUTION COMPLETED</span>
                            <span className="text-zinc-300 font-light mt-0.5 block">{step.ticketData.actionTaken}</span>
                          </div>
                          <div className="text-[8.5px] text-zinc-600 font-mono border-t border-white/5 pt-2 flex justify-between items-center">
                            <span>{step.ticketData.kb}</span>
                            <span>{step.ticketData.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  const isAura = step.role === "aura";
                  return (
                    <div
                      key={`mode1-chat-step-${step.id || idx}`}
                      className={`flex w-full animate-fade-in ${
                        isAura ? "justify-start" : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 relative shadow-md ${
                          isAura
                            ? "bg-gradient-to-tr from-indigo-950/45 to-zinc-900/65 border border-indigo-500/15 text-zinc-100 rounded-tl-none shadow-indigo-950/5"
                            : "bg-zinc-900/90 border border-white/5 text-zinc-200 rounded-tr-none ml-auto shadow-black/10"
                        }`}
                      >
                        <span className={`block text-[8.5px] font-mono tracking-widest uppercase font-semibold mb-1.5 ${
                          isAura ? "text-indigo-400" : "text-zinc-500"
                        }`}>
                          {isAura ? "AURA (L0 AI Support)" : "Ryan Ahmed Tusi (Gilead Employee)"}
                        </span>
                        <p className="text-xs leading-relaxed font-light">{step.text}</p>
                      </div>
                    </div>
                  );
                }
              })
            }
            
            {/* Scroll target */}
            <div ref={transcriptEndRef} />
          </div>
        </div>

      </div>
    </motion.div>
  );
}
