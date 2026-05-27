import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_about_page_mission_vision_icon" AS ENUM('globe', 'eye', 'heart', 'star');
  CREATE TABLE "about_page_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  ALTER TABLE "about_page_mission_vision" ADD COLUMN "icon" "enum_about_page_mission_vision_icon" DEFAULT 'globe' NOT NULL;
  ALTER TABLE "about_page_metrics" ADD CONSTRAINT "about_page_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_page_metrics_order_idx" ON "about_page_metrics" USING btree ("_order");
  CREATE INDEX "about_page_metrics_parent_id_idx" ON "about_page_metrics" USING btree ("_parent_id");
  CREATE INDEX "about_page_metrics_locale_idx" ON "about_page_metrics" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "about_page_metrics" CASCADE;
  ALTER TABLE "about_page_mission_vision" DROP COLUMN "icon";
  DROP TYPE "public"."enum_about_page_mission_vision_icon";`)
}
