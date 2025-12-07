import { Octokit } from "octokit"
import { Repository } from "@db"
import { Insertable } from "kysely"
import { repositoryStore } from "@domain/repository/store"

type Input = {
  owner: string
  name: string
}

const GITHUB_API_VERSION = "2022-11-28"
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  headers: {},
})

export const updateRepositoryInformation = async ({ owner, name }: Input) => {
  const response = await octokit.request("GET /repos/{owner}/{repo}", {
    owner,
    repo: name,
    headers: {
      "X-GitHub-Api-Version": GITHUB_API_VERSION,
    },
  })
  // TODO: Validate response code
  const data = response.data
  const repository: Insertable<Repository> = {
    owner,
    name,
    fullName: data.full_name,
    htmlUrl: data.html_url,
    homepageUrl: data.homepage,
    description: data.description,
    language: data.language,
    starsCount: data.stargazers_count,
    openIssuesCount: data.open_issues_count,
    archived: data.archived,
    lastCommitAt: new Date(data.pushed_at),
    topics: data.topics ?? [],
    githubCreatedAt: new Date(data.created_at),
    githubUpdatedAt: new Date(data.updated_at),
    healthFlags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await repositoryStore.upsertRepository(repository)

  return repository
}
