import "server-only"
import { bookmarkStore } from "@domain/bookmark/store"
import { DEMO_USER_ID } from "@lib/constants"
import { db } from "@db"
import { repositoryStore } from "@domain/repository/store"

const userId = DEMO_USER_ID

export const deleteBookmark = async ({
  owner,
  name,
}: {
  owner: string
  name: string
}) => {
  await bookmarkStore.deleteBookmark({ owner, name, userId })

  // We can be pragmatic and directly create queries that aren't likely to be reused.
  const repoInUse = await db()
    .selectNoFrom((eb) => eb.lit(true).as("exists"))
    .where((eb) =>
      eb.exists(
        eb
          .selectFrom("bookmark")
          .where((eb) =>
            eb.and([eb("owner", "=", owner), eb("name", "=", name)]),
          ),
      ),
    )
    .execute()

  if (!repoInUse.length) {
    await repositoryStore.deleteRepository({ owner, name })
  }
}
