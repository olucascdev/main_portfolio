import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

// Strip channel_binding — not supported by node-postgres
const rawUrl = process.env.DATABASE_URL || ""

if (!rawUrl) {
  console.error("❌ DATABASE_URL is missing! Check your .env.local file.")
}

const cleanUrl = rawUrl.replace(/&?channel_binding=[^&]*/g, "").replace(/\?&/, "?")

const pool = new Pool({
  connectionString: cleanUrl,
  ssl: cleanUrl.includes("sslmode=") ? { rejectUnauthorized: false } : false,
})

export const db = drizzle(pool, { schema })
