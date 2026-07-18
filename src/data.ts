import { L1Agent, IncidentPreset, CopilotStep, PastEntry } from "./types";
import { formatCurrentTimestamp } from "./utils";

// Constants for Image Hotlinks
export const IMAGES = {
  logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdOmrrhiaNcjHVftxLc0TBPdcmm5pjOQmwsKovSk6asQpcqCqRLRjwa-3Gndnv4UzO8mgrKtEjyMnJfk9ODpq-ElXOfH1kUxRKkndwmgLM59ScZ01A4U2WAUcQLn5-CNjflbs6jxLJlnLi0034OfMVngELzXCUV-nsqrT21UJMfbG13n1TP2LR0_HFcgY9oalYRgsbm2_CJBAeyeKZk302nDiM857Waha_-GrmMN_KMYJv09ThAsQNzfI2U-AK-iUy3LMKbjzQ73Q8",
  assist: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvFs9uAIk6cKCkDauRcq4L5IHmdxlTO44zGGVEejC4vnqFLLLd0DZLEonSOWL9rSozVeZ2hpGzkSgq-Mpzw8_rhCQr63vzoKcm8HYLugk8sjk185b9oDKN0N57LpD-iNxGwDQnreMjuM33vaN7Uv7nfCvGWvMZiJ9MI26c-A-hf5U2UKvBy8ETSzaokh_o_zesYGt40arsomptBSKQy7p2uhRCKKvzkpisMrzgs4yW2zqkVmu0P1phs4f7MydBKluOQNPQeDVZ7TzU",
  autonomous: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHeRDCntQcyoy5eRDE7xXpMt1etdngn3AN7f1RLhVQDkDXj_JrCqkD43eC34fi6W1LLwdnRW68pZYEdaeuvK0thyvca2XQr5WFgj_LbspqUosSoHz3PbZ-avEFOz8R9JeQ9Coz9LWLq3qayrVddns2vFesAIP-dZSGS56cMIF5stNyN-GAI_Gmnv7JyRr63aRzLyE9_iBq-V_7BAb8UkRZFWU4AwlGrSJfsJvEwMUAxLcDq8RujhbCweSlReOx-8MbBTzTS9D28G6h",
  routing: "https://lh3.googleusercontent.com/aida-public/AB6AXuDHWgaHMKvDkt9R74fWTIMkSCNbWoXFHC3UPyXc7Fluty0tDMAEyiwWMBMy3KSpeAj-b4-lyA4AvQ4ncNR_682AfrZqQ81qVpDS0o9-OPVl1lUNd1SYA6-cm84TvlJwY6FRpvejO8FM-x2l2Z9C6xBZ_EChjSiCMaUOhinBRi4kpN9kLV6UYKpDqiGaC41LfhO9EyhVRj39kU62y-Lv4K6bD7peqonfuTgK5_eBs0zbIjYOTWl8KvAK8qtSlcQkj_Q5Kw2wuWGP6Y2W",
  analytics: "https://lh3.googleusercontent.com/aida-public/AB6AXuA71j8Ok5bYbNsMbmsFcTwZLyRzTnqaAR7Ol-T2z6bVV1xBmC53CJ0rH4bkGS-8d3mlEqwd8_Zm4A1jcccoMGh00rj1oasRqGuJxE23yyLjRKMGcHc0WzV4mdT_T3nZvqjnhkiUwOMO2TTq5APlshqihZ73CGbnmSZ33R-1ZGzdbi3yPr3WVDQ6NoG9Ya97hr_78HHKsNIF5bLLtCCJpVgAaEjgwa0ZI9Jqzo7bNZA_-9CjvveF-Sk66GhepXMWoxqXDh7t_8TI0IfS"
};

// L1 Agents Roster for Mode 2 Intelligent Escalation
export const L1_AGENTS_ROSTER: L1Agent[] = [
  { id: "a1", name: "Karthikeyan BK", status: "On Call", resolutions: 12 },
  { id: "a2", name: "Rebekah Mahima", status: "Available", resolutions: 8 },
  { id: "a3", name: "Nancy Angelin", status: "On Call", resolutions: 15 },
  { id: "a4", name: "Mohammed Fawaz", status: "Available", resolutions: 27 }, // Best match (Available & highest resolutions)
  { id: "a5", name: "Yashwita", status: "Available", resolutions: 5 },
  { id: "a6", name: "Adithya Manoj", status: "Available", resolutions: 25 },
  { id: "a7", name: "Gowtham Akula", status: "Meeting", resolutions: 30 },
];

