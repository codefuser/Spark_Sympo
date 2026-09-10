"use client";

import React, { useState, useEffect, useRef } from "react";
import { Cpu, Zap, Shield, Activity } from "lucide-react";

export function Hero3DModel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 12, y: -15 });
  const [isHovered, setIsHovered] = useState(false);

  // Interactive mouse tilt for realistic 3D feel
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: -(y / 15),
      y: x / 15,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 12, y: -15 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[500px] h-[320px] sm:h-[380px] mx-auto flex items-center justify-center cursor-grab active:cursor-grabbing select-none my-2"
      style={{ perspective: "1200px" }}
    >
      {/* Ambient Blue Holographic Backlight */}
      <div className="absolute inset-0 m-auto w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-tr from-blue-600/30 via-cyan-500/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

      {/* 3D Root Stage with mouse-reactive tilt */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {/* ================= 3D RING 1 (OUTER GIMBAL) ================= */}
        <div
          className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border-2 border-cyan-400/40 border-dashed animate-spin-3d-1 pointer-events-none"
          style={{
            transformStyle: "preserve-3d",
            boxShadow: "0 0 25px rgba(0, 240, 255, 0.25), inset 0 0 25px rgba(0, 240, 255, 0.15)",
          }}
        >
          {/* Orbital White Nodes */}
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff]" />
        </div>

        {/* ================= 3D RING 2 (MIDDLE GIMBAL) ================= */}
        <div
          className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full border border-blue-500/60 animate-spin-3d-2 pointer-events-none"
          style={{
            transformStyle: "preserve-3d",
            boxShadow: "0 0 20px rgba(37, 99, 235, 0.35)",
          }}
        >
          <span className="absolute top-1/2 -left-2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
          <span className="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_10px_#00f0ff]" />
        </div>

        {/* ================= 3D RING 3 (INNER TECH ACCENT) ================= */}
        <div
          className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 border-cyan-300/70 border-dotted animate-spin-3d-3 pointer-events-none"
          style={{
            transformStyle: "preserve-3d",
            boxShadow: "0 0 15px rgba(0, 240, 255, 0.4)",
          }}
        />

        {/* ================= 3D FLOATING CORE PRISM ================= */}
        <div
          className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center animate-3d-core"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* 3D Cube Faces */}
          {/* Front */}
          <div
            className="absolute inset-0 bg-[#020917]/90 border-2 border-cyan-400/80 rounded-xl flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,240,255,0.4)] backdrop-blur-md"
            style={{ transform: "translateZ(44px)" }}
          >
            <Cpu className="w-8 h-8 text-cyan-300 drop-shadow-[0_0_10px_#00f0ff]" />
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 bg-[#020917]/90 border-2 border-blue-500/80 rounded-xl flex items-center justify-center shadow-[inset_0_0_20px_rgba(37,99,235,0.4)] backdrop-blur-md"
            style={{ transform: "rotateY(180deg) translateZ(44px)" }}
          >
            <Zap className="w-8 h-8 text-white drop-shadow-[0_0_10px_#ffffff]" />
          </div>
          {/* Left */}
          <div
            className="absolute inset-0 bg-[#010612]/90 border-2 border-cyan-500/80 rounded-xl flex items-center justify-center backdrop-blur-md"
            style={{ transform: "rotateY(-90deg) translateZ(44px)" }}
          >
            <span className="text-[10px] font-mono font-bold text-white tracking-widest">ECE</span>
          </div>
          {/* Right */}
          <div
            className="absolute inset-0 bg-[#010612]/90 border-2 border-blue-400/80 rounded-xl flex items-center justify-center backdrop-blur-md"
            style={{ transform: "rotateY(90deg) translateZ(44px)" }}
          >
            <span className="text-[10px] font-mono font-bold text-cyan-300 tracking-widest">EEE</span>
          </div>
          {/* Top */}
          <div
            className="absolute inset-0 bg-[#020917]/90 border-2 border-white/60 rounded-xl flex items-center justify-center backdrop-blur-md"
            style={{ transform: "rotateX(90deg) translateZ(44px)" }}
          >
            <span className="w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_#00f0ff]" />
          </div>
          {/* Bottom */}
          <div
            className="absolute inset-0 bg-[#020917]/90 border-2 border-cyan-600/70 rounded-xl flex items-center justify-center backdrop-blur-md"
            style={{ transform: "rotateX(-90deg) translateZ(44px)" }}
          >
            <span className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_15px_#2563eb]" />
          </div>
        </div>

        {/* ================= 3D HOLOGRAPHIC TELEMETRY BADGES ================= */}
        {/* Top Left Telemetry */}
        <div
          className="absolute -top-4 -left-6 sm:left-2 bg-[#020612]/95 border border-cyan-500/40 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.2)] backdrop-blur-md text-[10px] font-mono text-cyan-300 flex items-center gap-2 pointer-events-none"
          style={{ transform: "translateZ(60px)" }}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>3D CORE // ONLINE</span>
        </div>

        {/* Bottom Right Telemetry */}
        <div
          className="absolute -bottom-4 -right-6 sm:right-2 bg-[#020612]/95 border border-blue-500/40 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.2)] backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-2 pointer-events-none"
          style={{ transform: "translateZ(60px)" }}
        >
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-slate-300">ROTATION:</span>
          <span className="text-cyan-300 font-bold">60 FPS</span>
        </div>
      </div>

      {/* Subtle Hint Text */}
      <div className="absolute bottom-1 text-[9px] font-mono uppercase tracking-[0.2em] text-slate-400 opacity-60">
        [ DRAG OR MOVE MOUSE TO TILT 3D CORE ]
      </div>
    </div>
  );
}
