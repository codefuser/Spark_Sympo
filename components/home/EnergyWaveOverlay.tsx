"use client";

import React, { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

interface LightningArc {
  points: Point[];
  alpha: number;
  decay: number;
  width: number;
  color: string;
}

export function EnergyWaveOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let startTime = performance.now();

    // Lightning arcs state for right-side electricity towers & motor
    let lightningArcs: LightningArc[] = [];
    let lastLightningTime = 0;

    // Handle high-DPI scaling & resize
    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(width * dpr, 1);
      canvas.height = Math.max(height * dpr, 1);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    // Generate procedural jagged lightning path
    const createLightningBranch = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      displacement: number
    ): Point[] => {
      const points: Point[] = [{ x: x1, y: y1 }];
      const subDivide = (p1: Point, p2: Point, disp: number) => {
        if (disp < 5) {
          points.push(p2);
          return;
        }
        const midX = (p1.x + p2.x) / 2 + (Math.random() - 0.5) * disp;
        const midY = (p1.y + p2.y) / 2 + (Math.random() - 0.5) * disp;
        const mid: Point = { x: midX, y: midY };
        subDivide(p1, mid, disp * 0.52);
        subDivide(mid, p2, disp * 0.52);
      };
      subDivide({ x: x1, y: y1 }, { x: x2, y: y2 }, displacement);
      return points;
    };

    // Render loop
    const render = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(render);
      if (width === 0 || height === 0) return;

      const elapsed = (currentTime - startTime) * 0.001; // in seconds

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "screen";

      // -------------------------------------------------------------
      // PULSE CYCLES (Normal → Bright → Normal → Bright)
      // -------------------------------------------------------------
      const cyanPulse = 0.65 + 0.35 * Math.sin(elapsed * 1.8);
      const orangePulse = 0.65 + 0.35 * Math.sin(elapsed * 1.8 + 1.2);
      const microJitter = 1 + (Math.random() - 0.5) * 0.08;

      // -------------------------------------------------------------
      // 1. LEFT SIDE: BLUE / CYAN OSCILLATING ELECTRICAL WAVE
      // Around the circuit-board & processor (x: 12% to 52%, y: 40% to 62%)
      // -------------------------------------------------------------
      const cyanStartX = width * 0.14;
      const cyanStartY = height * 0.52;
      const cyanMidX = width * 0.33;
      const cyanMidY = height * 0.44;
      const cyanEndX = width * 0.51;
      const cyanEndY = height * 0.55;

      // Sample 60 points along the dynamic electrical wave
      const cyanSamples = 60;
      const cyanPoints: Point[] = [];
      const cyanPointsHarmonic: Point[] = [];

      for (let i = 0; i <= cyanSamples; i++) {
        const t = i / cyanSamples;
        // Base quadratic bezier curve
        const bx = (1 - t) * (1 - t) * cyanStartX + 2 * (1 - t) * t * cyanMidX + t * t * cyanEndX;
        const by = (1 - t) * (1 - t) * cyanStartY + 2 * (1 - t) * t * cyanMidY + t * t * cyanEndY;

        // Oscillations: Left-to-right travelling electrical wave + vertical harmonic undulation
        const envelope = Math.sin(t * Math.PI); // Pin ends, maximum in middle
        const wave1 = Math.sin(t * Math.PI * 4 - elapsed * 3.2) * 14 * envelope;
        const wave2 = Math.cos(t * Math.PI * 2.5 + elapsed * 1.4) * 8 * envelope;

        cyanPoints.push({
          x: bx + Math.cos(t * Math.PI * 3 + elapsed * 2) * 4 * envelope,
          y: by + wave1 + wave2,
        });

        // Harmonic secondary wave (slightly offset in frequency & phase)
        const harmWave = Math.sin(t * Math.PI * 5 - elapsed * 2.6 + 1.5) * 10 * envelope;
        cyanPointsHarmonic.push({
          x: bx,
          y: by + harmWave - 6 * envelope,
        });
      }

      // Draw Cyan Plasma Glow Ribbon (Diffuse Aura)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cyanPoints[0].x, cyanPoints[0].y);
      for (let i = 1; i < cyanPoints.length; i++) {
        ctx.lineTo(cyanPoints[i].x, cyanPoints[i].y);
      }
      ctx.lineWidth = 18;
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.28 * cyanPulse * microJitter})`;
      ctx.lineCap = "round";
      ctx.stroke();

      // Draw Cyan Core Wave Ribbon (Sharp electric body)
      ctx.beginPath();
      ctx.moveTo(cyanPoints[0].x, cyanPoints[0].y);
      for (let i = 1; i < cyanPoints.length; i++) {
        ctx.lineTo(cyanPoints[i].x, cyanPoints[i].y);
      }
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.85 * cyanPulse * microJitter})`;
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 18 * cyanPulse;
      ctx.stroke();

      // Draw Cyan Harmonic Secondary Wave
      ctx.beginPath();
      ctx.moveTo(cyanPointsHarmonic[0].x, cyanPointsHarmonic[0].y);
      for (let i = 1; i < cyanPointsHarmonic.length; i++) {
        ctx.lineTo(cyanPointsHarmonic[i].x, cyanPointsHarmonic[i].y);
      }
      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.7 * cyanPulse})`;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();

      // Draw Moving Bright Highlights Travelling Along the Blue Wave (Electron Packets)
      const numCyanPackets = 3;
      for (let p = 0; p < numCyanPackets; p++) {
        const progress = ((elapsed * 0.32 + (p / numCyanPackets)) % 1.0);
        const idx = Math.min(Math.floor(progress * cyanSamples), cyanSamples - 1);
        const pt = cyanPoints[idx];
        if (pt) {
          ctx.save();
          // Outer cyan aura
          const grad = ctx.createRadialGradient(pt.x, pt.y, 1, pt.x, pt.y, 22);
          grad.addColorStop(0, "rgba(255, 255, 255, 1)");
          grad.addColorStop(0.25, "rgba(0, 240, 255, 0.95)");
          grad.addColorStop(0.65, "rgba(2, 132, 199, 0.5)");
          grad.addColorStop(1, "rgba(0, 240, 255, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 22, 0, Math.PI * 2);
          ctx.fill();

          // Intense white electrical center spark
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.restore();
        }
      }

      // Circuit trace pulses on the left chip area
      const traceT = (elapsed * 0.45) % 1;
      const chipX = width * 0.18;
      const chipY = height * 0.54;
      ctx.save();
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.75 * cyanPulse})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(chipX - 80, chipY - 60);
      ctx.lineTo(chipX + 80 * traceT, chipY - 60);
      ctx.stroke();
      ctx.restore();

      // -------------------------------------------------------------
      // 2. RIGHT SIDE: ORANGE ELECTRICAL ENERGY & LIGHTNING ARCS
      // Windmill, electricity towers & motor area (x: 60% to 95%, y: 18% to 75%)
      // -------------------------------------------------------------
      const orangeStartX = width * 0.86;
      const orangeStartY = height * 0.58;
      const orangeMidX = width * 0.67;
      const orangeMidY = height * 0.46;
      const orangeEndX = width * 0.49;
      const orangeEndY = height * 0.55;

      // Sample 60 points along the dynamic orange electrical wave
      const orangeSamples = 60;
      const orangePoints: Point[] = [];
      const orangePointsHarmonic: Point[] = [];

      for (let i = 0; i <= orangeSamples; i++) {
        const t = i / orangeSamples;
        // Base quadratic bezier curve
        const bx = (1 - t) * (1 - t) * orangeStartX + 2 * (1 - t) * t * orangeMidX + t * t * orangeEndX;
        const by = (1 - t) * (1 - t) * orangeStartY + 2 * (1 - t) * t * orangeMidY + t * t * orangeEndY;

        const envelope = Math.sin(t * Math.PI);
        const wave1 = Math.sin(t * Math.PI * 4 + elapsed * 3.4) * 14 * envelope;
        const wave2 = Math.cos(t * Math.PI * 2.5 - elapsed * 1.5) * 8 * envelope;

        orangePoints.push({
          x: bx + Math.cos(t * Math.PI * 3 - elapsed * 2) * 4 * envelope,
          y: by + wave1 + wave2,
        });

        const harmWave = Math.sin(t * Math.PI * 5 + elapsed * 2.8 + 1.2) * 10 * envelope;
        orangePointsHarmonic.push({
          x: bx,
          y: by + harmWave + 6 * envelope,
        });
      }

      // Draw Orange Plasma Glow Ribbon (Diffuse Aura)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(orangePoints[0].x, orangePoints[0].y);
      for (let i = 1; i < orangePoints.length; i++) {
        ctx.lineTo(orangePoints[i].x, orangePoints[i].y);
      }
      ctx.lineWidth = 18;
      ctx.strokeStyle = `rgba(255, 85, 0, ${0.28 * orangePulse * microJitter})`;
      ctx.lineCap = "round";
      ctx.stroke();

      // Draw Orange Core Wave Ribbon (Sharp electric flame body)
      ctx.beginPath();
      ctx.moveTo(orangePoints[0].x, orangePoints[0].y);
      for (let i = 1; i < orangePoints.length; i++) {
        ctx.lineTo(orangePoints[i].x, orangePoints[i].y);
      }
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = `rgba(255, 85, 0, ${0.85 * orangePulse * microJitter})`;
      ctx.shadowColor = "#ff4500";
      ctx.shadowBlur = 18 * orangePulse;
      ctx.stroke();

      // Draw Orange Harmonic Secondary Wave
      ctx.beginPath();
      ctx.moveTo(orangePointsHarmonic[0].x, orangePointsHarmonic[0].y);
      for (let i = 1; i < orangePointsHarmonic.length; i++) {
        ctx.lineTo(orangePointsHarmonic[i].x, orangePointsHarmonic[i].y);
      }
      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(251, 191, 36, ${0.7 * orangePulse})`;
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.restore();

      // Draw Moving Bright Orange Energy Streaks Travelling from Motor to Center
      const numOrangeStreaks = 3;
      for (let s = 0; s < numOrangeStreaks; s++) {
        const progress = ((elapsed * 0.35 + (s / numOrangeStreaks)) % 1.0);
        const idx = Math.min(Math.floor(progress * orangeSamples), orangeSamples - 1);
        const pt = orangePoints[idx];
        if (pt) {
          ctx.save();
          const grad = ctx.createRadialGradient(pt.x, pt.y, 1, pt.x, pt.y, 22);
          grad.addColorStop(0, "rgba(255, 255, 255, 1)");
          grad.addColorStop(0.25, "rgba(255, 140, 0, 0.95)");
          grad.addColorStop(0.65, "rgba(220, 38, 38, 0.5)");
          grad.addColorStop(1, "rgba(255, 85, 0, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 22, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.shadowColor = "#ffffff";
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.restore();
        }
      }

      // -------------------------------------------------------------
      // 3. ANIMATED LIGHTNING / ELECTRIC ARCS AROUND TOWERS & WINDMILLS
      // -------------------------------------------------------------
      if (currentTime - lastLightningTime > 160 + Math.random() * 220) {
        lastLightningTime = currentTime;

        // Towers and windmills region: x ~ 0.70 to 0.95, y ~ 0.20 to 0.55
        const tower1X = width * (0.72 + Math.random() * 0.05);
        const tower1Y = height * (0.22 + Math.random() * 0.08);

        const tower2X = width * (0.86 + Math.random() * 0.06);
        const tower2Y = height * (0.24 + Math.random() * 0.08);

        const motorTopX = width * (0.80 + Math.random() * 0.08);
        const motorTopY = height * (0.52 + Math.random() * 0.08);

        // Tower to tower or tower to motor arc
        const strikeType = Math.random();
        let pStart: Point;
        let pEnd: Point;

        if (strikeType < 0.5) {
          pStart = { x: tower1X, y: tower1Y };
          pEnd = { x: motorTopX, y: motorTopY };
        } else {
          pStart = { x: tower2X, y: tower2Y };
          pEnd = { x: motorTopX, y: motorTopY };
        }

        const arcPoints = createLightningBranch(pStart.x, pStart.y, pEnd.x, pEnd.y, 24);
        lightningArcs.push({
          points: arcPoints,
          alpha: 0.85 + Math.random() * 0.15,
          decay: 0.045 + Math.random() * 0.035,
          width: 1.5 + Math.random() * 1.2,
          color: Math.random() > 0.4 ? "#ffa500" : "#ffffff",
        });

        // Keep maximum 5 active arcs
        if (lightningArcs.length > 5) {
          lightningArcs.shift();
        }
      }

      // Draw and update active lightning arcs
      for (let i = lightningArcs.length - 1; i >= 0; i--) {
        const arc = lightningArcs[i];
        if (arc.points.length < 2) continue;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(arc.points[0].x, arc.points[0].y);
        for (let j = 1; j < arc.points.length; j++) {
          ctx.lineTo(arc.points[j].x, arc.points[j].y);
        }
        ctx.lineWidth = arc.width;
        ctx.strokeStyle = arc.color === "#ffffff"
          ? `rgba(255, 255, 255, ${arc.alpha})`
          : `rgba(255, 140, 0, ${arc.alpha})`;
        ctx.shadowColor = "#ff7700";
        ctx.shadowBlur = 14;
        ctx.stroke();
        ctx.restore();

        arc.alpha -= arc.decay;
        if (arc.alpha <= 0) {
          lightningArcs.splice(i, 1);
        }
      }

      // -------------------------------------------------------------
      // 4. CENTER COLLISION INTERACTION: BLUE & ORANGE ENERGY NEXUS
      // Behind SPARKTRON where the two dynamic currents collide
      // -------------------------------------------------------------
      const nexusX = width * 0.50;
      const nexusY = height * 0.55;
      ctx.save();
      const nexusRadius = 55 + 15 * Math.sin(elapsed * 2.5);
      const nexusGrad = ctx.createRadialGradient(nexusX, nexusY, 2, nexusX, nexusY, nexusRadius);
      nexusGrad.addColorStop(0, `rgba(255, 255, 255, ${0.45 * microJitter})`);
      nexusGrad.addColorStop(0.35, `rgba(0, 240, 255, ${0.3 * cyanPulse})`);
      nexusGrad.addColorStop(0.7, `rgba(255, 85, 0, ${0.25 * orangePulse})`);
      nexusGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = nexusGrad;
      ctx.beginPath();
      ctx.arc(nexusX, nexusY, nexusRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
