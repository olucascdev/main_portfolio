import { NextResponse } from "next/server"
import { db } from "@/db"
import { contactLinks } from "@/db/schema"
import { isAdminAuthenticated } from "@/lib/auth"
import { createContactSchema, deleteIdSchema, updateContactSchema } from "@/lib/api-validation"
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
    const parsed = createContactSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid contact payload", details: parsed.error.flatten() }, { status: 400 })
    }

    const [row] = await db.insert(contactLinks).values(parsed.data).returning()
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
    const parsed = updateContactSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid contact payload", details: parsed.error.flatten() }, { status: 400 })
    }

    const { id, ...data } = parsed.data
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
    const parsed = deleteIdSchema.safeParse(searchParams.get("id"))
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid contact id" }, { status: 400 })
    }

    const id = parsed.data
    await db.delete(contactLinks).where(eq(contactLinks.id, id))
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete contact link" }, { status: 500 })
  }
}
