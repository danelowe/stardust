import { z } from "zod"

type NestedContainer = Record<string, unknown> | unknown[]
export type ValidationResult<T> = ReturnType<typeof z.treeifyError<T>>

export type Primitive =
  | string
  | number
  | symbol
  | bigint
  | boolean
  | null
  | undefined
export type Input<T> = T extends Primitive
  ? { errors: string[]; value: T }
  : T extends unknown[]
    ? { errors: string[]; items: Input<T[number]>[] }
    : T extends object
      ? { errors: string[]; properties: { [K in keyof T]: Input<T[K]> } }
      : never

type SuccessResponse<T> = {
  success: true
  data: T
}

type ErrorResponse = {
  success: false
}

export type ParsedResult<T extends object> = (
  | SuccessResponse<T>
  | ErrorResponse
) & {
  input: Input<T>
}

/**
 * Parse FormData
 *
 * Parses from FormData to an object, and ensures it conforms to zod schema.
 *
 * This is the heart of the port between frontend and backend.
 * Creating strong patterns here will help ensure writing and reviewing code goes smoothly,
 * as it becomes clear where code has diverged from the golden path.
 *
 * This will return:
 * `success`: Whether the input conforms to the zod schema.
 * `data`: If the input conforms to the schema, this is the validated data, ready to use in backend.
 * `input`: This is the data as sent by frontend,
 *    coerced into the same shape as the schema, and with validation errors attached.
 *    This is to allow a server-driven state pattern for presenting validation errors on frontend and retaining form values.
 *    DO NOT USE `input` IN BACKEND.
 */
export const parseFormData = <T extends object>(
  formData: FormData,
  schema: z.ZodSchema<T>,
): ParsedResult<T> => {
  const data: Record<string, unknown> = {}

  for (const [key, value] of formData.entries()) {
    setNestedValue(data, key.split("."), value)
  }
  const shaped = transformToSchemaShape(data, schema)
  const result = schema.safeParse(data)
  const errors: ValidationResult<T> | undefined = result.error
    ? z.treeifyError(result.error)
    : undefined
  const input = mergeErrors(shaped, errors)

  return {
    success: result.success,
    data: result.data,
    input,
  } as ParsedResult<T>
}

/*
 * Merge validation errors into the nested `Input` data.
 */
// Zod treeifyError results are not discriminated union, so it's easier to understand without types.
// (Also don't want to spend time on it yet)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mergeErrors = <T>(data: T, results: any): Input<T> => {
  if (Array.isArray(data)) {
    return {
      errors: results?.errors || [],
      items: data.map((item, i) => mergeErrors(item, results?.items[i])),
    } as Input<T>
  } else if (typeof data === "object" && data !== null) {
    return {
      errors: results?.errors || [],
      properties: Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          mergeErrors(value, results?.properties[key]),
        ]),
      ),
    } as Input<T>
  }
  return { value: data, errors: results?.errors || [] } as Input<T>
}

/**
 * Transform data to match the schema structure without validating values
 */
const transformToSchemaShape = <T>(data: unknown, schema: z.ZodType<T>): T => {
  if (schema instanceof z.ZodObject) {
    const result: Record<string, unknown> = {}
    const shape = schema.shape

    for (const [key, value] of Object.entries(
      data as Record<string, unknown>,
    )) {
      if (key in shape) {
        const fieldSchema = shape[key]
        if (fieldSchema instanceof z.ZodType) {
          result[key] = transformToSchemaShape(value, fieldSchema)
        } else {
          result[key] = value
        }
      }
      // Skip keys not in the schema
    }

    return result as T
  } else if (schema instanceof z.ZodArray) {
    const itemSchema = schema.def.type as unknown as z.ZodType
    return (
      Array.isArray(data)
        ? data.map((item) => transformToSchemaShape(item, itemSchema))
        : []
    ) as T
  } else {
    // For primitive types, return the value as-is without validation
    return data as T
  }
}

const isArrayIndex = (segment: string): boolean => /^#\d+$/.test(segment)

const getArrayIndex = (segment: string): number =>
  parseInt(segment.slice(1), 10)

const setNestedValue = (
  container: NestedContainer,
  path: string[],
  value: FormDataEntryValue,
): void => {
  if (path.length === 0) {
    return
  }

  const [segment, ...remainingPath] = path
  const isLast = remainingPath.length === 0

  if (isArrayIndex(segment)) {
    if (!Array.isArray(container)) {
      throw new Error(`Expected array but found ${typeof container}`)
    }

    const index = getArrayIndex(segment)

    if (isLast) {
      container[index] = value
    } else {
      let target = container[index]

      if (!target || typeof target !== "object") {
        target = isArrayIndex(remainingPath[0]) ? [] : {}
        container[index] = target
      }

      setNestedValue(target as NestedContainer, remainingPath, value)
    }
  } else {
    if (!container || Array.isArray(container)) {
      throw new Error(
        `Expected object but found ${Array.isArray(container) ? "array" : typeof container}`,
      )
    }

    const obj = container as Record<string, unknown>

    if (isLast) {
      obj[segment] = value
    } else {
      if (!obj[segment]) {
        obj[segment] = isArrayIndex(remainingPath[0]) ? [] : {}
      }

      setNestedValue(obj[segment] as NestedContainer, remainingPath, value)
    }
  }
}
