import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mic, Sparkles, BrainCircuit, X } from "lucide-react";
import { AuraMode } from "../types";

interface TutorialWalkthroughProps {
  tutorialStep: string | null;
  setTutorialStep: (step: any) => void;
  setInWorkspace: (val: boolean) => void;
  setActiveMode: (mode: AuraMode) => void;
  setShowLearnMoreModal: (val: boolean) => void;
}

export default function TutorialWalkthrough({
  tutorialStep,
  setTutorialStep,
  setInWorkspace,
  setActiveMode,
  setShowLearnMoreModal
}: TutorialWalkthroughProps) {
  
  const getStepProgressString = (): string => {
    switch (tutorialStep) {
      case "step_learn_more": return "STEP 1 OF 11";
      case "step_documents_opened": return "STEP 2 OF 11";
      case "step_orb": return "STEP 3 OF 11";
      case "step_enroll": return "STEP 4 OF 11";
      case "step_launch_cc": return "STEP 5 OF 11";
      case "step_mode_1": return "STEP 6 OF 11";
      case "step_mode_2": return "STEP 7 OF 11";
      case "step_mode_3": return "STEP 8 OF 11";
      case "step_mode_4": return "STEP 9 OF 11";
      case "step_back_to_landing": return "STEP 10 OF 11";
      case "step_conclusion": return "STEP 11 OF 11";
      default: return "";
    }
  };

  const getStepTitle = (): string => {
    switch (tutorialStep) {
      case "step_learn_more": return "1. Review Supporting Documents";
      case "step_documents_opened": return "2. Examine the Knowledge Base";
      case "step_orb": return "3. Meet the AURA Voice Orb";
      case "step_enroll": return "4. Enroll Your Voice Signature";
      case "step_launch_cc": return "5. Launch the Command Center";
      case "step_mode_1": return "6. Mode 01: Autonomous Resolution";
      case "step_mode_2": return "7. Mode 02: Intelligent Escalation";
      case "step_mode_3": return "8. Mode 03: Active L0 Co-Pilot";
      case "step_mode_4": return "9. Mode 04: Predictive Operations";
      case "step_back_to_landing": return "10. Return to Landing Page";
      case "step_conclusion": return "Walkthrough Complete!";
      default: return "";
    }
  };

  const getStepDescription = (): string => {
    switch (tutorialStep) {
      case "step_learn_more":
        return "First, let's look at AURA's technical blueprints and business metrics. Click on the 'Learn More' button to open the Supporting Documentation catalog.";
      case "step_documents_opened":
        return "Here are the live enterprise documents and checklists to download and view. This knowledge base provides the deep contextual groundings that AURA relies on. Close this modal to continue.";
      case "step_orb":
        return "This is AURA's voice-enabled core. Powered by ElevenLabs, AURA acts as an interactive vocal agent. You can speak directly to AURA or trigger voice feedback.";
      case "step_enroll":
        return "Try clicking the 'Record & Enroll your Voice' button below. Registering your voice will let you test real-time voice verification, verifying if you (or others) are permitted access. Try it out, it's cool!";
      case "step_launch_cc":
        return "Next, let's explore our central operations. Click 'Launch Command Center' in the sidebar navigation to see how AURA runs live automated simulations.";
      case "step_mode_1":
        return "Autonomous Resolution allows AURA to answer calls, run verification protocols, trigger self-healing scripts (e.g. fixing microservice leaks), and auto-close tickets without human help. There are two sub modes, check them out. Click the 'Start Call Simulation' button.";
      case "step_mode_2":
        return "Intelligent Escalation activates when cases are complex. Watch AURA auto-assemble a rich handover brief (sentiment, telemetry scans, matching notes) before escalating to a human agent. Click the 'Initiate Intelligent Escalation' button.";
      case "step_mode_3":
        return "Step into the human specialist's chair! In Co-Pilot mode, AURA transcribes user audio live and 'whispers' context, recommended steps, and knowledge references in real time. There are 3 sub modes, check them out. Click the 'Start' button for each.";
      case "step_mode_4":
        return "Predictive Operations scans fleet logs to pre-empt trouble. Watch AURA catch an Active Directory lockout spike and execute corrective scripts before users can even call. Click 'Initiate Predictive Monitoring' button.";
      case "step_back_to_landing":
        return "You have seen all of AURA's powerful interactive modules! Now, click the 'Back to Landing' button in the sidebar to return to the homepage for a quick conclusion.";
      case "step_conclusion":
        return "Congratulations, you are now fully thorough on AURA! Feel free to enroll your voice, trigger autonomous heals, or explore the prototype in detail.";
      default:
        return "";
    }
  };

  const handleNextStep = () => {
    switch (tutorialStep) {
      case "welcome":
        setTutorialStep("step_learn_more");
        break;
      case "step_learn_more":
        setShowLearnMoreModal(true);
        setTutorialStep("step_documents_opened");
        break;
      case "step_documents_opened":
        setShowLearnMoreModal(false);
        setTutorialStep("step_orb");
        break;
      case "step_orb":
        setTutorialStep("step_enroll");
        break;
      case "step_enroll":
        setTutorialStep("step_launch_cc");
        break;
      case "step_launch_cc":
        setInWorkspace(true);
        setActiveMode("autonomous");
        setTutorialStep("step_mode_1");
        break;
      case "step_mode_1":
        setActiveMode("escalation");
        setTutorialStep("step_mode_2");
        break;
      case "step_mode_2":
        setActiveMode("copilot");
        setTutorialStep("step_mode_3");
        break;
      case "step_mode_3":
        setActiveMode("predictive");
        setTutorialStep("step_mode_4");
        break;
      case "step_mode_4":
        setTutorialStep("step_back_to_landing");
        break;
      case "step_back_to_landing":
        setInWorkspace(false);
        setTutorialStep("step_conclusion");
        break;
      case "step_conclusion":
        setTutorialStep(null);
        break;
      default:
        setTutorialStep(null);
    }
  };

  const handlePrevStep = () => {
    switch (tutorialStep) {
      case "step_learn_more":
        setTutorialStep("welcome");
        break;
      case "step_documents_opened":
        setShowLearnMoreModal(false);
        setTutorialStep("step_learn_more");
        break;
      case "step_orb":
        setTutorialStep("step_documents_opened");
        setShowLearnMoreModal(true);
        break;
      case "step_enroll":
        setTutorialStep("step_orb");
        break;
      case "step_launch_cc":
        setTutorialStep("step_enroll");
        break;
      case "step_mode_1":
        setInWorkspace(false);
        setTutorialStep("step_launch_cc");
        break;
      case "step_mode_2":
        setActiveMode("autonomous");
        setTutorialStep("step_mode_1");
        break;
      case "step_mode_3":
        setActiveMode("escalation");
        setTutorialStep("step_mode_2");
        break;
      case "step_mode_4":
        setActiveMode("copilot");
        setTutorialStep("step_mode_3");
        break;
      case "step_back_to_landing":
        setTutorialStep("step_mode_4");
        break;
      case "step_conclusion":
        setInWorkspace(true);
        setTutorialStep("step_back_to_landing");
        break;
      default:
        break;
    }
  };

  return (
    <AnimatePresence>
      {/* 1. Microphone Access Modal (Requested First) */}
      {tutorialStep === "mic_prompt" && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="glass-panel w-full max-w-md rounded-[24px] relative z-10 flex flex-col shadow-2xl overflow-hidden border border-white/10 bg-[#0a0a0a]"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
            
            <div className="p-8 flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.2)] animate-pulse">
                <Mic className="w-8 h-8 text-blue-400" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-xl font-extrabold text-white">
                  Unlock AURA
                </h3>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                  Voice features & Live Speech
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed pt-2">
                  AURA features real-time voice synthesis (via ElevenLabs) and dynamic identity biometrics. Enabling microphone access allows you to speak to AURA and see voice verification working live.
                </p>
              </div>

              <div className="w-full flex flex-col gap-2 pt-2">
                <button
                  onClick={async () => {
                    try {
                      await navigator.mediaDevices.getUserMedia({ audio: true });
                    } catch (err) {
                      console.warn("Microphone permission denied by user:", err);
                    }
                    setTutorialStep("welcome");
                  }}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-[0.98] cursor-pointer"
                >
                  Allow Microphone
                </button>
                <button
                  onClick={() => {
                    setTutorialStep("welcome");
                  }}
                  className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/5 active:scale-[0.98] cursor-pointer"
                >
                  Skip Microphone
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 2. Welcome Modal */}
      {tutorialStep === "welcome" && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="glass-panel w-full max-w-lg rounded-[24px] relative z-10 flex flex-col shadow-2xl overflow-hidden border border-white/10 bg-[#0a0a0a]"
          >
            
            <div className="p-8 flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.2)] animate-bounce">
                <Sparkles className="w-8 h-8 text-emerald-400" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-2xl font-extrabold text-white">
                  Welcome to AURA!
                </h3>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                  CIS GILEAD IDEATHON 2026 PROTOTYPE WALKTHROUGH
                </p>
                <p className="text-xs text-zinc-400 leading-relaxed pt-2">
                  Let's take a quick guided tour of AURA. I'll highlight key components and demonstrate how this autonomous support agent streamlines enterprise operations via AIOps. You can follow along or skip to explore freely!
                </p>
              </div>

              <div className="w-full grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    setTutorialStep("step_learn_more");
                  }}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/20 active:scale-[0.98] cursor-pointer"
                >
                  Start Walkthrough
                </button>
                <button
                  onClick={() => {
                    setTutorialStep(null);
                  }}
                  className="py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-white/5 active:scale-[0.98] cursor-pointer"
                >
                  Skip Walkthrough
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 3. Floating Tooltip Step Panels */}
      {tutorialStep && tutorialStep !== "mic_prompt" && tutorialStep !== "welcome" && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-[120] w-full max-w-sm bg-zinc-950/95 backdrop-blur-lg border border-white/10 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden text-left"
        >
          {/* Content */}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                  <BrainCircuit className="w-4 h-4 text-blue-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                    Walkthrough Guide
                  </h4>
                  <span className="text-[9px] text-zinc-600 font-mono">
                    {getStepProgressString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setTutorialStep(null)}
                className="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-full cursor-pointer"
                title="Close and exit walkthrough"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                {getStepTitle()}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {getStepDescription()}
              </p>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <button
                onClick={() => {
                  setTutorialStep(null);
                }}
                className="text-[10px] font-mono uppercase text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                Skip Tour
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevStep}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-[10px] font-mono uppercase tracking-wider rounded border border-white/5 cursor-pointer transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-mono uppercase tracking-wider rounded cursor-pointer transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] font-bold"
                >
                  {tutorialStep === "step_conclusion" ? "Finish" : "Next"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