// Preset Incidents for Autonomous Simulation
export const INCIDENT_PRESETS: IncidentPreset[] = [
  {
    id: "leak",
    name: "Microservice Memory Leak",
    symptom: "Heap utilization on node_service_api exceeding 95%. Process slowing down.",
    steps: [
      "[AURA] Analysing core node telemetry...",
      "[AURA] Found anomalous process PID 2419 (node_service_api) consuming 4.12 GB virtual RAM.",
      "[AURA] Warning dispatched to API Gateway; throttling incoming sessions gracefully.",
      "[AURA] Triggering container process memory-dump and runtime state capture...",
      "[AURA] Initiating warm recycle of PID 2419 with 15s graceful teardown...",
      "[AURA] Swapping routing table target to isolated standby container-04B.",
      "[AURA] Recycling complete. Verified memory signature back to base profile (184 MB).",
      "[AURA] Auto-healing success. Resuming standard production flow."
    ],
    finalMetrics: { cpu: 14, latency: 8, memory: "184 MB", status: "Recovered" }
  },
  {
    id: "db_lag",
    name: "Database Replication Lag",
    symptom: "Master-replica sync delay spiking up to 1420ms. Read replicas serving stale state.",
    steps: [
      "[AURA] Detecting database synchronization drift...",
      "[AURA] Jitter identified on standby PostgreSQL secondary node replica-02.",
      "[AURA] Diagnosing write-ahead log (WAL) synchronization lock due to high-write batch...",
      "[AURA] Optimizing replica worker threads and auto-adjusting vacuum thresholds...",
      "[AURA] Forcing state flush and temporary WAL read stream prioritization...",
      "[AURA] Sync lag decreasing: 1120ms -> 600ms -> 4ms.",
      "[AURA] Database replication recovered to synchronous near-zero lag standard.",
      "[AURA] Disabling database throttling. Master-Replica sync verified green."
    ],
    finalMetrics: { cpu: 28, latency: 4, memory: "1.2 GB", status: "Healthy" }
  },
  {
    id: "cdn_fail",
    name: "CDN Endpoint Latency Jitter",
    symptom: "Edge router tables corrupted on West Coast CDN node SFO-04. Latency spikes up to 2.4s.",
    steps: [
      "[AURA] Network ping traceroute analysis loaded.",
      "[AURA] Edge routing bottleneck verified at regional node SFO-04 (San Francisco).",
      "[AURA] Re-routing traffic from SFO-04 to adjacent stable nodes (LAX-01, SEA-02)...",
      "[AURA] Dispatching flush-CDN routing instruction packet to edge routers...",
      "[AURA] Purging corrupted router tables and synchronizing DNS cache keys...",
      "[AURA] Re-testing target latency profile from SFO-04...",
      "[AURA] Latency restored to standard 14ms average.",
      "[AURA] Restoring SFO-04 to active pool. System status verified green."
    ],
    finalMetrics: { cpu: 8, latency: 14, memory: "94 MB", status: "Recovered" }
  }
];

