# AURA: The L0 Agent
**CIS Gilead Ideathon 2026 Prototype**

> Live Demo Deployed: https://aura-l0-agent.onrender.com/

AURA is an adaptive AI-powered voice and non-voice operational intelligence platform that introduces the L0 Autonomous Support Layer for Enterprise IT. It autonomously resolves infrastructure incidents at first contact, remediates endpoint issues, eliminates manual ticket documentation, intelligently routes complex cases to skill-matched engineers with complete context, supports human L1/L2 agents, and proactively predicts and prevents recurring or major P1/P2 incidents before users are impacted.

This prototype was built using **React 18**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Express**, with full-stack integrations including **ElevenLabs TTS/STT** for AI Voice.

---

## 🚀 Quick Start Guide (Local Setup)

Follow these simple steps to run this project on your local machine using VS Code.

### Prerequisites
- **Node.js**: Ensure you have Node.js (version 18 or higher) installed. Download it from [nodejs.org](https://nodejs.org/).
- **IDE**: VSCode - Recommended code editor for editing and debugging.

---

### Step 1: Install Dependencies
Open your project folder in VS Code, open a new terminal (`Ctrl + \`` or `Cmd + \``), and run:
```bash
npm install
```
This command downloads all necessary client and server libraries defined in `package.json` into a local `node_modules` folder.

---

### Step 2: Configure Environment Variables
1. Create the file `.env`
2. Open the `.env` file and fill in your keys:

```env
# 1. Local URL (For self-referential routing)
APP_URL="http://localhost:3000"

# 2. ElevenLabs API Key (For Voice Registration, Verification, and TTS speaking)
# Get an API key at: https://elevenlabs.io/
# (A placeholder key is pre-configured, but you should replace it with your own)
ELEVEN_LABS_API_KEY="your_actual_eleven_labs_api_key_here"
```

---

### Step 3: Run the Application (Development Mode)
To launch the backend server with dynamic hot-reloading (Vite middleware), run:
```bash
npm run dev
```

You should see output similar to:
```text
[AURA Server] Operating at http://localhost:3000
```
Open your web browser and navigate to **`http://localhost:3000`** to experience the app!

---

### Step 4: Run the Application (Production Mode)
To compile the React frontend and bundle the Express backend into a single, optimized file:
```bash
# 1. Build the frontend and backend assets
npm run build

# 2. Start the optimized server
npm start
```

---

## 🛠️ File and Folder Structure Explained

```text
├── assets/                  # Physical assets (presentations, spreadsheets, logo SVGs)
├── dist/                    # Compiled production build directory (generated during build)
├── src/
│   ├── components/          # React layout components
│   │   ├── AuraLogo.tsx             # Interactive Canvas-based pulsing energy orb
│   │   ├── AutonomousMode.tsx       # Mode 1: Voice call simulations & transcripts
│   │   ├── CopilotMode.tsx          # Mode 3: Call logging & chat helper panel
│   │   ├── EscalationMode.tsx       # Mode 2: Multi-agent routing & ticket generator
│   │   ├── LandingPage.tsx          # Main gateway, voice enrollment portal, documentation
│   │   ├── MicVisualizer.tsx        # Captivating particle animation for active recording
│   │   ├── PredictiveMode.tsx       # Mode 4: Remote remediation & lockout monitor
│   │   ├── Sidebar.tsx              # Clean dark-themed side navigation rail
│   │   └── TutorialWalkthrough.tsx  # Step-by-step interactive onboarding overlays
│   ├── App.tsx              # Core app shell, global states, voice recorder orchestration
│   ├── data.ts              # Simulated dialogues, rosters, metrics, and evidence models
│   ├── index.css            # Global CSS, font configuration, and custom Tailwind styles
│   ├── main.tsx             # React DOM application mounting point
│   ├── types.ts             # TypeScript interface and enum structures
│   └── utils.ts             # Tailwind class merges (clsx + tailwind-merge)
├── .env.example             # Blueprint outlining required API credentials
├── index.html               # Main entry HTML document
├── package.json             # Build commands, package configurations, and dependencies
├── server.ts                # Express backend containing FFT analysis, DSP algorithms, and API endpoints
├── tsconfig.json            # TypeScript build rules configuration
└── vite.config.ts           # Bundler options and asset routing definitions
```

---

## 🌟 Prototype Features & Walkthrough

The prototype includes an immersive, multi-layered dashboard covering 4 core support modes:

### 🎙️ The Voice Gateway (Landing Portal)
- **Voice Biometric Registration**: Click on the main energy orb to register your voice. AURA will prompt you to speak for 10 seconds.
- **WAV Audio Transformation**: The recorded WebM stream is converted directly into a clean 16kHz WAV file.
- **DSP Voice Verification**: Click the orb again to verify. The Express backend runs a **Fast Fourier Transform (FFT)** and an **Autocorrelation (YIN-like) Pitch Tracker** to extract your vocal features (Spectral envelope vector, Average pitch, and Pitch Standard Deviation). It compares the profile using timbre cosine similarity and awards access if confidence exceeds **75%**.
- **ElevenLabs Speech Synthesis**: Text-to-speech instructions guide the user through enrollment, registration, and confirmation.

### 🤖 Mode 1: Autonomous Resolution (Level 0 Voice)
- Simulates a fully automated support call where AURA interacts directly with an end-user.
- Supports two simulated scripts: **"Validated Case"** (successful self-healing troubleshooting) and **"Failed Case"** (AURA identifies a complex issue and prepares for escalation).
- Real-time voice simulation dynamically generated by **ElevenLabs TTS** updates visual dialogue steps as the audio plays.

### 📁 Mode 2: Intelligent Escalation (The Bridge)
- Simulates compiling rich incident logs (ServiceNow notes, terminal outputs, and chat histories) when L0 self-healing cannot solve the issue.
- Initiates an active scan of the Tier-1 roster, finds an optimal assignee (e.g., Mohammed Fawaz), creates a ticket, and generates a detailed briefing.

### 🤝 Mode 3: Active L0 Co-Pilot (Agent Dashboard)
- Demonstrates three operational sub-modes:
  1. **L1 Outbound**: AURA prompts the customer via automated outreach.
  2. **L2 Warm Transfer**: Telemetry and context are seamlessly handed over to a senior support agent.
  3. **Three-Strike Rule**: Non-responsive ticket progression triggers automated compliance closures.
- Tracks real-time customer sentiment ratings, timelines, action items, and live call transcripts side-by-side.

### 🧠 Mode 4: Predictive Operations (Self-Healing)
- Monitors active client lockouts and latency incidents.
- Click **"Push Nexthink Remote Action"** to trigger a real-time self-healing simulation.
- Watch progress bars resolve high-utilization memory processes, flush CDN nodes, and dynamically create ServiceNow tickets, showing real-time notifications for both the user and IT team.

---

## 🔑 Under the Hood: Key Algorithms & Technologies

### 1. Radix-2 Cooley-Tukey FFT & Pitch Detection
To enable local, secure biometric verification without needing expensive external servers, `/server.ts` implements raw DSP (Digital Signal Processing) algorithms:
- **Bit-reversal & FFT**: Converts standard raw WAV amplitude arrays into spectral magnitudes.
- **Autocorrelation (Pitch Tracking)**: Estimates fundamental frequencies between 50Hz and 400Hz, skipping silent or whisper regions by computing Root Mean Square (RMS) energy.
- **Voice Profile Matching**: Combines Timbre Cosine Similarity (45% weight), Pitch Similarity (45% weight), and Intonation Similarity (10% weight) with strict penalties for massive vocal pitch differences.

### 2. Vite Integration with Express
During development, the Express backend serves as the single source of truth, mounting Vite's HMR middleware directly. In production, Express switches to serving optimized static chunks from the `dist/` directory, ensuring consistent rendering performance.

---

## Acknowledgement

| Channel | Details |
|---|---|
| Company | Cognizant Technology Solutions |
| Client | Gilead Sciences Inc |
| Name | Ryan Ahmed Tusi - 2485906 |
| Event | CIS Gilead Ideathon 2026 - AIOps Theme |

---