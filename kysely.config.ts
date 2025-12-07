import { CamelCasePlugin, Kysely } from "kysely"
import { defineConfig } from "kysely-ctl"
import { DB } from "kysely-codegen"
import { dialect } from "@db/dialect"

const kysely = new Kysely<DB>({
  dialect,
  plugins: [new CamelCasePlugin()],
})

export default defineConfig({
  kysely,
  migrations: {
    migrationFolder: "./db/migrations",
  },
  plugins: [],
  seeds: {
    seedFolder: "./db/seeds",
  },
})
