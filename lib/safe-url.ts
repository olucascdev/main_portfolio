type SafeUrlOptions = {
  allowRelative?: boolean
  protocols?: string[]
}

const DEFAULT_PROTOCOLS = ["https:", "http:"]
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[+\d()[\]\s-]{6,}$/

export function getSafeUrl(
  value: string | null | undefined,
  options: SafeUrlOptions = {},
): string | undefined {
  if (!value) return undefined

  const trimmed = value.trim()
  if (!trimmed) return undefined

  if (options.allowRelative && trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed
  }

  const allowedProtocols = options.protocols ?? DEFAULT_PROTOCOLS

  if (!trimmed.includes(":")) {
    if (allowedProtocols.includes("mailto:") && EMAIL_PATTERN.test(trimmed)) {
      return `mailto:${trimmed}`
    }

    if (allowedProtocols.includes("tel:") && PHONE_PATTERN.test(trimmed)) {
      return `tel:${trimmed}`
    }

    if (
      (allowedProtocols.includes("https:") || allowedProtocols.includes("http:")) &&
      !trimmed.startsWith("//")
    ) {
      return getSafeUrl(`https://${trimmed}`, options)
    }
  }

  try {
    const parsed = new URL(trimmed)
    if (!allowedProtocols.includes(parsed.protocol)) {
      return undefined
    }
    return parsed.toString()
  } catch {
    return undefined
  }
}