export const VALIDATED_CALL_SCRIPT = [
  {
    id: "v1",
    type: "system",
    text: "Incoming support request. Establishing secure voice tunnel...",
    delay: 1000,
    progress: "Security Questions: --"
  },
  {
    id: "v2",
    type: "system",
    text: "Introducing and following mandatory verification steps. Requesting caller name...",
    delay: 1200,
    progress: "Security Questions: --"
  },
  {
    id: "v_cti",
    type: "system",
    text: "CTI Pop-Up: Retrieving incoming call info...",
    badge: { text: "CTI Pop-Up: Pass", status: "pass" },
    delay: 1500,
    progress: "Security Questions: --"
  },
  {
    id: "v3",
    type: "message",
    role: "aura",
    text: "Thank you for contacting Gilead Enterprise Service Desk. This is AURA, your L0 AI agent here for your support. May I have your full name please?",
    delay: 2800,
    progress: "Security Questions: --",
    speaking: true
  },
  {
    id: "v4",
    type: "message",
    role: "user",
    text: "Yes, Hi this is Ryan Ahmed Tusi.",
    delay: 1500,
    progress: "Security Questions: --"
  },
  {
    id: "v5",
    type: "system",
    text: "Recognizing voice, fetching records, and running background check.",
    badge: { text: "Voice Recognized (94.6% match confidence - 2/5 security questions set)", status: "pass" },
    delay: 2000,
    progress: "Security Questions: 0 / 2"
  },
  {
    id: "v6",
    type: "message",
    role: "aura",
    text: "Alright Ryan, could you please tell me your manager's full name?",
    delay: 2200,
    progress: "Security Questions: 0 / 2",
    speaking: true
  },
  {
    id: "v7",
    type: "message",
    role: "user",
    text: "My manager is Tara Matthews.",
    delay: 1500,
    progress: "Security Questions: 0 / 2"
  },
  {
    id: "v8",
    type: "system",
    text: "Mandatory verification done. Security validation in progress: Checking Active Directory records",
    badge: { text: "Reporting Match (99.8% confidence)", status: "pass" },
    delay: 1800,
    progress: "Security Questions: 1 / 2"
  },
  {
    id: "v9",
    type: "message",
    role: "aura",
    text: "Great. Could you please tell me the names of any two direct reports reporting to you?",
    delay: 2500,
    progress: "Security Questions: 1 / 2",
    speaking: true
  },
  {
    id: "v10",
    type: "message",
    role: "user",
    text: "I have none reporting to me.",
    delay: 1800,
    progress: "Security Questions: 1 / 2"
  },
  {
    id: "v11",
    type: "system",
    text: "Verifying relational ledger records in Gilead Org Tree",
    badge: { text: "Question 1 Passed (100% confidence)", status: "pass" },
    delay: 1500,
    progress: "Security Questions: 1 / 2"
  },
  {
    id: "v12",
    type: "message",
    role: "aura",
    text: "Got it. Could you please tell me the names of any two direct reports reporting to your manager?",
    delay: 2500,
    progress: "Security Questions: 2 / 2",
    speaking: true
  },
  {
    id: "v13",
    type: "message",
    role: "user",
    text: "I'm not sure. I don't know.",
    delay: 1500,
    progress: "Security Questions: 2 / 2"
  },
  {
    id: "v14",
    type: "system",
    text: "Security Question 2 Failed: Match mismatch or unresolved input. Triggering fallback validation 3/5.",
    badge: { text: "Question Failed", status: "fail" },
    delay: 2000,
    progress: "Security Questions: 2 / 2"
  },
  {
    id: "v15",
    type: "message",
    role: "aura",
    text: "It's alright, no worries. Can you please confirm your hiring date?",
    delay: 2200,
    progress: "Security Questions: 2 / 2",
    speaking: true
  },
  {
    id: "v16",
    type: "message",
    role: "user",
    text: "Yes, that was March 19, 2026.",
    delay: 1500,
    progress: "Security Questions: 2 / 2"
  },
  {
    id: "v17",
    type: "system",
    text: "Cross-referencing legal employment timestamp ledger",
    badge: { text: "Hiring Date Verified (100% match)", status: "pass" },
    delay: 1500,
    progress: "Security Questions: 2 / 2"
  },
  {
    id: "v18",
    type: "message",
    role: "aura",
    text: "Excellent, your call has been validated. Thank you for your patience through that. Now how may I assist you today?",
    delay: 3000,
    progress: "Security Questions: 2 / 2",
    speaking: true
  },
  {
    id: "v19",
    type: "message",
    role: "user",
    text: "I forgot my password and need to reset it manually.",
    delay: 1800,
    progress: "Security Questions: 2 / 2"
  },
  {
    id: "v20",
    type: "message",
    role: "aura",
    text: "Got it. Allow me a moment, I'm working on it.",
    delay: 2000,
    progress: "Security Questions: 2 / 2",
    speaking: true
  },
  {
    id: "v21",
    type: "system",
    text: "Fetched KB0031253 to follow.Fetching Active Directory account details for Ryan Ahmed Tusi...",
    delay: 1200,
    progress: "Security Questions: 2 / 2"
  },
  {
    id: "v22",
    type: "system",
    text: "Suspending temporary lock and resetting security credentials...",
    delay: 1200,
    progress: "Security Questions: 2 / 2"
  },
  {
    id: "v23",
    type: "system",
    text: "Generating new temporary password...",
    delay: 1200,
    progress: "Security Questions: 2 / 2"
  },
  {
    id: "v24",
    type: "message",
    role: "aura",
    text: "I have successfully reset your password. Your temporary password is 'GILEAD@2026'. Please use this to log in, reset your password, and let me know once you're successfully logged in.",
    delay: 4500,
    progress: "Security Questions: 2 / 2",
    speaking: true
  },
  {
    id: "v25",
    type: "message",
    role: "user",
    text: "Perfect, I am logging in now. Yes! That worked, I'm back in my account now. Thank you!",
    delay: 2000,
    progress: "Security Questions: 2 / 2"
  },
  {
    id: "v26",
    type: "system",
    text: "Pushing Nexthink remote action for SmartCard sync, Compiling system audit logs, and final resolution receipt...",
    delay: 1200,
    progress: "Security Questions: 2 / 2"
  },
  {
    id: "v27",
    type: "message",
    role: "aura",
    text: "Fantastic. I have logged and resolved Ticket INC2222222 for this password reset, and confirmed your access is fully restored. Is there anything else I can help you with? Or can I go ahead and close this ticket since it has been resolved?",
    delay: 4000,
    progress: "Security Questions: 2 / 2",
    speaking: true
  },
  {
    id: "v28",
    type: "message",
    role: "user",
    text: "No, that's everything! Yes, you can close the ticket. Thank you so much.",
    delay: 1800,
    progress: "Security Questions: 2 / 2"
  },
  {
    id: "v29",
    type: "ticket",
    ticketData: {
      number: "INC2222222",
      category: "CI: Accounts & Permissions",
      verificationNotes: "Genesys Verification: Pass.  Mandatory Verification: Full Name and Manager Name - Pass.  Security Verification: Voice Recognition, Direct Reports, and Hire Date - Pass. Failed Questions: Two Direct Reports for Manager.",
      actionTaken: "Active Directory password forced reset, account unlocked, temporary password dispatched & verified, and SmartCard sync actioned via Nexthink.",
      get timestamp() {
        return formatCurrentTimestamp();
      },
      kb: "KB Used: KB0031253",
      status: "RESOLVED"
    },
    delay: 3500,
    progress: "Security Questions: 2 / 2"
  },
  {
    id: "v30",
    type: "message",
    role: "aura",
    text: "Thank you for contacting Gilead Enterprise Service Desk. It was my pleasure assisting you today. Have a wonderful day.",
    delay: 2500,
    progress: "Security Questions: 2 / 2",
    speaking: true
  }
];

