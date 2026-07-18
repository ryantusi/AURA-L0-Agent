import React, { useState, useEffect, useRef } from "react";
import {
  X,
  BookOpen,
  FileText,
  FileSpreadsheet,
  Presentation,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Layers,
  Terminal,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import Sidebar from "./components/Sidebar";
import LandingPage from "./components/LandingPage";
import TutorialWalkthrough from "./components/TutorialWalkthrough";
import AutonomousMode from "./components/AutonomousMode";
import EscalationMode from "./components/EscalationMode";
import CopilotMode from "./components/CopilotMode";
import PredictiveMode from "./components/PredictiveMode";

import { AuraMode } from "./types";
import {
  VALIDATED_CALL_SCRIPT,
  FAILED_CALL_SCRIPT,
  L1_AGENTS_ROSTER,
  COPILOT_CALL_SCRIPT,
  WARM_TRANSFER_CALL_SCRIPT,
  THREE_STRIKE_CALL_SCRIPT
} from "./data";

export default function App() {
  // Navigation Shell State
  const [inWorkspace, setInWorkspace] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<AuraMode>("autonomous");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showLearnMoreModal, setShowLearnMoreModal] = useState<boolean>(false);

  // Voice Enrollment & Recognition States
  const [voiceEnrolled, setVoiceEnrolled] = useState<boolean>(false);
  const [isAuraSpeaking, setIsAuraSpeaking] = useState<boolean>(false);
  const [voiceStage, setVoiceStage] = useState<string>("unenrolled");
  const [voiceProgress, setVoiceProgress] = useState<number>(0);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>("");
  const [voiceError, setVoiceError] = useState<string | null>(null);

  // Tutorial / Walkthrough States
  const [tutorialStep, setTutorialStep] = useState<string | null>("mic_prompt");

  // Mode 1 (Autonomous Simulation) States
  const [mode1Tab, setMode1Tab] = useState<"validated" | "failed">("validated");
  const [mode1StepIndex, setMode1StepIndex] = useState<number>(0);
  const [mode1IsPlaying, setMode1IsPlaying] = useState<boolean>(false);
  const [mode1Timer, setMode1Timer] = useState<number>(0);
  const [mode1Speed, setMode1Speed] = useState<number>(1);
  const mode1AudioRef = useRef<HTMLAudioElement | null>(null);

  // Mode 2 (Intelligent Escalation) States
  const [mode2Status, setMode2Status] = useState<"idle" | "scanning" | "matched" | "briefing">("idle");
  const [mode2ScanIndex, setMode2ScanIndex] = useState<number>(0);
  const [mode2AssignedAgent, setMode2AssignedAgent] = useState<string>("Unassigned");
  const [mode2TicketStatus, setMode2TicketStatus] = useState<"New" | "Assigned">("New");
  const [mode2ShowQuote, setMode2ShowQuote] = useState<boolean>(false);

  // Mode 3 (Co-Pilot) States
  const [mode3Tab, setMode3Tab] = useState<"l1_outbound" | "l2_warm_transfer" | "three_strike">("l1_outbound");
  const [mode3StepIndex, setMode3StepIndex] = useState<number>(0);
  const [mode3IsPlaying, setMode3IsPlaying] = useState<boolean>(false);
  const [mode3Timer, setMode3Timer] = useState<number>(0);
  const [mode3Speed, setMode3Speed] = useState<number>(1);
  const [mode3Sentiment, setMode3Sentiment] = useState<number>(50);

  // Mode 4 (Predictive Operations) States
  const [mode4IsMonitoring, setMode4IsMonitoring] = useState<boolean>(false);
  const [mode4StepIndex, setMode4StepIndex] = useState<number>(0);
  const [mode4LockoutCount, setMode4LockoutCount] = useState<number>(0);
  const [mode4RemediationState, setMode4RemediationState] = useState<"idle" | "running" | "completed">("idle");
  const [mode4RemediationProgress, setMode4RemediationProgress] = useState<number>(0);
  const [mode4ShowUserNotified, setMode4ShowUserNotified] = useState<boolean>(false);
  const [mode4ShowAgentBriefed, setMode4ShowAgentBriefed] = useState<boolean>(false);

  // Media Capture Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimeoutRef = useRef<any>(null);

  // Escalation Simulation Refs
  const mode2ScanIntervalRef = useRef<any>(null);
  const mode2Timeout1Ref = useRef<any>(null);
  const mode2Timeout2Ref = useRef<any>(null);

  // Synchronize Voice Stage on enrollment trigger
  useEffect(() => {
    if (voiceEnrolled) {
      setVoiceStage("enrolled-idle");
    } else {
      setVoiceStage("unenrolled");
    }
  }, [voiceEnrolled]);

  // Clean up escalation timers on route changes
  useEffect(() => {
    return () => {
      if (mode2ScanIntervalRef.current) clearInterval(mode2ScanIntervalRef.current);
      if (mode2Timeout1Ref.current) clearTimeout(mode2Timeout1Ref.current);
      if (mode2Timeout2Ref.current) clearTimeout(mode2Timeout2Ref.current);
    };
  }, [activeMode]);

  // Automatically reset server cache on mount
  useEffect(() => {
    fetch("/api/voice/reset", { method: "POST" }).catch((e) => {
      console.error("Auto-reset on load failed:", e);
    });
  }, []);

  // Update playback speed for Mode 1 live call simulations
  useEffect(() => {
    if (mode1AudioRef.current) {
      mode1AudioRef.current.playbackRate = mode1Speed;
    }
  }, [mode1Speed]);

  // Call timer simulation for Mode 1
  useEffect(() => {
    let timerInterval: any = null;
    if (mode1IsPlaying) {
      timerInterval = setInterval(() => {
        setMode1Timer((prev) => prev + 1);
      }, 1000 / mode1Speed);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [mode1IsPlaying, mode1Speed]);

  // Call timer simulation for Mode 3
  useEffect(() => {
    let timerInterval: any = null;
    if (mode3IsPlaying && mode3Tab !== "three_strike") {
      timerInterval = setInterval(() => {
        setMode3Timer((prev) => prev + 1);
      }, 1000 / mode3Speed);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [mode3IsPlaying, mode3Speed, mode3Tab]);

  // Dialogue Step Playback Effect for Mode 3 (Co-Pilot Simulation)
  useEffect(() => {
    if (!mode3IsPlaying) return;

    let isCancelled = false;

    const currentScript =
      mode3Tab === "l1_outbound"
        ? COPILOT_CALL_SCRIPT
        : mode3Tab === "l2_warm_transfer"
        ? WARM_TRANSFER_CALL_SCRIPT
        : THREE_STRIKE_CALL_SCRIPT;

    if (mode3StepIndex >= currentScript.length) {
      setMode3IsPlaying(false);
      return;
    }

    const currentStep = currentScript[mode3StepIndex];

    if (currentStep.sentiment !== undefined) {
      setMode3Sentiment(currentStep.sentiment);
    }

    let stepTimeout: any = null;

    const advanceStep = () => {
      if (isCancelled) return;
      setMode3StepIndex((prev) => prev + 1);
    };

    const delayTime = (currentStep.delay || 1500) / mode3Speed;
    stepTimeout = setTimeout(advanceStep, delayTime);

    return () => {
      isCancelled = true;
      if (stepTimeout) clearTimeout(stepTimeout);
    };
  }, [mode3IsPlaying, mode3StepIndex, mode3Tab, mode3Speed]);

  // Handle TTS playback requests securely
  const playTTS = async (text: string) => {
    setIsAuraSpeaking(true);
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error("TTS request failed");

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);

      return new Promise<void>((resolve, reject) => {
        audio.onended = () => {
          setIsAuraSpeaking(false);
          resolve();
        };
        audio.onerror = (e) => {
          setIsAuraSpeaking(false);
          reject(e);
        };
        audio.play().catch((err) => {
          setIsAuraSpeaking(false);
          reject(err);
        });
      });
    } catch (error) {
      console.error("Error playing TTS:", error);
      setIsAuraSpeaking(false);
    }
  };

  // Start microphone capture for Voice Registration & Verification
  const startVoiceRecording = async (isEnroll: boolean) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await handleAudioUpload(audioBlob, isEnroll);
      };

      mediaRecorder.start();

      setVoiceStage(isEnroll ? "enrolling-record" : "verifying-record");
      setVoiceProgress(10);
      let timeLeft = 10;
      const interval = setInterval(() => {
        timeLeft -= 1;
        setVoiceProgress(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(interval);
          if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
          }
        }
      }, 1000);
      recordingTimeoutRef.current = interval;
    } catch (err: any) {
      console.error("Failed to access microphone for recording:", err);
      setVoiceError("Microphone access denied or unavailable.");
      setVoiceStage(isEnroll ? "unenrolled" : "enrolled-idle");
    }
  };

  // Convert WebM format chunk buffers to 16kHz WAV format (server compliant)
  const convertWebmToWav = async (webmBlob: Blob): Promise<Blob> => {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await webmBlob.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const targetSampleRate = 16000;

    let downsampledData = channelData;
    if (sampleRate !== targetSampleRate) {
      const ratio = sampleRate / targetSampleRate;
      const newLength = Math.round(channelData.length / ratio);
      downsampledData = new Float32Array(newLength);
      for (let i = 0; i < newLength; i++) {
        downsampledData[i] = channelData[Math.round(i * ratio)];
      }
    }

    const wavBuffer = new ArrayBuffer(44 + downsampledData.length * 2);
    const view = new DataView(wavBuffer);

    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + downsampledData.length * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, targetSampleRate, true);
    view.setUint32(28, targetSampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, downsampledData.length * 2, true);

    let offset = 44;
    for (let i = 0; i < downsampledData.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, downsampledData[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    audioCtx.close();
    return new Blob([view], { type: "audio/wav" });
  };

  // Upload WAV blob to server enrollment/verification endpoints
  const handleAudioUpload = async (blob: Blob, isEnroll: boolean) => {
    setVoiceStage("processing");
    try {
      const wavBlob = await convertWebmToWav(blob);

      const formData = new FormData();
      formData.append("audio", wavBlob, "audio.wav");

      const endpoint = isEnroll ? "/api/voice/enroll" : "/api/voice/verify";
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();

      if (isEnroll) {
        setVoiceEnrolled(true);
        setVoiceStage("enrolled-idle");
        await playTTS("Registered Successfully.");
      } else {
        const { confidence, match, text } = data;
        setConfidenceScore(confidence);
        setIsVerified(match);
        setVoiceTranscript(text || "(No speech detected)");
        setShowVerificationModal(true);
        setVoiceStage("enrolled-idle");

        if (match) {
          await playTTS(`Voice Verified Successfully with a confidence score of ${confidence} percent. Access Granted.`);
        } else {
          await playTTS(`Voice Verification Failed. Confidence score was only ${confidence} percent. Access Denied.`);
        }
      }
    } catch (err: any) {
      console.error("Audio upload failed:", err);
      setVoiceError(err.message || "Failed to process audio.");
      setVoiceStage(isEnroll ? "unenrolled" : "enrolled-idle");
    }
  };

  // Orchestrate microphone clicks based on current voice signature states
  const handleMicClick = async () => {
    if (voiceStage === "unenrolled") {
      setVoiceStage("enrolling-speak");
      await playTTS("Hi I'm AURA, your L0 AI Agent. Speak for 10 seconds, so I can recognize you.");
      await startVoiceRecording(true);
    } else if (voiceStage === "enrolled-idle") {
      setVoiceStage("verifying-record");
      await startVoiceRecording(false);
    } else if (voiceStage === "enrolling-record" || voiceStage === "verifying-record") {
      if (recordingTimeoutRef.current) {
        clearInterval(recordingTimeoutRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
    }
  };

  // Reset voice profile cache on local state and server endpoints
  const handleVoiceReset = async () => {
    try {
      await fetch("/api/voice/reset", { method: "POST" });
    } catch (e) {
      console.error("Reset request failed:", e);
    }
    if (recordingTimeoutRef.current) {
      clearInterval(recordingTimeoutRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setVoiceEnrolled(false);
    setConfidenceScore(null);
    setIsVerified(null);
    setVoiceTranscript("");
    setVoiceStage("unenrolled");
  };

  // Dialogue Step Playback Effect for Mode 1 (Autonomous Call Simulation)
  useEffect(() => {
    if (!mode1IsPlaying) return;

    let isCancelled = false;

    const currentScript = mode1Tab === "validated" ? VALIDATED_CALL_SCRIPT : FAILED_CALL_SCRIPT;
    if (mode1StepIndex >= currentScript.length) {
      setMode1IsPlaying(false);
      return;
    }

    const currentStep = currentScript[mode1StepIndex];
    const isAuraSpeakingStep = currentStep.type === "message" && currentStep.role === "aura" && currentStep.text;

    let stepTimeout: any = null;

    const advanceStep = () => {
      if (isCancelled) return;
      setMode1StepIndex((prev) => prev + 1);
    };

    if (isAuraSpeakingStep) {
      const fallbackTimeout = setTimeout(() => {
        if (isCancelled) return;
        console.warn("TTS audio playback safety timeout triggered, advancing step");
        advanceStep();
      }, 60000 / mode1Speed);

      fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: currentStep.text }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("TTS failed");
          return res.blob();
        })
        .then((blob) => {
          if (isCancelled) return;

          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          mode1AudioRef.current = audio;
          audio.playbackRate = mode1Speed;

          audio.onended = () => {
            clearTimeout(fallbackTimeout);
            if (isCancelled) return;
            stepTimeout = setTimeout(advanceStep, 500 / mode1Speed);
          };

          audio.onerror = () => {
            clearTimeout(fallbackTimeout);
            advanceStep();
          };

          audio.play().catch((err) => {
            console.error("Audio playback failed, using fallback:", err);
            clearTimeout(fallbackTimeout);
            advanceStep();
          });
        })
        .catch((err) => {
          console.error("TTS fetch failed, using fallback:", err);
          clearTimeout(fallbackTimeout);
          if (isCancelled) return;
          const delayTime = (currentStep.delay || 2500) / mode1Speed;
          stepTimeout = setTimeout(advanceStep, delayTime);
        });
    } else {
      const delayTime = (currentStep.delay || 1500) / mode1Speed;
      stepTimeout = setTimeout(advanceStep, delayTime);
    }

    return () => {
      isCancelled = true;
      if (stepTimeout) clearTimeout(stepTimeout);
      if (mode1AudioRef.current) {
        mode1AudioRef.current.pause();
        mode1AudioRef.current = null;
      }
    };
  }, [mode1IsPlaying, mode1StepIndex, mode1Tab, mode1Speed]);

  // Initiate Intelligent Escalation Sequence Simulation (Mode 2)
  const handleStartEscalation = () => {
    if (mode2ScanIntervalRef.current) clearInterval(mode2ScanIntervalRef.current);
    if (mode2Timeout1Ref.current) clearTimeout(mode2Timeout1Ref.current);
    if (mode2Timeout2Ref.current) clearTimeout(mode2Timeout2Ref.current);

    setMode2Status("scanning");
    setMode2ScanIndex(0);
    setMode2AssignedAgent("Unassigned");
    setMode2TicketStatus("New");
    setMode2ShowQuote(false);

    let currentIndex = 0;
    mode2ScanIntervalRef.current = setInterval(() => {
      currentIndex++;
      if (currentIndex < L1_AGENTS_ROSTER.length) {
        setMode2ScanIndex(currentIndex);
      } else {
        clearInterval(mode2ScanIntervalRef.current);
        mode2ScanIntervalRef.current = null;

        setMode2Status("matched");
        setMode2ScanIndex(3);

        mode2Timeout1Ref.current = setTimeout(() => {
          setMode2Status("briefing");
          setMode2AssignedAgent("Mohammed Fawaz");
          setMode2TicketStatus("Assigned");

          mode2Timeout2Ref.current = setTimeout(() => {
            setMode2ShowQuote(true);
          }, 1500);
        }, 3000);
      }
    }, 1500);
  };

  // Synchronize tutorial steps with modal toggles dynamically
  useEffect(() => {
    if (showLearnMoreModal) {
      if (tutorialStep === "step_learn_more") {
        setTutorialStep("step_documents_opened");
      }
    } else {
      if (tutorialStep === "step_documents_opened") {
        setTutorialStep("step_orb");
      }
    }
  }, [showLearnMoreModal]);

  // Synchronize tutorial steps with workspace entrances automatically
  useEffect(() => {
    if (inWorkspace) {
      if (tutorialStep === "step_launch_cc") {
        setTutorialStep("step_mode_1");
      }
    } else {
      if (tutorialStep === "step_back_to_landing") {
        setTutorialStep("step_conclusion");
      }
    }
  }, [inWorkspace]);

  // Handle active mode syncing with tutorial steps
  useEffect(() => {
    if (inWorkspace && tutorialStep) {
      if (activeMode === "autonomous" && tutorialStep === "step_mode_2") {
        setTutorialStep("step_mode_1");
      } else if (activeMode === "escalation" && tutorialStep === "step_mode_1") {
        setTutorialStep("step_mode_2");
      } else if (activeMode === "escalation" && tutorialStep === "step_mode_3") {
        setTutorialStep("step_mode_2");
      } else if (activeMode === "copilot" && tutorialStep === "step_mode_2") {
        setTutorialStep("step_mode_3");
      } else if (activeMode === "copilot" && tutorialStep === "step_mode_4") {
        setTutorialStep("step_mode_3");
      } else if (activeMode === "predictive" && tutorialStep === "step_mode_3") {
        setTutorialStep("step_mode_4");
      }
    }
  }, [activeMode, inWorkspace]);

  // Trigger file download matching physical assets in `/assets`
  const handleDownloadFile = (fileName: string, assetName: string) => {
    const link = document.createElement("a");
    link.href = `/api/download/${assetName}`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-shell flex flex-col md:grid md:grid-cols-[280px_1fr] h-screen w-screen overflow-hidden bg-[#0b0b0c] text-[#e2e2e4] selection:bg-blue-600/30 font-sans">
      
      {/* Sidebar Navigation */}
      <Sidebar
        inWorkspace={inWorkspace}
        setInWorkspace={setInWorkspace}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        tutorialStep={tutorialStep}
      />

      {/* Main Content Area */}
      <main className="overflow-y-auto h-full relative flex flex-col justify-between bg-gradient-to-b from-blue-900/[0.02] to-transparent">
        <div className="dot-bg"></div>
        
        <AnimatePresence mode="wait">
          {!inWorkspace ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 w-full"
            >
              <LandingPage
                voiceEnrolled={voiceEnrolled}
                voiceStage={voiceStage}
                voiceProgress={voiceProgress}
                isAuraSpeaking={isAuraSpeaking}
                handleVoiceReset={handleVoiceReset}
                handleMicClick={handleMicClick}
                setInWorkspace={setInWorkspace}
                setActiveMode={setActiveMode}
                setShowModal={setShowModal}
                setShowLearnMoreModal={setShowLearnMoreModal}
                tutorialStep={tutorialStep}
              />
            </motion.div>
          ) : (
            <motion.div
              key="workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 w-full p-6 md:p-8 space-y-6"
            >
              <AnimatePresence mode="wait">
                {activeMode === "autonomous" && (
                  <AutonomousMode
                    mode1Tab={mode1Tab}
                    setMode1Tab={setMode1Tab}
                    mode1IsPlaying={mode1IsPlaying}
                    setMode1IsPlaying={setMode1IsPlaying}
                    mode1StepIndex={mode1StepIndex}
                    setMode1StepIndex={setMode1StepIndex}
                    mode1Timer={mode1Timer}
                    setMode1Timer={setMode1Timer}
                    mode1Speed={mode1Speed}
                    setMode1Speed={setMode1Speed}
                    tutorialStep={tutorialStep}
                  />
                )}

                {activeMode === "escalation" && (
                  <EscalationMode
                    mode2Status={mode2Status}
                    mode2ScanIndex={mode2ScanIndex}
                    mode2AssignedAgent={mode2AssignedAgent}
                    mode2TicketStatus={mode2TicketStatus}
                    mode2ShowQuote={mode2ShowQuote}
                    handleStartEscalation={handleStartEscalation}
                  />
                )}

                {activeMode === "copilot" && (
                  <CopilotMode
                    mode3Tab={mode3Tab}
                    setMode3Tab={setMode3Tab}
                    mode3StepIndex={mode3StepIndex}
                    setMode3StepIndex={setMode3StepIndex}
                    mode3IsPlaying={mode3IsPlaying}
                    setMode3IsPlaying={setMode3IsPlaying}
                    mode3Timer={mode3Timer}
                    setMode3Timer={setMode3Timer}
                    mode3Speed={mode3Speed}
                    setMode3Speed={setMode3Speed}
                    mode3Sentiment={mode3Sentiment}
                    setMode3Sentiment={setMode3Sentiment}
                  />
                )}

                {activeMode === "predictive" && (
                  <PredictiveMode
                    mode4IsMonitoring={mode4IsMonitoring}
                    setMode4IsMonitoring={setMode4IsMonitoring}
                    mode4StepIndex={mode4StepIndex}
                    setMode4StepIndex={setMode4StepIndex}
                    mode4LockoutCount={mode4LockoutCount}
                    setMode4LockoutCount={setMode4LockoutCount}
                    mode4RemediationState={mode4RemediationState}
                    setMode4RemediationState={setMode4RemediationState}
                    mode4RemediationProgress={mode4RemediationProgress}
                    setMode4RemediationProgress={setMode4RemediationProgress}
                    mode4ShowUserNotified={mode4ShowUserNotified}
                    setMode4ShowUserNotified={setMode4ShowUserNotified}
                    mode4ShowAgentBriefed={mode4ShowAgentBriefed}
                    setMode4ShowAgentBriefed={setMode4ShowAgentBriefed}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Gateway selector modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="glass-panel w-full max-w-[760px] rounded-[24px] relative z-10 flex flex-col shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-zinc-950/60">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    Select Interaction Mode
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5">
                    AURA COMMAND GATEWAY
                  </p>
                </div>
                <button
                  className="text-[#8e9192] hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setShowModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: "autonomous",
                      name: "Autonomous Resolution",
                      desc: "Mode 01",
                      icon: Cpu
                    },
                    {
                      id: "escalation",
                      name: "Intelligent Escalation",
                      desc: "Mode 02",
                      icon: Layers
                    },
                    {
                      id: "copilot",
                      name: "Active L0 Co-Pilot",
                      desc: "Mode 03",
                      icon: Terminal
                    },
                    {
                      id: "predictive",
                      name: "Predictive Operations",
                      desc: "Mode 04",
                      icon: Activity
                    }
                  ].map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <button
                        key={`modal-mode-${mode.id}`}
                        onClick={() => {
                          setActiveMode(mode.id as AuraMode);
                          setInWorkspace(true);
                          setShowModal(false);
                        }}
                        className="p-6 text-left rounded-xl border border-white/5 bg-zinc-900/40 hover:bg-blue-600/10 hover:border-blue-500/20 transition-all group flex gap-4 items-start cursor-pointer"
                      >
                        <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl group-hover:border-blue-500/20 group-hover:bg-blue-900/10 transition-colors">
                          <Icon className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-display font-semibold text-white text-sm group-hover:text-blue-300">
                            {mode.name}
                          </h4>
                          <p className="text-zinc-400 text-xs font-light leading-relaxed">{mode.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Supporting Documents Modal */}
      <AnimatePresence>
        {showLearnMoreModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLearnMoreModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="glass-panel w-full max-w-[840px] rounded-[24px] relative z-10 flex flex-col shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="flex justify-between items-center p-6 border-b border-white/5 bg-zinc-950/60">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    AURA Supporting Documentation
                  </h3>
                  <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-0.5">
                    CIS GILEAD IDEATHON 2026 EVIDENCE PORTAL
                  </p>
                </div>
                <button
                  className="text-[#8e9192] hover:text-white p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => setShowLearnMoreModal(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                <p className="text-zinc-400 text-sm leading-relaxed">
                  To fully understand the <strong className="text-white font-semibold">AURA Level 0 Agent</strong> system in detail, its core operational paradigms, and the underlying financial and technical evidence, please review our supporting documents. Click any button below to download the official document directly to your device.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: "whitepaper",
                      title: "1. AURA Whitepaper",
                      fileName: "AURA Whitepaper.docx",
                      assetName: "AURA_Whitepaper.docx",
                      desc: "The full document about the core concept, operational metrics, and L0 support layer vision.",
                      icon: BookOpen,
                      color: "hover:border-blue-500/30 hover:bg-blue-950/10",
                      iconColor: "text-blue-400"
                    },
                    {
                      id: "presentation",
                      title: "2. AURA Presentation",
                      fileName: "AURA Presentation.pptx",
                      assetName: "AURA_Presentation.pptx",
                      desc: "Visual presentation slide deck outlining problem statements, architecture flows, and business impacts.",
                      icon: Presentation,
                      color: "hover:border-amber-500/30 hover:bg-amber-950/10",
                      iconColor: "text-amber-400"
                    },
                    {
                      id: "ticket_analysis",
                      title: "3. Ticket Analysis Master",
                      fileName: "Ticket Analysis Master.xlsx",
                      assetName: "Ticket_Analysis_Master.xlsx",
                      desc: "Evidence-backed automated exploratory data analysis workbook with telemetry analysis & core incident matrices.",
                      icon: FileSpreadsheet,
                      color: "hover:border-emerald-500/30 hover:bg-emerald-950/10",
                      iconColor: "text-emerald-400"
                    },
                    {
                      id: "prototype",
                      title: "4. AURA Prototype",
                      fileName: "AURA Prototype.docx",
                      assetName: "AURA_Prototype.docx",
                      desc: "Explains the prototype's technical architecture, build details, and integration steps.",
                      icon: FileText,
                      color: "hover:border-purple-500/30 hover:bg-purple-950/10",
                      iconColor: "text-purple-400"
                    }
                  ].map((doc) => {
                    const Icon = doc.icon;
                    return (
                      <div
                        key={`modal-doc-${doc.id}`}
                        className={`p-6 rounded-xl border border-white/5 bg-zinc-900/40 transition-all flex flex-col justify-between group ${doc.color}`}
                      >
                        <div className="flex gap-4 items-start">
                          <div className="p-3 bg-zinc-900 border border-white/5 rounded-xl group-hover:scale-105 transition-transform">
                            <Icon className={`w-6 h-6 ${doc.iconColor}`} />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-display font-semibold text-white text-sm">
                              {doc.title}
                            </h4>
                            <p className="text-zinc-400 text-xs font-light leading-relaxed">{doc.desc}</p>
                            <span className="inline-block text-[10px] text-zinc-500 font-mono mt-1">
                              File: {doc.fileName}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDownloadFile(doc.fileName, doc.assetName)}
                          className="mt-6 w-full py-2 px-4 bg-white/5 hover:bg-white text-white hover:text-black font-semibold text-[11px] uppercase tracking-wider rounded transition-all duration-300 cursor-pointer text-center"
                        >
                          Download File
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Voice Verification Result Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden">
            <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] opacity-25 ${isVerified ? "bg-emerald-500" : "bg-red-500"}`} />
            
            <button
              onClick={() => setShowVerificationModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-5 pt-4">
              {isVerified ? (
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                  <ShieldCheck className="w-8 h-8 text-emerald-400 animate-pulse" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                  <ShieldAlert className="w-8 h-8 text-red-400 animate-pulse" />
                </div>
              )}

              <div>
                <h3 className={`text-xl font-display font-bold tracking-tight ${isVerified ? "text-emerald-400" : "text-red-400"}`}>
                  {isVerified ? "Voice Verified" : "Verification Failed"}
                </h3>
                <p className="text-xs text-zinc-500 font-mono uppercase mt-1 tracking-widest">
                  AURA Security Protocol
                </p>
              </div>

              <div className="w-full bg-zinc-950 border border-white/5 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-500">Confidence Match Score:</span>
                  <span className={`font-bold ${isVerified ? "text-emerald-400" : "text-red-400"}`}>
                    {confidenceScore}%
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full transition-all duration-1000 ${isVerified ? "bg-emerald-500" : "bg-red-500"}`}
                    style={{ width: `${confidenceScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>Threshold: 70%</span>
                  <span>{isVerified ? "Access Granted" : "Access Denied"}</span>
                </div>
              </div>

              <div className="w-full text-left space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Transcribed Utterance
                </span>
                <div className="bg-zinc-950 border border-white/5 p-3 rounded-lg max-h-24 overflow-y-auto text-xs text-zinc-300 font-mono italic leading-relaxed">
                  "{voiceTranscript}"
                </div>
              </div>

              <button
                onClick={() => setShowVerificationModal(false)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  isVerified
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                    : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10"
                }`}
              >
                Close Connection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Walkthrough Overlays */}
      <TutorialWalkthrough
        tutorialStep={tutorialStep}
        setTutorialStep={setTutorialStep}
        setInWorkspace={setInWorkspace}
        setActiveMode={setActiveMode}
        setShowLearnMoreModal={setShowLearnMoreModal}
      />
    </div>
  );
}
