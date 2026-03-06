import { NextResponse } from "next/server"
import { db } from "@/db"
import { skills } from "@/db/schema"
import { isAdminAuthenticated } from "@/lib/auth"
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
    const { category, items, orderIndex } = await req.json()
    const [row] = await db.insert(skills).values({ category, items, orderIndex }).returning()
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
    const { id, category, items, orderIndex } = await req.json()
    const [row] = await db.update(skills).set({ category, items, orderIndex }).where(eq(skills.id, id)).returning()
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
    const id = Number(searchParams.get("id"))
    await db.delete(skills).where(eq(skills.id, id))
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 })
  }
}
