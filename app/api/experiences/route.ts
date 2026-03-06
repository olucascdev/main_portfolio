import { NextResponse } from "next/server"
import { db } from "@/db"
import { experiences } from "@/db/schema"
import { isAdminAuthenticated } from "@/lib/auth"
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
    const body = await req.json()
    const [row] = await db.insert(experiences).values(body).returning()
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
    const body = await req.json()
    const { id, ...data } = body
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
    const id = Number(searchParams.get("id"))
    await db.delete(experiences).where(eq(experiences.id, id))
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete experience" }, { status: 500 })
  }
}
