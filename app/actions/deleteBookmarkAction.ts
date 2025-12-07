"use server"

import { z } from "zod"
import { deleteBookmark } from "@domain/bookmark/operations/deleteBookmark"

const schema = z.object({
  owner: z.string(),
  name: z.string(),
})
type Params = z.infer<typeof schema>

/*
 * This forms the 'port' between the domain and the specific 'adapter' (being Next.js/React).
 * It also naturally takes the place of a controller.
 *
 * Making a clear separation here is useful for:
 * - Ensuring there's a clear place to focus on for check for related security patterns in code reviews.
 * - Ensuring there is room to split out to an API layer when it becomes a useful abstraction.
 */
export const deleteBookmarkAction = async (params: Params): Promise<void> => {
  const { owner, name } = z.parse(schema, params)
  await deleteBookmark({ owner, name })
}
