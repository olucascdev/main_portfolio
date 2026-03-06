import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

// Strip channel_binding — not supported by node-postgres
const rawUrl = process.env.DATABASE_URL ?? ""
const cleanUrl = rawUrl.replace(/&?channel_binding=[^&]*/g, "").replace(/\?&/, "?")

const pool = new Pool({
  connectionString: cleanUrl,
  ssl: cleanUrl.includes("sslmode=require") ? { rejectUnauthorized: false } : false,
})

export const db = drizzle(pool, { schema })
