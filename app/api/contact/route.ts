import { NextResponse } from "next/server"
import { db } from "@/db"
import { contactLinks } from "@/db/schema"
import { isAdminAuthenticated } from "@/lib/auth"
import { eq, asc } from "drizzle-orm"

export async function GET() {
  try {
    const rows = await db.select().from(contactLinks).orderBy(asc(contactLinks.orderIndex))
    return NextResponse.json(rows)
  } catch {
    return NextResponse.json({ error: "Failed to fetch contact links" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json()
    const [row] = await db.insert(contactLinks).values(body).returning()
    return NextResponse.json(row)
  } catch {
    return NextResponse.json({ error: "Failed to create contact link" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { id, ...data } = body
    const [row] = await db.update(contactLinks).set(data).where(eq(contactLinks.id, id)).returning()
    return NextResponse.json(row)
  } catch {
    return NextResponse.json({ error: "Failed to update contact link" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const id = Number(searchParams.get("id"))
    await db.delete(contactLinks).where(eq(contactLinks.id, id))
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete contact link" }, { status: 500 })
  }
}
