import { upsertRepository } from "@domain/repository/mutations/upsertRepository"
import { deleteRepository } from "@domain/repository/mutations/deleteRepository"

export const repositoryStore = {
  deleteRepository,
  upsertRepository,
}
