import { NextResponse } from "next/server"
import { db } from "@/db"
import { aboutParagraphs, aboutStats } from "@/db/schema"
import { isAdminAuthenticated } from "@/lib/auth"
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
      const { content, orderIndex } = body
      const [row] = await db.insert(aboutParagraphs).values({ content, orderIndex }).returning()
      return NextResponse.json(row)
    } else if (type === "stat") {
      const { value, label, orderIndex } = body
      const [row] = await db.insert(aboutStats).values({ value, label, orderIndex }).returning()
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
      const { content, orderIndex } = body
      const [row] = await db.update(aboutParagraphs).set({ content, orderIndex }).where(eq(aboutParagraphs.id, id)).returning()
      return NextResponse.json(row)
    } else if (type === "stat") {
      const { value, label, orderIndex } = body
      const [row] = await db.update(aboutStats).set({ value, label, orderIndex }).where(eq(aboutStats.id, id)).returning()
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
    const id = Number(searchParams.get("id"))
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
