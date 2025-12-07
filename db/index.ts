import { CamelCasePlugin, Kysely } from "kysely"
import type { DB } from "./db"
import { dialect as defaultDialect } from "./dialect"
import { cache } from "react"

export type * from "./db.d.ts"

/*
 * Convenient access to a request-scoped database connection.
 */
export const db = cache(() => createDb())

const createDb = (dialect = defaultDialect) =>
  new Kysely<DB>({
    dialect,
    plugins: [new CamelCasePlugin()],
  })
