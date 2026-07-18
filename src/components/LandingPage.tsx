import React from "react";
import {
  RotateCcw,
  Volume2,
  Mic,
  Loader2
} from "lucide-react";
import { motion } from "motion/react";
import MicVisualizer from "./MicVisualizer";
import { AuraMode } from "../types";

// @ts-ignore
import gileadLogo from "@/assets/gilead.svg";

interface LandingPageProps {
  voiceEnrolled: boolean;
  voiceStage: string;
  voiceProgress: number;
  isAuraSpeaking: boolean;
  handleVoiceReset: () => void;
  handleMicClick: () => void;
  setInWorkspace: (val: boolean) => void;
  setActiveMode: (mode: AuraMode) => void;
  setShowModal: (val: boolean) => void;
  setShowLearnMoreModal: (val: boolean) => void;
  tutorialStep: string | null;
}

const IMAGES = {
  logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdOmrrhiaNcjHVftxLc0TBPdcmm5pjOQmwsKovSk6asQpcqCqRLRjwa-3Gndnv4UzO8mgrKtEjyMnJfk9ODpq-ElXOfH1kUxRKkndwmgLM59ScZ01A4U2WAUcQLn5-CNjflbs6jxLJlnLi0034OfMVngELzXCUV-nsqrT21UJMfbG13n1TP2LR0_HFcgY9oalYRgsbm2_CJBAeyeKZk302nDiM857Waha_-GrmMN_KMYJv09ThAsQNzfI2U-AK-iUy3LMKbjzQ73Q8",
  assist: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvFs9uAIk6cKCkDauRcq4L5IHmdxlTO44zGGVEejC4vnqFLLLd0DZLEonSOWL9rSozVeZ2hpGzkSgq-Mpzw8_rhCQr63vzoKcm8HYLugk8sjk185b9oDKN0N57LpD-iNxGwDQnreMjuM33vaN7Uv7nfCvGWvMZiJ9MI26c-A-hf5U2UKvBy8ETSzaokh_o_zesYGt40arsomptBSKQy7p2uhRCKKvzkpisMrzgs4yW2zqkVmu0P1phs4f7MydBKluOQNPQeDVZ7TzU",
  autonomous: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHeRDCntQcyoy5eRDE7xXpMt1etdngn3AN7f1RLhVQDkDXj_JrCqkD43eC34fi6W1LLwdnRW68pZYEdaeuvK0thyvca2XQr5WFgj_LbspqUosSoHz3PbZ-avEFOz8R9JeQ9Coz9LWLq3qayrVddns2vFesAIP-dZSGS56cMIF5stNyN-GAI_Gmnv7JyRr63aRzLyE9_iBq-V_7BAb8UkRZFWU4AwlGrSJfsJvEwMUAxLcDq8RujhbCweSlReOx-8MbBTzTS9D28G6h",
  routing: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHWgaHMKvDkt9R74fWTIMkSCNbWoXFHC3UPyXc7Fluty0tDMAEyiwWMBMy3KSpeAj-b4-lyA4AvQ4ncNR_682AfrZqQ81qVpDS0o9-OPVl1lUNd1SYA6-cm84TvlJwY6FRpvejO8FM-x2l2Z9C6xBZ_EChjSiCMaUOhinBRi4kpN9kLV6UYKpDqiGaC41LfhO9EyhVRj39kU62y-Lv4K6bD7peqonfuTgK5_eBs0zbIjYOTWl8KvAK8qtSlcQkj_Q5Kw2wuWGP6Y2W",
  analytics: "https://lh3.googleusercontent.com/aida-public/AB6AXuA71j8Ok5bYbNsMbmsFcTwZLyRzTnqaAR7Ol-T2z6bVV1xBmC53CJ0rH4bkGS-8d3mlEqwd8_Zm4A1jcccoMGh00rj1oasRqGuJxE23yyLjRKMGcHc0WzV4mdT_T3nZvqjnhkiUwOMO2TTq5APlshqihZ73CGbnmSZ33R-1ZGzdbi3yPr3WVDQ6NoG9Ya97hr_78HHKsNIF5bLLtCCJpVgAaEjgwa0ZI9Jqzo7bNZA_-9CjvveF-Sk66GhepXMWoxqXDh7t_8TI0IfS"
};

