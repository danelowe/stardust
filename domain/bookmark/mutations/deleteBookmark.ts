import "server-only"
import { db } from "@db"

type Params = {
  owner: string
  name: string
  userId: string
}

export const deleteBookmark = async ({ owner, name, userId }: Params) => {
  return await db()
    .deleteFrom("bookmark")
    .where("userId", "=", userId)
    .where("owner", "=", owner)
    .where("name", "=", name)
    .execute()
}
