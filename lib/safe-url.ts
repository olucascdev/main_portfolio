type SafeUrlOptions = {
  allowRelative?: boolean
  protocols?: string[]
}

const DEFAULT_PROTOCOLS = ["https:", "http:"]

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

  try {
    const parsed = new URL(trimmed)
    const allowedProtocols = options.protocols ?? DEFAULT_PROTOCOLS
    if (!allowedProtocols.includes(parsed.protocol)) {
      return undefined
    }
    return parsed.toString()
  } catch {
    return undefined
  }
}
