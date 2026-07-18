import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Volume2,
  Mic,
  RotateCcw,
  Play,
  Pause,
  Fingerprint,
  Activity,
  Info,
  Sparkles,
  BrainCircuit,
  Globe,
  Check,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Database,
  Shield,
  BookOpen,
  X
} from "lucide-react";
import MicVisualizer from "./MicVisualizer";
import {
  COPILOT_CALL_SCRIPT,
  WARM_TRANSFER_CALL_SCRIPT,
  THREE_STRIKE_CALL_SCRIPT,
  COPILOT_PAST_HISTORY,
  WARM_TRANSFER_PAST_HISTORY,
  THREE_STRIKE_PAST_HISTORY
} from "../data";

interface CopilotModeProps {
  mode3Tab: "l1_outbound" | "l2_warm_transfer" | "three_strike";
  setMode3Tab: (tab: "l1_outbound" | "l2_warm_transfer" | "three_strike") => void;
  mode3StepIndex: number;
  setMode3StepIndex: React.Dispatch<React.SetStateAction<number>> | ((idx: number) => void);
  mode3IsPlaying: boolean;
  setMode3IsPlaying: (playing: boolean) => void;
  mode3Timer: number;
  setMode3Timer: React.Dispatch<React.SetStateAction<number>> | ((timer: number) => void);
  mode3Speed: number;
  setMode3Speed: (speed: number) => void;
  mode3Sentiment: number;
  setMode3Sentiment: (sentiment: number) => void;
}

