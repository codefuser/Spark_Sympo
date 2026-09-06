"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Cpu, Mail, Phone, MapPin, ArrowRight, Zap } from "lucide-react";
import { useRegistrationModal } from "@/components/registration/RegistrationModalContext";

export function Footer() {
  const pathname = usePathname();
  const { openRegistrationModal } = useRegistrationModal();

  // Hide footer on admin routes
  if (pathname?.startsWith("/admin")) return null;

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer id="contact" className="w-full border-t border-primary/15 bg-background text-secondary-foreground font-sans">
      {/* Top Banner */}
      <div className="border-b border-primary/15 bg-gradient-to-r from-card/90 via-card/60 to-primary/5 py-8 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-sans font-semibold tracking-wider uppercase">
              <Zap className="w-3.5 h-3.5 fill-primary text-primary animate-pulse" />
              <span>SPARKTRON 2K26 • REGISTRATION LIVE</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
              Ignite Your Spark.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-primary drop-shadow-[0_0_20px_rgba(0,240,255,0.35)]">
                Electrify the Arena.
              </span>
            </h3>

            <p className="text-sm text-slate-400 font-sans flex flex-wrap items-center gap-x-2 gap-y-1 justify-center md:justify-start">
              <span>Compete in CircuitRIX, PaperTronix, RoboCombat & Workshops</span>
              <span className="hidden sm:inline text-primary/40">•</span>
              <span className="text-amber-400 font-sans font-semibold">₹20,000+ Prize Pool</span>
            </p>
          </div>
          <button
            onClick={() => openRegistrationModal()}
            className="relative group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-sans text-sm font-semibold tracking-wider uppercase text-primary bg-primary/[0.08] hover:bg-primary/[0.18] border border-primary/50 hover:border-primary shadow-[0_0_20px_rgba(0,240,255,0.18)] hover:shadow-[0_0_30px_rgba(0,240,255,0.45)] backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden cursor-pointer"
          >
            {/* Shimmer sweep effect */}
            <span
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-primary/25 to-transparent pointer-events-none"
              aria-hidden="true"
            />

            {/* Glowing pulse indicator dot */}
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_8px_#00F0FF]" />
            </span>

            {/* Button text */}
            <span className="relative z-10 text-white group-hover:text-primary transition-colors duration-200">
              Register Now
            </span>

            {/* Animated Arrow */}
            <ArrowRight className="relative z-10 w-4 h-4 text-primary group-hover:translate-x-1.5 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand & Dept */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/40 flex items-center justify-center text-primary shadow-glow">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-display tracking-wide text-white">
                SPARK<span className="text-primary font-black">TRON</span>
              </span>
              <span className="text-[11px] font-semibold font-sans px-2 py-0.5 rounded-md bg-primary/10 border border-primary/30 text-primary tracking-wider">
                2K26
              </span>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-400 font-sans">
            National Level Technical Symposium organized by the Department of Electronics and Communication Engineering (ECE). Empowering next-gen innovators.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card/80 border border-primary/20 text-xs font-sans text-primary">
            <span className="font-semibold text-white">September 16, 2026</span>
            <span className="text-primary/50">•</span>
            <span className="text-slate-300">ECE Campus Auditorium</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <div className="pb-2.5 border-b border-primary/25 relative group">
            <h4 className="text-sm font-black font-display tracking-[0.16em] uppercase flex items-center gap-2.5 lightning-text">
              <Zap className="w-4 h-4 text-primary fill-primary animate-pulse drop-shadow-[0_0_8px_#00F0FF] shrink-0" />
              <span className="bg-gradient-to-r from-white via-cyan-200 to-primary bg-clip-text text-transparent font-black drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]">
                NAVIGATION
              </span>
            </h4>
            <div className="absolute -bottom-[1px] left-0 w-16 h-[2px] bg-gradient-to-r from-primary via-cyan-300 to-transparent shadow-[0_0_10px_#00F0FF]" />
          </div>
          <ul className="space-y-2.5 text-sm font-sans">
            {[
              { label: "About Symposium", href: "#about" },
              { label: "Schedule & Guidelines", href: "#symposium" },
              { label: "Events Catalog", href: "#events" },
              { label: "Coordinators", href: "#coordinators" },
              { label: "Sponsors & Partners", href: "#sponsors" },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="group flex items-center gap-2.5 text-slate-300 hover:text-primary transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-primary group-hover:w-2.5 transition-all duration-200" />
                  <span className="font-medium group-hover:translate-x-0.5 transition-transform duration-200">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Event Tracks */}
        <div className="space-y-4">
          <div className="pb-2.5 border-b border-primary/25 relative group">
            <h4 className="text-sm font-black font-display tracking-[0.16em] uppercase flex items-center gap-2.5 lightning-text">
              <Zap className="w-4 h-4 text-primary fill-primary animate-pulse drop-shadow-[0_0_8px_#00F0FF] shrink-0" />
              <span className="bg-gradient-to-r from-white via-cyan-200 to-primary bg-clip-text text-transparent font-black drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]">
                FEATURED TRACKS
              </span>
            </h4>
            <div className="absolute -bottom-[1px] left-0 w-16 h-[2px] bg-gradient-to-r from-primary via-cyan-300 to-transparent shadow-[0_0_10px_#00F0FF]" />
          </div>
          <ul className="space-y-2.5 text-sm font-sans">
            {[
              "CircuitRIX Debugging",
              "PaperTronix Symposium",
              "RoboCombat 2.0 Arena",
              "IoT Edge Workshop",
            ].map((track) => (
              <li key={track}>
                <a
                  href="#events"
                  onClick={(e) => handleNavClick(e, "#events")}
                  className="group flex items-center justify-between text-slate-300 hover:text-primary transition-all duration-200"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-primary group-hover:w-2.5 transition-all duration-200" />
                    <span className="font-medium group-hover:translate-x-0.5 transition-transform duration-200">{track}</span>
                  </span>
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary/80 border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Explore
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <div className="pb-2.5 border-b border-primary/25 relative group">
            <h4 className="text-sm font-black font-display tracking-[0.16em] uppercase flex items-center gap-2.5 lightning-text">
              <Zap className="w-4 h-4 text-primary fill-primary animate-pulse drop-shadow-[0_0_8px_#00F0FF] shrink-0" />
              <span className="bg-gradient-to-r from-white via-cyan-200 to-primary bg-clip-text text-transparent font-black drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]">
                CONTACT US
              </span>
            </h4>
            <div className="absolute -bottom-[1px] left-0 w-16 h-[2px] bg-gradient-to-r from-primary via-cyan-300 to-transparent shadow-[0_0_10px_#00F0FF]" />
          </div>
          <div className="space-y-3 text-sm font-sans">
            <div className="flex items-start gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0 mt-0.5 group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-xs leading-relaxed text-slate-300">
                <span className="text-white font-semibold block mb-0.5">ECE Department</span>
                <span className="text-slate-400">Thamirabharani Engineering College, Thatchanallur, Tirunelveli - 627358</span>
              </div>
            </div>

            <a
              href="mailto:sparktron2026@college.edu"
              className="flex items-center gap-3 group text-slate-300 hover:text-white transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-slate-300 group-hover:text-primary transition-colors">
                sparktron2026@college.edu
              </span>
            </a>

            <div className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-xs font-medium text-slate-300 flex items-center gap-1.5 flex-wrap">
                <a href="tel:+919840123456" className="hover:text-primary transition-colors">
                  +91 98401 23456
                </a>
                <span className="text-slate-600">/</span>
                <a href="tel:+919876543210" className="hover:text-primary transition-colors">
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary/10 py-6 bg-background/50 text-xs font-sans">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 font-medium">© 2026 SPARKTRON 2K26. Department of ECE. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-500 text-xs">
            <span className="hover:text-slate-400 transition-colors">Thamirabharani Engineering College</span>
            <span>•</span>
            <span className="text-primary/70">Empowering Innovators</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
