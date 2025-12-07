import { describe, expect, it } from "vitest"
import { z } from "zod"
import { parseFormData } from "./parseFormData"

describe("parseFormData", () => {
  it("should validate and coerce using a Zod schema", () => {
    const formData = new FormData()
    formData.append("name", "Alice")
    formData.append("age", "30")
    formData.append("active", "true")

    const schema = z.object({
      name: z.string(),
      age: z.string().transform(Number),
      active: z.string().transform((v) => v === "true"),
    })

    const result = parseFormData(formData, schema)
    expect(result.success).toBe(true)
    expect((result as { data: Record<string, unknown> }).data).toEqual({
      name: "Alice",
      age: 30,
      active: true,
    })
    expect(result.input).toEqual({
      errors: [],
      properties: {
        name: { errors: [], value: "Alice" },
        age: { errors: [], value: "30" },
        active: { errors: [], value: "true" },
      },
    })
  })

  it("should return without success invalid data with a Zod schema", () => {
    const formData = new FormData()
    formData.append("name", "Bob")
    formData.append("age", "not-a-number")

    const schema = z.object({
      name: z.string(),
      age: z
        .string()
        .transform(Number)
        .refine((n) => !Number.isNaN(n), {
          message: "Age must be a number",
        }),
    })

    const result = parseFormData(formData, schema)
    expect(result.success).toBe(false)
    expect((result as { data: Record<string, unknown> }).data).toBe(undefined)
    expect(result.input).toEqual({
      errors: [],
      properties: {
        name: { errors: [], value: "Bob" },
        age: { errors: ["Age must be a number"], value: "not-a-number" },
      },
    })
  })
})
