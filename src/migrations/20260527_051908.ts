import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_rooms_bed_configuration" AS ENUM('1-single', '1-double', '1-double-1-single', '2-singles', '2-doubles');
  ALTER TABLE "rooms" ADD COLUMN "room_size" numeric DEFAULT 0 NOT NULL;
  ALTER TABLE "rooms" ADD COLUMN "bed_configuration" "enum_rooms_bed_configuration" DEFAULT '1-single' NOT NULL;
  ALTER TABLE "contact_settings" ADD COLUMN "check_in_time" varchar DEFAULT '14:00 hrs' NOT NULL;
  ALTER TABLE "contact_settings" ADD COLUMN "check_out_time" varchar DEFAULT '10:00 hrs' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "rooms" DROP COLUMN "room_size";
  ALTER TABLE "rooms" DROP COLUMN "bed_configuration";
  ALTER TABLE "contact_settings" DROP COLUMN "check_in_time";
  ALTER TABLE "contact_settings" DROP COLUMN "check_out_time";
  DROP TYPE "public"."enum_rooms_bed_configuration";`)
}
