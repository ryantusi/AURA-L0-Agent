import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  ShieldCheck,
  Check,
  X,
  Loader2,
  Layers,
  BookOpen
} from "lucide-react";
import { L1_AGENTS_ROSTER } from "../data";

interface EscalationModeProps {
  mode2Status: "idle" | "scanning" | "matched" | "briefing";
  mode2ScanIndex: number;
  mode2AssignedAgent: string;
  mode2TicketStatus: "New" | "Assigned";
  mode2ShowQuote: boolean;
  handleStartEscalation: () => void;
}

export default function EscalationMode({
  mode2Status,
  mode2ScanIndex,
  mode2AssignedAgent,
  mode2TicketStatus,
  mode2ShowQuote,
  handleStartEscalation
}: EscalationModeProps) {
  return (
    <motion.div
      key="escalation"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[#141313] rounded-2xl border border-white/5 overflow-hidden p-6 space-y-6"
    >
      <div>
        <span className="text-blue-400 text-[10px] uppercase font-mono tracking-widest">
          DOSSIER HANDOFF
        </span>
        <h2 className="text-2xl font-display font-semibold text-white mt-1">
          Intelligent Escalation Compiler
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          When AURA decides a call is too complex or sensitive to resolve autonomously, it compiles a complete briefing package and matches it live to the best-available human specialist.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT PANE - ESCALATION TICKET */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 font-display">
            Escalation Ticket Card
          </h3>

          <div className="bg-zinc-950/40 rounded-xl border border-white/5 p-5 space-y-5">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-500/10 rounded border border-blue-500/20">
                  <FileText className="w-4 h-4 text-blue-400" />
                </span>
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono block uppercase tracking-widest font-semibold">TICKET ID</span>
                  <span className="text-sm font-mono font-bold text-white">INC2222222</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-500 font-mono block uppercase tracking-widest font-semibold">STATUS</span>
                <span className={`text-[9px] px-2.5 py-0.5 font-mono font-bold rounded border ${
                  mode2TicketStatus === "Assigned"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.05)]"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                }`}>
                  {mode2TicketStatus === "New" ? "NEW" : "ASSIGNED"}
                </span>
              </div>
            </div>

            {/* Metadata Fields */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-widest font-semibold">CALLER</span>
                <span className="text-white font-medium">Kamrudeen K</span>
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-widest font-semibold">CONFIGURATION ITEM</span>
                <span className="text-zinc-300 font-mono">Veeva CRM</span>
              </div>
              <div className="col-span-2">
                <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-widest font-semibold">ISSUE TITLE</span>
                <span className="text-white font-semibold">Can't access Veeva CRM</span>
              </div>
              <div className="col-span-2">
                <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-widest font-semibold">ISSUE DESCRIPTION</span>
                <span className="text-zinc-400 font-light leading-relaxed">Unable to login to Veeva CRM. Access Denied.</span>
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-widest font-semibold">ASSIGNMENT GROUP</span>
                <span className="text-zinc-300 font-mono">Contact Center</span>
              </div>
              <div>
                <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-widest font-semibold">ASSIGNED AGENT</span>
                <span className={`font-semibold font-mono transition-all duration-300 ${mode2AssignedAgent === "Unassigned" ? "text-amber-400/80" : "text-emerald-400"}`}>
                  {mode2AssignedAgent}
                </span>
              </div>
            </div>

            {/* Genesys Call Validation Notes */}
            <div className="p-4 rounded-lg bg-zinc-950/60 border border-white/5 space-y-2">
              <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-widest font-semibold">GENESYS CALL VALIDATION TRACE</span>
              <div className="space-y-1.5 font-mono text-[10px] text-zinc-400">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>TruU Pass</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Mandatory Questions: Full Name & Manager Name — YES</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Voice Recognition: Confirmed [94% Confidence] — 2/5 questions to pass</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Security Questions Passed: Two Direct Reports, Hire Date</span>
                </div>
                <div className="flex items-center gap-1.5 text-red-400/80">
                  <X className="w-3 h-3 text-red-400" />
                  <span>Security Questions Failed: Two Direct Reports to Manager</span>
                </div>
                <div className="border-t border-white/5 pt-1.5 mt-1.5 text-center text-emerald-400 font-bold text-[9px] tracking-widest uppercase">
                  -- USER VERIFIED SUCCESSFULLY --
                </div>
              </div>
            </div>

            {/* Work Notes */}
            <div className="space-y-1.5">
              <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-widest font-semibold">AURA AUTOMATED WORK NOTES</span>
              <p className="bg-black/40 p-3 rounded-lg text-[10.5px] text-zinc-400 font-sans leading-relaxed border border-white/5 font-light italic">
                "AURA automatically initiated a cloud-profile trace for Veeva CRM authentication logs. Found persistent 'Access Denied' flag under OAuth token S-119283. Internal directory lock-out detected. Veeva is a validated GxP system, autonomous action is intentionally withheld. Manual remediation required; escalating to Contact Center agent with high-context briefing dossier."
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleStartEscalation}
            disabled={mode2Status === "scanning" || mode2Status === "matched"}
            className={`w-full py-3.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              mode2Status === "scanning" || mode2Status === "matched"
                ? "bg-zinc-800 text-zinc-500 border border-white/5 cursor-not-allowed"
                : mode2Status === "briefing"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                : "bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white"
            }`}
          >
            {mode2Status === "scanning" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Scanning Roster Database...
              </>
            ) : mode2Status === "matched" ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 animate-pulse" /> Agent Lock Confirmed!
              </>
            ) : mode2Status === "briefing" ? (
              "Re-run Intelligent Escalation"
            ) : (
              "Initiate Intelligent Escalation"
            )}
          </button>
        </div>

        {/* RIGHT PANE - ESCALATION SEQUENCE & BRIEFING */}
        <div className="bg-zinc-950 p-5 sm:p-6 rounded-xl border border-white/5 flex flex-col justify-between h-full min-h-[580px]">
          <AnimatePresence mode="wait">
            {/* IDLE STANDBY */}
            {mode2Status === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full text-center py-20 space-y-4 my-auto"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/5 flex items-center justify-center border border-blue-500/10 animate-pulse">
                  <Layers className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-300 uppercase font-mono tracking-widest">
                    Routing & Briefing Standby
                  </h4>
                  <p className="text-xs text-zinc-500 max-w-xs font-light mt-1.5 leading-relaxed">
                    AURA's Intelligent Routing Engine is ready. Click <strong className="text-blue-400 font-medium">Initiate Intelligent Escalation</strong> on the left to scan available human specialists and compile their live briefing dossier.
                  </p>
                </div>
              </motion.div>
            )}

            {/* SCANNING & MATCHED */}
            {(mode2Status === "scanning" || mode2Status === "matched") && (
              <motion.div
                key="roster"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-5 flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${mode2Status === "scanning" ? "bg-blue-400 animate-ping" : "bg-emerald-400 animate-pulse"}`} />
                      <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest font-semibold">
                        {mode2Status === "scanning" ? "ENGAGING AURA MATCHER ENGINE..." : "RECOMMENDED AGENT DETECTED"}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">
                      7 PEER AGENTS ONLINE
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {L1_AGENTS_ROSTER.map((agent, idx) => {
                      const isCurrentScanned = idx === mode2ScanIndex && mode2Status === "scanning";
                      const isMatch = idx === 3 && mode2Status === "matched";
                      const isOthersDimmed = mode2Status === "matched" && idx !== 3;

                      return (
                        <div
                          key={`agent-roster-${agent.id}`}
                          className={`p-4 rounded-xl border transition-all duration-300 flex justify-between items-center relative overflow-hidden ${
                            isCurrentScanned
                              ? "bg-blue-500/10 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)] scale-[1.01]"
                              : isMatch
                              ? "bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] scale-[1.02]"
                              : isOthersDimmed
                              ? "bg-zinc-950/20 border-white/5 opacity-40 scale-[0.98]"
                              : "bg-zinc-950/40 border-white/5 opacity-80"
                          }`}
                        >
                          {/* Visual scan highlight overlay */}
                          {isCurrentScanned && (
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 animate-pulse" />
                          )}

                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold font-mono border ${
                              isMatch
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20"
                                : isCurrentScanned
                                ? "bg-blue-500/20 text-blue-400 border-blue-500/20"
                                : "bg-zinc-900 text-zinc-400 border-white/5"
                            }`}>
                              {agent.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <h5 className={`text-xs font-semibold ${isMatch ? "text-emerald-400" : "text-white"}`}>{agent.name}</h5>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "Available" ? "bg-emerald-400" : agent.status === "On Call" ? "bg-amber-400" : "bg-blue-400"}`} />
                                <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-wider">{agent.status}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            {/* Resolution stat with scanning visual */}
                            {idx <= mode2ScanIndex || mode2Status === "matched" ? (
                              <div className="flex flex-col items-end gap-0.5">
                                <span className="text-[10px] font-semibold text-zinc-300 font-mono">
                                  Veeva CRM resolutions: {agent.resolutions}
                                </span>
                                {isMatch && (
                                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 font-mono font-bold tracking-widest uppercase">
                                    MATCH 98%
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-[10px] text-zinc-600 font-mono animate-pulse">
                                Querying data...
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-center pt-2">
                    <span className="text-[10px] text-zinc-600 font-mono italic">
                      {mode2Status === "scanning" ? "// Telemetry database lock query in progress" : "// Optimal agent locked. Compiling briefing package..."}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* BRIEFING SCREEN */}
            {mode2Status === "briefing" && (
              <motion.div
                key="briefing"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5 flex flex-col justify-between h-full"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-center pb-2 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" />
                      <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest font-bold">
                        DOSSIER RECIPIENT COMPILER: ACTIVE
                      </span>
                    </div>
                    <span className="text-[9px] text-zinc-500 font-mono uppercase">
                      AGENTS DESK: BINDING TO INC2222222
                    </span>
                  </div>

                  {/* Briefing Dossier Card */}
                  <div className="bg-zinc-950/60 p-5 rounded-xl border border-white/10 relative overflow-hidden space-y-4 shadow-2xl">
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-500/30 via-teal-500/45 to-emerald-500/30" />

                    {/* Sentiment Indicator Row */}
                    <div className="flex justify-between items-center bg-zinc-900/40 p-3 rounded-lg border border-white/5">
                      <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider font-semibold">CALLER SENTIMENT</span>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                        <span className="text-[10px] text-amber-400 font-bold font-mono tracking-wider uppercase">Mildly Frustrated</span>
                      </div>
                    </div>

                    {/* Issue Summary */}
                    <div className="space-y-2">
                      <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-widest font-semibold">ISSUE ANALYSIS SUMMARY</span>
                      <ul className="space-y-1.5 text-xs text-zinc-300 font-sans list-none font-light leading-relaxed pl-1">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                          <span>Enterprise identity token validation rejected by Veeva API gateway.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                          <span>Persistent lock-out triggered on authentication endpoint due to expired cached ticket.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                          <span>Active Directory profile is in active, unrestricted status.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                          <span>Veeva is a validated GxP system, autonomous action is intentionally withheld.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Diagnostic Steps Run */}
                    <div className="space-y-2 border-t border-white/5 pt-3">
                      <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-widest font-semibold">COMPLETED DIAGNOSTIC CYCLES</span>
                      <ul className="space-y-1.5 text-xs text-zinc-400 font-sans list-none font-light leading-relaxed pl-1">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                          <span>TruU multi-factor credential check: <strong className="text-emerald-400 font-medium">PASS</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                          <span>Active biometric voiceprint signature verified: <strong className="text-emerald-400 font-medium">94% confidence match</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                          <span>Veeva CRM authentication log fetch: <strong className="text-red-400/80 font-medium">Access Denied (Token Conflict)</strong></span>
                        </li>
                      </ul>
                    </div>

                    {/* Recommended Resolution Steps */}
                    <div className="space-y-2 border-t border-white/5 pt-3">
                      <span className="text-[9px] text-zinc-500 font-mono block uppercase tracking-widest font-semibold">RECOMMENDED RESOLUTION ROUTINE</span>
                      <div className="space-y-1.5 text-xs text-zinc-300 font-sans leading-normal font-light">
                        <div className="flex items-start gap-2">
                          <span className="text-blue-400 font-mono text-[10px] font-bold">01</span>
                          <span>Access Veeva Administration dashboard console.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-400 font-mono text-[10px] font-bold">02</span>
                          <span>Terminate the stale active session lock-out for user <strong className="text-white font-medium">Kamrudeen K</strong>.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-400 font-mono text-[10px] font-bold">03</span>
                          <span>Force identity cache database re-sync.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-400 font-mono text-[10px] font-bold">04</span>
                          <span>Advise user to relaunch browser in incognito mode and retry.</span>
                        </div>
                      </div>
                    </div>

                    {/* Knowledge Base */}
                    <div className="border-t border-white/5 pt-3 flex items-center justify-between text-xs font-mono">
                      <span className="text-[9px] text-zinc-500 uppercase tracking-widest">REFERENCED KNOWLEDGE BASE</span>
                      <div className="flex items-center gap-1.5 text-blue-400 font-medium hover:underline cursor-pointer">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>KB0041882 — Veeva Access conflicts</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Closing Beat: Matched agent's opening line */}
                <AnimatePresence>
                  {mode2ShowQuote && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-left"
                    >
                      <div className="bg-gradient-to-tr from-blue-950/20 to-zinc-900 border border-blue-500/20 rounded-xl p-4 shadow-lg flex items-start gap-3.5 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-[3px] h-full bg-blue-500" />
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold font-mono text-xs flex-shrink-0">
                          MF
                        </div>
                        <div>
                          <span className="text-[9px] text-blue-400 font-mono block uppercase tracking-widest font-semibold mb-0.5">Mohammed Fawaz (Agent Specialist) - Veeva CRM</span>
                          <p className="text-xs text-white leading-relaxed font-light italic">
                            "I can see the access conflict on your Veeva account — let's fix that now."
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
