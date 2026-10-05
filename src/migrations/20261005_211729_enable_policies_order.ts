import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "policies" ADD COLUMN "_order" varchar;
  CREATE INDEX "policies__order_idx" ON "policies" USING btree ("_order");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "policies__order_idx";
  ALTER TABLE "policies" DROP COLUMN "_order";`)
}
