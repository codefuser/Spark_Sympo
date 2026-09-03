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
      date: "March 28, 2026",
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
      date: "March 28, 2026",
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
      date: "March 28, 2026",
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
      date: "March 28, 2026",
      time: "01:30 PM - 04:30 PM",
      venue: "DSP & Communication Lab",
      coordinatorName: "Er. A. Dinesh Kumar",
      coordinatorPhone: "+91 98404 56789",
      status: "OPEN",
    },
    {
      slug: "tech-trivia-quiz",
      title: "SPARK Quiz: Tech Mastermind",
      category: "QUIZ",
      shortDesc: "Rapid-fire online & live quiz on Electronics, Telecom, AI, and Tech Trivia.",
      fullDesc: "Speed, accuracy, and deep engineering knowledge! Answer multi-tier questions spanning semiconductor physics, wireless protocols, historical tech breakthroughs, and modern computing trends.",
      rules: "1. 15 Questions in 15 Minutes on our online quiz portal.\n2. Server-side timestamping to resolve ties.\n3. Top 5 qualify for live buzzer final round on stage.",
      eligibility: "Individual participation for all registered delegates",
      teamSize: "Individual",
      maxTeams: 200,
      rounds: "Online Screening + Stage Buzzer Finale",
      date: "March 28, 2026",
      time: "02:00 PM - 03:30 PM",
      venue: "Online Portal / Main Stage Auditorium",
      coordinatorName: "Ms. P. Swetha",
      coordinatorPhone: "+91 98405 67890",
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
      date: "March 28, 2026",
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
  console.log("✅ Seeded 6 Symposium Events");

  // 3. Create Sample Quiz & Questions
  const quiz = await prisma.quiz.upsert({
    where: { id: "sparktron-main-quiz-2026" },
    update: {},
    create: {
      id: "sparktron-main-quiz-2026",
      title: "SPARKTRON 2K26 National Tech Challenge",
      description: "Official ECE & Tech Knowledge Screening Quiz",
      durationMinutes: 15,
      totalQuestions: 10,
      isActive: true,
    },
  });

  const questionsData = [
    {
      id: "q1",
      quizId: quiz.id,
      questionText: "Which semiconductor material has a direct energy band gap commonly used in optoelectronics (LEDs & Laser Diodes)?",
      category: "Semiconductor Physics",
      points: 10,
      options: [
        { optionText: "Silicon (Si)", isCorrect: false },
        { optionText: "Gallium Arsenide (GaAs)", isCorrect: true },
        { optionText: "Germanium (Ge)", isCorrect: false },
        { optionText: "Carbon (Diamond)", isCorrect: false },
      ],
    },
    {
      id: "q2",
      quizId: quiz.id,
      questionText: "What is the primary function of a Schmitt Trigger circuit in digital electronics?",
      category: "Digital Circuits",
      points: 10,
      options: [
        { optionText: "Convert AC to DC voltage", isCorrect: false },
        { optionText: "Provide hysteresis to eliminate noise in switching signals", isCorrect: true },
        { optionText: "Amplify high-frequency RF signals", isCorrect: false },
        { optionText: "Generate pure sine wave oscillations", isCorrect: false },
      ],
    },
    {
      id: "q3",
      quizId: quiz.id,
      questionText: "In 5G NR (New Radio), what frequency spectrum band is categorized as millimeter Wave (mmWave)?",
      category: "Telecommunication",
      points: 10,
      options: [
        { optionText: "Sub-1 GHz", isCorrect: false },
        { optionText: "1 GHz to 6 GHz", isCorrect: false },
        { optionText: "24 GHz to 100 GHz", isCorrect: true },
        { optionText: "300 GHz to 1 THz", isCorrect: false },
      ],
    },
    {
      id: "q4",
      quizId: quiz.id,
      questionText: "What does the Nyquist-Shannon Sampling Theorem specify to prevent aliasing when converting analog to digital?",
      category: "Signal Processing",
      points: 10,
      options: [
        { optionText: "Sampling frequency must be at least twice the maximum signal frequency", isCorrect: true },
        { optionText: "Sampling frequency must equal signal bandwidth", isCorrect: false },
        { optionText: "Sampling rate must be half the signal frequency", isCorrect: false },
        { optionText: "Quantization steps must be logarithmic", isCorrect: false },
      ],
    },
    {
      id: "q5",
      quizId: quiz.id,
      questionText: "In microcontroller systems (such as ESP32 / STM32), what is the function of a Watchdog Timer (WDT)?",
      category: "Embedded Systems",
      points: 10,
      options: [
        { optionText: "Measure precise CPU temperature", isCorrect: false },
        { optionText: "Reset the microcontroller if firmware hangs or gets stuck in infinite loops", isCorrect: true },
        { optionText: "Increase clock multiplier for Turbo mode", isCorrect: false },
        { optionText: "Encrypt serial SPI communication payload", isCorrect: false },
      ],
    },
    {
      id: "q6",
      quizId: quiz.id,
      questionText: "Which logic gate family provides the lowest static power consumption in integrated circuits?",
      category: "VLSI Design",
      points: 10,
      options: [
        { optionText: "TTL (Transistor-Transistor Logic)", isCorrect: false },
        { optionText: "ECL (Emitter-Coupled Logic)", isCorrect: false },
        { optionText: "CMOS (Complementary Metal-Oxide-Semiconductor)", isCorrect: true },
        { optionText: "NMOS Depletion Logic", isCorrect: false },
      ],
    },
    {
      id: "q7",
      quizId: quiz.id,
      questionText: "What protocol is widely used for low-power long-range IoT sensor communication up to 15km?",
      category: "IoT Communications",
      points: 10,
      options: [
        { optionText: "Bluetooth Low Energy (BLE)", isCorrect: false },
        { optionText: "LoRaWAN", isCorrect: true },
        { optionText: "Zigbee", isCorrect: false },
        { optionText: "NFC", isCorrect: false },
      ],
    },
    {
      id: "q8",
      quizId: quiz.id,
      questionText: "What is the theoretical maximum efficiency of a Class A power amplifier?",
      category: "Analog Electronics",
      points: 10,
      options: [
        { optionText: "25% (or 50% with transformer coupling)", isCorrect: true },
        { optionText: "78.5%", isCorrect: false },
        { optionText: "90%", isCorrect: false },
        { optionText: "100%", isCorrect: false },
      ],
    },
    {
      id: "q9",
      quizId: quiz.id,
      questionText: "In Fiber Optic Communications, what physical phenomenon guides light through the core?",
      category: "Optoelectronics",
      points: 10,
      options: [
        { optionText: "Total Internal Reflection", isCorrect: true },
        { optionText: "Diffraction Gradient", isCorrect: false },
        { optionText: "Birefringence Dispersion", isCorrect: false },
        { optionText: "Photoelectric Absorption", isCorrect: false },
      ],
    },
    {
      id: "q10",
      quizId: quiz.id,
      questionText: "Who is celebrated as the Father of Electronics for inventing the Triode Vacuum Tube (Audion) in 1906?",
      category: "Tech History",
      points: 10,
      options: [
        { optionText: "Nikola Tesla", isCorrect: false },
        { optionText: "Lee de Forest", isCorrect: true },
        { optionText: "Guglielmo Marconi", isCorrect: false },
        { optionText: "Heinrich Hertz", isCorrect: false },
      ],
    },
  ];

  for (const q of questionsData) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {},
      create: {
        id: q.id,
        quizId: q.quizId,
        questionText: q.questionText,
        category: q.category,
        points: q.points,
        options: {
          create: q.options,
        },
      },
    });
  }
  console.log("✅ Seeded Quiz and 10 Technical MCQ Questions");

  // 4. Seed Coordinators
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

  // 5. Seed Sponsors
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

  // 6. Seed Sample Announcements
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