export const FAILED_CALL_SCRIPT = [
  {
    id: "f1",
    type: "system",
    text: "Incoming support request. Establishing secure voice tunnel...",
    delay: 1000,
    progress: "Security Questions: --"
  },
  {
    id: "f2",
    type: "system",
    text: "Introducing and following mandatory verification steps. Requesting caller name...",
    delay: 1200,
    progress: "Security Questions: --"
  },
  {
    id: "f_cti",
    type: "system",
    text: "CTI Pop-Up: Scanning directory for caller metadata...",
    badge: { text: "CTI Pop-Up: User not found", status: "fail" },
    delay: 1500,
    progress: "Security Questions: --"
  },
  {
    id: "f3",
    type: "message",
    role: "aura",
    text: "Thank you for contacting Gilead Enterprise Service Desk. This is AURA, your L0 AI agent here for your support. May I have your full name please?",
    delay: 2800,
    progress: "Security Questions: --",
    speaking: true
  },
  {
    id: "f4",
    type: "message",
    role: "user",
    text: "Yes, this is Ryan Ahmed Tusi.",
    delay: 1500,
    progress: "Security Questions: --"
  },
  {
    id: "f5",
    type: "system",
    text: "Recognizing voice and running biometric validation",
    badge: { text: "Voice Recognition Warning (42.1% confidence - Mismatch - 4/5 security questions set)", status: "fail" },
    delay: 2000,
    progress: "Security Questions: 0 / 4"
  },
  {
    id: "f6",
    type: "message",
    role: "aura",
    text: "Alright, could you please tell me your manager's full name?",
    delay: 2200,
    progress: "Security Questions: 0 / 4",
    speaking: true
  },
  {
    id: "f7",
    type: "message",
    role: "user",
    text: "I think it is Sarah Jenkin... or maybe Darren?",
    delay: 1800,
    progress: "Security Questions: 0 / 4"
  },
  {
    id: "f8",
    type: "system",
    text: "Mandatory verification in progress: Checking Active Directory reporting structure",
    badge: { text: "Reporting Mismatch - Expected 'Tara Matthews'", status: "fail" },
    delay: 1800,
    progress: "Security Questions: 0 / 4"
  },
  {
    id: "f9",
    type: "message",
    role: "aura",
    text: "I'm sorry, I'm afraid we're unable to proceed furthr at this moment. As per Gilead's security policy, providing IT support requires that we successfully complete the verification process, and that's in place entirely to protect your account. I'd recommend reaching out to your manager, who can walk you through the verification requirements. Please know that we are available 24/7 and we'll be right here whenever you're ready to reach back out. Hope that is understandable. Thank you for calling and have a nice day.",
    delay: 7500,
    progress: "Security Questions: 0 / 4 (Failed)",
    speaking: true
  },
  {
    id: "f10",
    type: "system",
    text: "Verification failure recorded. Fetched KB0028745 to follow. Restricting Active Directory operations.",
    badge: { text: "Access Restricted", status: "fail" },
    delay: 1200,
    progress: "Security Questions: 0 / 4 (Failed)"
  },
  {
    id: "f11",
    type: "system",
    text: "Creating incident ticket INC2222222 for failed verification attempt...",
    delay: 1200,
    progress: "Security Questions: 0 / 4 (Failed)"
  },
  {
    id: "f12",
    type: "system",
    text: "Sending notification email with voice biometric logs to user's manager, CC Tara Matthews, and BCC IT Security...",
    delay: 1200,
    progress: "Security Questions: 0 / 4 (Failed)"
  },
  {
    id: "f13",
    type: "system",
    text: "Dispatching alert to ESD Team Leads for potential account spoofing...",
    delay: 1200,
    progress: "Security Questions: 0 / 4 (Failed)"
  },
  {
    id: "f14",
    type: "system",
    text: "Forwarding call metadata to standard human support team dashboard...",
    delay: 1200,
    progress: "Security Questions: 0 / 4 (Failed)"
  },
  {
    id: "f15",
    type: "ticket",
    ticketData: {
      number: "INC2222222",
      category: "CI: Security & Privacy - Unauthorized Access Attempt",
      verificationNotes: "Genesys Verification: User not found.  Mandatory Verification: Full Name and Manager Name - FAILED.  Security Verification: NA. Failed Questions: Voice not recongized. Critical security breach threshold met",
      actionTaken: "Account temporarily flagged, write privileges locked, escalations dispatched to Manager & Security Desk",
      get timestamp() {
        return formatCurrentTimestamp();
      },
      kb: "KB Used: KB0028745",
      status: "CLOSED"
    },
    delay: 1500,
    progress: "Security Questions: 0 / 3 (LOCKED)"
  }
];

