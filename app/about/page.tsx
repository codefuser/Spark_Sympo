import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Cpu, Target, Award, Compass, BookOpen, ShieldCheck, Zap, Users, Trophy } from "lucide-react";

export const metadata = {
  title: "About | SPARKTRON 2K26 ECE Symposium",
  description: "Learn about SPARKTRON 2K26, the Department of ECE, vision, mission, and symposium purpose.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 space-y-16">
      <SectionHeading
        badge="ABOUT US"
        title="About SPARKTRON 2K26 & ECE Department"
        description="Fostering technical innovation, engineering mastery, and collaborative research excellence."
      />

      {/* Storytelling Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <Card glowOnHover className="space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-primary font-mono text-sm mb-2">
              <Zap className="w-4 h-4" />
              <span>THE SYMPOSIUM LEGACY</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-3">What is SPARKTRON 2K26?</h3>
            <p className="text-sm text-secondary-foreground leading-relaxed space-y-3">
              <span>
                SPARKTRON 2K26 is the annual flagship National Level Technical Symposium organized by the Department of Electronics and Communication Engineering. It serves as a high-octane nexus where budding engineers from across the nation converge to benchmark their technical prowess.
              </span>
              <br /><br />
              <span>
                Featuring state-of-the-art competitions in circuit debugging, technical paper synthesis, autonomous robot combat, embedded edge workshops, and automated quiz challenges, SPARKTRON bridges the gap between academic theory and practical industry execution.
              </span>
            </p>
          </div>
          <div className="pt-4 border-t border-primary/10 flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-primary" /> ISO Certified</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Award className="w-4 h-4 text-cyan" /> IEEE Supported</span>
          </div>
        </Card>

        <Card glowOnHover className="space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-cyan font-mono text-sm mb-2">
              <Cpu className="w-4 h-4" />
              <span>DEPARTMENT OVERVIEW</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-3">Department of ECE</h3>
            <p className="text-sm text-secondary-foreground leading-relaxed">
              The Department of Electronics and Communication Engineering is renowned for its academic rigor, research publications, and cutting-edge laboratory infrastructure. Equipped with advanced VLSI design tools, Embedded System kits, DSP trainers, and Microwave test setups, the department nurtures industry-ready engineers capable of solving global technological challenges.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4 font-mono text-xs text-center">
            <div className="p-3 rounded-lg bg-background border border-primary/20">
              <div className="text-xl font-bold text-primary">12+</div>
              <div className="text-slate-400">Advanced Labs</div>
            </div>
            <div className="p-3 rounded-lg bg-background border border-primary/20">
              <div className="text-xl font-bold text-cyan">100%</div>
              <div className="text-slate-400">Placement Record</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Vision & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-l-4 border-l-primary">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Target className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">Our Vision</h4>
          </div>
          <p className="text-sm text-secondary-foreground leading-relaxed">
            To evolve into a center of excellence in Electronics and Communication Engineering education and research, producing globally competent, ethically sound, and innovative engineers equipped to lead technological advancements.
          </p>
        </Card>

        <Card className="border-l-4 border-l-cyan">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 rounded-lg bg-cyan/10 text-cyan">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold text-white">Our Mission</h4>
          </div>
          <ul className="text-sm text-secondary-foreground leading-relaxed space-y-2 list-disc list-inside">
            <li>Provide rigorous technical curriculum enriched with practical laboratory experience.</li>
            <li>Foster research partnerships with semiconductor, telecommunication, and robotics industries.</li>
            <li>Inculcate leadership qualities, ethical values, and lifelong learning habits in students.</li>
          </ul>
        </Card>
      </div>

      {/* What Participants Can Expect */}
      <div className="space-y-6">
        <div className="text-center">
          <Badge variant="primary" size="md">PARTICIPANT EXPERIENCE</Badge>
          <h3 className="text-2xl font-bold text-white mt-2">What Participants Can Expect</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Certificate of Participation",
              desc: "All registered symposium delegates receive official hardcopy & digital certificates recognized across institutions.",
              icon: BookOpen,
            },
            {
              title: "Industry Networking",
              desc: "Interact with keynote speakers, alumni from top semiconductor giants, and academic researchers.",
              icon: Users,
            },
            {
              title: "Cash Prizes & Trophies",
              desc: "Over ₹75,000 in total prize pool awarded to top 3 teams across all 6 technical and non-technical events.",
              icon: Trophy,
            },
          ].map((item, idx) => (
            <Card key={idx} glowOnHover className="text-center space-y-3">
              <item.icon className="w-8 h-8 text-primary mx-auto" />
              <h4 className="text-base font-bold text-white">{item.title}</h4>
              <p className="text-xs text-secondary-foreground leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
