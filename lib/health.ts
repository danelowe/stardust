import { countBy } from "es-toolkit"

export type HealthStatus = "active" | "slowing" | "stale"
type Item = {
  starsCount: number
  openIssuesCount: number
  lastCommitAt: Date | null
}

type HealthAggregations = {
  total: number
  active: number
  slowing: number
  stale: number
}

export const getHealthAggregations = (
  repositories: Item[],
): HealthAggregations => {
  const { active, slowing, stale } = countBy(repositories, getHealthStatus)
  return {
    total: repositories.length,
    active: active ?? 0,
    slowing: slowing ?? 0,
    stale: stale ?? 0,
  }
}

/**
 * Get Health Status of repository
 *
 * This is currently the most naive approach possible to get something quickly.
 * This should eventually include e.g. ratios of tickets opening to closing, and trends over time.
 * The single API query in use gives only open tickets, which isn't a good tell at all.
 */
export const getHealthStatus = (repository: Item): HealthStatus => {
  if (!repository.lastCommitAt) {
    return "stale"
  }
  const monthsAgo =
    (Date.now() - repository.lastCommitAt.getTime()) /
    (1000 * 60 * 60 * 24 * 30)
  if (monthsAgo <= 2) {
    return "active"
  } else if (monthsAgo <= 9) {
    return "slowing"
  }
  return "stale"
}
