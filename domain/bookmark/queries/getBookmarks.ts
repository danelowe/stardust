import "server-only"
import { db } from "@db"
import { UUID } from "crypto"
import { cache } from "react"

export type BookmarkListView = Awaited<ReturnType<typeof getBookmarks>>[number]

export const getBookmarks = async ({ userId }: { userId: UUID }) => {
  const rows = await db()
    .selectFrom("bookmark as b")
    .innerJoin("repository as r", (j) =>
      j.on((eb) =>
        eb.and([
          eb("r.owner", "=", eb.ref("b.owner")),
          eb("r.name", "=", eb.ref("b.name")),
        ]),
      ),
    )
    .select([
      "r.owner",
      "r.name",
      "b.note",
      "r.starsCount",
      "r.fullName",
      "r.language",
      "r.htmlUrl",
      "r.homepageUrl",
      "r.description",
      "r.openIssuesCount",
      "r.archived",
      "r.topics",
      "r.lastCommitAt",
      "r.healthFlags",
      "r.createdAt",
      "r.githubUpdatedAt",
    ])
    .where("b.userId", "=", userId)
    .execute()

  return rows.map((r) => ({
    ...r,
    id: `${r.owner}/${r.name}`,
    lastCommitAt: r.lastCommitAt ? new Date(r.lastCommitAt) : null,
    createdAt: new Date(r.createdAt),
    githubCreatedAt: new Date(r.githubUpdatedAt),
  }))
}
export const getBookmarksCached = cache(getBookmarks)
