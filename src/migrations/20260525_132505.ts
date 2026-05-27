import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "rooms_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "site_content_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"amenities_id" integer
  );
  
  ALTER TABLE "rooms_rels" DROP CONSTRAINT "rooms_rels_media_fk";
  
  DROP INDEX "rooms_rels_media_id_idx";
  ALTER TABLE "rooms_rels" ADD COLUMN "amenities_id" integer;
  ALTER TABLE "rooms_gallery" ADD CONSTRAINT "rooms_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "rooms_gallery" ADD CONSTRAINT "rooms_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_rels" ADD CONSTRAINT "site_content_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_rels" ADD CONSTRAINT "site_content_rels_amenities_fk" FOREIGN KEY ("amenities_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "rooms_gallery_order_idx" ON "rooms_gallery" USING btree ("_order");
  CREATE INDEX "rooms_gallery_parent_id_idx" ON "rooms_gallery" USING btree ("_parent_id");
  CREATE INDEX "rooms_gallery_image_idx" ON "rooms_gallery" USING btree ("image_id");
  CREATE INDEX "site_content_rels_order_idx" ON "site_content_rels" USING btree ("order");
  CREATE INDEX "site_content_rels_parent_idx" ON "site_content_rels" USING btree ("parent_id");
  CREATE INDEX "site_content_rels_path_idx" ON "site_content_rels" USING btree ("path");
  CREATE INDEX "site_content_rels_amenities_id_idx" ON "site_content_rels" USING btree ("amenities_id");
  ALTER TABLE "rooms_rels" ADD CONSTRAINT "rooms_rels_amenities_fk" FOREIGN KEY ("amenities_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "rooms_rels_amenities_id_idx" ON "rooms_rels" USING btree ("amenities_id");
  ALTER TABLE "rooms_rels" DROP COLUMN "media_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "rooms_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_content_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "rooms_gallery" CASCADE;
  DROP TABLE "site_content_rels" CASCADE;
  ALTER TABLE "rooms_rels" DROP CONSTRAINT "rooms_rels_amenities_fk";
  
  DROP INDEX "rooms_rels_amenities_id_idx";
  ALTER TABLE "rooms_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "rooms_rels" ADD CONSTRAINT "rooms_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "rooms_rels_media_id_idx" ON "rooms_rels" USING btree ("media_id");
  ALTER TABLE "rooms_rels" DROP COLUMN "amenities_id";`)
}
