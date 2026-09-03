const { execSync } = require("child_process");

// Set fallback DATABASE_URL if missing in Vercel environment
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
  process.env.DATABASE_URL = "file:./dev.db";
  console.log("ℹ️ Defaulting DATABASE_URL to file:./dev.db for Vercel deployment");
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() === "") {
  process.env.JWT_SECRET = "sparktron_2k26_super_secret_jwt_key_ece_dept_symposium";
}

try {
  console.log("🛠️ Running Vercel build pipeline...");
  
  // 1. Sync database schema for SQLite on Vercel
  try {
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit", env: process.env });
  } catch (e) {
    console.warn("⚠️ Warning on DB push:", e.message);
  }

  // 2. Seed initial data
  try {
    execSync("node prisma/seed.js", { stdio: "inherit", env: process.env });
  } catch (e) {
    console.warn("⚠️ Warning on DB seed:", e.message);
  }

  // 3. Next.js production build
  execSync("npx next build", { stdio: "inherit", env: process.env });
  console.log("🎉 Vercel build pipeline completed successfully!");
} catch (error) {
  console.error("❌ Vercel build failed:", error);
  process.exit(1);
}
