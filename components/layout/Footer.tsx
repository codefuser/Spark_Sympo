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
    <footer className="w-full border-t border-primary/15 bg-background text-secondary-foreground">
      {/* Top Banner */}
      <div className="border-b border-primary/15 bg-gradient-to-r from-card/90 via-card/60 to-primary/5 py-8 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono tracking-widest uppercase">
              <Zap className="w-3.5 h-3.5 fill-primary text-primary animate-pulse" />
              <span>SPARKTRON 2K26 • REGISTRATION LIVE</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-white">
              Ignite Your Spark.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-300 to-primary drop-shadow-[0_0_20px_rgba(0,240,255,0.35)]">
                Electrify the Arena.
              </span>
            </h3>

            <p className="text-sm text-slate-400 font-sans flex flex-wrap items-center gap-x-2 gap-y-1 justify-center md:justify-start">
              <span>Compete in CircuitRIX, PaperTronix, RoboCombat & Workshops</span>
              <span className="hidden sm:inline text-primary/40">•</span>
              <span className="text-amber-400 font-mono font-semibold">₹20,000+ Prize Pool</span>
            </p>
          </div>
          <button
            onClick={() => openRegistrationModal()}
            className="relative group inline-flex items-center gap-3 px-6 py-3.5 rounded-xl font-mono text-sm font-bold tracking-wider uppercase text-primary bg-primary/[0.08] hover:bg-primary/[0.18] border border-primary/50 hover:border-primary shadow-[0_0_20px_rgba(0,240,255,0.18)] hover:shadow-[0_0_30px_rgba(0,240,255,0.45)] backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden cursor-pointer"
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
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/40 flex items-center justify-center text-primary shadow-glow">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-xl font-black font-mono tracking-wider text-white">
              SPARK<span className="text-primary">TRON</span> 2K26
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            National Level Technical Symposium organized by the Department of Electronics and Communication Engineering (ECE). Empowering next-gen innovators.
          </p>
          <div className="pt-2 text-xs font-mono text-primary flex items-center space-x-2">
            <span>September 16, 2026</span>
            <span>•</span>
            <span>ECE Campus Auditorium</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3 font-mono">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-primary/20 pb-2">
            Navigation
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#about" onClick={(e) => handleNavClick(e, "#about")} className="hover:text-primary transition-colors">
                About Symposium
              </a>
            </li>
            <li>
              <a href="#symposium" onClick={(e) => handleNavClick(e, "#symposium")} className="hover:text-primary transition-colors">
                Schedule & Guidelines
              </a>
            </li>
            <li>
              <a href="#events" onClick={(e) => handleNavClick(e, "#events")} className="hover:text-primary transition-colors">
                Events Catalog
              </a>
            </li>
            <li>
              <a href="#coordinators" onClick={(e) => handleNavClick(e, "#coordinators")} className="hover:text-primary transition-colors">
                Coordinators
              </a>
            </li>
            <li>
              <a href="#sponsors" onClick={(e) => handleNavClick(e, "#sponsors")} className="hover:text-primary transition-colors">
                Sponsors & Partners
              </a>
            </li>
          </ul>
        </div>

        {/* Event Tracks */}
        <div className="space-y-3 font-mono">
          <h4 className="text-xs font-bold text-white uppercase tracking-widest border-b border-primary/20 pb-2">
            Featured Tracks
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#events" onClick={(e) => handleNavClick(e, "#events")} className="hover:text-primary transition-colors">
                CircuitRIX Debugging
              </a>
            </li>
            <li>
              <a href="#events" onClick={(e) => handleNavClick(e, "#events")} className="hover:text-primary transition-colors">
                PaperTronix Symposium
              </a>
            </li>
            <li>
              <a href="#events" onClick={(e) => handleNavClick(e, "#events")} className="hover:text-primary transition-colors">
                RoboCombat 2.0 Arena
              </a>
            </li>
            <li>
              <a href="#events" onClick={(e) => handleNavClick(e, "#events")} className="hover:text-primary transition-colors">
                IoT Edge Workshop
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest border-b border-primary/20 pb-2">
            Contact Us
          </h4>
          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>ECE Department, Thamirabharani Engineering College, Thatchanallur, Tirunelveli - 627358</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <span>sparktron2026@college.edu</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <span>+91 98401 23456 / +91 98765 43210</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary/10 py-6 bg-background/50 text-xs">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 SPARKTRON 2K26. Department of ECE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