export const COPILOT_PAST_HISTORY: PastEntry[] = [
  {
    timestamp: "Day 1 - 14:22",
    category: "Mode 1 (Autonomous Attempt)",
    text: "AURA Level 0 Autonomous assistant was initiated by caller Arafath Hussain. Caller verified. Troubleshooting initiated, but course navigation remained locked under a module. Automated Level 0 resolution was unable to complete manual basic troubleshooting.",
    caller: "Arafath Hussain",
    statusBadge: { text: "AUTONOMOUS ATTEMPT UNSUCCESSFUL", status: "fail" },
    steps: [
      { text: "Verified User Successfully", completed: true },
      { text: "Identified & Classified Issue and Created Ticket", completed: true },
      { text: "Netskope Reauthentication and Remediation", completed: true},
      { text: "Basic Troubleshooting", completed: false }
    ],
    meta: [
      { label: "Channel", value: "Voice (AURA L0)" },
      { label: "Status", value: "Issue Persistent" }
    ]
  },
  {
    timestamp: "Day 1 - 14:29",
    category: "Mode 2 (Intelligent Escalation)",
    text: "AURA compiled a complete diagnostic dossier for GxpLearn lockouts and escalated the incident. Ticket INC2222222 was created and routed to the Contact Center assignment group.",
    statusBadge: { text: "ESCALATED TO L1 GROUP", status: "warning" },
    meta: [
      { label: "Incident No.", value: "INC2222222" },
      { label: "Target Group", value: "Contact Center" },
      { label: "Dossier Status", value: "Compiled & Attached" }
    ]
  },
  {
    timestamp: "Day 1 - 14:30",
    category: "Knowledge Base Reference",
    text: "KB Article referenced during automated search: KB0011695 — Procedure - GxPLearn Support",
    statusBadge: { text: "KB ATTACHED", status: "info" },
    meta: [
      { label: "KB ID", value: "KB0011695" },
      { label: "Title", value: "GxpLearn Support" }
    ]
  },
  {
    timestamp: "Day 1 - 15:10",
    category: "L1 Support Notes",
    text: "L1 Support agent (Karthikeyan BK) triaged the ticket. Completed recommended resolution steps 1, 2, and 3. Steps 4 and 5 remain untried.",
    statusBadge: { text: "PARTIALLY TROUBLESHOOTED", status: "info" },
    steps: [
      { text: "Step 1: Device Sync via Intune", completed: true },
      { text: "Step 2: Active session termination", completed: true },
      { text: "Step 3: Profile reset", completed: true },
      { text: "Step 4: Clear service-worker cache", completed: false },
      { text: "Step 5: Delete browser history", completed: false }
    ],
    meta: [
      { label: "L1 Agent", value: "Karthikeyan BK" },
      { label: "Status", value: "Incomplete" }
    ]
  },
  {
    timestamp: "Day 1 - 15:20",
    category: "Callback Request",
    text: "Standard L1 troubleshooting failed to resolve the issue. Caller requested a callback from a representative.",
    statusBadge: { text: "CALLBACK ENQUEUED", status: "warning" },
    meta: [
      { label: "Priority", value: "P3 - Moderate" },
      { label: "Requested By", value: "Arafath Hussain" }
    ]
  }
];