export default function LandingPage({
  voiceEnrolled,
  voiceStage,
  voiceProgress,
  isAuraSpeaking,
  handleVoiceReset,
  handleMicClick,
  setInWorkspace,
  setActiveMode,
  setShowModal,
  setShowLearnMoreModal,
  tutorialStep
}: LandingPageProps) {
  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 w-full text-left"
    >
      {/* Section 1: Hero */}
      <section className="p-6 md:p-16 flex flex-col gap-16 md:gap-24 relative z-10">
        
        {/* Hero row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] items-center gap-12 lg:gap-16 min-h-[55vh]">
          <div className="content space-y-6">
            <span className="label-mono bg-blue-500/10 text-blue-400 border border-blue-500/10 px-2.5 py-1 rounded inline-block">
              Interactive Prototype: CIS Gilead Ideathon 2026
            </span>
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-white leading-[0.95] pt-2">
              AURA: The L0 Agent
            </h2>           
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-lg">
              An adaptive, AI-powered operational intelligence platform that introduces an autonomous L0 support layer for Enterprise IT to proactively predict, route, and resolve infrastructure and endpoint incidents while automating ticket workflows.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => {
                  setShowModal(true);
                }}
                className="inline-block py-3.5 px-7 bg-[#e2e2e4] hover:bg-white text-[#0b0b0c] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-white/5 active:scale-[0.98] cursor-pointer"
              >
                Try It Out
              </button>
              <button
                id="tutorial-learn-more"
                onClick={() => {
                  setShowLearnMoreModal(true);
                }}
                className={`inline-block py-3.5 px-7 border border-[#e2e2e4]/20 hover:border-white hover:bg-white/5 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-[0.98] cursor-pointer ${
                  tutorialStep === "step_learn_more" ? "ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] scale-105 z-50" : ""
                }`}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Mic visualizer container */}
          <div className="visualizer-container corner-marks border border-[#e2e2e4]/10 aspect-square relative flex flex-col items-center justify-center bg-white/[0.01] p-8 transition-all duration-300">
            {/* Reset Button */}
            {voiceEnrolled && (
              <button
                onClick={handleVoiceReset}
                className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 bg-white/[0.02] border border-white/5 rounded hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-zinc-500 text-[10px] font-mono uppercase tracking-widest transition-all duration-300 cursor-pointer z-20"
                title="Reset Voice Enrollment"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <MicVisualizer 
                isListening={voiceStage === "enrolling-record" || voiceStage === "verifying-record"} 
                isSpeaking={isAuraSpeaking}
              />
            </div>
            <button
              id="tutorial-voice-orb"
              onClick={handleMicClick}
              disabled={voiceStage === "processing"}
              className={`mic-orb-glow relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full border flex items-center justify-center bg-zinc-950/85 backdrop-blur-md cursor-pointer transition-all duration-500 hover:scale-105 active:scale-95 outline-none ${
                voiceStage === "enrolling-speak"
                  ? "border-purple-500/60 shadow-[0_0_25px_rgba(168,85,247,0.3)]"
                  : voiceStage === "enrolling-record" || voiceStage === "verifying-record"
                  ? "border-red-500/60 shadow-[0_0_25px_rgba(239,68,68,0.3)] animate-pulse"
                  : voiceStage === "processing"
                  ? "border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.3)] cursor-wait"
                  : voiceStage === "enrolled-idle"
                  ? "border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                  : "border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:border-blue-400"
              } ${
                tutorialStep === "step_orb" ? "ring-2 ring-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.9)] scale-110 z-50" : ""
              }`}
            >
              {voiceStage === "enrolling-speak" ? (
                <Volume2 className="w-6 h-6 text-purple-400 animate-pulse scale-110" />
              ) : voiceStage === "enrolling-record" || voiceStage === "verifying-record" ? (
                <Mic className="w-6 h-6 text-red-400 scale-110" />
              ) : voiceStage === "processing" ? (
                <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
              ) : voiceEnrolled ? (
                <Mic className="w-6 h-6 text-emerald-400" />
              ) : (
                <Mic className="w-6 h-6 text-blue-400" />
              )}
            </button>
            
            {/* Status Indicator */}
            <div className="absolute bottom-6 flex flex-col items-center gap-1 text-[10px] font-mono tracking-widest text-zinc-500 select-none uppercase transition-all duration-300">
              {voiceStage === "unenrolled" ? (
                <span 
                  id="tutorial-voice-enroll-btn"
                  onClick={handleMicClick}
                  className={`flex items-center gap-2 text-blue-400 font-semibold bg-blue-500/10 px-3 py-1 rounded border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all cursor-pointer shadow-[0_0_15px_rgba(59,130,246,0.1)] animate-pulse ${
                    tutorialStep === "step_enroll" ? "ring-2 ring-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)] scale-105 z-50" : ""
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Record & Enroll your Voice
                </span>
              ) : voiceStage === "enrolling-speak" ? (
                <span className="flex items-center gap-2 text-purple-400 bg-purple-500/10 px-3 py-1 rounded border border-purple-500/20 font-medium">
                  <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                  AURA Speaking...
                </span>
              ) : voiceStage === "enrolling-record" ? (
                <span className="flex items-center gap-2 text-red-400 bg-red-500/10 px-3 py-1 rounded border border-red-500/20 font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  Enroll Recording: {voiceProgress}s left
                </span>
              ) : voiceStage === "verifying-record" ? (
                <span className="flex items-center gap-2 text-red-400 bg-red-500/10 px-3 py-1 rounded border border-red-500/20 font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  Verify Recording: {voiceProgress}s left
                </span>
              ) : voiceStage === "processing" ? (
                <span className="flex items-center gap-2 text-amber-400 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20 font-medium font-mono">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  ANALYZING VOICE SIGNATURE...
                </span>
              ) : (
                <span 
                  onClick={handleMicClick}
                  className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Click Orb to speak
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Split Row */}
        <div className="split-row grid grid-cols-1 md:grid-cols-2 border-t border-[#e2e2e4]/10">
          <div className="split-cell p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#e2e2e4]/10 space-y-4 hover:bg-white/[0.01] transition-all">
            <span className="label-mono">Face 1</span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              AURA FOR THE USER
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              It is an instantly available, conversational AI that serves as the continuous first point of contact to resolve customer issues end-to-end within a single short conversation.
            </p>
          </div>
          <div className="split-cell p-8 md:p-12 space-y-4 hover:bg-white/[0.01] transition-all">
            <span className="label-mono">Face 2</span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              AURA FOR L1/L2 AGENTS
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              It is a continuous AI co-pilot that acts as a live operational presence before, during, and after every call, eliminating administrative overhead by fully briefing human agents and automating documentation.
            </p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="feature-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-[#e2e2e4]/10">
          {[
            {
              mode: "autonomous",
              label: "Mode 01",
              title: "Autonomous Resolution",
              desc: "AURA answers, verifies, and resolves end-to-end with zero human touch. Experience a complete autonomous support call in real time.",
              img: IMAGES.autonomous
            },
            {
              mode: "escalation",
              label: "Mode 02",
              title: "Intelligent Escalation",
              desc: "Watch AURA assemble a full agent handoff package — sentiment flag, ticket, recommended fix — before the human ever picks up.",
              img: IMAGES.routing
            },
            {
              mode: "copilot",
              label: "Mode 03",
              title: "Active L0 Co-Pilot",
              desc: "Step into the L1 agent's seat. AURA reads the live call transcript and whispers guidance, suggestions, and alerts in real time.",
              img: IMAGES.assist
            },
            {
              mode: "predictive",
              label: "Mode 04",
              title: "Predictive Operations",
              desc: "See AURA detect the Monday surge before it arrives, run corrective scripts, and brief the desk before the first call comes in.",
              img: IMAGES.analytics
            }
          ].map((card, index) => (
            <div
              key={`landing-feature-${index}`}
              className="feature-card p-6 border-b sm:border-b-0 border-r border-[#e2e2e4]/10 flex flex-col justify-between gap-4 group hover:bg-white/[0.01] transition-all"
            >
              <div className="space-y-4 text-left">
                <span className="label-mono text-blue-400">{card.label}</span>
                <h3 className="font-display font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                  {card.title}
                </h3>
                <div className="w-full h-28 overflow-hidden bg-black/40 border border-[#e2e2e4]/10">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-75 transition-all duration-700"
                  />
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {card.desc}
                </p>
              </div>
              <button
                onClick={() => {
                  setInWorkspace(true);
                  setActiveMode(card.mode as AuraMode);
                }}
                className="label-mono hover:opacity-100 hover:text-blue-400 transition-colors flex items-center gap-1 mt-2 text-left w-fit self-start cursor-pointer"
                style={{ opacity: 1, color: "var(--accent)" }}
              >
                Execute Test &rarr;
              </button>
            </div>
          ))}
        </div>

        {/* Cinematic Footer */}
        <div className="border-t border-[#e2e2e4]/10 py-12 text-zinc-500 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-[10px] tracking-wider text-zinc-600">
              © AURA - The L0 Agent. CIS Gilead Ideathon 2026. AIOps - AI Driven Infrastructure.
            </p>
            <p className="text-[10px] tracking-wider text-zinc-600">
              Cognizant - Gilead. Ryan Ahmed Tusi - 2485906
            </p>
            {/* Partner Logos */}
            <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
              {/* Inline Cognizant Logo */}
              <svg
                viewBox="0 0 250.59 43.96"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4.5 w-auto cursor-pointer group transition-all duration-300"
              >
                <defs>
                  <linearGradient id="cog-a-landing" gradientTransform="matrix(13.37 0 0 -9.45 11012.63 1246.13)" gradientUnits="userSpaceOnUse" x1="-823.74" x2="-821.42" y1="128.43" y2="128.43">
                    <stop offset="0" stopColor="#3d54ce"/>
                    <stop offset="1" stopColor="#35cacf"/>
                  </linearGradient>
                  <linearGradient id="cog-b-landing" gradientTransform="matrix(15.84 0 0 -9.45 13081.06 1246.13)" gradientUnits="userSpaceOnUse" x1="-825.05" x2="-822.72" y1="128.43" y2="128.43">
                    <stop offset="0" stopColor="#13457d"/>
                    <stop offset="1" stopColor="#279698"/>
                  </linearGradient>
                  <linearGradient id="cog-c-landing" gradientTransform="matrix(13.38 0 0 -9.45 11021.62 1236.69)" gradientUnits="userSpaceOnUse" x1="-823.75" x2="-821.43" y1="129.75" y2="129.75">
                    <stop offset="0" stopColor="#090086"/>
                    <stop offset="1" stopColor="#2f96a9"/>
                  </linearGradient>
                  <linearGradient id="cog-d-landing" gradientTransform="matrix(15.84 0 0 -9.45 13081.06 1236.69)" gradientUnits="userSpaceOnUse" x1="-825.05" x2="-822.72" y1="129.75" y2="129.75">
                    <stop offset="0" stopColor="#3b62ca"/>
                    <stop offset="1" stopColor="#93dfe3"/>
                  </linearGradient>
                </defs>
                <path 
                  d="M250.59 5.11a2.45 2.45 0 1 1-2.45-2.45 2.45 2.45 0 0 1 2.45 2.45zm-.33 0a2.12 2.12 0 1 0-2.12 2.13 2.13 2.13 0 0 0 2.12-2.13zm-1.67.21l.74 1.14h-.57l-.67-1.08h-.38v1.08h-.47V3.75h1a.83.83 0 0 1 .84.81.76.76 0 0 1-.49.76zm-.88-.32h.5a.4.4 0 0 0 .41-.39.39.39 0 0 0-.41-.38h-.5zm-89 5.65h3.69v22.08h-3.69zm-13.49-.49a10.15 10.15 0 0 0-6.45 2.31v-1.85h-3.68v22.1h3.68V20.26a6.45 6.45 0 1 1 12.9 0v12.46h3.69V20.26a10.13 10.13 0 0 0-10.14-10.13zm-17.5.48h3.69v21.25a11.79 11.79 0 0 1-11.54 11.53 11.15 11.15 0 0 1-11-8h4a7.41 7.41 0 0 0 7 4.31 8.13 8.13 0 0 0 7.85-7.85v-1.77a11.54 11.54 0 1 1 0-16.9zm0 11.05a7.85 7.85 0 1 0-7.85 7.85 7.85 7.85 0 0 0 7.85-7.88zm-57-7.85a7.85 7.85 0 0 1 7.12 4.53h3.93a11.54 11.54 0 1 0 0 6.64h-3.95a7.85 7.85 0 1 1-7.12-11.2zm35.86 7.85A11.54 11.54 0 1 1 95 10.13a11.54 11.54 0 0 1 11.56 11.53zm-3.68 0a7.85 7.85 0 1 0-7.9 7.82 7.86 7.86 0 0 0 7.88-7.85zm120.5-11.56a10.15 10.15 0 0 0-6.4 2.31v-1.82h-3.68v22.1H217V20.26a6.45 6.45 0 1 1 12.9 0v12.46h3.68V20.26a10.12 10.12 0 0 0-10.18-10.13zm-17.5.5h3.69v22.1h-3.69v-2.62a11.53 11.53 0 1 1-7.85-20 11.51 11.51 0 0 1 7.85 3.08zm0 11a7.85 7.85 0 1 0-7.85 7.85 7.85 7.85 0 0 0 7.85-7.82zm39.95-7.36v-3.65h-5.52v-6h-3.69v20.73a7.37 7.37 0 0 0 7.36 7.37h1.84V29H244a3.69 3.69 0 0 1-3.68-3.69v-11zM160.56 2.65A2.45 2.45 0 1 0 163 5.09a2.44 2.44 0 0 0-2.44-2.44zm24 8h-18.44v3.69h13.64L166.12 29v3.69h18.42V29h-13.65l13.64-14.73z" 
                  className="fill-zinc-600 group-hover:fill-zinc-300 transition-colors duration-300"
                />
                <g fillRule="evenodd">
                  <path 
                    d="M22.23 21.98H0l15.27 21.98 15.84-9.46z" 
                    className="fill-zinc-600 group-hover:fill-[url(#cog-a-landing)] transition-all duration-300"
                  />
                  <path 
                    d="M52.12 21.98L15.27 43.96h21.87z" 
                    className="fill-zinc-600 group-hover:fill-[url(#cog-b-landing)] transition-all duration-300"
                  />
                  <path 
                    d="M0 21.98h22.23l8.9-12.52L15.27 0z" 
                    className="fill-zinc-600 group-hover:fill-[url(#cog-c-landing)] transition-all duration-300"
                  />
                  <path 
                    d="M52.12 21.98L15.27 0h21.87z" 
                    className="fill-zinc-600 group-hover:fill-[url(#cog-d-landing)] transition-all duration-300"
                  />
                </g>
              </svg>
              <img 
                src={gileadLogo} 
                alt="Gilead Logo" 
                className="h-4.5 w-auto object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          </div>
          <div className="flex gap-6 text-[10px] tracking-widest text-zinc-500">
            <a href="https://github.com/ryantusi/AURA-L0-Agent" target="_blank" className="hover:text-white transition-colors">CODE</a>
            <a href="https://www.linkedin.com/in/ryantusi/" target="_blank" className="hover:text-white transition-colors">LINKEDIN</a>
            <a href="https://github.com/ryantusi" target="_blank" className="hover:text-white transition-colors">GITHUB</a>
            <a href="https://ryantusi.netlify.app/" target="_blank" className="hover:text-white transition-colors">PORTFOLIO</a>
          </div>
        </div>

      </section>
    </motion.div>
  );
}
