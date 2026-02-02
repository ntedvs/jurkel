import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  people: defineTable({
    name: v.string(),
    x: v.number(),
    y: v.number(),
  }),
})
