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

  // 2. Create Events (6 Comprehensive Tracks)
  const eventsData = [
    {
      slug: "paper-presentation",
      title: "Paper Presentation",
      category: "TECHNICAL",
      shortDesc: "National Level Technical Paper & Innovation Presentation Symposium.",
      fullDesc: "Showcase original research, project ideas, and technical write-ups in VLSI Design, 5G Communications, Embedded AI, Signal Processing, and IoT Sensors.",
      rules: "1. Abstract submission required prior to event day.\n2. Team size max 3 members.\n3. Presentation time: 8 mins talk + 2 mins Q&A.",
      eligibility: "Engineering undergraduates & diploma students",
      teamSize: "1-3 Members",
      minMembers: 1,
      maxMembers: 3,
      maxTeams: 50,
      rounds: "1 Round (Presentation + Q&A)",
      date: "September 16, 2026",
      time: "10:00 AM - 01:00 PM",
      venue: "ECE Seminar Hall, Ground Floor",
      coordinatorName: "Prof. S. Meenakshi",
      coordinatorPhone: "+91 98402 34567",
      status: "OPEN",
    },
    {
      slug: "technical-quiz",
      title: "Technical Quiz",
      category: "TECHNICAL",
      shortDesc: "Fast-paced live digital quiz testing core electronics, computing, and tech trivia.",
      fullDesc: "Compete against top minds in real-time online quiz rounds. Tests knowledge in analog electronics, digital circuits, microcontrollers, AI, and computer systems.",
      rules: "1. Max 2 members per team.\n2. Timed online portal access.\n3. Strictly single attempt during official quiz window.",
      eligibility: "Open to all registered engineering students",
      teamSize: "1-2 Members",
      minMembers: 1,
      maxMembers: 2,
      maxTeams: 100,
      rounds: "Prelims + Live Final Round",
      date: "September 16, 2026",
      time: "10:00 AM - 10:30 AM",
      venue: "Digital Quiz Portal / Computer Center",
      coordinatorName: "Dr. K. Ramprasath",
      coordinatorPhone: "+91 98401 23456",
      status: "OPEN",
    },
    {
      slug: "circuit-debugging",
      title: "Circuit Debugging",
      category: "TECHNICAL",
      shortDesc: "Ultimate schematic debugging, breadboard synthesis, and hardware troubleshooting.",
      fullDesc: "Debug complex electronic circuits containing hidden glitches, faulty components, and logic mismatches. Reconstruct operational states on breadboards and simulate output signals.",
      rules: "1. Max 2 members per team.\n2. Standard components provided by ECE lab.\n3. Round 1: Debugging quiz; Round 2: Breadboard synthesis.",
      eligibility: "UG/PG Engineering Students (ECE, EEE, EIE, CSE, IT)",
      teamSize: "1-2 Members",
      minMembers: 1,
      maxMembers: 2,
      maxTeams: 60,
      rounds: "2 Rounds",
      date: "September 16, 2026",
      time: "11:30 AM - 01:30 PM",
      venue: "VLSI & Embedded Systems Lab, 2nd Floor",
      coordinatorName: "Dr. R. Vigneshwaren",
      coordinatorPhone: "+91 98403 45678",
      status: "OPEN",
    },
    {
      slug: "iot-workshop",
      title: "IoT & Robotics Workshop",
      category: "WORKSHOP",
      shortDesc: "Hands-on training session on ESP32 Microcontrollers, Sensors, & Cloud Dashboard Integration.",
      fullDesc: "Master IoT sensor interfacing, Wi-Fi telemetry, MQTT protocols, and cloud dashboard design in a guided hands-on laboratory workshop led by industry engineers.",
      rules: "1. Laptops with Arduino IDE pre-installed recommended.\n2. Hardware development kits will be provided per team.\n3. Participation certificate issued upon completion.",
      eligibility: "Open to all engineering & diploma students",
      teamSize: "1-2 Members",
      minMembers: 1,
      maxMembers: 2,
      maxTeams: 80,
      rounds: "Hands-on Guided Session",
      date: "September 16, 2026",
      time: "01:45 PM - 04:15 PM",
      venue: "DSP & Advanced Microprocessor Lab",
      coordinatorName: "Dr. P. Karthik",
      coordinatorPhone: "+91 98405 12345",
      status: "OPEN",
    },
    {
      slug: "rythemania",
      title: "Rythemania",
      category: "NON_TECHNICAL",
      shortDesc: "Energetic non-technical group music, dance, & performance battle.",
      fullDesc: "Unleash stage energy and show-stopping performances! Rythemania brings together creative choreography, rhythm synchronization, and musical fusion.",
      rules: "1. Team size: 1-5 members.\n2. Time limit: 5 minutes per team.\n3. Submit audio tracks 30 mins prior to event start.",
      eligibility: "Open to all symposium participants",
      teamSize: "1-5 Members",
      minMembers: 1,
      maxMembers: 5,
      maxTeams: 40,
      rounds: "Stage Performance",
      date: "September 16, 2026",
      time: "02:00 PM - 04:30 PM",
      venue: "Main Campus Open Air Theater",
      coordinatorName: "Mr. B. Gautham",
      coordinatorPhone: "+91 98406 78901",
      status: "OPEN",
    },
    {
      slug: "e-sports",
      title: "E-Sports",
      category: "NON_TECHNICAL",
      shortDesc: "High-octane mobile & multiplayer LAN gaming battleground tournament.",
      fullDesc: "Test tactical gaming instincts in custom room tournament duels. Features strategic battle royale and fast tactical FPS multiplayer matches.",
      rules: "1. Max 4 members per squad.\n2. Players must use their own mobile devices.\n3. Tournament brackets strictly enforced.",
      eligibility: "Open to all symposium participants",
      teamSize: "1-4 Members",
      minMembers: 1,
      maxMembers: 4,
      maxTeams: 60,
      rounds: "Knockout Brackets + Grand Finals",
      date: "September 16, 2026",
      time: "01:30 PM - 04:00 PM",
      venue: "Seminar Hall Arena & Media Hub",
      coordinatorName: "Er. A. Dinesh Kumar",
      coordinatorPhone: "+91 98404 56789",
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
  console.log("✅ Seeded 6 Technical, Non-Technical & Workshop Events");

  // 3. Seed Quiz Settings
  const startTime = new Date();
  startTime.setHours(9, 0, 0, 0);
  const endTime = new Date();
  endTime.setHours(18, 0, 0, 0);

  const existingSettings = await prisma.quizSettings.findFirst();
  if (!existingSettings) {
    await prisma.quizSettings.create({
      data: {
        quizTitle: "SPARKTRON 2K26 Technical Quiz",
        startTime,
        endTime,
        isActive: true,
        durationMinutes: 30,
      },
    });
    console.log("✅ Seeded Quiz Settings (Active 09:00 AM - 06:00 PM)");
  }

  // 4. Clean & Seed Coordinators (Prevents Duplicates)
  await prisma.coordinator.deleteMany();

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
      name: "Prof. S. Meenakshi",
      role: "FACULTY",
      designation: "Faculty Co-Convener & Academic Lead",
      department: "ECE",
      phone: "+91 98402 34567",
      email: "meenakshi.ece@college.edu",
    },
    {
      name: "Dr. R. Vigneshwaren",
      role: "FACULTY",
      designation: "Technical Committee Head",
      department: "ECE",
      phone: "+91 98403 45678",
      email: "vigneshwaren.ece@college.edu",
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
      name: "Ananya R.",
      role: "STUDENT",
      designation: "Student Vice-President & Technical Lead",
      department: "ECE (Final Year)",
      phone: "+91 98765 43211",
      email: "ananya.ece26@student.edu",
    },
    {
      name: "Karthik M.",
      role: "STUDENT",
      designation: "Event Operations & Logistics Lead",
      department: "ECE (Third Year)",
      phone: "+91 98765 43212",
      email: "karthik.ece27@student.edu",
    },
    {
      name: "Priya Dharshini",
      role: "STUDENT",
      designation: "Registration & Hospitality Lead",
      department: "ECE (Final Year)",
      phone: "+91 98765 43213",
      email: "priya.ece26@student.edu",
    },
    {
      name: "Aravind Kumar",
      role: "STUDENT",
      designation: "Robotics & Hardware Track Lead",
      department: "ECE (Third Year)",
      phone: "+91 98765 43214",
      email: "aravind.ece27@student.edu",
    },
    {
      name: "Divya Bharathi",
      role: "STUDENT",
      designation: "Media, Design & PR Lead",
      department: "ECE (Third Year)",
      phone: "+91 98765 43215",
      email: "divya.ece27@student.edu",
    },
  ];

  for (const item of coordinatorsData) {
    await prisma.coordinator.create({ data: item });
  }
  console.log("✅ Cleaned & Seeded Distinct Faculty & Student Coordinators");

  // 5. Clean & Seed Sponsors (Prevents Duplicates)
  await prisma.sponsor.deleteMany();

  const sponsorsData = [
    { name: "Texas Instruments", tier: "PLATINUM", websiteUrl: "https://www.ti.com" },
    { name: "Bosch Sensing Systems", tier: "PLATINUM", websiteUrl: "https://www.bosch.com" },
    { name: "Qualcomm Wireless", tier: "GOLD", websiteUrl: "https://www.qualcomm.com" },
    { name: "Intel Embedded Solutions", tier: "GOLD", websiteUrl: "https://www.intel.com" },
    { name: "Siemens EDA", tier: "GOLD", websiteUrl: "https://www.siemens.com" },
    { name: "Microchip Technology", tier: "SILVER", websiteUrl: "https://www.microchip.com" },
    { name: "Keysight Technologies", tier: "SILVER", websiteUrl: "https://www.keysight.com" },
    { name: "MathWorks India", tier: "SILVER", websiteUrl: "https://www.mathworks.com" },
  ];

  for (const item of sponsorsData) {
    await prisma.sponsor.create({ data: item });
  }
  console.log("✅ Cleaned & Seeded Distinct Industry Sponsors");

  // 6. Seed Announcement if empty
  const existingAnn = await prisma.announcement.findFirst();
  if (!existingAnn) {
    await prisma.announcement.create({
      data: {
        title: "SPARKTRON 2K26 Registration Now Live!",
        content: "Online registration for Technical & Non-Technical event tracks is officially open.",
        priority: "HIGH",
      },
    });
  }

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