export const COPILOT_CALL_SCRIPT: CopilotStep[] = [
  {
    type: "system",
    subType: "voice_verification",
    text: "AURA Voice Verification Trace: Biometric signature matches caller 'Arafath Hussain' with 98.4% confidence. Voice recognition PASSED. --- Skipping security validation process and fastforwarding to resolution steps ---",
    badge: { text: "Voice Biometrics: Passed", status: "pass" },
    sentiment: 50,
    delay: 2000
  },
  {
    type: "chat",
    sender: "agent",
    senderName: "Karthikeyan BK",
    text: "Hi Arafath, this is Karthikeyan BK from the Gilead IT Contact Center. This regarding your issue with GxpLearn course",
    speaking: true,
    sentiment: 50,
    delay: 3500
  },
  {
    type: "chat",
    sender: "user",
    senderName: "Arafath Hussain",
    text: "Yes, hi Karthikeyan! Yes, I'm here. I'm still stuck on Module 2 of the course. It just displays a loading screen and won't let me complete it. I really need this done by the end of today.",
    speaking: false,
    sentiment: 50,
    delay: 3500
  },
  {
    type: "system",
    subType: "sentiment_alert",
    text: "AURA Sentiment Watch: Mild frustration detected in caller voice pitch. Shifting sentiment index to 62/100.",
    sentiment: 62,
    delay: 2000
  },
  {
    type: "chat",
    sender: "agent",
    senderName: "Karthikeyan BK",
    text: "Got it. Let me try the resolution steps we missed the other day and let's get into remote session. Just a second...",
    speaking: true,
    sentiment: 62,
    delay: 3500
  },
  {
    type: "system",
    subType: "alert",
    heading: "Untried Resolution Steps Identified",
    text: "Suggesting untried resolution steps from original ticket history. Step 4 & Step 5 remain untried.",
    bullets: [
      "Step 4: Clear service-worker cache (Untried)",
      "Step 5: Delete browsing history (Untried)"
    ],
    sentiment: 62,
    delay: 3500
  },
  {
    type: "chat",
    sender: "agent",
    senderName: "Karthikeyan BK",
    text: "Okay, I've cleared the service-worker cache & deleted browser history. Arafath, could you please try refreshing the course page?",
    speaking: true,
    sentiment: 62,
    delay: 3500
  },
  {
    type: "chat",
    sender: "user",
    senderName: "Arafath Hussain",
    text: "I just refreshed... Still the exact same blank screen. This is really frustrating, I need to complete this regulatory compliance course today.",
    speaking: false,
    sentiment: 62,
    delay: 3500
  },
  {
    type: "system",
    subType: "sentiment_alert",
    text: "AURA Sentiment threshold exceeded: Caller Frustrated. Initializing AI agents for further resolution formulation...",
    sentiment: 85,
    delay: 2500
  },
  {
    type: "system",
    subType: "thinking_gemini",
    heading: "Gemini AI Agent Active",
    text: "AURA: Gemini searching external sources for 'Online course stuck in a module. Find resolutions.'...",
    sentiment: 85,
    delay: 3500
  },
  {
    type: "system",
    subType: "thinking_claude",
    heading: "Claude Reasoning Engine Engaged",
    text: "AURA: Claude reasoning over Gemini's fetched external sources and ticket history... Synthesizing recommendation...",
    sentiment: 85,
    delay: 3500
  },
  {
    type: "system",
    subType: "recommendation",
    heading: "Recommended Solution Formulated",
    text: "AURA Recommendation: GxpLearn might have compatibility issues with Edge v114+ browser.",
    bullets: [
      "Action: Direct user to switch browser to Google Chrome or Firefox."
    ],
    sentiment: 85,
    delay: 3500
  },
  {
    type: "chat",
    sender: "agent",
    senderName: "Karthikeyan BK",
    text: "Arafath, our background systems detected a potential browser engine conflict between GxpLearn and your browser. Do you have Google Chrome or Firefox installed on your computer? Let's try opening the link there.",
    speaking: true,
    sentiment: 85,
    delay: 3000
  },
  {
    type: "chat",
    sender: "user",
    senderName: "Arafath Hussain",
    text: "Yes, I have Chrome. Let me copy-paste the URL over there and see what happens....",
    speaking: false,
    sentiment: 80,
    delay: 4500,
    isResolved: false
  },
  {
    type: "chat",
    sender: "user",
    senderName: "Arafath Hussain",
    text: "Oh! Wow! It loaded instantly! It bypassed the loader and I can see the completion button now! It worked!",
    speaking: false,
    sentiment: 60,
    delay: 4500,
    isResolved: true
  },
  {
    type: "system",
    subType: "success",
    text: "AURA Success: Browser Compatibility Switch resolved the GxpLearn block. [RESOLVED]",
    sentiment: 30,
    delay: 2500,
    isResolved: true
  },
  {
    type: "system",
    subType: "guidance",
    heading: "Co-pilot Quality Assurance Guidance",
    text: "AURA Guidance: Prompt the caller to confirm they can complete the remaining course modules.",
    bullets: [
      "Verify slide transition",
      "Verify progress indicator synchronization"
    ],
    sentiment: 30,
    delay: 2500
  },
  {
    type: "chat",
    sender: "agent",
    senderName: "Karthikeyan BK",
    text: "Excellent! I am so glad that worked. Could you try clicking on the next slide just to make sure it's updating slide progress correctly?",
    speaking: true,
    sentiment: 30,
    delay: 3500
  },
  {
    type: "chat",
    sender: "user",
    senderName: "Arafath Hussain",
    text: "Yes, I just clicked next, and it transitioned to Module 3 without any loading loop. This is perfect. I can finish this course now!",
    speaking: false,
    sentiment: 20,
    delay: 3500
  },
  {
    type: "chat",
    sender: "agent",
    senderName: "Karthikeyan BK",
    text: "That is great news, Arafath! Glad to know it resolved the issue. Thank you for contacting Enterprise Service Desk.",
    speaking: true,
    sentiment: 15,
    delay: 3500
  },
  {
    type: "system",
    subType: "watchdog",
    heading: "Protocol Warning",
    text: "AURA Protocol Warning: Agent is wrapping up call without obtaining explicit ticket closure confirmation. Prompting agent: Ask caller to confirm if the ticket can be officially marked resolved.",
    bullets: [
      "Ticket clearance protocol requires explicit verbal consent.",
      "Prompt: Confirm permission to close ticket INC2222222."
    ],
    sentiment: 15,
    delay: 3500
  },
  {
    type: "chat",
    sender: "agent",
    senderName: "Karthikeyan BK",
    text: "Since it's fully working now, do I have your permission to mark ticket INC2222222 as resolved and close it out on our systems?",
    speaking: true,
    sentiment: 15,
    delay: 3500
  },
  {
    type: "chat",
    sender: "user",
    senderName: "Arafath Hussain",
    text: "Yes, definitely. You can close it. Thank you so much, Karthikeyan! This saved my day.",
    speaking: false,
    sentiment: 10,
    delay: 3000
  },
  {
    type: "system",
    subType: "success",
    heading: "Session Concluded",
    text: "AURA Outbound Call Mode Terminated. Automatic documentation and ticket closure payload dispatched. Prompting agent: Close the ticket now that everything is confirmed.",
    sentiment: 10,
    delay: 2500
  },
  {
    type: "chat",
    sender: "agent",
    senderName: "Karthikeyan BK",
    text: "Thank you for contacting Gilead ESD. Have a wonderful day.",
    speaking: true,
    sentiment: 10,
    delay: 1500
  }
];

