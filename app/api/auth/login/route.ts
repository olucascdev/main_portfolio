import { NextResponse } from "next/server"
import { timingSafeEqual } from "node:crypto"
import { z } from "zod"
import { signAdminToken, COOKIE_NAME, isAdminAuthConfigured } from "@/lib/auth"
import {
  clearLoginAttempts,
  getLoginRateLimitKey,
  getLoginRateLimitState,
  recordFailedLoginAttempt,
} from "@/lib/login-rate-limit"

const loginSchema = z.object({
  password: z.string().min(1).max(256),
})

export async function POST(req: Request) {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json({ error: "Admin authentication is not configured" }, { status: 500 })
  }

  const rateLimitKey = getLoginRateLimitKey(req.headers)
  const rateLimitState = getLoginRateLimitState(rateLimitKey)
  if (!rateLimitState.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimitState.retryAfter) },
      },
    )
  }

  try {
    const parsed = loginSchema.safeParse(await req.json())
    if (!parsed.success) {
      recordFailedLoginAttempt(rateLimitKey)
      return NextResponse.json({ error: "Invalid login payload" }, { status: 400 })
    }

    const expectedPassword = process.env.ADMIN_PASSWORD
    if (!expectedPassword) {
      return NextResponse.json({ error: "Admin authentication is not configured" }, { status: 500 })
    }

    const providedBuffer = Buffer.from(parsed.data.password)
    const expectedBuffer = Buffer.from(expectedPassword)
    const isValidPassword =
      providedBuffer.length === expectedBuffer.length &&
      timingSafeEqual(providedBuffer, expectedBuffer)

    if (!isValidPassword) {
      recordFailedLoginAttempt(rateLimitKey)
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    const token = await signAdminToken()
    clearLoginAttempts(rateLimitKey)

    const res = NextResponse.json({ success: true })
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })
    return res
  } catch {
    recordFailedLoginAttempt(rateLimitKey)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
