export type AuraMode = "autonomous" | "escalation" | "copilot" | "predictive";

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  parts: { text: string }[];
  timestamp: Date;
  isSimulated?: boolean;
}

export interface IncidentPreset {
  id: string;
  name: string;
  symptom: string;
  steps: string[];
  finalMetrics: {
    cpu: number;
    latency: number;
    memory: string;
    status: "Healthy" | "Recovered";
  };
}

export interface PredictiveMetric {
  nodeId: string;
  type: "Storage" | "Replication Lag" | "Process Leak" | "Vulnerability";
  riskScore: number; // 0 to 100
  details: string;
  remediationPatch: string;
  status: "at-risk" | "remediating" | "healthy";
}

export interface EscalationTicket {
  id: string;
  title: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  targetTeam: "L2 DevOps Support" | "L3 DB Administrators" | "L1 Security SecOps";
  details: string;
  diagnosticPayload: string;
  timestamp: string;
  status: "compiled" | "routed";
}

export interface L1Agent {
  id: string;
  name: string;
  status: "Available" | "On Call" | "Meeting";
  resolutions: number;
}

export interface CopilotStep {
  type: "system" | "chat";
  sender?: "user" | "agent" | "aura";
  senderName?: string;
  text: string;
  sentiment: number;
  speaking?: boolean;
  delay?: number;
  isResolved?: boolean;
  subType?: "voice_verification" | "sentiment_alert" | "alert" | "thinking_gemini" | "thinking_claude" | "recommendation" | "success" | "guidance" | "watchdog";
  badge?: { text: string; status: "pass" | "fail" | "info" | "warning" };
  heading?: string;
  bullets?: string[];
}

export interface PastEntryStep {
  text: string;
  completed: boolean;
}

export interface PastEntry {
  timestamp: string;
  category: string;
  text: string;
  caller?: string;
  statusBadge?: { text: string; status: "success" | "fail" | "info" | "warning" };
  steps?: PastEntryStep[];
  meta?: { label: string; value: string }[];
}