export const WARM_TRANSFER_PAST_HISTORY: PastEntry[] = [
  {
    timestamp: "Day 1 - 14:22",
    category: "Mode 1 (Autonomous Attempt)",
    text: "AURA Level 0 Autonomous assistant was initiated by caller Surya Dev. Caller verified. Troubleshooting initiated, checked user's BYOD enrollment status (approved), tried syncing the device via Intune backend, but unable to do manual troubleshooting.",
    caller: "Surya Dev",
    statusBadge: { text: "AUTONOMOUS ATTEMPT UNSUCCESSFUL", status: "fail" },
    steps: [
      { text: "Verified User Successfully", completed: true },
      { text: "Identified & Classified Issue and Created Ticket", completed: true },
      { text: "Checked BYOD Enrollment Status", completed: true },
      { text: "Sync Device via Intune Backend", completed: true },
      { text: "Basic Troubleshooting", completed: false }
    ],
    meta: [
      { label: "Channel", value: "Voice (AURA L0)" },
      { label: "Status", value: "Issue Persistent" }
    ]
  },
  {
    timestamp: "Day 1 - 14:25",
    category: "Mode 2 (Intelligent Escalation)",
    text: "AURA compiled a complete diagnostic dossier for BYOD Mobile Setup and escalated the incident. Ticket INC2222222 was created and routed to the Contact Center assignment group.",
    statusBadge: { text: "ESCALATED TO L1 GROUP", status: "warning" },
    meta: [
      { label: "Incident No.", value: "INC2222222" },
      { label: "Target Group", value: "Contact Center" },
      { label: "Priority", value: "P3 - Moderate" }
    ]
  },
  {
    timestamp: "Day 1 - 14:30",
    category: "Knowledge Base Reference",
    text: "KB Article referenced during automated search: KB0021238 — Procedure - BYOD iOS/Android.",
    statusBadge: { text: "KB ATTACHED", status: "info" },
    meta: [
      { label: "KB ID", value: "KB0021238" },
      { label: "Title", value: "BYOD iOS/Android Support" }
    ]
  },
  {
    timestamp: "Day 1 - 14:40",
    category: "L1 Support Notes",
    text: "L1 Support agent (Nancy Angelin) triaged the ticket. Agent guided user to retry the setup, deleted the company profile, signed in to work profile under VPN & Device management settings in iPhone, followed the setup process, but it doesn't download the Company Portal and other Gilead apps automatically like it should.",
    statusBadge: { text: "PARTIALLY TROUBLESHOOTED", status: "info" },
    steps: [
      { text: "Step 1: Delete company profile & retry setup", completed: true },
      { text: "Step 2: Sign into work profile under VPN & Device management", completed: true },
      { text: "Step 3: Follow setup process from KB", completed: true },
      { text: "Step 4: Company Portal & other apps download automatically", completed: false },
      { text: "Step 5: Setup and sign-in user account", completed: false }
    ],
    meta: [
      { label: "L1 Agent", value: "Nancy Angelin" },
      { label: "Status", value: "Incomplete" }
    ]
  },
  {
    timestamp: "Day 1 - 14:45",
    category: "Escalation Request",
    text: "Standard L1 troubleshooting failed to resolve the issue. Recommending escalation to appropriate specialized team for advanced specialist support.",
    statusBadge: { text: "ESCALATION ENQUEUED", status: "warning" },
    meta: [
      { label: "Priority", value: "P3 - Moderate" },
      { label: "Requested By", value: "Nancy Angelin" }
    ]
  }
];

export const WARM_TRANSFER_CALL_SCRIPT: CopilotStep[] = [
  {
    type: "system",
    subType: "thinking_gemini",
    heading: "AURA Team Routing Scan",
    text: "AURA: Searching database, ticket history, & KB for correct assignment group to resolve BYOD Company Portal download failure...",
    sentiment: 50,
    delay: 2500
  },
  {
    type: "system",
    subType: "recommendation",
    heading: "Assignment Group Identified",
    text: "AURA Recommendation: End User Platform - Mobility",
    bullets: ["Identified specialized mobility enrollment group", "Action: Warm transfer to End User Platform - Mobility"],
    sentiment: 50,
    delay: 4500
  },
  {
    type: "system",
    subType: "alert",
    heading: "Warm Transfer Notification Sent",
    text: "Warm Transfer Request Sent: Notification and template dispatched to End User Platform - Mobility L2 agents.",
    bullets: [
      "Group: End User Platform - Mobility",
      "Notification status: Dispatched",
      "L2 Agents: Natheem J, Puja Prabha, Ankita Patil, Harini, Adithya, Dharmeshwaran"
    ],
    sentiment: 50,
    delay: 3000
  },
  {
    type: "system",
    subType: "thinking_claude",
    heading: "Waiting for Agent Acknowledgment",
    text: "AURA: Waiting for an available L2 Mobility Agent to acknowledge the warm transfer request...",
    sentiment: 50,
    delay: 5500
  },
  {
    type: "system",
    subType: "success",
    heading: "Puja Prabha Acknowledged",
    text: "Puja Prabha has accepted the Warm Transfer request.",
    sentiment: 30,
    delay: 5500
  },
  {
    type: "chat",
    sender: "aura",
    senderName: "AURA Co-Pilot",
    text: "Thank you for acknowledging, initiating warm transfer and assigning the ticket.",
    sentiment: 30,
    delay: 4000
  },
  {
    type: "chat",
    sender: "agent",
    senderName: "Puja Prabha (L2)",
    text: "Thanks AURA. Did the L1 agent try deleting the profile completely?",
    sentiment: 30,
    delay: 3000
  },
  {
    type: "chat",
    sender: "aura",
    senderName: "AURA Co-Pilot",
    text: "Yes, they completely deleted the profile and attempted a fresh login, but the automatic download still fails. They require your specialist assistance.",
    sentiment: 30,
    delay: 3500
  },
  {
    type: "system",
    subType: "guidance",
    heading: "Warm Transfer Completed",
    text: "AURA: Warm Transfer Completed. Live L2 Specialist Connected and ticket assigned. AURA remains active in background ready for assistance.",
    sentiment: 15,
    delay: 2000
  }
];

export const THREE_STRIKE_PAST_HISTORY: PastEntry[] = [
  {
    timestamp: "Day 0 - 09:00",
    category: "AURA Automated Action",
    text: "GADI Access Request RITM0034567 has been approved and successful. Notified user Sarah Linhart to confirm resolution. AURA is waiting for confirmation of resolution.",
    statusBadge: { text: "REQUEST SUCCESSFUL", status: "success" },
    meta: [
      { label: "Request No.", value: "RITM0034567" },
      { label: "Status", value: "Waiting for Confirmation" }
    ]
  }
];

