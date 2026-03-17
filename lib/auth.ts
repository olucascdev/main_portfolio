import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const COOKIE_NAME = "admin_token"

function getAdminSecret(): Uint8Array {
  const secret = process.env.ADMIN_SECRET_KEY
  if (!secret) {
    throw new Error("ADMIN_SECRET_KEY is not configured")
  }
  return new TextEncoder().encode(secret)
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_SECRET_KEY && process.env.ADMIN_PASSWORD)
}

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getAdminSecret())
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getAdminSecret())
    return true
  } catch {
    return false
  }
}

export async function getAdminTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = await getAdminTokenFromCookies()
  if (!token) return false
  return verifyAdminToken(token)
}

export { COOKIE_NAME }
