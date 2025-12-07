import {
  CompiledQuery,
  createQueryId,
  DatabaseConnection,
  type Dialect,
  Driver,
  IdentifierNode,
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
  QueryCompiler,
  QueryResult,
  RawNode,
} from "kysely"
import { PGlite } from "@electric-sql/pglite"
import * as fs from "node:fs"

if (!fs.existsSync("./.private")) {
  fs.mkdirSync("./.private")
}

const parseSavepointCommand = (command: string, savepointName: string) => {
  return RawNode.createWithChildren([
    RawNode.createWithSql(`${command} `),
    IdentifierNode.create(savepointName), // ensures savepointName gets sanitized
  ])
}

/**
 * Kysely Driver for PGLite
 *
 * This serves a couple of purposes:
 * - Allows running prototype without having to install Postgres or create a Postgres database.
 * - Provides for potential parallel and/or isolated integration or unit tests with in-memory databases.
 * - We can tweak this class or wrap the Kysely<DB> instance to enable convenient nested transactions
 *   by starting a savepoint, and storing the connection in cache() or AsyncLocalStorage.
 */
class PgliteDriver implements Driver {
  #client: PGlite

  constructor(client: PGlite) {
    this.#client = client
  }

  async beginTransaction(): Promise<void> {
    await this.#client.exec("BEGIN")
  }

  async commitTransaction(): Promise<void> {
    await this.#client.exec("COMMIT")
  }

  async rollbackTransaction(): Promise<void> {
    await this.#client.exec("ROLLBACK")
  }

  async savepoint(
    connection: DatabaseConnection,
    savepointName: string,
    compileQuery: QueryCompiler["compileQuery"],
  ): Promise<void> {
    await connection.executeQuery(
      compileQuery(
        parseSavepointCommand("SAVEPOINT", savepointName),
        createQueryId(),
      ),
    )
  }

  async rollbackToSavepoint(
    connection: DatabaseConnection,
    savepointName: string,
    compileQuery: QueryCompiler["compileQuery"],
  ): Promise<void> {
    await connection.executeQuery(
      compileQuery(
        parseSavepointCommand("ROLLBACK TO", savepointName),
        createQueryId(),
      ),
    )
  }

  async releaseSavepoint(
    connection: DatabaseConnection,
    savepointName: string,
    compileQuery: QueryCompiler["compileQuery"],
  ): Promise<void> {
    await connection.executeQuery(
      compileQuery(
        parseSavepointCommand("RELEASE", savepointName),
        createQueryId(),
      ),
    )
  }

  async init(): Promise<void> {}

  async acquireConnection(): Promise<DatabaseConnection> {
    return new PgliteConnection(this.#client)
  }

  async releaseConnection(): Promise<void> {}

  async destroy(): Promise<void> {
    await this.#client.close()
  }
}

class PgliteConnection implements DatabaseConnection {
  #client

  constructor(client: PGlite) {
    this.#client = client
  }

  async executeQuery<R>(compiledQuery: CompiledQuery) {
    return (await this.#client.query(compiledQuery.sql, [
      ...compiledQuery.parameters,
    ])) as QueryResult<R>
  }

  async *streamQuery() {
    throw new Error("PGlite does not support streaming.")
  }
}

class PgLiteDialect {
  #client: PGlite

  constructor(client: PGlite) {
    this.#client = client
  }

  createAdapter() {
    return new PostgresAdapter()
  }

  createDriver() {
    return new PgliteDriver(this.#client)
  }

  createIntrospector(db: Kysely<unknown>) {
    return new PostgresIntrospector(db)
  }

  createQueryCompiler() {
    return new PostgresQueryCompiler()
  }
}

export const dialect: Dialect = new PgLiteDialect(
  new PGlite("./.private/pgdata"),
)
