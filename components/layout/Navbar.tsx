"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, Menu, X, ShieldAlert, Award, Calendar, Users, HelpCircle, PhoneCall, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Symposium", href: "/symposium" },
  { name: "Events", href: "/events" },
  { name: "Quiz", href: "/quiz" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Coordinators", href: "/coordinators" },
  { name: "Sponsors", href: "/sponsors" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide navbar on admin routes
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary/15 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/40 flex items-center justify-center text-primary group-hover:shadow-glow group-hover:scale-105 transition-all">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-widest text-white font-mono flex items-center">
              SPARK<span className="text-primary">TRON</span>
              <span className="text-xs ml-1 px-1.5 py-0.5 rounded bg-cyan/20 text-cyan border border-cyan/40">2K26</span>
            </span>
            <span className="text-[10px] text-secondary-foreground tracking-wider uppercase">ECE Symposium</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "text-primary bg-primary/10 border border-primary/30"
                    : "text-secondary-foreground hover:text-white hover:bg-card/60"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden xl:flex items-center space-x-3">
          <Link href="/register">
            <Button variant="primary" size="sm">
              Register Now
            </Button>
          </Link>
          <Link href="/admin/login">
            <Button variant="ghost" size="sm" leftIcon={<ShieldAlert className="w-4 h-4" />}>
              Admin
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex xl:hidden items-center space-x-2">
          <Link href="/register">
            <Button variant="primary" size="sm">
              Register
            </Button>
          </Link>
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
        <div className="xl:hidden border-b border-primary/20 bg-card/95 backdrop-blur-xl px-4 py-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2.5 text-sm font-medium rounded-lg text-center transition-all",
                    isActive
                      ? "text-primary bg-primary/10 border border-primary/30 font-bold"
                      : "text-secondary-foreground hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="pt-3 border-t border-primary/10 flex justify-between items-center">
            <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-xs text-secondary-foreground hover:text-primary flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-primary" /> Admin Portal Access
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
