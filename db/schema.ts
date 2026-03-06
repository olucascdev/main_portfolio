import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core"

// ─── Hero ───────────────────────────────────────────────────────────────────
export const hero = pgTable("hero", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  githubUrl: text("github_url").notNull().default(""),
  linkedinUrl: text("linkedin_url").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// ─── About Paragraphs ───────────────────────────────────────────────────────
export const aboutParagraphs = pgTable("about_paragraphs", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
})

// ─── About Stats ────────────────────────────────────────────────────────────
export const aboutStats = pgTable("about_stats", {
  id: serial("id").primaryKey(),
  value: text("value").notNull(),
  label: text("label").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
})

// ─── Skills ─────────────────────────────────────────────────────────────────
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  items: jsonb("items").$type<string[]>().notNull().default([]),
  orderIndex: integer("order_index").notNull().default(0),
})

// ─── Projects ───────────────────────────────────────────────────────────────
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  tech: jsonb("tech").$type<string[]>().notNull().default([]),
  githubUrl: text("github_url").notNull().default(""),
  liveUrl: text("live_url").notNull().default(""),
  imageUrl: text("image_url").default(""),
  orderIndex: integer("order_index").notNull().default(0),
})

// ─── Experiences ────────────────────────────────────────────────────────────
export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  period: text("period").notNull(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  description: text("description").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
})

// ─── Contact Links ──────────────────────────────────────────────────────────
export const contactLinks = pgTable("contact_links", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  href: text("href").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
})

// ─── Types ──────────────────────────────────────────────────────────────────
export type Hero = typeof hero.$inferSelect
export type HeroInsert = typeof hero.$inferInsert

export type AboutParagraph = typeof aboutParagraphs.$inferSelect
export type AboutParagraphInsert = typeof aboutParagraphs.$inferInsert

export type AboutStat = typeof aboutStats.$inferSelect
export type AboutStatInsert = typeof aboutStats.$inferInsert

export type Skill = typeof skills.$inferSelect
export type SkillInsert = typeof skills.$inferInsert

export type Project = typeof projects.$inferSelect
export type ProjectInsert = typeof projects.$inferInsert

export type Experience = typeof experiences.$inferSelect
export type ExperienceInsert = typeof experiences.$inferInsert

export type ContactLink = typeof contactLinks.$inferSelect
export type ContactLinkInsert = typeof contactLinks.$inferInsert
