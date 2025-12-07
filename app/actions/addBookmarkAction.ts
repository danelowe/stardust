"use server"

import { z } from "zod"
import { escapeHTML } from "es-escape-html"
import { addBookmark } from "@domain/bookmark/operations/addBookmark"
import { parseFormData } from "@lib/parseFormData"
import { ActionState } from "@app/hooks/useAction"
import { ApplicationError } from "@lib/error"

// `owner/repository` format
const REGEX_REPOSITORY_ID = /^[\w-.]+\/[\w-.]+$/

const schema = z.object({
  repository: z.url().or(z.string().regex(REGEX_REPOSITORY_ID)),
  note: z.string(),
})
type AddBookmarkFields = z.infer<typeof schema>

/*
 * This forms the 'port' between the domain and the specific 'adapter' (being Next.js/React).
 * It also naturally takes the place of a controller.
 *
 * Making a clear separation here is useful for:
 * - Ensuring there's a clear place to focus on for check for related security patterns in code reviews.
 * - Ensuring there is room to split out to an API layer when it becomes a useful abstraction.
 */
export const addBookmarkAction = async (
  unsafeForm: FormData,
): Promise<ActionState<AddBookmarkFields>> => {
  // TODO: implement a pattern for CSRF et al. (after checking if Next.js handles it already)
  const parsed = parseFormData(unsafeForm, schema)
  if (parsed.success) {
    // TODO: implement a pattern such that parsed.data is always safe,
    // to make a single place to check sanitizing of inputs in code reviews.
    // Perhaps simply a callback passed to parseFormData
    // Even if HTML is handled safely on display by React, any data in the database remains a liability,
    // and software patterns can change over time.
    const data = { ...parsed.data, note: escapeHTML(parsed.data.note) }

    // TODO: Create a consistent pattern for error handling
    try {
      await addBookmark(data)
    } catch (e) {
      const message =
        e instanceof ApplicationError
          ? e.message
          : "An error occurred while adding new bookmark."
      return {
        success: false,
        input: { ...parsed.input, errors: [...parsed.input.errors, message] },
      }
    }

    return {
      success: true,
      message: "Bookmark added",
      input: parsed.input,
    }
  }

  return { success: false, input: parsed.input }
}
