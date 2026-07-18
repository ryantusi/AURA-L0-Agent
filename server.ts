import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";

const app = express();
const PORT = 3000;

app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY || "sk_8e608a65877fc06789698b83d7f12b2793acf08cb31ee3b4";
const DEFAULT_VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // George

interface VoiceProfile {
  spectralVector: number[];
  avgPitch: number;
  pitchSD: number;
  text: string;
}
let enrolledProfile: VoiceProfile | null = null;

// Scientific 16-bit WAV parser
function parseWav(buffer: Buffer): { samples: Float32Array; sampleRate: number } {
  const riff = buffer.toString("ascii", 0, 4);
  if (riff !== "RIFF") {
    throw new Error("Invalid WAV file: missing RIFF header");
  }
  
  const wave = buffer.toString("ascii", 8, 12);
  if (wave !== "WAVE") {
    throw new Error("Invalid WAV file: missing WAVE header");
  }
  
  let fmtOffset = -1;
  let dataOffset = -1;
  let dataSize = -1;
  
  let offset = 12;
  while (offset < buffer.length - 8) {
    const chunkId = buffer.toString("ascii", offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    
    if (chunkId === "fmt ") {
      fmtOffset = offset + 8;
    } else if (chunkId === "data") {
      dataOffset = offset + 8;
      dataSize = chunkSize;
      break;
    }
    offset += 8 + chunkSize;
  }
  
  if (fmtOffset === -1 || dataOffset === -1) {
    throw new Error("Invalid WAV file: format or data chunk not found");
  }
  
  const audioFormat = buffer.readUInt16LE(fmtOffset);
  const numChannels = buffer.readUInt16LE(fmtOffset + 2);
  const sampleRate = buffer.readUInt32LE(fmtOffset + 4);
  const bitsPerSample = buffer.readUInt16LE(fmtOffset + 14);
  
  const sampleCount = Math.floor(dataSize / (bitsPerSample / 8));
  const samples = new Float32Array(sampleCount);
  
  if (bitsPerSample === 16) {
    for (let i = 0; i < sampleCount; i++) {
      const byteOffset = dataOffset + i * 2;
      if (byteOffset + 2 <= buffer.length) {
        const val = buffer.readInt16LE(byteOffset);
        samples[i] = val / 32768.0;
      }
    }
  } else if (bitsPerSample === 32) {
    for (let i = 0; i < sampleCount; i++) {
      const byteOffset = dataOffset + i * 4;
      if (byteOffset + 4 <= buffer.length) {
        samples[i] = buffer.readFloatLE(byteOffset);
      }
    }
  } else if (bitsPerSample === 8) {
    for (let i = 0; i < sampleCount; i++) {
      const byteOffset = dataOffset + i;
      if (byteOffset + 1 <= buffer.length) {
        const val = buffer.readUInt8(byteOffset);
        samples[i] = (val - 128) / 128.0;
      }
    }
  } else {
    throw new Error(`Unsupported bits per sample: ${bitsPerSample}`);
  }
  
  if (numChannels === 2) {
    const monoSamples = new Float32Array(sampleCount / 2);
    for (let i = 0; i < monoSamples.length; i++) {
      monoSamples[i] = (samples[i * 2] + samples[i * 2 + 1]) / 2;
    }
    return { samples: monoSamples, sampleRate };
  }
  
  return { samples, sampleRate };
}

// Bit-reversal and Radix-2 Cooley-Tukey FFT
function runFFT(re: Float32Array, im: Float32Array) {
  const n = re.length;
  let j = 0;
  for (let i = 0; i < n; i++) {
    if (i < j) {
      let temp = re[i]; re[i] = re[j]; re[j] = temp;
      temp = im[i]; im[i] = im[j]; im[j] = temp;
    }
    let m = n >> 1;
    while (m >= 1 && j >= m) {
      j -= m;
      m >>= 1;
    }
    j += m;
  }
  for (let len = 2; len <= n; len <<= 1) {
    const angle = -2 * Math.PI / len;
    const wlen_re = Math.cos(angle);
    const wlen_im = Math.sin(angle);
    for (let i = 0; i < n; i += len) {
      let w_re = 1;
      let w_im = 0;
      const half = len >> 1;
      for (let k = 0; k < half; k++) {
        const u_re = re[i + k];
        const u_im = im[i + k];
        const v_idx = i + k + half;
        const v_re = re[v_idx] * w_re - im[v_idx] * w_im;
        const v_im = re[v_idx] * w_im + im[v_idx] * w_re;
        re[i + k] = u_re + v_re;
        im[i + k] = u_im + v_im;
        re[v_idx] = u_re - v_re;
        im[v_idx] = u_im - v_im;
        const next_w_re = w_re * wlen_re - w_im * wlen_im;
        const next_w_im = w_re * wlen_im + w_im * wlen_re;
        w_re = next_w_re;
        w_im = next_w_im;
      }
    }
  }
}

// Autocorrelation fundamental frequency tracker (YIN-like robustness)
function detectPitchAutocorrelation(samples: Float32Array, sampleRate: number): number[] {
  const frameSize = 1024;
  const hopSize = 512;
  const pitches: number[] = [];
  
  const minLag = Math.floor(sampleRate / 400); // 400Hz max pitch
  const maxLag = Math.floor(sampleRate / 50);  // 50Hz min pitch
  
  for (let offset = 0; offset + frameSize <= samples.length; offset += hopSize) {
    const frame = samples.subarray(offset, offset + frameSize);
    
    let rms = 0;
    for (let i = 0; i < frame.length; i++) {
      rms += frame[i] * frame[i];
    }
    rms = Math.sqrt(rms / frame.length);
    if (rms < 0.015) {
      continue; // Skip silent/whisper regions
    }
    
    let bestLag = -1;
    let bestR = -Infinity;
    
    for (let lag = minLag; lag <= maxLag; lag++) {
      let sum = 0;
      let norm1 = 0;
      let norm2 = 0;
      for (let i = 0; i < frame.length - lag; i++) {
        sum += frame[i] * frame[i + lag];
        norm1 += frame[i] * frame[i];
        norm2 += frame[i + lag] * frame[i + lag];
      }
      const r = sum / (Math.sqrt(norm1 * norm2) || 1.0);
      if (r > bestR) {
        bestR = r;
        bestLag = lag;
      }
    }
    
    if (bestLag !== -1 && bestR > 0.45) {
      const pitch = sampleRate / bestLag;
      if (pitch >= 55 && pitch <= 380) {
        pitches.push(pitch);
      }
    }
  }
  
  return pitches;
}

// Log-Spectral Band Energy Feature Extractor
function extractSpectralFeatures(samples: Float32Array, sampleRate: number): Float32Array {
  const frameSize = 1024;
  const hopSize = 512;
  const numBands = 16;
  const avgSpectralVector = new Float32Array(numBands);
  let totalFrames = 0;
  
  const minFreq = 100;
  const maxFreq = 4000;
  const logMin = Math.log10(minFreq);
  const logMax = Math.log10(maxFreq);
  const bandEdges: number[] = [];
  for (let i = 0; i <= numBands; i++) {
    bandEdges.push(Math.pow(10, logMin + (i / numBands) * (logMax - logMin)));
  }
  
  for (let offset = 0; offset + frameSize <= samples.length; offset += hopSize) {
    const frame = samples.subarray(offset, offset + frameSize);
    
    let rms = 0;
    for (let i = 0; i < frame.length; i++) {
      rms += frame[i] * frame[i];
    }
    rms = Math.sqrt(rms / frame.length);
    if (rms < 0.015) continue;
    
    const re = new Float32Array(frameSize);
    const im = new Float32Array(frameSize);
    for (let i = 0; i < frameSize; i++) {
      const hamming = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (frameSize - 1));
      re[i] = frame[i] * hamming;
    }
    
    runFFT(re, im);
    
    const frameBands = new Float32Array(numBands);
    for (let bin = 0; bin < frameSize / 2; bin++) {
      const freq = (bin * sampleRate) / frameSize;
      if (freq < minFreq || freq > maxFreq) continue;
      
      const magnitude = Math.sqrt(re[bin] * re[bin] + im[bin] * im[bin]);
      for (let b = 0; b < numBands; b++) {
        if (freq >= bandEdges[b] && freq < bandEdges[b + 1]) {
          frameBands[b] += magnitude;
          break;
        }
      }
    }
    
    for (let b = 0; b < numBands; b++) {
      avgSpectralVector[b] += Math.log10(frameBands[b] + 1e-5);
    }
    totalFrames++;
  }
  
  if (totalFrames > 0) {
    for (let b = 0; b < numBands; b++) {
      avgSpectralVector[b] /= totalFrames;
    }
  }
  
  let sumSq = 0;
  for (let b = 0; b < numBands; b++) {
    sumSq += avgSpectralVector[b] * avgSpectralVector[b];
  }
  const l2Norm = Math.sqrt(sumSq) || 1.0;
  for (let b = 0; b < numBands; b++) {
    avgSpectralVector[b] /= l2Norm;
  }
  
  return avgSpectralVector;
}

