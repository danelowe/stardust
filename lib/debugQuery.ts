import type { CompiledQuery } from "kysely"

/*
 * Little helper to (temporarily) use when you wish to print a Kysely query with parameters mogrified
 * TODO: Add linting to prevent use of this method in main.
 */
export const debugQuery = (query: CompiledQuery) => {
  const { sql, parameters } = query
  let formattedSql = sql.replace(/\s+/g, " ").trim()

  // Interpolate parameters into the SQL string
  parameters.forEach((param, index) => {
    const placeholder = `$${index + 1}`
    let formattedParam: string

    if (param === null || param === undefined) {
      formattedParam = "NULL"
    } else if (typeof param === "string") {
      formattedParam = `'${param.replace(/'/g, "''")}'` // Escape single quotes
    } else if (typeof param === "boolean") {
      formattedParam = param ? "TRUE" : "FALSE"
    } else {
      formattedParam = String(param)
    }

    formattedSql = formattedSql.replace(
      new RegExp(`\\${placeholder}\\b`, "g"),
      formattedParam,
    )
  })

  console.debug(formattedSql)
}
