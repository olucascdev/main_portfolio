import { NextResponse } from "next/server"
import { db } from "@/db"
import { experiences } from "@/db/schema"
import { isAdminAuthenticated } from "@/lib/auth"
import { createExperienceSchema, deleteIdSchema, updateExperienceSchema } from "@/lib/api-validation"
import { eq, asc } from "drizzle-orm"

export async function GET() {
  try {
    const rows = await db.select().from(experiences).orderBy(asc(experiences.orderIndex))
    return NextResponse.json(rows)
  } catch {
    return NextResponse.json({ error: "Failed to fetch experiences" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const parsed = createExperienceSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid experience payload", details: parsed.error.flatten() }, { status: 400 })
    }

    const [row] = await db.insert(experiences).values(parsed.data).returning()
    return NextResponse.json(row)
  } catch {
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const parsed = updateExperienceSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid experience payload", details: parsed.error.flatten() }, { status: 400 })
    }

    const { id, ...data } = parsed.data
    const [row] = await db.update(experiences).set(data).where(eq(experiences.id, id)).returning()
    return NextResponse.json(row)
  } catch {
    return NextResponse.json({ error: "Failed to update experience" }, { status: 500 })
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
      return NextResponse.json({ error: "Invalid experience id" }, { status: 400 })
    }

    const id = parsed.data
    await db.delete(experiences).where(eq(experiences.id, id))
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 })
  }
}
