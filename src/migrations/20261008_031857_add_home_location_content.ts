import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_content_nearby_references" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_content_nearby_references_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "site_content_locales" ADD COLUMN "location_title" varchar;
  ALTER TABLE "site_content_locales" ADD COLUMN "location_description" varchar;
  ALTER TABLE "site_content_nearby_references" ADD CONSTRAINT "site_content_nearby_references_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_nearby_references_locales" ADD CONSTRAINT "site_content_nearby_references_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content_nearby_references"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_content_nearby_references_order_idx" ON "site_content_nearby_references" USING btree ("_order");
  CREATE INDEX "site_content_nearby_references_parent_id_idx" ON "site_content_nearby_references" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_content_nearby_references_locales_locale_parent_id_uniq" ON "site_content_nearby_references_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_content_nearby_references" CASCADE;
  DROP TABLE "site_content_nearby_references_locales" CASCADE;
  ALTER TABLE "site_content_locales" DROP COLUMN "location_title";
  ALTER TABLE "site_content_locales" DROP COLUMN "location_description";`)
}
