"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Cpu, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useRegistrationModal } from "@/components/registration/RegistrationModalContext";

const navLinks = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Symposium", href: "#symposium" },
  { name: "Events", href: "#events" },
  { name: "Coordinators", href: "#coordinators" },
  { name: "Sponsors", href: "#sponsors" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const { openRegistrationModal } = useRegistrationModal();

  // Hide public navbar on admin portal routes
  if (pathname?.startsWith("/admin")) return null;

  // Real-time Active Section Tracking & Scroll Effect
  useEffect(() => {
    const sectionIds = navLinks.map((l) => l.href.replace("#", ""));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      const scrollPosition = window.scrollY + 140; // Offset for navbar height

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check on mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      setActiveSection(targetId);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300",
        isScrolled
          ? "bg-[#02050e]/95 backdrop-blur-2xl border-blue-500/25 shadow-xl shadow-blue-500/5"
          : "bg-[#02050e]/80 backdrop-blur-xl border-blue-500/15"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="flex items-center space-x-3 group cursor-pointer"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-b from-[#081730] to-[#020712] border border-blue-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-300 shadow-[0_0_15px_rgba(0,114,255,0.3)] group-hover:scale-105 transition-all">
            <span className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 border-t border-l border-cyan-400" />
            <span className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 border-b border-r border-cyan-400" />
            <Cpu className="w-5 h-5 drop-shadow-[0_0_8px_#00f0ff]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-widest text-white font-mono flex items-center drop-shadow-sm">
              SPARK<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">TRON</span>
              <span className="text-[11px] ml-2 px-2 py-0.5 rounded-md bg-blue-950/80 text-cyan-300 border border-blue-400/50 shadow-[0_0_10px_rgba(0,114,255,0.3)] font-bold">2K26</span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-[0.15em] uppercase font-semibold">ECE &amp; EEE Symposium</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-6 font-mono">
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  "relative py-2 text-sm font-medium transition-all duration-200 cursor-pointer group select-none",
                  isActive
                    ? "text-white font-black drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]"
                    : "text-slate-300 hover:text-cyan-400"
                )}
              >
                <span>{link.name}</span>

                {/* Underline Indicator without any box border */}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 shadow-[0_0_10px_#00f0ff] transition-all duration-300 transform origin-left",
                    isActive
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                  )}
                />
              </a>
            );
          })}
        </nav>

        {/* Action Button */}
        <div className="hidden xl:flex items-center space-x-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => openRegistrationModal()}
            className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:to-cyan-400 text-black font-extrabold shadow-[0_0_20px_rgba(0,114,255,0.4)] cursor-pointer rounded-xl px-5 transition-all hover:scale-105"
          >
            Register Now
          </Button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex xl:hidden items-center space-x-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => openRegistrationModal()}
          >
            Register
          </Button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-secondary-foreground hover:text-primary rounded-lg border border-primary/20 bg-card"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-primary/20 bg-card/95 backdrop-blur-2xl px-4 py-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 font-mono">
            {navLinks.map((link) => {
              const sectionId = link.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={cn(
                    "px-3 py-2.5 text-sm font-medium rounded-lg text-center transition-all",
                    isActive
                      ? "text-primary font-bold bg-primary/10"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  {link.name}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

