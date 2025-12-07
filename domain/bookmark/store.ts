import { createBookmark } from "@domain/bookmark/mutations/createBookmark"
import {
  getBookmarks,
  getBookmarksCached,
} from "@domain/bookmark/queries/getBookmarks"
import { deleteBookmark } from "@domain/bookmark/mutations/deleteBookmark"

/*
 * Combine the queries and mutations into a Store
 * (avoiding calling it a Repository to prevent confusion with domain)
 */
export const bookmarkStore = {
  createBookmark,
  getBookmarks,
  getBookmarksCached,
  deleteBookmark,
}