export default function CopilotMode({
  mode3Tab,
  setMode3Tab,
  mode3StepIndex,
  setMode3StepIndex,
  mode3IsPlaying,
  setMode3IsPlaying,
  mode3Timer,
  setMode3Timer,
  mode3Speed,
  setMode3Speed,
  mode3Sentiment,
  setMode3Sentiment
}: CopilotModeProps) {
  const copilotFeedEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom of Co-Pilot feed
  useEffect(() => {
    copilotFeedEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mode3StepIndex]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const getCurrentScript = () => {
    if (mode3Tab === "l1_outbound") return COPILOT_CALL_SCRIPT;
    if (mode3Tab === "l2_warm_transfer") return WARM_TRANSFER_CALL_SCRIPT;
    return THREE_STRIKE_CALL_SCRIPT;
  };

  const getCurrentHistory = () => {
    if (mode3Tab === "l1_outbound") return COPILOT_PAST_HISTORY;
    if (mode3Tab === "l2_warm_transfer") return WARM_TRANSFER_PAST_HISTORY;
    return THREE_STRIKE_PAST_HISTORY;
  };

  const getTicketDetails = () => {
    if (mode3Tab === "l1_outbound") {
      const isCompleted = mode3StepIndex >= COPILOT_CALL_SCRIPT.length;
      return {
        number: "INC2222222",
        caller: "Arafath Hussain",
        ci: "GxpLearn",
        title: "GxpLearn Course Issue",
        group: "Contact Center",
        agent: "Karthikeyan BK",
        desc: "Unable to complete the online course. Stuck in a module. Potential bug.",
        status: mode3StepIndex === 0 && !mode3IsPlaying
          ? "On Hold"
          : isCompleted
          ? "Resolved"
          : "Work in Progress"
      };
    } else if (mode3Tab === "l2_warm_transfer") {
      const isCompleted = mode3StepIndex >= WARM_TRANSFER_CALL_SCRIPT.length;
      const isAccepted = mode3StepIndex >= 4;
      return {
        number: "INC2222222",
        caller: "Surya Dev",
        ci: "Company Portal",
        title: "BYOD Mobile Setup Issue",
        group: isAccepted ? "End User Platforms - Mobility" : "Contact Center",
        agent: isAccepted ? "Puja Prabha" : "Nancy Angelin",
        desc: "Unable to setup company profile in user's iPhone. Company portal not downloading automatically after VPN setup.",
        status: mode3StepIndex === 0 && !mode3IsPlaying
          ? "On Hold"
          : isCompleted
          ? "Resolved"
          : "Work in Progress"
      };
    } else {
      const isCompleted = mode3StepIndex >= THREE_STRIKE_CALL_SCRIPT.length - 1;
      return {
        number: "INC2222222",
        caller: "Sarah Linhart",
        ci: "GADI",
        title: "GADI VDI Access Issue",
        group: "Contact Center",
        agent: "AURA - L0",
        desc: "Requesting access for GADI VDI to access Gilead application.",
        status: mode3StepIndex === 0 && !mode3IsPlaying
          ? "On Hold"
          : isCompleted
          ? "Closed"
          : "On Hold"
      };
    }
  };

  const renderTicketBrief = () => {
    const ticket = getTicketDetails();
    const isClosed = ticket.status === "Closed";
    const isResolved = ticket.status === "Resolved";
    
    let statusBg = "bg-amber-500/10 text-amber-400 border-amber-500/20";
    let statusDot = "bg-amber-400";
    if (isResolved) {
      statusBg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      statusDot = "bg-emerald-400";
    } else if (isClosed) {
      statusBg = "bg-rose-500/10 text-rose-400 border-rose-500/20";
      statusDot = "bg-rose-400";
    } else if (ticket.status === "Work in Progress") {
      statusBg = "bg-blue-500/10 text-blue-400 border-blue-500/20";
      statusDot = "bg-blue-400 animate-ping";
    }

    return (
      <div className="bg-zinc-950/60 p-5 rounded-xl border border-white/10 relative overflow-hidden space-y-4 shadow-xl select-none w-full text-left animate-fade-in">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-blue-500/30 via-indigo-500/45 to-blue-500/30" />
        
        <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest font-semibold">
              CO-PILOT TICKET BRIEF
            </span>
          </div>
          <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">
            {ticket.number.startsWith("RITM") ? "REQ RECORD ACTIVE" : "INCIDENT FILE ACTIVE"}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs">
          <div>
            <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider mb-0.5">Ticket Number</span>
            <span className="text-white font-mono font-semibold text-[13px]">{ticket.number}</span>
          </div>
          <div>
            <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider mb-0.5">Caller</span>
            <span className="text-white font-medium">{ticket.caller}</span>
          </div>
          <div>
            <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider mb-0.5">Configuration Item</span>
            <span className="text-indigo-400 font-mono font-semibold">{ticket.ci}</span>
          </div>
          <span className="col-span-full border-t border-white/5 my-0.5" />
          <div className="col-span-2 md:col-span-1">
            <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider mb-0.5">Issue Title</span>
            <span className="text-zinc-200 font-light">{ticket.title}</span>
          </div>
          <div>
            <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider mb-0.5">Assignment Group</span>
            <span className="text-zinc-200 font-light">{ticket.group}</span>
          </div>
          <div>
            <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider mb-0.5">Agent Assigned</span>
            <span className="text-zinc-200 font-light">{ticket.agent}</span>
          </div>
        </div>

        <div className="border-t border-white/5 pt-3.5 text-xs grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div className="md:col-span-3">
            <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider mb-0.5">Description</span>
            <p className="text-zinc-300 font-light leading-relaxed">
              {ticket.desc}
            </p>
          </div>
          <div className="md:col-span-1">
            <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-wider mb-0.5">Status</span>
            <div className="mt-1">
              <span className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider inline-flex items-center gap-1.5 ${statusBg}`}>
                <span className={`w-1 h-1 rounded-full ${statusDot}`} />
                {ticket.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const currentScript = getCurrentScript();

  return (
    <motion.div
      key="copilot"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[#141313] rounded-2xl border border-white/5 overflow-hidden flex flex-col"
    >
      {/* Top Bar Navigation */}
      <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-zinc-950/40">
        <div>
          <span className="text-blue-400 text-[10px] uppercase font-mono tracking-widest font-semibold bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/10">
            MODE 3: ACTIVE L0 CO-PILOT
          </span>
          <h2 className="text-2xl font-display font-semibold text-white mt-2.5">
            {mode3Tab === "l1_outbound" && "Active L0 Co-Pilot: L1 Outbound"}
            {mode3Tab === "l2_warm_transfer" && "Active L0 Co-Pilot: L2 Warm Transfer"}
            {mode3Tab === "three_strike" && "Active L0 Co-Pilot: 3-Strike Policy"}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {mode3Tab === "l1_outbound" && "AURA runs quietly in the background of a live call, tracking sentiment, surfacing resolution suggestions, and enforcing protocols."}
            {mode3Tab === "l2_warm_transfer" && "Experience a warm transfer handoff where AURA dynamically scans the L2 roster and assigns specialized mobile setup issues."}
            {mode3Tab === "three_strike" && "AURA automatically implements the organization's 3-strike protocol when a user is non-responsive, with weekend and OOO protection."}
          </p>
        </div>

        {/* Three Tabs Selector */}
        <div className="flex flex-wrap bg-zinc-900/80 p-1.5 rounded-xl border border-white/5 w-full md:w-auto gap-1">
          <button
            onClick={() => {
              setMode3Tab("l1_outbound");
              setMode3IsPlaying(false);
              setMode3StepIndex(0);
              setMode3Timer(0);
              setMode3Sentiment(50);
            }}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              mode3Tab === "l1_outbound"
                ? "bg-zinc-800 text-white border border-white/10 shadow-lg"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            L1 Outbound
          </button>
          <button
            onClick={() => {
              setMode3Tab("l2_warm_transfer");
              setMode3IsPlaying(false);
              setMode3StepIndex(0);
              setMode3Timer(0);
              setMode3Sentiment(50);
            }}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              mode3Tab === "l2_warm_transfer"
                ? "bg-zinc-800 text-white border border-white/10 shadow-lg"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            L2 Warm Transfer
          </button>
          <button
            onClick={() => {
              setMode3Tab("three_strike");
              setMode3IsPlaying(false);
              setMode3StepIndex(0);
              setMode3Timer(0);
              setMode3Sentiment(50);
            }}
            className={`flex-1 md:flex-initial px-3.5 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              mode3Tab === "three_strike"
                ? "bg-zinc-800 text-white border border-white/10 shadow-lg"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            3-Strike Policy
          </button>
        </div>
      </div>

      {/* Main Simulator Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 p-6 bg-zinc-950/10">
        
        {/* LEFT COLUMN: Voice Orb & Outbound Call Controller */}
        <div className="flex flex-col gap-6">
          <div className="bg-zinc-950/40 rounded-xl border border-white/5 p-6 flex flex-col items-center justify-between text-center relative overflow-hidden flex-1 min-h-[480px]">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            
            <div className="w-full flex flex-col items-center">
              <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
                AURA LIVE ORB
              </span>
              
              {/* Giant Liquid Voice Orb */}
              <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center bg-white/[0.01] rounded-full border border-white/5 shadow-inner mt-6">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <MicVisualizer
                    isListening={false}
                    isSpeaking={mode3IsPlaying && currentScript[mode3StepIndex]?.speaking}
                  />
                </div>
                
                {/* Microphone Overlay / Status Icon */}
                <div className={`relative z-10 w-11 h-11 rounded-full border flex items-center justify-center bg-zinc-950/90 backdrop-blur-md shadow-lg transition-all duration-500 ${
                  mode3IsPlaying
                    ? "border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.25)]"
                    : "border-white/10"
                }`}>
                  {mode3IsPlaying && currentScript[mode3StepIndex]?.speaking ? (
                    <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                  ) : (
                    <Mic className={`w-4 h-4 ${mode3IsPlaying ? "text-purple-400 animate-pulse" : "text-zinc-500"}`} />
                  )}
                </div>
              </div>
              
              {/* Call Timer Display */}
              <div className="mt-6 space-y-1">
                <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                  {mode3Tab === "three_strike" ? "ELAPSED TIMELINE" : mode3Tab === "l2_warm_transfer" ? "TRANSFER TIMELINE" : "CALL DURATION"}
                </p>
                <p className="text-3xl font-mono font-bold tracking-tight text-white">
                  {mode3Tab === "three_strike"
                    ? (mode3StepIndex === 0 && !mode3IsPlaying ? "Day 0" : `Day ${Math.min(mode3StepIndex, 9)}`)
                    : formatTimer(mode3Timer)}
                </p>
              </div>

              {/* Active Step Progress Badge */}
              <div className="mt-4 px-4 py-1.5 rounded-full bg-zinc-900/80 border border-white/5 inline-flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${mode3IsPlaying ? "bg-emerald-400 animate-ping" : "bg-zinc-600"}`} />
                <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-300">
                  {mode3StepIndex >= currentScript.length
                    ? (mode3Tab === "three_strike" ? "Policy Enforced & Closed" : "Call Completed")
                    : (mode3Tab === "three_strike" ? "3-Strike Policy Standby" : mode3Tab === "l2_warm_transfer" ? "L2 Warm Transfer Standby" : "Outbound Call Standby")}
                </span>
              </div>
            </div>

            {/* Control Actions Frame */}
            <div className="w-full pt-6 border-t border-white/5 flex flex-col gap-4 mt-6">
              
              {/* Initiate Call button or Play/Pause/Reset controls */}
              {mode3StepIndex === 0 && !mode3IsPlaying ? (
                <button
                  onClick={() => {
                    setMode3StepIndex(0);
                    setMode3Timer(0);
                    setMode3Sentiment(50);
                    setMode3IsPlaying(true);
                  }}
                  className="w-full py-3 px-4 rounded-lg font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/10 border-glow"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {mode3Tab === "three_strike" ? "Initiate 3-Strike Simulation" : mode3Tab === "l2_warm_transfer" ? "Initiate Warm Transfer" : "Initiate Outbound Call"}
                </button>
              ) : (
                <div className="flex justify-center items-center gap-3">
                  <button
                    onClick={() => {
                      if (mode3StepIndex >= currentScript.length) {
                        setMode3StepIndex(0);
                        setMode3Timer(0);
                        setMode3Sentiment(50);
                      }
                      setMode3IsPlaying(!mode3IsPlaying);
                    }}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      mode3IsPlaying
                        ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20"
                        : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/10 border-glow"
                    }`}
                  >
                    {mode3IsPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" /> {mode3Tab === "three_strike" ? "Pause Simulation" : mode3Tab === "l2_warm_transfer" ? "Pause Simulation" : "Pause Call"}
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />{" "}
                        {mode3StepIndex >= currentScript.length
                          ? (mode3Tab === "three_strike" ? "Restart" : mode3Tab === "l2_warm_transfer" ? "Restart" : "Restart Call")
                          : (mode3Tab === "three_strike" ? "Resume" : mode3Tab === "l2_warm_transfer" ? "Resume" : "Resume Call")}
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setMode3IsPlaying(false);
                      setMode3StepIndex(0);
                      setMode3Timer(0);
                      setMode3Sentiment(50);
                    }}
                    className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/5 rounded-lg transition-colors cursor-pointer"
                    title={mode3Tab === "three_strike" ? "Restart Simulation" : "Restart Call"}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Playback speed multiplier */}
              <div className="flex items-center justify-between px-1">
                <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase">SIMULATION SPEED</span>
                <div className="flex gap-1 bg-zinc-900 p-0.5 rounded-md border border-white/5">
                  {[1, 2, 5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setMode3Speed(speed)}
                      className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded transition-all cursor-pointer ${
                        mode3Speed === speed
                          ? "bg-blue-500 text-white"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Ticket details & Scrolling Feed */}
        <div className="flex flex-col gap-6 h-full justify-between flex-1">
          
          {/* Ticket Details Card (consistent with Mode 2 style) */}
          {renderTicketBrief()}

          {/* Chat/Feed panel */}
          <div className="bg-zinc-950/40 border border-white/5 rounded-xl flex flex-col h-[400px] overflow-hidden relative">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            
            {/* Live sentiment indicator near top of the chat feed */}
            {mode3Tab === "l1_outbound" && (
              <div className="bg-zinc-900/60 p-3.5 border-b border-white/5 sticky top-0 backdrop-blur-md z-10 flex flex-col gap-2 shadow-sm">
                <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-zinc-500">
                  <span>LIVE CALLER SENTIMENT</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      mode3Sentiment <= 30 ? "bg-emerald-400 animate-pulse" :
                      mode3Sentiment <= 65 ? "bg-amber-400 animate-pulse" :
                      "bg-red-500 animate-pulse"
                    }`} />
                    <span className={`font-bold uppercase tracking-wider ${
                      mode3Sentiment <= 30 ? "text-emerald-400" :
                      mode3Sentiment <= 65 ? "text-amber-400" :
                      "text-red-400"
                    }`}>
                      {mode3Sentiment <= 15 ? "Satisfied (15/100)" :
                       mode3Sentiment <= 30 ? "Relieved (30/100)" :
                       mode3Sentiment <= 50 ? "Neutral (50/100)" :
                       mode3Sentiment <= 65 ? "Mildly Frustrated (62/100)" :
                       mode3Sentiment <= 75 ? "Frustrated (75/100)" :
                       "Critically Frustrated (85/100)"}
                    </span>
                  </div>
                </div>
                {/* The sentiment gauge progress bar */}
                <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden relative border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      mode3Sentiment <= 30 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" :
                      mode3Sentiment <= 65 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)]" :
                      "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                    }`}
                    style={{ width: `${mode3Sentiment}%` }}
                  />
                </div>
              </div>
            )}

            {/* Main scrollable feed container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin flex flex-col bg-zinc-950/20">
              
              {/* Prior history logs (Backstory, styled as past entries, slightly muted) */}
              <div className="space-y-3.5 border-b border-white/5 pb-4">
                <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-mono tracking-widest uppercase">
                  <span>&bull;</span>
                  <span>
                    {mode3Tab === "three_strike" ? "Automated Strike Policy History Logs" : mode3Tab === "l2_warm_transfer" ? "L2 Escalate & Dispatch History Logs" : "Historical Backstory Log (Day 1)"}
                  </span>
                </div>
                
                {getCurrentHistory().map((entry, idx) => {
                  const statusColorMap = {
                    fail: "bg-red-500",
                    warning: "bg-amber-500",
                    info: "bg-blue-500",
                    success: "bg-emerald-500",
                  };
                  const sideColor = entry.statusBadge ? statusColorMap[entry.statusBadge.status] : "bg-zinc-600";

                  const badgeClassMap = {
                    fail: "bg-red-500/10 text-red-400 border-red-500/20",
                    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                  };

                  return (
                    <div
                      key={`past-${idx}`}
                      className="p-4 bg-zinc-900/60 border border-white/5 rounded-xl hover:bg-zinc-900/80 hover:border-white/10 transition-all duration-200 flex flex-col gap-2.5 relative overflow-hidden group shadow-sm shadow-black/20 text-left"
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${sideColor}`} />
                      
                      {/* Header row */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-mono tracking-wider font-semibold text-zinc-300 uppercase">
                            {entry.category}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-500 font-light">
                            {entry.timestamp}
                          </span>
                        </div>

                        {entry.statusBadge && (
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider border ${badgeClassMap[entry.statusBadge.status]}`}>
                            {entry.statusBadge.text}
                          </span>
                        )}
                      </div>

                      {/* Backstory text */}
                      <p className="text-xs text-zinc-300 leading-relaxed font-light">
                        {entry.text}
                      </p>

                      {/* Custom Steps Display */}
                      {entry.steps && entry.steps.length > 0 && (
                        <div className="mt-1 bg-zinc-950/40 rounded-lg p-3 border border-white/5 space-y-2">
                          <span className="text-[8.5px] font-mono text-zinc-500 tracking-wider uppercase block font-semibold">
                            Execution Checklist & Step Status:
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                            {entry.steps.map((step, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-2 text-[11px] font-sans">
                                {step.completed ? (
                                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mt-0.5">
                                    <Check className="w-2.5 h-2.5" />
                                  </span>
                                ) : (
                                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mt-0.5">
                                    <X className="w-2.5 h-2.5" />
                                  </span>
                                )}
                                <span className={`leading-snug text-left ${step.completed ? "text-emerald-400/90 font-medium" : "text-red-400/80 font-normal"}`}>
                                  {step.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Meta chips display */}
                      {entry.meta && entry.meta.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-0.5">
                          {entry.meta.map((m, mIdx) => (
                            <div
                              key={mIdx}
                              className="px-2 py-0.5 rounded bg-zinc-950/60 border border-white/5 text-[9px] font-mono text-zinc-400 flex items-center gap-1.5"
                            >
                              <span className="text-zinc-600 uppercase font-bold">{m.label}:</span>
                              <span className="text-zinc-300">{m.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Live Call Steps */}
              {mode3StepIndex > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[9px] text-blue-400 font-mono tracking-widest uppercase mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                    <span>
                      {mode3Tab === "three_strike" ? "Automated Outreach Timeline Logs" : "Live Call Simulation Feed"}
                    </span>
                  </div>

                  {currentScript.slice(0, mode3StepIndex).map((step, idx) => {
                    if (step.type === "system") {
                      switch (step.subType) {
                        case "voice_verification":
                          return (
                            <div
                              key={`live-${idx}`}
                              className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/30 shadow-lg shadow-emerald-950/10 flex flex-col gap-2.5 animate-fade-in my-3 text-left"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <Fingerprint className="w-3.5 h-3.5 animate-pulse" />
                                  </div>
                                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                                    User Identity System
                                  </span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest animate-pulse">
                                  {step.badge?.text || "PASSED"}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-300 leading-relaxed font-light">
                                {step.text}
                              </p>
                            </div>
                          );

                        case "sentiment_alert":
                          return (
                            <div
                              key={`live-${idx}`}
                              className="p-3.5 rounded-xl bg-amber-950/10 border border-amber-500/10 shadow-sm flex items-start gap-3 animate-fade-in my-3 text-left"
                            >
                              <div className="w-5 h-5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mt-0.5">
                                <Activity className="w-3 h-3 animate-pulse" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-400 block">
                                  AURA SENTIMENT MONITORING
                                </span>
                                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                                  {step.text}
                                </p>
                              </div>
                            </div>
                          );

                        case "alert":
                          return (
                            <div
                              key={`live-${idx}`}
                              className="p-4 rounded-xl bg-blue-950/10 border border-blue-500/15 shadow-sm flex flex-col gap-2.5 animate-fade-in my-3 text-left"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Info className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">
                                    {step.heading || "AURA DIAGNOSTIC TRIGGER"}
                                  </span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                                  TICKET OVERVIEW
                                </span>
                              </div>
                              <p className="text-xs text-zinc-300 leading-relaxed font-light">
                                {step.text}
                              </p>
                              {step.bullets && (
                                <div className="space-y-1.5 pl-1.5 mt-1 border-l border-blue-500/20 text-left">
                                  {step.bullets.map((b, bIdx) => (
                                    <div key={bIdx} className="flex items-center gap-2 text-[11px] text-zinc-400">
                                      <span className="w-1 h-1 rounded-full bg-blue-400" />
                                      <span>{b}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );

                        case "thinking_gemini":
                          return (
                            <div
                              key={`live-${idx}`}
                              className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/25 shadow-md flex items-start gap-3.5 animate-fade-in my-3 relative overflow-hidden text-left"
                            >
                              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                              <div className="w-6 h-6 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mt-0.5 animate-spin duration-3000">
                                <Sparkles className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                                    {step.heading || "GEMINI CO-PILOT AGENT"}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                                    <span className="text-[8.5px] font-mono text-indigo-400/80 uppercase font-semibold">REASONING...</span>
                                  </div>
                                </div>
                                <p className="text-xs text-zinc-300 leading-relaxed font-light">
                                  {step.text}
                                </p>
                              </div>
                            </div>
                          );

                        case "thinking_claude":
                          return (
                            <div
                              key={`live-${idx}`}
                              className="p-4 rounded-xl bg-orange-950/10 border border-orange-500/25 shadow-md flex items-start gap-3.5 animate-fade-in my-3 relative overflow-hidden text-left"
                            >
                              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl pointer-events-none" />
                              <div className="w-6 h-6 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 mt-0.5">
                                <BrainCircuit className="w-3.5 h-3.5 animate-pulse" />
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400">
                                    {step.heading || "CLAUDE REASONING CORE"}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />
                                    <span className="text-[8.5px] font-mono text-orange-400/80 uppercase font-semibold">SYNTHESIZING...</span>
                                  </div>
                                </div>
                                <p className="text-xs text-zinc-300 leading-relaxed font-light">
                                  {step.text}
                                </p>
                              </div>
                            </div>
                          );

                        case "recommendation":
                          return (
                            <div
                              key={`live-${idx}`}
                              className="p-4.5 rounded-xl bg-gradient-to-r from-violet-950/25 to-indigo-950/15 border border-violet-500/30 shadow-xl shadow-violet-950/10 flex flex-col gap-3 animate-fade-in my-4 relative overflow-hidden border-glow animate-pulse text-left"
                            >
                              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
                              
                              {/* Header tag */}
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-5.5 h-5.5 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
                                    <Globe className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="text-[10.5px] font-mono font-extrabold uppercase tracking-widest text-violet-300">
                                    {step.heading || "EXTERNAL RECOMMENDATION"}
                                  </span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[8.5px] font-mono font-bold bg-violet-500/25 text-violet-200 border border-violet-500/40 uppercase tracking-widest animate-pulse">
                                  HIGH MATCH
                                </span>
                              </div>

                              {/* Main Body */}
                              <p className="text-xs text-zinc-100 leading-relaxed font-medium bg-zinc-950/40 p-3 rounded-lg border border-white/5">
                                {step.text}
                              </p>

                              {/* Bullets */}
                              {step.bullets && (
                                <div className="space-y-1.5 pl-1.5 border-l-2 border-violet-500/30 text-left">
                                  {step.bullets.map((b, bIdx) => (
                                    <div key={bIdx} className="flex items-start gap-2 text-[11px] text-zinc-300">
                                      <span className="flex-shrink-0 w-3.5 h-3.5 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mt-0.5">
                                        <Check className="w-2 h-2" />
                                      </span>
                                      <span className="leading-tight">{b}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );

                        case "success":
                          return (
                            <div
                              key={`live-${idx}`}
                              className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/30 shadow-lg shadow-emerald-950/10 flex flex-col gap-2.5 animate-fade-in my-3 text-left"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                                    {step.heading || "CO-PILOT PROTOCOL RESOLVED"}
                                  </span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/35 uppercase tracking-widest">
                                  INCIDENT CLEAR
                                </span>
                              </div>
                              <p className="text-xs text-zinc-200 leading-relaxed font-light">
                                {step.text}
                              </p>
                              {step.bullets && (
                                <div className="space-y-1.5 pl-1.5 mt-1 border-l border-emerald-500/20 text-left">
                                  {step.bullets.map((b, bIdx) => (
                                    <div key={bIdx} className="flex items-center gap-2 text-[11px] text-zinc-300">
                                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                                      <span>{b}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );

                        case "guidance":
                          return (
                            <div
                              key={`live-${idx}`}
                              className="p-4 rounded-xl bg-zinc-900/80 border border-white/5 shadow-md flex flex-col gap-2.5 animate-fade-in my-3 text-left"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
                                    <HelpCircle className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-300">
                                    {step.heading || "AURA GUIDANCE PROTOCOL"}
                                  </span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-white/5 text-zinc-400 border border-white/10 uppercase tracking-widest">
                                  QA AUDIT
                                </span>
                              </div>
                              <p className="text-xs text-zinc-300 leading-relaxed font-light">
                                {step.text}
                              </p>
                              {step.bullets && (
                                <div className="space-y-1.5 pl-1.5 mt-1 border-l border-white/10 text-left">
                                  {step.bullets.map((b, bIdx) => (
                                    <div key={bIdx} className="flex items-center gap-2 text-[11px] text-zinc-400">
                                      <span className="w-1 h-1 rounded-full bg-zinc-500" />
                                      <span>{b}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );

                        case "watchdog":
                          return (
                            <div
                              key={`live-${idx}`}
                              className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/25 shadow-lg shadow-rose-950/5 flex flex-col gap-2.5 animate-fade-in my-3 text-left"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                                    <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                                  </div>
                                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
                                    {step.heading || "AURA PROTOCOL WATCHDOG"}
                                  </span>
                                </div>
                                <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-widest animate-pulse">
                                  COMPLIANCE RISK
                                </span>
                              </div>
                              <p className="text-xs text-rose-300/90 leading-relaxed font-light">
                                {step.text}
                              </p>
                              {step.bullets && (
                                <div className="space-y-1.5 pl-1.5 mt-1 border-l border-rose-500/20 text-left">
                                  {step.bullets.map((b, bIdx) => (
                                    <div key={bIdx} className="flex items-center gap-2 text-[11px] text-rose-300/80">
                                      <span className="w-1 h-1 rounded-full bg-rose-400" />
                                      <span>{b}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );

                        default:
                          return (
                            <div
                              key={`live-${idx}`}
                              className={`flex flex-col items-center text-center my-3 animate-fade-in ${
                                step.isResolved ? "border-y border-emerald-500/10 py-3 bg-emerald-950/5 rounded-lg" : ""
                              }`}
                            >
                              <span className={`text-[10px] font-mono leading-relaxed px-4 ${
                                step.isResolved ? "text-emerald-400 font-bold" : "text-zinc-500 italic"
                              }`}>
                                // {step.text}
                              </span>
                              {step.isResolved && (
                                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)] uppercase">
                                  <CheckCircle className="w-3.5 h-3.5" /> Resolution Confirmed
                                </div>
                              )}
                            </div>
                          );
                      }
                    } else {
                      const isAgent = step.sender === "agent";
                      return (
                        <div
                          key={`live-${idx}`}
                          className={`flex w-full animate-fade-in ${isAgent ? "justify-start" : "justify-end"}`}
                        >
                          <div className={`max-w-[85%] rounded-2xl p-4 relative shadow-md text-left ${
                            isAgent
                              ? "bg-gradient-to-tr from-blue-950/35 to-zinc-900/65 border border-blue-500/15 text-zinc-100 rounded-tl-none shadow-blue-950/5"
                              : "bg-zinc-900/90 border border-white/5 text-zinc-200 rounded-tr-none ml-auto shadow-black/10"
                          }`}>
                            <span className={`block text-[8.5px] font-mono tracking-widest uppercase font-semibold mb-1.5 ${
                              isAgent ? "text-blue-400" : "text-zinc-500"
                            }`}>
                              {isAgent ? `${step.senderName} (Agent)` : `${step.senderName} (Caller)`}
                            </span>
                            <p className="text-xs leading-relaxed font-light">{step.text}</p>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3 my-auto select-none">
                  <div className="w-10 h-10 rounded-full bg-blue-500/5 flex items-center justify-center border border-blue-500/10 animate-pulse">
                    {mode3Tab === "three_strike" ? (
                      <Shield className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Mic className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">
                      {mode3Tab === "three_strike" ? "3-Strike Policy Standby" : mode3Tab === "l2_warm_transfer" ? "Warm Transfer Standby" : "Outbound Channel Standby"}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-1.5 max-w-[280px] leading-relaxed">
                      {mode3Tab === "three_strike" ? (
                        <>Click <strong className="text-blue-400 font-medium">Initiate 3-Strike Simulation</strong> to trigger AURA's automated user outreach protocol.</>
                      ) : mode3Tab === "l2_warm_transfer" ? (
                        <>Click <strong className="text-blue-400 font-medium">Initiate Warm Transfer</strong> to begin live co-pilot oversight for warm escalation handoffs.</>
                      ) : (
                        <>Click <strong className="text-blue-400 font-medium">Initiate Outbound Call</strong> to connect the agent and start AURA's live co-pilot oversight.</>
                      )}
                    </p>
                  </div>
                </div>
              )}

              <div ref={copilotFeedEndRef} />
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
