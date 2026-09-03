"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useRegistrationModal } from "@/components/registration/RegistrationModalContext";

const navLinks = [
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
  const [activeSection, setActiveSection] = useState("");
  const { openRegistrationModal } = useRegistrationModal();

  // Hide public navbar completely on admin portal routes
  if (pathname?.startsWith("/admin")) return null;

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
    <header className="sticky top-0 z-40 w-full border-b border-primary/15 bg-background/90 backdrop-blur-xl">
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
        <nav className="hidden xl:flex items-center space-x-1 font-mono">
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={cn(
                  "relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "text-primary bg-primary/10 border border-primary/30 shadow-glow"
                    : "text-secondary-foreground hover:text-white hover:bg-card/60"
                )}
              >
                <span>{link.name}</span>
                {/* Glowing bottom line animation on hover */}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-cyan group-hover:w-4/5 transition-all duration-300 rounded-full" />
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

        {/* Mobile menu trigger */}
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

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-primary/20 bg-card/95 backdrop-blur-2xl px-4 py-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 font-mono">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-2.5 text-sm font-medium rounded-lg text-center transition-all text-secondary-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
