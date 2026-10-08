import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_rooms_bathroom_type" AS ENUM('private', 'shared');
  ALTER TABLE "rooms" ADD COLUMN "bathroom_type" "enum_rooms_bathroom_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "rooms" DROP COLUMN "bathroom_type";
  DROP TYPE "public"."enum_rooms_bathroom_type";`)
}
