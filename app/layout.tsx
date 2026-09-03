import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "SPARKTRON 2K26 | ECE Technical Symposium",
  description:
    "Official National Level Technical Symposium organized by the Department of Electronics and Communication Engineering (ECE). CircuitRIX, PaperTronix, RoboCombat, Workshops & Online Quiz.",
  keywords: [
    "SPARKTRON 2K26",
    "ECE Symposium",
    "Technical Symposium 2026",
    "CircuitRIX",
    "Paper presentation ECE",
    "RoboCombat",
    "Engineering Contest",
  ],
  authors: [{ name: "Department of ECE" }],
  openGraph: {
    title: "SPARKTRON 2K26 | ECE Technical Symposium",
    description:
      "Join the ultimate technical symposium by the ECE Department. Register now for CircuitRIX, PaperTronix, RoboCombat, Workshops, and Online Quiz.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-background text-foreground circuit-bg selection:bg-primary selection:text-background">
        <ToastProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
