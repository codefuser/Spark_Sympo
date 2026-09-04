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
          ? "bg-background/95 backdrop-blur-2xl border-primary/25 shadow-xl shadow-primary/5"
          : "bg-background/75 backdrop-blur-xl border-primary/15"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="flex items-center space-x-3 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/40 flex items-center justify-center text-primary group-hover:shadow-glow group-hover:scale-105 transition-all">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-widest text-white font-mono flex items-center">
              SPARK<span className="text-primary">TRON</span>
              <span className="text-xs ml-1.5 px-1.5 py-0.5 rounded bg-cyan/20 text-cyan border border-cyan/40">2K26</span>
            </span>
            <span className="text-[10px] text-secondary-foreground tracking-wider uppercase">ECE Symposium</span>
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
                    ? "text-primary font-extrabold"
                    : "text-slate-400 hover:text-primary"
                )}
              >
                <span>{link.name}</span>

                {/* Underline Indicator without any box border */}
                <span
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-primary via-cyan to-cyan-glow shadow-glow transition-all duration-300 transform origin-left",
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

