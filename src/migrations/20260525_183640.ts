import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "rooms_slug_idx";
  ALTER TABLE "rooms" ALTER COLUMN "slug" SET NOT NULL;
  CREATE UNIQUE INDEX "rooms_slug_idx" ON "rooms" USING btree ("slug");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "rooms_slug_idx";
  ALTER TABLE "rooms" ALTER COLUMN "slug" DROP NOT NULL;
  CREATE INDEX "rooms_slug_idx" ON "rooms" USING btree ("slug");`)
}