export const THREE_STRIKE_CALL_SCRIPT: CopilotStep[] = [
  {
    type: "system",
    subType: "alert",
    heading: "Strike 1 Protocol Initiated",
    text: "Day 1 - Wednesday: Strike 1 initiated due to user inactivity.",
    bullets: [
      "Detected 24 hours of user inactivity on resolved VDI ticket INC2222222",
      "Scanned Microsoft Teams presence API: User is currently in work hours",
      "Dispatched Strike 1 automated email notification via SMTP integration",
      "Enforced 24-hour response window and placed incident file on temporary hold"
    ],
    badge: { text: "Strike 1 Sent", status: "warning" },
    sentiment: 50,
    delay: 2000
  },
  {
    type: "system",
    subType: "alert",
    heading: "Strike 2 Protocol Initiated",
    text: "Day 2 - Thursday: Strike 2 protocol activated with continued user silence.",
    bullets: [
      "Inactivity threshold of 24 hours exceeded with no user reply to Strike 1",
      "Re-checked Active Directory & Teams status: User remains active",
      "Dispatched Strike 2 email notification warning of impending closure",
      "Incremented hold window to 48 hours under corporate SLA compliance policy"
    ],
    badge: { text: "Strike 2 Sent", status: "warning" },
    sentiment: 50,
    delay: 4000
  },
  {
    type: "system",
    subType: "alert",
    heading: "Strike 2 Protocol Continuation",
    text: "Day 3 - Friday: Continuing Strike 2 monitoring checklist.",
    bullets: [
      "Strike 2: 24-hour checkmark reached, user reply still pending",
      "Maintained Strike 2 status, leaving 24 hours remaining in active countdown",
      "Queued weekend protection mechanism to pause countdown automatically"
    ],
    badge: { text: "Strike 2 On Hold", status: "warning" },
    sentiment: 50,
    delay: 4000
  },
  {
    type: "system",
    subType: "watchdog",
    heading: "Weekend Standby",
    text: "Day 4 - Saturday: Weekend standby mode is active.",
    bullets: [
      "SLA detected calendar weekend: Saturday standby active",
      "Enforced corporate weekend protection rules: Paused active countdown timer",
      "Preserved Strike 2 status with exactly 24 active hours remaining",
      "Suppressed all outbound email triggers to prevent weekend user disturbance"
    ],
    badge: { text: "Weekend Standby", status: "info" },
    sentiment: 50,
    delay: 4500
  },
  {
    type: "system",
    subType: "watchdog",
    heading: "Weekend Standby",
    text: "Day 5 - Sunday: Weekend standby mode remains active.",
    bullets: [
      "SLA watchdog active: Sunday weekend standby rules enforced",
      "Strike 2 countdown remains safely frozen at 24 active hours",
      "Automated monitoring continues checks of background ticket updates",
      "Prepared sequence resume routine scheduled for Monday morning 08:00"
    ],
    badge: { text: "Weekend Standby", status: "info" },
    sentiment: 50,
    delay: 4500
  },
  {
    type: "system",
    subType: "alert",
    heading: "Strike 2 Resume",
    text: "Day 6 - Monday: Resuming Strike 2 active timer.",
    bullets: [
      "Transitioned out of weekend standby: Resumed active countdown at 08:00",
      "Polled user presence: Working status active with no ticket feedback",
      "Resumed final 24-hour countdown of Strike 2",
      "Pre-scheduled final Strike 3 trigger for Tuesday morning"
    ],
    badge: { text: "Strike 2 Active", status: "warning" },
    sentiment: 50,
    delay: 4000
  },
  {
    type: "system",
    subType: "watchdog",
    heading: "Out of Office (OOO) Detection",
    text: "Day 7 - Tuesday: Smart pause triggered due to active Out of Office status.",
    bullets: [
      "System scanned Teams calendar and detected active Out of Office (OOO) auto-reply",
      "Enforced smart OOO protection: Instantly paused Strike 3 queue",
      "Extended ticket on-hold status for an additional 24 hours",
      "Scheduled check for user return-to-office status on Wednesday"
    ],
    badge: { text: "OOO Hold", status: "info" },
    sentiment: 50,
    delay: 5000
  },
  {
    type: "system",
    subType: "alert",
    heading: "Strike 3 Protocol Initiated",
    text: "Day 8 - Wednesday: Final Strike 3 protocol activated.",
    bullets: [
      "Confirmed user returned from Out of Office status (Active status verified)",
      "Dispatched final Strike 3 notification via email and Teams DM bot",
      "Warned user of automated ticket closure within 24 hours under corporate policy",
      "Enforced final 24-hour response window before auto-close sequence execution"
    ],
    badge: { text: "Strike 3 Sent", status: "fail" },
    sentiment: 50,
    delay: 4500
  },
  {
    type: "system",
    subType: "success",
    heading: "Auto Ticket Closure",
    text: "Day 9 - Thursday: Auto ticket closure executed under the 3-strike policy.",
    bullets: [
      "Final 24-hour response window elapsed with zero contact",
      "Issued automated ticket closure summary notification to user and manager",
      "Updated incident record status to 'Closed' in system of record",
      "Logged compliance standard resolution code under Gilead 3-Strike Policy: KB0012278"
    ],
    badge: { text: "Ticket Closed", status: "pass" },
    sentiment: 10,
    delay: 3500
  }
];
