import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Convertir temporalmente a texto para actualizar los valores.
    ALTER TABLE "policies"
      ALTER COLUMN "icon" SET DATA TYPE text;

    -- Migrar los datos existentes a los nombres nuevos de Lucide.
    UPDATE "policies"
    SET "icon" = CASE
      WHEN "icon" = 'smoking' THEN 'cigarette-off'
      WHEN "icon" = 'dog' THEN 'paw-print'
      ELSE "icon"
    END
    WHERE "icon" IN ('smoking', 'dog');

    -- Recrear el enum con las opciones actuales.
    DROP TYPE "public"."enum_policies_icon";

    CREATE TYPE "public"."enum_policies_icon" AS ENUM (
      'clock',
      'ban',
      'shield',
      'paw-print',
      'cigarette-off',
      'credit-card',
      'calendar-x',
      'heart-handshake',
      'car',
      'luggage'
    );

    -- Aplicar el enum después de actualizar los datos.
    ALTER TABLE "policies"
      ALTER COLUMN "icon"
      SET DATA TYPE "public"."enum_policies_icon"
      USING "icon"::"public"."enum_policies_icon";
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "policies" ALTER COLUMN "icon" SET DATA TYPE text;
  DROP TYPE "public"."enum_policies_icon";
  CREATE TYPE "public"."enum_policies_icon" AS ENUM('clock', 'ban', 'shield', 'dog', 'smoking');
  ALTER TABLE "policies" ALTER COLUMN "icon" SET DATA TYPE "public"."enum_policies_icon" USING "icon"::"public"."enum_policies_icon";`)
}
