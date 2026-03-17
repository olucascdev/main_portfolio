import { z } from "zod"
import { getSafeUrl } from "@/lib/safe-url"

function requiredString(max: number) {
  return z.string().trim().min(1).max(max)
}

function optionalSafeUrl(options: { allowRelative?: boolean; protocols?: string[] }) {
  return z
    .string()
    .trim()
    .max(2048)
    .refine((value) => value === "" || Boolean(getSafeUrl(value, options)), {
      message: "Invalid URL",
    })
    .transform((value) => getSafeUrl(value, options) ?? "")
}

function stringArray(maxItems: number, maxLength: number) {
  return z.array(z.string().trim().min(1).max(maxLength)).max(maxItems)
}

const orderIndex = z.coerce.number().int().min(0).max(10_000)
const recordId = z.coerce.number().int().positive()

export const heroPayloadSchema = z.object({
  name: requiredString(120),
  title: requiredString(160),
  subtitle: requiredString(200),
  description: requiredString(5_000),
  githubUrl: optionalSafeUrl({ protocols: ["https:", "http:"] }),
  linkedinUrl: optionalSafeUrl({ protocols: ["https:", "http:"] }),
  cvUrl: optionalSafeUrl({ allowRelative: true, protocols: ["https:", "http:"] }),
  imageUrl: optionalSafeUrl({ allowRelative: true, protocols: ["https:", "http:"] }),
})

export const createSkillSchema = z.object({
  category: requiredString(80),
  items: stringArray(30, 60),
  orderIndex,
})

export const updateSkillSchema = createSkillSchema.extend({
  id: recordId,
})

export const createProjectSchema = z.object({
  title: requiredString(140),
  description: requiredString(5_000),
  tech: stringArray(30, 60),
  githubUrl: optionalSafeUrl({ protocols: ["https:", "http:"] }),
  liveUrl: optionalSafeUrl({ protocols: ["https:", "http:"] }),
  imageUrl: optionalSafeUrl({ allowRelative: true, protocols: ["https:", "http:"] }),
  orderIndex,
})

export const updateProjectSchema = createProjectSchema.extend({
  id: recordId,
})

export const createExperienceSchema = z.object({
  period: requiredString(120),
  role: requiredString(160),
  company: requiredString(160),
  description: requiredString(5_000),
  orderIndex,
})

export const updateExperienceSchema = createExperienceSchema.extend({
  id: recordId,
})

export const createContactSchema = z.object({
  label: requiredString(80),
  value: requiredString(160),
  href: optionalSafeUrl({ protocols: ["https:", "http:", "mailto:", "tel:"] }).refine(
    (value) => value !== "",
    { message: "Invalid contact URL" },
  ),
  orderIndex,
})

export const updateContactSchema = createContactSchema.extend({
  id: recordId,
})

export const paragraphPayloadSchema = z.object({
  content: requiredString(5_000),
  orderIndex,
})

export const updateParagraphSchema = paragraphPayloadSchema.extend({
  id: recordId,
})

export const statPayloadSchema = z.object({
  value: requiredString(32),
  label: requiredString(80),
  orderIndex,
})

export const updateStatSchema = statPayloadSchema.extend({
  id: recordId,
})

export const deleteIdSchema = z.coerce.number().int().positive()
