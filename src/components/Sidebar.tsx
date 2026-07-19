import React from "react";
import {
  Cpu,
  Layers,
  Terminal,
  Activity,
  ChevronRight
} from "lucide-react";
import AuraLogo from "./AuraLogo";
import { AuraMode } from "../types";

// @ts-ignore
import gileadLogo from "@/assets/gilead.svg";

interface SidebarProps {
  inWorkspace: boolean;
  setInWorkspace: (val: boolean) => void;
  activeMode: AuraMode;
  setActiveMode: (mode: AuraMode) => void;
  tutorialStep: string | null;
}

export default function Sidebar({
  inWorkspace,
  setInWorkspace,
  activeMode,
  setActiveMode,
  tutorialStep
}: SidebarProps) {
  return (
    <aside className="border-b md:border-b-0 md:border-r border-[#e2e2e4]/10 p-6 md:p-8 flex flex-col justify-between bg-gradient-to-b from-white/[0.02] to-transparent h-auto md:h-full overflow-y-auto">
      <div className="top-nav flex flex-col gap-8">
        <div 
          className="brand flex items-center gap-3 cursor-pointer" 
          onClick={() => setInWorkspace(false)}
        >
          <AuraLogo className="w-8 h-8" />
          <h1 className="font-display font-extrabold text-2xl tracking-normal text-white">AURA</h1>
        </div>
        
        {!inWorkspace ? (
          <div className="space-y-4">
            <div className="label-mono">[ THE L0 AGENT ]</div>
            <div className="text-[11px] text-zinc-500 font-mono mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              System ready
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="label-mono">[ CONTROL PANEL ]</div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              AURA L0 LIVE
            </div>

            {/* Workspace mode selectors nested inside sidebar */}
            <div className="flex flex-col gap-1 mt-4">
              {[
                { id: "autonomous", name: "Autonomous Resolution", icon: Cpu, label: "Mode 01" },
                { id: "escalation", name: "Intelligent Escalation", icon: Layers, label: "Mode 02" },
                { id: "copilot", name: "Active L0 Co-Pilot", icon: Terminal, label: "Mode 03" },
                { id: "predictive", name: "Predictive Operations", icon: Activity, label: "Mode 04" }
              ].map((mode) => {
                const Icon = mode.icon;
                const isActive = activeMode === mode.id;
                return (
                   <button
                    key={`sidebar-mode-${mode.id}`}
                    id={`tutorial-mode-${mode.id}`}
                    onClick={() => setActiveMode(mode.id as AuraMode)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between transition-all group border ${
                      isActive
                        ? "bg-blue-600/10 border-blue-500/30 text-white shadow-inner"
                        : "border-transparent text-zinc-400 hover:text-white hover:bg-white/5"
                    } ${
                      (tutorialStep === "step_mode_1" && mode.id === "autonomous") ||
                      (tutorialStep === "step_mode_2" && mode.id === "escalation") ||
                      (tutorialStep === "step_mode_3" && mode.id === "copilot") ||
                      (tutorialStep === "step_mode_4" && mode.id === "predictive")
                        ? "ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] scale-102 z-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-blue-400"}`} />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold font-display">{mode.name}</span>
                        <span className="text-[9px] text-zinc-500 font-mono mt-0.5">{mode.label}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-3 h-3 opacity-50 ${isActive ? "translate-x-0.5" : "group-hover:translate-x-1"}`} />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* AI Powered By Section */}
      <div className="space-y-2 mt-8 md:mt-0">
        <p className="label-mono">AI Powered By</p>
        <div className="flex items-center gap-3">
          {/* Anthropic Tooltip and Icon */}
          <div className="group relative">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-white/[0.02] border border-white/5 text-zinc-500 hover:text-[#E05D3F] hover:bg-[#E05D3F]/5 hover:border-[#E05D3F]/20 transition-all duration-300 cursor-pointer">
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-none" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="m13.788825 3.932 6.43325 16.136075h3.5279L17.316725 3.932H13.788825Z" strokeWidth="0.25" />
                <path fill="currentColor" d="m6.325375 13.682775 2.20125 -5.67065 2.201275 5.67065H6.325375ZM6.68225 3.932 0.25 20.068075h3.596525l1.3155 -3.3886h6.729425l1.315275 3.3886h3.59655L10.371 3.932H6.68225Z" strokeWidth="0.25" />
              </svg>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider text-white bg-zinc-900 border border-white/10 rounded shadow-xl opacity-0 scale-90 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-50 whitespace-nowrap">
              Anthropic
            </div>
          </div>

          {/* OpenAI Tooltip and Icon */}
          <div className="group relative">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-white/[0.02] border border-white/5 text-zinc-500 hover:text-[#10A37F] hover:bg-[#10A37F]/5 hover:border-[#10A37F]/20 transition-all duration-300 cursor-pointer">
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
              </svg>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider text-white bg-zinc-900 border border-white/10 rounded shadow-xl opacity-0 scale-90 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-50 whitespace-nowrap">
              OpenAI
            </div>
          </div>

          {/* Gemini Tooltip and Icon */}
          <div className="group relative">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-white/[0.02] border border-white/5 text-zinc-500 hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all duration-300 cursor-pointer">
              <div className="w-4.5 h-4.5 filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="#3186FF" />
                  <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#lobe-icons-gemini-fill-0-sidebar)" />
                  <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#lobe-icons-gemini-fill-1-sidebar)" />
                  <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" fill="url(#lobe-icons-gemini-fill-2-sidebar)" />
                  <defs>
                    <linearGradient gradientUnits="userSpaceOnUse" id="lobe-icons-gemini-fill-0-sidebar" x1="7" x2="11" y1="15.5" y2="12">
                      <stop stopColor="#08B962" />
                      <stop offset="1" stopColor="#08B962" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient gradientUnits="userSpaceOnUse" id="lobe-icons-gemini-fill-1-sidebar" x1="8" x2="11.5" y1="5.5" y2="11">
                      <stop stopColor="#F94543" />
                      <stop offset="1" stopColor="#F94543" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient gradientUnits="userSpaceOnUse" id="lobe-icons-gemini-fill-2-sidebar" x1="3.5" x2="17.5" y1="13.5" y2="12">
                      <stop stopColor="#FABC12" />
                      <stop offset=".46" stopColor="#FABC12" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider text-white bg-zinc-900 border border-white/10 rounded shadow-xl opacity-0 scale-90 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-50 whitespace-nowrap">
              Gemini
            </div>
          </div>

          {/* ElevenLabs Tooltip and Icon */}
          <div className="group relative">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-white/[0.02] border border-white/5 text-zinc-500 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all duration-300 cursor-pointer">
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-none" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="3.5" width="4.5" height="17" rx="1.5" fill="currentColor" />
                <rect x="13.5" y="3.5" width="4.5" height="17" rx="1.5" fill="currentColor" />
              </svg>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider text-white bg-zinc-900 border border-white/10 rounded shadow-xl opacity-0 scale-90 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-50 whitespace-nowrap">
              ElevenLabs
            </div>
          </div>
        </div>
      </div>

      <div className="nav-meta mt-6 pt-6 border-t border-[#e2e2e4]/10 space-y-4">
        <div className="space-y-1">
          <p className="label-mono">Engineered By</p>
          <p className="text-xs font-semibold text-white">Ryan Ahmed Tusi - 2485906</p>
        </div>

        {!inWorkspace ? (
          <button
            id="tutorial-launch-cc-btn"
            onClick={() => {
              setInWorkspace(true);
              setActiveMode("autonomous");
            }}
            className={`w-full text-center py-2.5 px-4 bg-[#e2e2e4] hover:bg-white text-[#0b0b0c] font-bold text-[10px] uppercase tracking-wider transition-colors inline-block cursor-pointer ${
              tutorialStep === "step_launch_cc" ? "ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] scale-105 z-50" : ""
            }`}
          >
            Launch Command Center
          </button>
        ) : (
          <button
            id="tutorial-back-to-landing-btn"
            onClick={() => setInWorkspace(false)}
            className={`w-full text-center py-2.5 px-4 bg-transparent hover:bg-white/5 text-[#e2e2e4] border border-[#e2e2e4]/20 font-bold text-[10px] uppercase tracking-wider transition-colors inline-block cursor-pointer ${
              tutorialStep === "step_back_to_landing" ? "ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] scale-105 z-50" : ""
            }`}
          >
            Back to Landing
          </button>
        )}
      </div>
    </aside>
  );
}
