import React, { useEffect, useRef } from "react";

interface MicVisualizerProps {
  isListening?: boolean;
  isSpeaking?: boolean;
}

export default function MicVisualizer({ isListening = false, isSpeaking = false }: MicVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioDataRef = useRef({ volume: 0, bass: 0, mid: 0, treble: 0 });
  
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Effect to manage microphone audio capturing
  useEffect(() => {
    if (!isListening) {
      // Cleanup audio stream and context
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      analyserRef.current = null;
      return;
    }

    let active = true;

    async function initAudio() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;
      } catch (err) {
        console.warn("Could not access microphone for live visualizer:", err);
      }
    }

    initAudio();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isListening]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return;

    // Vertex Shader
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader with multi-layered polar simplex noise reacting to frequency bands
    const fsSource = `
      precision highp float;
      varying vec2 v_texCoord;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_volume;
      uniform float u_bass;
      uniform float u_mid;
      uniform float u_treble;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 a0 = x - floor(x + 0.5);
          vec3 g = a0 * vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw));
          float n = 130.0 * dot(m, h*h*h + g);
          return n;
      }

      void main() {
          vec2 uv = v_texCoord;
          vec2 center = vec2(0.5, 0.5);
          
          vec2 toCenter = uv - center;
          float dist = length(toCenter);
          float angle = atan(toCenter.y, toCenter.x);
          
          // Base fluid boundary radius (increased from 0.24 to 0.35 for a much larger liquid orb)
          float baseRadius = 0.35;
          
          // Dynamic time-based color phase blending (dissolves between Blue, Purple, and Neon smoothly)
          float tCycle = u_time * 0.5; // continuous slow phase transition
          
          float wBlue   = clamp(sin(tCycle) * 0.5 + 0.5, 0.0, 1.0);
          float wPurple = clamp(sin(tCycle + 2.094) * 0.5 + 0.5, 0.0, 1.0); // 120 deg offset
          float wNeon   = clamp(sin(tCycle + 4.188) * 0.5 + 0.5, 0.0, 1.0); // 240 deg offset
          float totalW  = wBlue + wPurple + wNeon;
          
          wBlue /= totalW;
          wPurple /= totalW;
          wNeon /= totalW;
          
          // Palettes:
          // 1. Blue Palette (deep royal blue to celestial cyan-blue)
          vec3 blue1 = vec3(0.02, 0.15, 0.85);
          vec3 blue2 = vec3(0.00, 0.50, 1.00);
          
          // 2. Purple Palette (indigo-purple to neon magenta-pink)
          vec3 purple1 = vec3(0.50, 0.05, 0.85);
          vec3 purple2 = vec3(0.90, 0.10, 0.50);
          
          // 3. Neon Palette (neon teal/mint to neon green/lime)
          vec3 neon1 = vec3(0.00, 0.90, 0.70);
          vec3 neon2 = vec3(0.40, 0.95, 0.10);
          
          // Mix target colors using the smooth phase weights
          vec3 activeCol1 = blue1 * wBlue + purple1 * wPurple + neon1 * wNeon;
          vec3 activeCol2 = blue2 * wBlue + purple2 * wPurple + neon2 * wNeon;
          
          // Layer 1: Bass-heavy outer fluid blob
          float nCoord1 = angle * 1.5;
          float wave1 = snoise(vec2(cos(nCoord1), sin(nCoord1)) * 1.2 + u_time * 0.9) * (0.02 + u_bass * 0.12);
          float r1 = baseRadius + wave1 + (u_volume * 0.04) + sin(u_time * 1.5) * 0.008;
          float alpha1 = smoothstep(r1, r1 - 0.03 - u_volume * 0.01, dist);
          vec3 col1 = mix(activeCol1, activeCol2, uv.y);
          
          // Layer 2: Mid-range fluid blob (rotated & shifted frequency)
          float angle2 = angle + 2.094;
          float nCoord2 = angle2 * 2.5;
          float wave2 = snoise(vec2(cos(nCoord2), sin(nCoord2)) * 1.8 - u_time * 1.4) * (0.015 + u_mid * 0.10);
          float r2 = (baseRadius * 0.9) + wave2 + (u_volume * 0.05) + cos(u_time * 1.1) * 0.01;
          float alpha2 = smoothstep(r2, r2 - 0.025 - u_volume * 0.01, dist);
          vec3 col2 = mix(activeCol2, activeCol1 * 0.8, uv.x);
          
          // Layer 3: Treble-reactive overlay (rotated & rapid frequency)
          float angle3 = angle - 2.094;
          float nCoord3 = angle3 * 4.5;
          float wave3 = snoise(vec2(cos(nCoord3), sin(nCoord3)) * 3.0 + u_time * 2.1) * (0.01 + u_treble * 0.08);
          float r3 = (baseRadius * 0.82) + wave3 + (u_volume * 0.04) + sin(u_time * 2.0) * 0.006;
          float alpha3 = smoothstep(r3, r3 - 0.02 - u_volume * 0.005, dist);
          vec3 col3 = mix(activeCol2 * 1.1, activeCol1, uv.y + uv.x - 0.5);
          
          // Composite layers using alpha blending to build a rich organic fluid entity
          vec4 composite = vec4(0.0);
          composite = mix(composite, vec4(col1, alpha1), alpha1 * 0.75);
          composite = mix(composite, vec4(col2, alpha2), alpha2 * 0.65);
          composite = mix(composite, vec4(col3, alpha3), alpha3 * 0.80);
          
          // Calculate max dynamic radius of the composite fluid blob for the overall atmospheric outer glow
          float maxRadius = max(max(r1, r2), r3);
          float glowSoftness = 10.0 - (u_volume * 3.5);
          float outerGlow = exp(-(dist - maxRadius * 0.45) * glowSoftness) * (0.35 + u_volume * 0.55);
          outerGlow = clamp(outerGlow, 0.0, 1.0);
          
          // Shift atmospheric glow color naturally matching the current active phase
          vec3 glowColor = mix(activeCol1, activeCol2, 0.5) * outerGlow * 1.3;
          
          composite.rgb += glowColor;
          composite.a = max(composite.a, outerGlow * 0.50);
          
          gl_FragColor = composite;
      }
    `;

    // Helper to compile shaders
    const createShader = (glContext: WebGLRenderingContext, type: number, source: string) => {
      const shader = glContext.createShader(type);
      if (!shader) return null;
      glContext.shaderSource(shader, source);
      glContext.compileShader(shader);
      if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        console.error("Shader compile error:", glContext.getShaderInfoLog(shader));
        glContext.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Buffer setting
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uVolume = gl.getUniformLocation(program, "u_volume");
    const uBass = gl.getUniformLocation(program, "u_bass");
    const uMid = gl.getUniformLocation(program, "u_mid");
    const uTreble = gl.getUniformLocation(program, "u_treble");

    let animationFrameId: number;
    const render = (timestamp: number) => {
      // Sync canvas size
      const width = canvas.clientWidth || 350;
      const height = canvas.clientHeight || 350;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      // Live microphone signal analysis
      if (isListening && analyserRef.current) {
        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        let total = 0;
        let bassTotal = 0;
        let midTotal = 0;
        let trebleTotal = 0;

        const bassCount = Math.max(1, Math.floor(bufferLength * 0.15));
        const midCount = Math.max(1, Math.floor(bufferLength * 0.45));

        for (let i = 0; i < bufferLength; i++) {
          const val = dataArray[i];
          total += val;

          if (i < bassCount) {
            bassTotal += val;
          } else if (i < bassCount + midCount) {
            midTotal += val;
          } else {
            trebleTotal += val;
          }
        }

        const avgVolume = total / bufferLength / 255;
        const avgBass = bassTotal / bassCount / 255;
        const avgMid = midTotal / midCount / 255;
        const avgTreble = trebleTotal / (bufferLength - bassCount - midCount) / 255;

        // Smooth transition damping
        const lerpFactor = 0.25;
        audioDataRef.current.volume += (avgVolume - audioDataRef.current.volume) * lerpFactor;
        audioDataRef.current.bass += (avgBass - audioDataRef.current.bass) * lerpFactor;
        audioDataRef.current.mid += (avgMid - audioDataRef.current.mid) * lerpFactor;
        audioDataRef.current.treble += (avgTreble - audioDataRef.current.treble) * lerpFactor;
      } else {
        // Continuous fluid organic motion when idle
        const t = timestamp * 0.0015;
        const speechOsc = isSpeaking ? (Math.sin(t * 8.0) * Math.cos(t * 3.1) * 0.5 + 0.5) : 0.0;
        
        const simulatedVolume = (0.06 + 0.05 * Math.sin(t * 1.4)) + (isSpeaking ? (0.2 + 0.15 * speechOsc) : 0.0);
        const simulatedBass = (0.08 + 0.07 * Math.sin(t * 1.1 + 0.5)) + (isSpeaking ? (0.25 + 0.2 * speechOsc) : 0.0);
        const simulatedMid = (0.06 + 0.05 * Math.sin(t * 1.6 + 1.2)) + (isSpeaking ? (0.18 + 0.15 * speechOsc) : 0.0);
        const simulatedTreble = (0.04 + 0.03 * Math.sin(t * 2.2 + 2.0)) + (isSpeaking ? (0.12 + 0.1 * speechOsc) : 0.0);

        const lerpFactor = isSpeaking ? 0.18 : 0.08;
        audioDataRef.current.volume += (simulatedVolume - audioDataRef.current.volume) * lerpFactor;
        audioDataRef.current.bass += (simulatedBass - audioDataRef.current.bass) * lerpFactor;
        audioDataRef.current.mid += (simulatedMid - audioDataRef.current.mid) * lerpFactor;
        audioDataRef.current.treble += (simulatedTreble - audioDataRef.current.treble) * lerpFactor;
      }

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uTime, timestamp * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      
      // Update audio parameters inside WebGL
      if (uVolume) gl.uniform1f(uVolume, audioDataRef.current.volume);
      if (uBass) gl.uniform1f(uBass, audioDataRef.current.bass);
      if (uMid) gl.uniform1f(uMid, audioDataRef.current.mid);
      if (uTreble) gl.uniform1f(uTreble, audioDataRef.current.treble);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isListening, isSpeaking]);

  return (
    <div id="mic-visualizer-container" className="absolute inset-0 w-full h-full mix-blend-screen opacity-90 pointer-events-none">
      <canvas
        id="shader-canvas-ANIMATION_7"
        ref={canvasRef}
        className="block w-full h-full animate-fade-in"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
