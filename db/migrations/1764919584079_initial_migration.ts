import { Kysely, sql } from "kysely"

export async function up(db: Kysely<Record<string, never>>): Promise<void> {
  // To use later with background jobs doing expensive calculation.
  await db.schema
    .createType("health_flag")
    .asEnum(["active", "inactive", "archived", "drowning"])
    .execute()

  await db.schema
    .createTable("user")
    .addColumn("id", "uuid", (col) => col.notNull())
    .addPrimaryKeyConstraint("user_id", ["id"])
    .addColumn("github_token", "text")
    .execute()

  await db.schema
    .createTable("repository")
    // There is no reason to use e.g. varchar(255) over text unless domain requires limiting the text.
    // I.e. text has no performance, memory or space cost for the same data.
    .addColumn("owner", "text", (col) => col.notNull())
    .addColumn("name", "text", (col) => col.notNull())
    .addPrimaryKeyConstraint("repository_id", ["owner", "name"])
    .addColumn("full_name", "text", (col) => col.notNull())
    .addColumn("html_url", "text", (col) => col.notNull())
    .addColumn("homepage_url", "text")
    .addColumn("description", "text")
    .addColumn("language", "text")
    .addColumn("stars_count", "integer", (col) => col.notNull())
    .addColumn("open_issues_count", "integer", (col) => col.notNull())
    .addColumn("archived", "boolean", (col) => col.notNull())
    .addColumn("topics", sql`text[]`, (col) => col.notNull())
    .addColumn("latest_release", "text")
    .addColumn("last_commit_at", "timestamptz")
    .addColumn("health_flags", sql`health_flag[]`, (col) => col.notNull())
    .addColumn("github_created_at", "timestamptz", (col) => col.notNull())
    .addColumn("github_updated_at", "timestamptz", (col) => col.notNull())
    .addColumn("created_at", "timestamptz", (col) => col.notNull())
    .addColumn("updated_at", "timestamptz", (col) => col.notNull())
    .execute()

  await db.schema
    .createIndex("repository_owner_name_uniq")
    .on("repository")
    .column("owner")
    .column("name")
    .unique()
    .execute()

  await db.schema
    .createTable("bookmark")
    .addColumn("user_id", "uuid", (col) => col.notNull())
    .addColumn("owner", "text", (col) => col.notNull())
    .addColumn("name", "text", (col) => col.notNull())
    .addPrimaryKeyConstraint("bookmark_id", ["user_id", "owner", "name"])
    .addColumn("note", "text")
    .addForeignKeyConstraint(
      "fk_bookmark_owner_name__repository_owner_name",
      ["owner", "name"],
      "repository",
      ["owner", "name"],
    )
    .execute()

  await db.schema
    .createIndex("bookmark_user_id")
    .on("bookmark")
    .column("user_id")
    .execute()
}

export async function down(db: Kysely<Record<string, never>>): Promise<void> {
  db.schema.dropTable("bookmark")
  db.schema.dropTable("repository")
}
