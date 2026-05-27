import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('es', 'en');
  CREATE TABLE "rooms_locales" (
  	"name" varchar NOT NULL,
  	"description" jsonb,
  	"short_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "amenities_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "policies_locales" (
  	"title" varchar NOT NULL,
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_settings_locales" (
  	"default_message" varchar,
  	"address" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_content_locales" (
  	"hero_title" varchar DEFAULT 'Tu hogar en el corazón de Cusco' NOT NULL,
  	"hero_subtitle" varchar DEFAULT 'Descansa en un ambiente cálido, seguro y familiar a pocos pasos del centro histórico.' NOT NULL,
  	"about_title" varchar DEFAULT 'Siente la verdadera calidez cusqueña' NOT NULL,
  	"about_text" jsonb NOT NULL,
  	"footer_description" varchar DEFAULT 'Tu refugio andino en el corazón de Cusco.' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_page_locales" (
  	"title" varchar DEFAULT 'Nuestra Historia en el Corazón de Cusco' NOT NULL,
  	"content" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP INDEX "amenities_name_idx";
  ALTER TABLE "about_page_mission_vision" ADD COLUMN "_locale" "_locales" DEFAULT 'es' NOT NULL;
  ALTER TABLE "rooms_locales" ADD CONSTRAINT "rooms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rooms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "amenities_locales" ADD CONSTRAINT "amenities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."amenities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "policies_locales" ADD CONSTRAINT "policies_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_settings_locales" ADD CONSTRAINT "contact_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_content_locales" ADD CONSTRAINT "site_content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "rooms_locales_locale_parent_id_unique" ON "rooms_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "amenities_name_idx" ON "amenities_locales" USING btree ("name","_locale");
  CREATE UNIQUE INDEX "amenities_locales_locale_parent_id_unique" ON "amenities_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "policies_locales_locale_parent_id_unique" ON "policies_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_settings_locales_locale_parent_id_unique" ON "contact_settings_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_content_locales_locale_parent_id_unique" ON "site_content_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "about_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_mission_vision_locale_idx" ON "about_page_mission_vision" USING btree ("_locale");
  ALTER TABLE "rooms" DROP COLUMN "name";
  ALTER TABLE "rooms" DROP COLUMN "description";
  ALTER TABLE "rooms" DROP COLUMN "short_description";
  ALTER TABLE "amenities" DROP COLUMN "name";
  ALTER TABLE "media" DROP COLUMN "alt";
  ALTER TABLE "policies" DROP COLUMN "title";
  ALTER TABLE "policies" DROP COLUMN "content";
  ALTER TABLE "contact_settings" DROP COLUMN "default_message";
  ALTER TABLE "contact_settings" DROP COLUMN "address";
  ALTER TABLE "site_content" DROP COLUMN "hero_title";
  ALTER TABLE "site_content" DROP COLUMN "hero_subtitle";
  ALTER TABLE "site_content" DROP COLUMN "about_title";
  ALTER TABLE "site_content" DROP COLUMN "about_text";
  ALTER TABLE "site_content" DROP COLUMN "footer_description";
  ALTER TABLE "about_page" DROP COLUMN "title";
  ALTER TABLE "about_page" DROP COLUMN "content";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "rooms_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "amenities_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "media_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "policies_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "contact_settings_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_content_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "about_page_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "rooms_locales" CASCADE;
  DROP TABLE "amenities_locales" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "policies_locales" CASCADE;
  DROP TABLE "contact_settings_locales" CASCADE;
  DROP TABLE "site_content_locales" CASCADE;
  DROP TABLE "about_page_locales" CASCADE;
  DROP INDEX "about_page_mission_vision_locale_idx";
  ALTER TABLE "rooms" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "rooms" ADD COLUMN "description" jsonb;
  ALTER TABLE "rooms" ADD COLUMN "short_description" varchar;
  ALTER TABLE "amenities" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "media" ADD COLUMN "alt" varchar NOT NULL;
  ALTER TABLE "policies" ADD COLUMN "title" varchar NOT NULL;
  ALTER TABLE "policies" ADD COLUMN "content" jsonb NOT NULL;
  ALTER TABLE "contact_settings" ADD COLUMN "default_message" varchar;
  ALTER TABLE "contact_settings" ADD COLUMN "address" varchar NOT NULL;
  ALTER TABLE "site_content" ADD COLUMN "hero_title" varchar DEFAULT 'Tu hogar en el corazón de Cusco' NOT NULL;
  ALTER TABLE "site_content" ADD COLUMN "hero_subtitle" varchar DEFAULT 'Descansa en un ambiente cálido, seguro y familiar a pocos pasos del centro histórico.' NOT NULL;
  ALTER TABLE "site_content" ADD COLUMN "about_title" varchar DEFAULT 'Siente la verdadera calidez cusqueña' NOT NULL;
  ALTER TABLE "site_content" ADD COLUMN "about_text" jsonb NOT NULL;
  ALTER TABLE "site_content" ADD COLUMN "footer_description" varchar DEFAULT 'Tu refugio andino en el corazón de Cusco.' NOT NULL;
  ALTER TABLE "about_page" ADD COLUMN "title" varchar DEFAULT 'Nuestra Historia en el Corazón de Cusco' NOT NULL;
  ALTER TABLE "about_page" ADD COLUMN "content" jsonb NOT NULL;
  CREATE UNIQUE INDEX "amenities_name_idx" ON "amenities" USING btree ("name");
  ALTER TABLE "about_page_mission_vision" DROP COLUMN "_locale";
  DROP TYPE "public"."_locales";`)
}
