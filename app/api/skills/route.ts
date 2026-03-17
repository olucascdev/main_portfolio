import { NextResponse } from "next/server"
import { db } from "@/db"
import { skills } from "@/db/schema"
import { isAdminAuthenticated } from "@/lib/auth"
import { createSkillSchema, deleteIdSchema, updateSkillSchema } from "@/lib/api-validation"
import { eq, asc } from "drizzle-orm"

export async function GET() {
  try {
    const rows = await db.select().from(skills).orderBy(asc(skills.orderIndex))
    return NextResponse.json(rows)
  } catch {
    return NextResponse.json({ error: "Failed to fetch skills" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const parsed = createSkillSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid skill payload", details: parsed.error.flatten() }, { status: 400 })
    }

    const [row] = await db.insert(skills).values(parsed.data).returning()
    return NextResponse.json(row)
  } catch {
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const parsed = updateSkillSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid skill payload", details: parsed.error.flatten() }, { status: 400 })
    }

    const { id, ...data } = parsed.data
    const [row] = await db.update(skills).set(data).where(eq(skills.id, id)).returning()
    return NextResponse.json(row)
  } catch {
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const parsed = deleteIdSchema.safeParse(searchParams.get("id"))
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid skill id" }, { status: 400 })
    }

    const id = parsed.data
    await db.delete(skills).where(eq(skills.id, id))
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 })
  }
}
