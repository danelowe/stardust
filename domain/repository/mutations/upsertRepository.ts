import { Insertable } from "kysely"
import { db, Repository } from "@db"
import { omit } from "es-toolkit"

export const upsertRepository = async (repository: Insertable<Repository>) => {
  await db()
    .insertInto("repository")
    .values(repository)
    .onConflict((c) =>
      c.columns(["owner", "name"]).doUpdateSet(omit(repository, ["createdAt"])),
    )
    .execute()
}
