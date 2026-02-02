import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createPerson = mutation({
  args: { name: v.string() },
  handler: async ({ db }, args) => {
    await db.insert("people", { name: args.name, x: 0, y: 0 })
  },
})

export const movePerson = mutation({
  args: {
    id: v.id("people"),
    x: v.number(),
    y: v.number(),
  },
  handler: async ({ db }, args) => {
    await db.patch("people", args.id, { x: args.x, y: args.y })
  },
})

export const getPeople = query({
  handler: async ({ db }) => {
    return db.query("people").collect()
  },
})
