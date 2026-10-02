import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "rooms_locales"
      ADD COLUMN "slug" varchar;

    UPDATE "rooms_locales" AS localized_room
    SET "slug" = room."slug"
    FROM "rooms" AS room
    WHERE localized_room."_parent_id" = room."id";

    ALTER TABLE "rooms_locales"
      ALTER COLUMN "slug" SET NOT NULL;

    DROP INDEX "rooms_slug_idx";

    CREATE UNIQUE INDEX "rooms_slug_idx"
      ON "rooms_locales" USING btree ("slug", "_locale");

    ALTER TABLE "rooms"
      DROP COLUMN "slug";
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "rooms_slug_idx";
  ALTER TABLE "rooms" ADD COLUMN "slug" varchar NOT NULL;
  CREATE UNIQUE INDEX "rooms_slug_idx" ON "rooms" USING btree ("slug");
  ALTER TABLE "rooms_locales" DROP COLUMN "slug";`)
}
