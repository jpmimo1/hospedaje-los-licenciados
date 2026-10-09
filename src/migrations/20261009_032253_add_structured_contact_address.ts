import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_settings" ADD COLUMN "structured_address_street_address" varchar;
  ALTER TABLE "contact_settings" ADD COLUMN "structured_address_address_locality" varchar;
  ALTER TABLE "contact_settings" ADD COLUMN "structured_address_address_region" varchar;
  ALTER TABLE "contact_settings" ADD COLUMN "structured_address_postal_code" varchar;
  ALTER TABLE "contact_settings" ADD COLUMN "structured_address_address_country" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_settings" DROP COLUMN "structured_address_street_address";
  ALTER TABLE "contact_settings" DROP COLUMN "structured_address_address_locality";
  ALTER TABLE "contact_settings" DROP COLUMN "structured_address_address_region";
  ALTER TABLE "contact_settings" DROP COLUMN "structured_address_postal_code";
  ALTER TABLE "contact_settings" DROP COLUMN "structured_address_address_country";`)
}
