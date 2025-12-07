import "server-only"
import { updateRepositoryInformation } from "@domain/repository/operations/updateRepositoryInformation"
import { bookmarkStore } from "@domain/bookmark/store"
import { DEMO_USER_ID } from "@lib/constants"
import { ApplicationError } from "@lib/error"

const userId = DEMO_USER_ID

export const addBookmark = async (data: {
  repository: string
  note: string
}) => {
  const { owner, name } = parseRepositoryIdentifier(data.repository)

  await updateRepositoryInformation({ owner, name })

  try {
    return await bookmarkStore.createBookmark({
      userId,
      owner,
      name,
      note: data.note,
    })
  } catch (e) {
    // TODO: find actual types of SQL errors
    if ((e as { code: string }).code === "23505") {
      throw new ApplicationError("Bookmark already exists", { cause: e })
    }
    throw e
  }
}

const parseRepositoryIdentifier = (repository: string) => {
  const url = URL.parse(repository)
  if (url) {
    return parseRepositoryIdentifier(url.pathname)
  }

  const [owner, name] = repository.split("/").filter((x) => !!x)

  return { owner, name }
}
