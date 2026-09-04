import { NextResponse } from "next/server";
import { supabase } from "@/lib/database/supabase";

const DEFAULT_EVENTS_SEED = [
  { slug: "paper-presentation", title: "Paper Presentation", category: "TECHNICAL", short_desc: "Present your research paper on cutting-edge ECE topics", full_desc: "Showcase your research in Electronics and Communication Engineering to academic and industry experts.", min_members: 1, max_members: 3 },
  { slug: "technical-quiz", title: "Technical Quiz", category: "TECHNICAL", short_desc: "Test your technical knowledge in this thrilling multi-round ECE quiz", full_desc: "Compete in multi-round technical quiz covering core ECE concepts, aptitude and technology trends.", min_members: 1, max_members: 4 },
  { slug: "circuit-debugging", title: "Circuit Debugging", category: "TECHNICAL", short_desc: "Find and fix circuit faults in minimum time to win", full_desc: "Hands-on circuit debugging challenge: identify and rectify faults in given electronic circuits.", min_members: 1, max_members: 2 },
  { slug: "rythemania", title: "Rythemania", category: "NON_TECHNICAL", short_desc: "Show off your rhythm and dance moves on stage", full_desc: "High-energy dance competition open to all styles. Solo and group performances welcome.", min_members: 1, max_members: 8 },
  { slug: "e-sports", title: "E-Sports", category: "NON_TECHNICAL", short_desc: "Compete in popular mobile and PC gaming tournaments", full_desc: "Battle it out in popular mobile and PC gaming tournaments across multiple game titles.", min_members: 1, max_members: 5 },
];

function mapEvent(e: any) {
  return {
    id: e.id,
    slug: e.slug,
    title: e.title,
    category: e.category,
    shortDesc: e.short_desc || "",
    fullDesc: e.full_desc || "",
    minMembers: e.min_members || 1,
    maxMembers: e.max_members || 5,
    venue: e.venue || "ECE Campus",
    status: e.status || "OPEN",
    max_members: e.max_members || 5,
    min_members: e.min_members || 1,
  };
}

export async function GET() {
  try {
    const { data: supaEvents, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && supaEvents && supaEvents.length > 0) {
      return NextResponse.json({ success: true, events: supaEvents.map(mapEvent) });
    }

    // Table is empty — seed default events
    const { data: seeded } = await supabase
      .from("events")
      .insert(DEFAULT_EVENTS_SEED)
      .select();

    if (seeded && seeded.length > 0) {
      return NextResponse.json({ success: true, events: seeded.map(mapEvent) });
    }

    // Final fallback with numeric IDs
    return NextResponse.json({
      success: true,
      events: DEFAULT_EVENTS_SEED.map((e, i) => mapEvent({ ...e, id: String(i + 1) })),
    });
  } catch (err) {
    console.error("Events API error:", err);
    return NextResponse.json({
      success: true,
      events: DEFAULT_EVENTS_SEED.map((e, i) => mapEvent({ ...e, id: String(i + 1) })),
    });
  }
}