// Simulated high-fidelity response dictionary for local testing / fallback
function getSimulatedAuraResponse(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes("status") || lower.includes("health") || lower.includes("diagnostic")) {
    return `### **AURA System Diagnostic Report**
*   **Core Nodes**: 24/25 Active
*   **Vulnerability Risk Index**: \`LOW (14%)\`
*   **Anomalies Detected**: 1 Attention Required
    *   *Node-042 Storage Drive* is reaching peak capacity (94%). Outage prediction: **14 hours**.
*   **Recommended Action**: Deploy Preventive Storage Optimization Patch or clear node cache.`;
  }
  if (lower.includes("memory") || lower.includes("leak") || lower.includes("hog") || lower.includes("leak")) {
    return `### **Process Analyzer: Memory Spike Detected**
*   **Target Process**: \`node_service_api\` (PID: \`2419\`)
*   **Virtual Memory Allocation**: \`4.12 GB\` (Unusually high for standard runtime)
*   **Remediation Command**:
    \`\`\`bash
    # Run container process isolation and warm recycle
    aura-cli container recycle --pid 2419 --grace-period 15s
    \`\`\`
*   *Deploying the Memory patch will isolate this process automatically.*`;
  }
  if (lower.includes("latency") || lower.includes("ping") || lower.includes("network") || lower.includes("slow")) {
    return `### **Network Topology Analysis**
*   **API Gateway Jitter**: \`112ms\` (Standard: \`4ms\`)
*   **Bottleneck Identified**: Cloudflare Edge CDN node \`SFO-04\` replication lag.
*   **Recommended Action**: Flush CDN router tables.
    \`\`\`bash
    aura-cli edge flush-cdn --region sfo-04
    \`\`\``;
  }
  if (lower.includes("reboot") || lower.includes("restart") || lower.includes("shutdown")) {
    return `### **Container Restart Warning**
*   **Target**: App cluster pods \`pod-app-7a9b\`
*   **Grace Period**: 30 seconds.
*   **Warning**: Active users (18 users) will be soft-migrated to backup pods without state disruption.
*   **Command**:
    \`\`\`bash
    aura-cli cluster restart --pod pod-app-7a9b --migrate-sessions
    \`\`\``;
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("aura")) {
    return `### **AURA L0 Agent Initialized**
I am AURA, your enterprise-tier level-0 intelligence operator. I monitor fleet-wide diagnostics, self-heal cloud infrastructure, and format high-context escalations. 
*   How can I assist your team today? Try asking about **"system status"**, **"memory leak PID"**, or **"network latency bottlenecks"**.`;
  }

  return `### **AURA L0 Operator Analysis**
Query received: *"#${prompt}"*
Analysis matches standard cloud infrastructure paradigms. Recommended operations:
1. Run **System Diagnostics** in the Control Panel.
2. If this is an active incident, trigger **Intelligent Escalation** to compile logs.
3. Chat with me regarding specific error codes or log files.
4. Issue commands like \`aura-cli help\` to inspect options.`;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Serve assets for download securely
app.get("/api/download/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const allowedFiles: Record<string, string> = {
    "AURA_Whitepaper.docx": "AURA_Whitepaper.docx",
    "AURA_Presentation.pptx": "AURA_Presentation.pptx",
    "Ticket_Analysis_Master.xlsx": "Ticket_Analysis_Master.xlsx",
    "AURA_Prototype.docx": "AURA_Prototype.docx"
  };

  const actualFile = allowedFiles[fileName];
  if (!actualFile) {
    return res.status(404).json({ error: "File not found" });
  }

  const filePath = path.join(process.cwd(), "assets", actualFile);
  res.download(filePath, actualFile, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error downloading file" });
      }
    }
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      // Simulate AURA response if API key is not configured
      const lastUserMessage = messages[messages.length - 1]?.parts?.[0]?.text || "";
      const simulatedResponse = getSimulatedAuraResponse(lastUserMessage);
      return res.json({
        text: simulatedResponse,
        isSimulated: true
      });
    }

    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: messages,
      config: {
        systemInstruction: `You are AURA, an ultra-advanced, enterprise-grade AI-native L0 IT Support Operator.
Your personality is professional, hyper-focused, cinematic, and direct. Keep your responses precise, razor-sharp, and highly actionable.
You speak about Docker, Kubernetes, database replication lag, network routing, AWS, node memory leaks, and telemetry.
Always use markdown formatting. Include CLI examples or code blocks where appropriate.
Keep responses concise (max 180 words) to respect the screen boundaries. Avoid robotic introductory or closing fluff.`,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API error in /api/chat:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// ELEVENLABS AUDIO ENDPOINTS

// 1. Text to Speech (TTS)
app.post("/api/tts", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${DEFAULT_VOICE_ID}`, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_LABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_v3",
        output_format: "mp3_44100_128",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("ElevenLabs TTS error details:", errText);
      return res.status(response.status).json({ error: `ElevenLabs TTS Error: ${errText}` });
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
    });
    res.send(audioBuffer);
  } catch (error: any) {
    console.error("TTS endpoint error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// 2. Speech to Text (STT)
app.post("/api/stt", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
    formData.append("file", blob, req.file.originalname || "audio.webm");
    formData.append("model_id", "scribe_v1"); // scribe_v1 is highly optimized for fast transcription

    const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_LABS_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("ElevenLabs STT error details:", errText);
      return res.status(response.status).json({ error: `ElevenLabs STT Error: ${errText}` });
    }

    const data = await response.json();
    res.json({ text: data.text || "" });
  } catch (error: any) {
    console.error("STT endpoint error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// 3. Voice Enroll
app.post("/api/voice/enroll", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    // 1. Get STT Transcription
    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: "audio/wav" });
    formData.append("file", blob, "audio.wav");
    formData.append("model_id", "scribe_v1");

    let text = "";
    try {
      const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
        method: "POST",
        headers: {
          "xi-api-key": ELEVEN_LABS_API_KEY,
        },
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        text = data.text || "";
      } else {
        const errText = await response.text();
        console.warn("STT during voice enrollment warned:", errText);
      }
    } catch (sttError) {
      console.error("STT failed during enrollment, fallback to acoustic only:", sttError);
    }

    // 2. Extract Acoustic Features
    const { samples, sampleRate } = parseWav(req.file.buffer);
    const pitches = detectPitchAutocorrelation(samples, sampleRate);
    
    let avgPitch = 0;
    let pitchSD = 0;
    if (pitches.length > 0) {
      const sum = pitches.reduce((a, b) => a + b, 0);
      avgPitch = sum / pitches.length;
      
      const sqDiffSum = pitches.reduce((a, b) => a + Math.pow(b - avgPitch, 2), 0);
      pitchSD = Math.sqrt(sqDiffSum / pitches.length);
    }
    
    const spectralVector = Array.from(extractSpectralFeatures(samples, sampleRate));

    // 3. Save profile in-memory
    enrolledProfile = {
      spectralVector,
      avgPitch,
      pitchSD,
      text: text,
    };

    console.log("[AURA Voice Enroll] Saved voice profile:", {
      avgPitch,
      pitchSD,
      spectralVectorSize: spectralVector.length,
      text
    });

    res.json({ status: "enrolled", text });
  } catch (error: any) {
    console.error("Voice Enroll error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// 4. Voice Verify
app.post("/api/voice/verify", upload.single("audio"), async (req, res) => {
  try {
    if (!enrolledProfile) {
      return res.status(400).json({ error: "No voice profile enrolled yet." });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    // 1. Get STT Transcription
    const formData = new FormData();
    const blob = new Blob([req.file.buffer], { type: "audio/wav" });
    formData.append("file", blob, "audio.wav");
    formData.append("model_id", "scribe_v1");

    let text = "";
    try {
      const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
        method: "POST",
        headers: {
          "xi-api-key": ELEVEN_LABS_API_KEY,
        },
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        text = data.text || "";
      }
    } catch (sttError) {
      console.error("STT failed during verification:", sttError);
    }

    // 2. Extract Acoustic Features
    const { samples, sampleRate } = parseWav(req.file.buffer);
    const pitches = detectPitchAutocorrelation(samples, sampleRate);
    
    let avgPitch = 0;
    let pitchSD = 0;
    if (pitches.length > 0) {
      const sum = pitches.reduce((a, b) => a + b, 0);
      avgPitch = sum / pitches.length;
      
      const sqDiffSum = pitches.reduce((a, b) => a + Math.pow(b - avgPitch, 2), 0);
      pitchSD = Math.sqrt(sqDiffSum / pitches.length);
    }
    
    const spectralVector = extractSpectralFeatures(samples, sampleRate);

    // 3. Compute speaker comparison logic
    // A. Timbre Cosine Similarity (Dot product of L2-normalized vectors)
    let timbreScore = 0;
    for (let i = 0; i < 16; i++) {
      timbreScore += enrolledProfile.spectralVector[i] * spectralVector[i];
    }
    if (timbreScore < 0) timbreScore = 0;

    // B. Pitch Similarity
    let pitchScore = 1.0;
    if (enrolledProfile.avgPitch > 0 && avgPitch > 0) {
      const diff = Math.abs(enrolledProfile.avgPitch - avgPitch);
      const max = Math.max(enrolledProfile.avgPitch, avgPitch);
      pitchScore = 1.0 - (diff / max);
    } else if (enrolledProfile.avgPitch > 0 || avgPitch > 0) {
      pitchScore = 0.3; // One has voiced signal, the other doesn't
    }

    // C. Intonation / Pitch Standard Deviation Similarity
    let sdScore = 1.0;
    if (enrolledProfile.pitchSD > 0 && pitchSD > 0) {
      const diff = Math.abs(enrolledProfile.pitchSD - pitchSD);
      const max = Math.max(enrolledProfile.pitchSD, pitchSD, 1.0);
      sdScore = 1.0 - (diff / max);
    }

    // Weighted overall similarity
    let similarity = (timbreScore * 0.45) + (pitchScore * 0.45) + (sdScore * 0.10);

    // D. Strict penalty for massive pitch ratio difference (e.g., > 25% difference)
    if (enrolledProfile.avgPitch > 0 && avgPitch > 0) {
      const ratio = Math.max(enrolledProfile.avgPitch, avgPitch) / Math.min(enrolledProfile.avgPitch, avgPitch);
      if (ratio > 1.25) {
        similarity *= 0.6; // Massive penalty for pitch mismatch (different speakers)
      }
    }

    // Convert to percentage (75% standard match threshold)
    let confidence_pct = Math.round(similarity * 100);
    if (confidence_pct > 99) confidence_pct = 99;
    if (confidence_pct < 10) confidence_pct = 12;

    const MATCH_THRESHOLD = 75;
    const match = confidence_pct >= MATCH_THRESHOLD;

    console.log("[AURA Voice Verify] Verification details:", {
      enrolledPitch: enrolledProfile.avgPitch,
      newPitch: avgPitch,
      enrolledPitchSD: enrolledProfile.pitchSD,
      newPitchSD: pitchSD,
      timbreSimilarity: timbreScore,
      weightedSimilarity: similarity,
      confidence_pct,
      match,
      text
    });

    res.json({
      confidence: confidence_pct,
      match: match,
      text: text
    });
  } catch (error: any) {
    console.error("Voice Verify error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// 5. Voice Reset
app.post("/api/voice/reset", (req, res) => {
  enrolledProfile = null;
  res.json({ status: "reset" });
});

// Configure Vite or Static files depending on environment
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[AURA Server] Operating at http://localhost:${PORT}`);
  });
}

setupViteOrStatic();
