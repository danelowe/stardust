import * as path from "path"
import { promises as fs } from "fs"
import {
  CamelCasePlugin,
  FileMigrationProvider,
  Kysely,
  Migrator,
} from "kysely"
import { type DB } from "@db"
import { dialect } from "@db/dialect"

/**
 * `pnpm migrate`
 *
 * Script to run migrations using our defined dialect, and without Kysely CLI
 */
async function migrateToLatest() {
  const db = new Kysely<DB>({
    dialect,
    plugins: [new CamelCasePlugin()],
  })
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "../db/migrations"),
    }),
  })
  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error("failed to migrate")
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

migrateToLatest()
