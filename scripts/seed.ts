import { CamelCasePlugin, Insertable, Kysely } from "kysely"
import { type DB, Repository, User } from "@db"
import { dialect } from "@db/dialect"
import dotenv from "dotenv"
import { omit, pick } from "es-toolkit"
import { DEMO_USER_ID } from "@lib/constants"

/**
 * `pnpm seed`
 *
 * Script to seed database using our defined dialect, and without Kysely CLI
 * Ensure GITHUB_PAT is in environment, or in .env
 */

dotenv.config()

const DEMO_USER: Insertable<User> = {
  id: DEMO_USER_ID,
  githubToken: process.env.GITHUB_PAT,
}

const DEMO_REPOS: (Insertable<Repository> & { note: string })[] = [
  {
    owner: "facebook",
    name: "react",
    note: "Looks like it might become popular one day",
    fullName: "facebook/react",
    htmlUrl: "https://github.com/facebook/react",
    homepageUrl: "https://react.dev",
    description: "The library for web and native user interfaces.",
    language: "JavaScript",
    starsCount: 241234,
    openIssuesCount: 1099,
    archived: false,
    topics: ["declarative", "frontend", "javascript", "library", "react", "ui"],
    latestRelease: null,
    lastCommitAt: "2025-12-05 23:21:57.000000 +00:00",
    healthFlags: [],
    githubCreatedAt: "2013-05-24 16:15:54.000000 +00:00",
    githubUpdatedAt: "2025-12-06 08:09:33.000000 +00:00",
    createdAt: "2025-12-06 08:20:03.515000 +00:00",
    updatedAt: "2025-12-06 08:20:03.515000 +00:00",
  },
  {
    owner: "octokit",
    name: "core.js",
    note: "For an app to search and discover useful repositories",
    fullName: "octokit/core.js",
    htmlUrl: "https://github.com/octokit/core.js",
    homepageUrl: "",
    description: "Extendable client for GitHub's REST & GraphQL APIs",
    language: "TypeScript",
    starsCount: 1257,
    openIssuesCount: 13,
    archived: false,
    topics: ["hacktoberfest", "octokit-js", "plugin"],
    latestRelease: null,
    lastCommitAt: "2025-12-03 21:53:13.000000 +00:00",
    healthFlags: [],
    githubCreatedAt: "2019-08-08 00:26:56.000000 +00:00",
    githubUpdatedAt: "2025-12-06 06:42:07.000000 +00:00",
    createdAt: "2025-12-06 08:30:22.130000 +00:00",
    updatedAt: "2025-12-06 08:30:22.130000 +00:00",
  },
  {
    owner: "motdotla",
    name: "dotenv",
    note: "For when AWS SSM isn't practical",
    fullName: "motdotla/dotenv",
    htmlUrl: "https://github.com/motdotla/dotenv",
    homepageUrl: "https://www.dotenv.org",
    description: "Loads environment variables from .env for nodejs projects.",
    language: "JavaScript",
    starsCount: 20162,
    openIssuesCount: 7,
    archived: false,
    topics: [
      "configuration-file",
      "dotenv",
      "env",
      "environment-variables",
      "javascript",
      "node",
      "nodejs",
      "secret-management",
      "secret-manager",
      "secrets",
      "security-tools",
    ],
    latestRelease: null,
    lastCommitAt: "2025-09-29 23:21:59.000000 +00:00",
    healthFlags: [],
    githubCreatedAt: "2013-07-05 18:25:05.000000 +00:00",
    githubUpdatedAt: "2025-12-05 10:49:06.000000 +00:00",
    createdAt: "2025-12-06 08:30:52.432000 +00:00",
    updatedAt: "2025-12-06 08:30:52.432000 +00:00",
  },
  {
    owner: "NixOS",
    name: "nixpkgs",
    note: "If this is out of date, it is a big problem for me",
    fullName: "NixOS/nixpkgs",
    htmlUrl: "https://github.com/NixOS/nixpkgs",
    homepageUrl: "",
    description: "Nix Packages collection & NixOS",
    language: "Nix",
    starsCount: 22641,
    openIssuesCount: 17612,
    archived: false,
    topics: ["hacktoberfest", "linux", "nix", "nixos", "nixpkgs"],
    latestRelease: null,
    lastCommitAt: "2025-12-06 08:49:39.000000 +00:00",
    healthFlags: [],
    githubCreatedAt: "2012-06-04 02:49:46.000000 +00:00",
    githubUpdatedAt: "2025-12-06 08:56:05.000000 +00:00",
    createdAt: "2025-12-06 09:04:09.460000 +00:00",
    updatedAt: "2025-12-06 09:04:09.460000 +00:00",
  },
  {
    owner: "netz98",
    name: "n98-magerun",
    note: "People are still running Magento",
    fullName: "netz98/n98-magerun",
    htmlUrl: "https://github.com/netz98/n98-magerun",
    homepageUrl: "http://magerun.net/",
    description:
      "The swiss army knife for Magento developers, sysadmins and devops. The tool provides a huge set of well tested command line commands which save hours of work time. All commands are extendable by a module API.",
    language: "PHP",
    starsCount: 1442,
    openIssuesCount: 95,
    archived: false,
    topics: ["cli-app", "magento", "php"],
    latestRelease: null,
    lastCommitAt: "2025-12-01 15:31:22.000000 +00:00",
    healthFlags: [],
    githubCreatedAt: "2012-08-01 13:13:14.000000 +00:00",
    githubUpdatedAt: "2025-12-03 15:04:25.000000 +00:00",
    createdAt: "2025-12-06 09:11:01.766000 +00:00",
    updatedAt: "2025-12-06 09:12:28.159000 +00:00",
  },
  {
    owner: "basecamp",
    name: "fizzy",
    note: "Curious about this one",
    fullName: "basecamp/fizzy",
    htmlUrl: "https://github.com/basecamp/fizzy",
    homepageUrl: "https://fizzy.do",
    description: "Kanban as it should be. Not as it has been.",
    language: "Ruby",
    starsCount: 4623,
    openIssuesCount: 26,
    archived: false,
    topics: ["hotwire", "kanban", "rails", "ruby"],
    latestRelease: null,
    lastCommitAt: "2025-12-06 04:53:14.000000 +00:00",
    healthFlags: [],
    githubCreatedAt: "2024-06-21 15:43:29.000000 +00:00",
    githubUpdatedAt: "2025-12-06 09:12:33.000000 +00:00",
    createdAt: "2025-12-06 09:12:54.267000 +00:00",
    updatedAt: "2025-12-06 09:12:54.267000 +00:00",
  },
  {
    owner: "snowfallorg",
    name: "lib",
    note: "Was recommended for me",
    fullName: "snowfallorg/lib",
    htmlUrl: "https://github.com/snowfallorg/lib",
    homepageUrl: "https://snowfall.org",
    description:
      "Unified configuration for systems, packages, modules, shells, templates, and more with Nix Flakes.",
    language: "Nix",
    starsCount: 584,
    openIssuesCount: 45,
    archived: false,
    topics: [],
    latestRelease: null,
    lastCommitAt: "2025-01-06 02:28:15.000000 +00:00",
    healthFlags: [],
    githubCreatedAt: "2022-09-08 00:07:34.000000 +00:00",
    githubUpdatedAt: "2025-11-30 14:41:48.000000 +00:00",
    createdAt: "2025-12-06 09:14:38.817000 +00:00",
    updatedAt: "2025-12-06 09:14:38.817000 +00:00",
  },
]

async function seed() {
  const db = new Kysely<DB>({
    dialect,
    plugins: [new CamelCasePlugin()],
  })
  await db.insertInto("user").values(DEMO_USER).execute()
  for (const repo of DEMO_REPOS) {
    await db
      .insertInto("repository")
      .values(omit(repo, ["note"]))
      .execute()
    await db
      .insertInto("bookmark")
      .values({
        ...pick(repo, ["owner", "name", "note"]),
        userId: DEMO_USER.id,
      })
      .execute()
  }
  await db.destroy()
}

seed()
