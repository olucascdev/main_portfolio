import { NextResponse } from "next/server"
import { db } from "@/db"
import { hero } from "@/db/schema"
import { isAdminAuthenticated } from "@/lib/auth"
import { heroPayloadSchema } from "@/lib/api-validation"
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
    const parsed = heroPayloadSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid hero payload", details: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data
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
