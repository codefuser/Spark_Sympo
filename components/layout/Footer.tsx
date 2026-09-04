"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Cpu, Mail, Phone, MapPin } from "lucide-react";
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
      <div className="border-b border-primary/10 bg-card/40 py-8">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white font-mono tracking-tight">
              Ready to electrify your engineering vision?
            </h3>
            <p className="text-sm text-secondary-foreground">
              Register now for CircuitRIX, PaperTronix, RoboCombat, and Workshops!
            </p>
          </div>
          <button
            onClick={() => openRegistrationModal()}
            className="px-6 py-3 rounded-lg bg-primary text-background font-bold text-sm shadow-glow hover:bg-primary-dark transition-all transform hover:-translate-y-0.5"
          >
            Register Now →
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
