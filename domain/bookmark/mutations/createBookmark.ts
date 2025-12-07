import "server-only"
import { Insertable } from "kysely"
import { Bookmark, db } from "@db"

export const createBookmark = async (bookmark: Insertable<Bookmark>) => {
  return await db()
    .insertInto("bookmark")
    .values(bookmark)
    .returning(["owner", "name"])
    .executeTakeFirst()
}
