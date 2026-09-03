import React from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ExternalLink, Award, Sparkles, Building2 } from "lucide-react";
import { prisma } from "@/lib/database/prisma";

export const metadata = {
  title: "Sponsors | SPARKTRON 2K26 Partners",
  description: "SPARKTRON 2K26 Platinum, Gold, Silver & Media sponsors.",
};

export const revalidate = 60;

export default async function SponsorsPage() {
  const sponsors = await prisma.sponsor.findMany();

  const platinum = sponsors.filter((s) => s.tier === "PLATINUM");
  const gold = sponsors.filter((s) => s.tier === "GOLD");
  const silverMedia = sponsors.filter((s) => s.tier === "SILVER" || s.tier === "MEDIA");

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-16">
      <SectionHeading
        badge="SPONSORSHIP & PARTNERS"
        title="Our Industrial Sponsors & Media Partners"
        description="We express our heartfelt gratitude to our corporate sponsors powering technology advancement at SPARKTRON 2K26."
      />

      {/* Platinum Tier */}
      <div className="space-y-4">
        <div className="text-center">
          <Badge variant="primary" size="md">PLATINUM TITLE SPONSORS</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {platinum.map((item) => (
            <Card key={item.id} glowOnHover className="p-8 text-center space-y-4 border-primary/40 bg-card/80">
              <Building2 className="w-12 h-12 text-primary mx-auto" />
              <h3 className="text-2xl font-extrabold text-white font-mono">{item.name}</h3>
              {item.websiteUrl && (
                <a
                  href={item.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs font-mono text-cyan hover:underline"
                >
                  <span>Visit Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Gold Tier */}
      <div className="space-y-4">
        <div className="text-center">
          <Badge variant="cyan" size="md">GOLD SPONSORS</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {gold.map((item) => (
            <Card key={item.id} glowOnHover className="p-6 text-center space-y-3 border-cyan/30">
              <Sparkles className="w-10 h-10 text-cyan mx-auto" />
              <h3 className="text-xl font-bold text-white font-mono">{item.name}</h3>
            </Card>
          ))}
        </div>
      </div>

      {/* Silver & Media Tier */}
      <div className="space-y-4">
        <div className="text-center">
          <Badge variant="neutral" size="md">SILVER & MEDIA PARTNERS</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {silverMedia.map((item) => (
            <Card key={item.id} className="p-4 text-center font-mono text-sm text-slate-300">
              {item.name}
            </Card>
          ))}
        </div>
      </div>

      {/* Sponsor Invitation Card */}
      <Card className="max-w-3xl mx-auto text-center p-8 space-y-4 border-primary/30">
        <h3 className="text-2xl font-extrabold text-white font-mono">Become a Sponsor for SPARKTRON 2K26</h3>
        <p className="text-sm text-secondary-foreground">
          Interested in showcasing your brand or recruiting top engineering talent from across India? Partner with us today!
        </p>
        <div className="pt-2">
          <Link href="/contact">
            <Button variant="primary">Get Sponsorship Brochure →</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
