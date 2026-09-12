"use client";

import React, { useEffect, useRef } from "react";
import { Cpu, Zap, Activity } from "lucide-react";

export function Hero3DModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentX = 10;
    let currentY = -12;
    let targetX = 10;
    let targetY = -12;
    let animationFrameId: number;
    let isHovering = false;

    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const handleMouseMove = (e: MouseEvent) => {
      isHovering = true;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      // Max tilt of +/- 18 degrees
      targetX = -Math.max(-18, Math.min(18, y / 10));
      targetY = Math.max(-18, Math.min(18, x / 10));
    };

    const handleMouseLeave = () => {
      isHovering = false;
      targetX = 10;
      targetY = -12;
    };

    // Smooth 60 FPS animation loop with lerp (linear interpolation) - ZERO React re-renders!
    const renderLoop = () => {
      // Lerp smoothing factor: 0.08 for buttery fluid motion
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (stage) {
        stage.style.transform = `rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[400px] h-[260px] sm:h-[300px] lg:h-[340px] mx-auto flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      style={{ perspective: "1000px" }}
    >
      {/* Ambient Blue Holographic Backlight - Hardware accelerated */}
      <div className="absolute inset-0 m-auto w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-tr from-blue-600/25 via-cyan-500/20 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />

      {/* 3D Root Stage with RAF direct GPU transform */}
      <div
        ref={stageRef}
        className="relative w-full h-full flex items-center justify-center will-change-transform transform-gpu"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(10deg) rotateY(-12deg)",
        }}
      >
        {/* ================= 3D RING 1 (OUTER GIMBAL) ================= */}
        <div
          className="absolute w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full border-2 border-cyan-400/40 border-dashed animate-spin-3d-1 pointer-events-none transform-gpu"
          style={{
            transformStyle: "preserve-3d",
            boxShadow: "0 0 20px rgba(0, 240, 255, 0.2), inset 0 0 20px rgba(0, 240, 255, 0.12)",
          }}
        >
          {/* Orbital Nodes */}
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
        </div>

        {/* ================= 3D RING 2 (MIDDLE GIMBAL) ================= */}
        <div
          className="absolute w-44 h-44 sm:w-52 sm:h-52 lg:w-56 lg:h-56 rounded-full border border-blue-500/60 animate-spin-3d-2 pointer-events-none transform-gpu"
          style={{
            transformStyle: "preserve-3d",
            boxShadow: "0 0 16px rgba(37, 99, 235, 0.3)",
          }}
        >
          <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
          <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#00f0ff]" />
        </div>

        {/* ================= 3D RING 3 (INNER TECH ACCENT) ================= */}
        <div
          className="absolute w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full border-2 border-cyan-300/70 border-dotted animate-spin-3d-3 pointer-events-none transform-gpu"
          style={{
            transformStyle: "preserve-3d",
            boxShadow: "0 0 12px rgba(0, 240, 255, 0.35)",
          }}
        />

        {/* ================= 3D FLOATING CORE PRISM ================= */}
        <div
          className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center animate-3d-core transform-gpu"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* 3D Cube Faces (Clean high-performance dark translucent panels without expensive backdrop-blur) */}
          {/* Front */}
          <div
            className="absolute inset-0 bg-[#020917]/95 border-2 border-cyan-400/90 rounded-lg flex items-center justify-center shadow-[inset_0_0_16px_rgba(0,240,255,0.4)]"
            style={{ transform: "translateZ(36px)" }}
          >
            <Cpu className="w-7 h-7 text-cyan-300 drop-shadow-[0_0_8px_#00f0ff]" />
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 bg-[#020917]/95 border-2 border-blue-500/90 rounded-lg flex items-center justify-center shadow-[inset_0_0_16px_rgba(37,99,235,0.4)]"
            style={{ transform: "rotateY(180deg) translateZ(36px)" }}
          >
            <Zap className="w-7 h-7 text-white drop-shadow-[0_0_8px_#ffffff]" />
          </div>
          {/* Left */}
          <div
            className="absolute inset-0 bg-[#010612]/95 border-2 border-cyan-500/80 rounded-lg flex items-center justify-center"
            style={{ transform: "rotateY(-90deg) translateZ(36px)" }}
          >
            <span className="text-[9px] font-mono font-bold text-white tracking-wider">ECE</span>
          </div>
          {/* Right */}
          <div
            className="absolute inset-0 bg-[#010612]/95 border-2 border-blue-400/80 rounded-lg flex items-center justify-center"
            style={{ transform: "rotateY(90deg) translateZ(36px)" }}
          >
            <span className="text-[9px] font-mono font-bold text-cyan-300 tracking-wider">EEE</span>
          </div>
          {/* Top */}
          <div
            className="absolute inset-0 bg-[#020917]/95 border-2 border-white/60 rounded-lg flex items-center justify-center"
            style={{ transform: "rotateX(90deg) translateZ(36px)" }}
          >
            <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f0ff]" />
          </div>
          {/* Bottom */}
          <div
            className="absolute inset-0 bg-[#020917]/95 border-2 border-cyan-600/70 rounded-lg flex items-center justify-center"
            style={{ transform: "rotateX(-90deg) translateZ(36px)" }}
          >
            <span className="w-3.5 h-3.5 rounded-full bg-blue-500 shadow-[0_0_12px_#2563eb]" />
          </div>
        </div>

        {/* ================= 3D HOLOGRAPHIC TELEMETRY BADGES ================= */}
        {/* Top Left Telemetry */}
        <div
          className="absolute -top-2 -left-2 sm:left-1 bg-[#020612]/95 border border-cyan-500/40 px-2.5 py-1 rounded-md shadow-[0_0_12px_rgba(0,240,255,0.2)] text-[9px] font-mono text-cyan-300 flex items-center gap-1.5 pointer-events-none"
          style={{ transform: "translateZ(50px)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>3D CORE // ONLINE</span>
        </div>

        {/* Bottom Right Telemetry */}
        <div
          className="absolute -bottom-2 -right-2 sm:right-1 bg-[#020612]/95 border border-blue-500/40 px-2.5 py-1 rounded-md shadow-[0_0_12px_rgba(37,99,235,0.2)] text-[9px] font-mono text-white flex items-center gap-1.5 pointer-events-none"
          style={{ transform: "translateZ(50px)" }}
        >
          <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span className="text-slate-300">ROTATION:</span>
          <span className="text-cyan-300 font-bold">60 FPS</span>
        </div>
      </div>

      {/* Subtle Hint Text */}
      <div className="absolute -bottom-1 text-[8px] font-mono uppercase tracking-[0.2em] text-slate-400/80">
        [ MOVE MOUSE TO INTERACT ]
      </div>
    </div>
  );
}
