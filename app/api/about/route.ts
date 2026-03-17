import { NextResponse } from "next/server"
import { db } from "@/db"
import { aboutParagraphs, aboutStats } from "@/db/schema"
import { isAdminAuthenticated } from "@/lib/auth"
import {
  deleteIdSchema,
  paragraphPayloadSchema,
  statPayloadSchema,
  updateParagraphSchema,
  updateStatSchema,
} from "@/lib/api-validation"
import { eq, asc } from "drizzle-orm"

export async function GET() {
  try {
    const paragraphs = await db
      .select()
      .from(aboutParagraphs)
      .orderBy(asc(aboutParagraphs.orderIndex))
    const stats = await db
      .select()
      .from(aboutStats)
      .orderBy(asc(aboutStats.orderIndex))
    return NextResponse.json({ paragraphs, stats })
  } catch {
    return NextResponse.json({ error: "Failed to fetch about" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { type } = body

    if (type === "paragraph") {
      const parsed = paragraphPayloadSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid paragraph payload", details: parsed.error.flatten() }, { status: 400 })
      }

      const [row] = await db.insert(aboutParagraphs).values(parsed.data).returning()
      return NextResponse.json(row)
    } else if (type === "stat") {
      const parsed = statPayloadSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid stat payload", details: parsed.error.flatten() }, { status: 400 })
      }

      const [row] = await db.insert(aboutStats).values(parsed.data).returning()
      return NextResponse.json(row)
    }
    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { type, id } = body

    if (type === "paragraph") {
      const parsed = updateParagraphSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid paragraph payload", details: parsed.error.flatten() }, { status: 400 })
      }

      const { id, ...data } = parsed.data
      const [row] = await db.update(aboutParagraphs).set(data).where(eq(aboutParagraphs.id, id)).returning()
      return NextResponse.json(row)
    } else if (type === "stat") {
      const parsed = updateStatSchema.safeParse(body)
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid stat payload", details: parsed.error.flatten() }, { status: 400 })
      }

      const { id, ...data } = parsed.data
      const [row] = await db.update(aboutStats).set(data).where(eq(aboutStats.id, id)).returning()
      return NextResponse.json(row)
    }
    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
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
      return NextResponse.json({ error: "Invalid about id" }, { status: 400 })
    }

    const id = parsed.data
    const type = searchParams.get("type")

    if (type === "paragraph") {
      await db.delete(aboutParagraphs).where(eq(aboutParagraphs.id, id))
    } else if (type === "stat") {
      await db.delete(aboutStats).where(eq(aboutStats.id, id))
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
