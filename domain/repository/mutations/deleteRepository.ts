import "server-only"
import { db } from "@db"

type Params = {
  owner: string
  name: string
}

export const deleteRepository = async ({ owner, name }: Params) => {
  return await db()
    .deleteFrom("repository")
    .where("owner", "=", owner)
    .where("name", "=", name)
    .execute()
}
