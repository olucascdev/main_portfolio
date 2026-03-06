import { NextResponse } from "next/server"
import { db } from "@/db"
import { projects } from "@/db/schema"
import { isAdminAuthenticated } from "@/lib/auth"
import { eq, asc } from "drizzle-orm"

export async function GET() {
  try {
    const rows = await db.select().from(projects).orderBy(asc(projects.orderIndex))
    return NextResponse.json(rows)
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { title, description, tech, githubUrl, liveUrl, imageUrl, orderIndex } = await req.json()
    const [row] = await db.insert(projects).values({ title, description, tech, githubUrl, liveUrl, imageUrl, orderIndex }).returning()
    return NextResponse.json(row)
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id, title, description, tech, githubUrl, liveUrl, imageUrl, orderIndex } = await req.json()
    const [row] = await db.update(projects).set({ title, description, tech, githubUrl, liveUrl, imageUrl, orderIndex }).where(eq(projects.id, id)).returning()
    return NextResponse.json(row)
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const id = Number(searchParams.get("id"))
    await db.delete(projects).where(eq(projects.id, id))
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
