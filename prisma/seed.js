const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding SPARKTRON 2K26 database...");

  // 1. Create Default Admin
  const adminPasswordHash = await bcrypt.hash("sparktron2k26#admin", 10);
  const admin = await prisma.admin.upsert({
    where: { email: "admin@sparktron.ece" },
    update: {},
    create: {
      email: "admin@sparktron.ece",
      name: "ECE Symposium Chair",
      passwordHash: adminPasswordHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // 2. Create Events
  const eventsData = [
    {
      slug: "circuitrix",
      title: "CircuitRIX",
      category: "TECHNICAL",
      shortDesc: "Ultimate circuit debugging, schematic design, and breadboard synthesis challenge.",
      fullDesc: "Test your fundamental electronics expertise! CircuitRIX presents participants with complex analog & digital circuit schematics containing hidden glitches, faulty components, and logic mismatches. Debug the layout, reconstruct the operational state on breadboards, and simulate output signals on CRO.",
      rules: "1. Maximum 2 members per team.\n2. Standard components & breadboards provided by ECE lab.\n3. Round 1: Written MCQ & Schematic Debugging (20 mins).\n4. Round 2: Real-time Breadboard Hardware Synthesis & Signal Analysis.",
      eligibility: "Open to all UG/PG Engineering Students (ECE, EEE, EIE, CSE, IT)",
      teamSize: "1-2 Members",
      maxTeams: 50,
      rounds: "2 Rounds",
      date: "September 16, 2026",
      time: "09:30 AM - 11:30 AM",
      venue: "VLSI & Embedded Systems Lab, 2nd Floor",
      coordinatorName: "Dr. K. Ramprasath",
      coordinatorPhone: "+91 98401 23456",
      status: "OPEN",
    },
    {
      slug: "papertronix",
      title: "PaperTronix",
      category: "TECHNICAL",
      shortDesc: "National Level Technical Paper & Innovation Presentation Symposium.",
      fullDesc: "Showcase your original research, innovative project ideas, and technical write-ups in frontier domains including VLSI Design, 5G Communications, Autonomous Systems, Embedded AI, Signal Processing, and IoT Sensors.",
      rules: "1. Abstract submission required prior to event day.\n2. Team size max 3 members.\n3. Presentation time: 8 mins talk + 2 mins Q&A.\n4. IEEE double-column format preferred.",
      eligibility: "Engineering undergraduates & diploma students",
      teamSize: "1-3 Members",
      maxTeams: 40,
      rounds: "1 Round (Presentation + Q&A)",
      date: "September 16, 2026",
      time: "10:00 AM - 01:00 PM",
      venue: "ECE Seminar Hall, Ground Floor",
      coordinatorName: "Prof. S. Meenakshi",
      coordinatorPhone: "+91 98402 34567",
      status: "OPEN",
    },
    {
      slug: "robo-wars",
      title: "RoboCombat 2.0",
      category: "TECHNICAL",
      shortDesc: "High-octane wired/wireless mini bot battlefield arena clash.",
      fullDesc: "Design and deploy your custom mini ground combat robot in our obstacle-heavy tactical arena. Overcome traps, hit target zones, and push rival bots out of the ring to claim supremacy.",
      rules: "1. Robot dimensions max 30cm x 30cm x 30cm.\n2. Weight limit: <= 3kg.\n3. Wireless RF/Bluetooth or tethered remote control permitted.\n4. Voltage cap: 18V DC maximum.",
      eligibility: "All engineering students",
      teamSize: "2-4 Members",
      maxTeams: 30,
      rounds: "Knockout + Final Duel",
      date: "September 16, 2026",
      time: "11:30 AM - 02:00 PM",
      venue: "College Central Courtyard Arena",
      coordinatorName: "Dr. R. Vigneshwaren",
      coordinatorPhone: "+91 98403 45678",
      status: "OPEN",
    },
    {
      slug: "iot-smart-edge",
      title: "IoT & Embedded Edge Workshop",
      category: "WORKSHOP",
      shortDesc: "Hands-on workshop on ESP32, TinyML sensor fusion, and cloud telemetry.",
      fullDesc: "An intensive 3-hour practical session guided by industry experts from Texas Instruments & Bosch. Participants will build edge AI sensor nodes, stream telemetry to AWS IoT core, and trigger real-time web alerts.",
      rules: "1. Hardware development kits will be provided during session.\n2. Bring laptop with Arduino IDE / VSCode pre-installed.\n3. Certificate of participation issued to all attendees.",
      eligibility: "Open to all students interested in Embedded IoT",
      teamSize: "Individual",
      maxTeams: 80,
      rounds: "Hands-on Practical Workshop",
      date: "September 16, 2026",
      time: "01:30 PM - 04:30 PM",
      venue: "DSP & Communication Lab",
      coordinatorName: "Er. A. Dinesh Kumar",
      coordinatorPhone: "+91 98404 56789",
      status: "OPEN",
    },
    {
      slug: "pixelfest-media",
      title: "LensCraft: Tech Photography & Reels",
      category: "NON_TECHNICAL",
      shortDesc: "Capture the spirit of innovation, circuit art, and symposium energy.",
      fullDesc: "Unleash your creative lens! Capture high-impact aesthetic shots of symposium events, glowing breadboards, robot duels, or compile a 30-second cinematic symposium reel.",
      rules: "1. All photos/videos must be captured on campus during SPARKTRON 2K26.\n2. Minimal color grading allowed; no artificial generative AI additions.\n3. Submissions via QR link before 3:00 PM.",
      eligibility: "Open to all symposium participants",
      teamSize: "Individual or Pair",
      maxTeams: 60,
      rounds: "Single Submission Review",
      date: "September 16, 2026",
      time: "Full Day (Submissions by 03:00 PM)",
      venue: "Campus Wide / Media Center",
      coordinatorName: "Mr. B. Gautham",
      coordinatorPhone: "+91 98406 78901",
      status: "OPEN",
    },
  ];

  for (const item of eventsData) {
    await prisma.event.upsert({
      where: { slug: item.slug },
      update: item,
      create: item,
    });
  }
  console.log("✅ Seeded 5 Symposium Events");

  // 3. Seed Coordinators
  const coordinatorsData = [
    {
      name: "Dr. V. Rajeshwari",
      role: "FACULTY",
      designation: "Head of Department (ECE) & Chief Patron",
      department: "ECE",
      phone: "+91 98400 11122",
      email: "hod.ece@college.edu",
    },
    {
      name: "Dr. K. Ramprasath",
      role: "FACULTY",
      designation: "Staff Convener - SPARKTRON 2K26",
      department: "ECE",
      phone: "+91 98401 23456",
      email: "ramprasath.ece@college.edu",
    },
    {
      name: "Sanjay V.",
      role: "STUDENT",
      designation: "Student President & Lead Coordinator",
      department: "ECE (Final Year)",
      phone: "+91 98765 43210",
      email: "sanjay.ece26@student.edu",
    },
    {
      name: "Ananya Ramesh",
      role: "STUDENT",
      designation: "Student Vice President & Events Lead",
      department: "ECE (Final Year)",
      phone: "+91 98765 43211",
      email: "ananya.ece26@student.edu",
    },
    {
      name: "Karthik Raja M.",
      role: "STUDENT",
      designation: "Technical & Platform Lead",
      department: "ECE (Third Year)",
      phone: "+91 98765 43212",
      email: "karthik.ece27@student.edu",
    },
  ];

  for (const item of coordinatorsData) {
    await prisma.coordinator.create({
      data: item,
    });
  }
  console.log("✅ Seeded Coordinators");

  // 4. Seed Sponsors
  const sponsorsData = [
    { name: "Texas Instruments", tier: "PLATINUM", websiteUrl: "https://www.ti.com" },
    { name: "Bosch Sensing Systems", tier: "PLATINUM", websiteUrl: "https://www.bosch.com" },
    { name: "Qualcomm Wireless", tier: "GOLD", websiteUrl: "https://www.qualcomm.com" },
    { name: "Microchip Technology", tier: "GOLD", websiteUrl: "https://www.microchip.com" },
    { name: "IEEE Madras Section", tier: "SILVER", websiteUrl: "https://www.ieee.org" },
    { name: "TechBytes Media", tier: "MEDIA", websiteUrl: "https://techbytes.in" },
  ];

  for (const item of sponsorsData) {
    await prisma.sponsor.create({ data: item });
  }
  console.log("✅ Seeded Sponsors");

  // 5. Seed Announcements
  await prisma.announcement.create({
    data: {
      title: "SPARKTRON 2K26 Registration Now Live!",
      content: "Early bird online registration for CircuitRIX, PaperTronix, RoboCombat, and Workshops is officially open.",
      priority: "HIGH",
    },
  });

  await prisma.announcement.create({
    data: {
      title: "Cash Prizes Worth ₹75,000 Up For Grabs",
      content: "Certificates of Excellence will be provided to all winners and finalists across technical and workshop tracks.",
      priority: "NORMAL",
    },
  });

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
