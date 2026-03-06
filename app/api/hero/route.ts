import { NextResponse } from "next/server"
import { db } from "@/db"
import { hero } from "@/db/schema"
import { isAdminAuthenticated } from "@/lib/auth"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const rows = await db.select().from(hero).limit(1)
    return NextResponse.json(rows[0] ?? null)
  } catch {
    return NextResponse.json({ error: "Failed to fetch hero" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { name, title, subtitle, description, githubUrl, linkedinUrl, cvUrl, imageUrl } = await req.json()
    const data = { name, title, subtitle, description, githubUrl, linkedinUrl, cvUrl, imageUrl }
    
    const rows = await db.select().from(hero).limit(1)

    if (rows.length === 0) {
      const [inserted] = await db.insert(hero).values(data).returning()
      return NextResponse.json(inserted)
    } else {
      const [updated] = await db
        .update(hero)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(hero.id, rows[0].id))
        .returning()
      return NextResponse.json(updated)
    }
  } catch {
    return NextResponse.json({ error: "Failed to update hero" }, { status: 500 })
  }
}
