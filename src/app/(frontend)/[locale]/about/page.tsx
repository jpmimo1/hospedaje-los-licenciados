import { getPayload } from "payload";
import configPromise from "@payload-config";
import Image from "next/image";
import { notFound } from "next/navigation";
import { DynamicIcon } from "@/components/DynamicIcon";
import { RichText } from "@payloadcms/richtext-lexical/react";

// IMPORTANTE: Asegúrate de importar tu componente para renderizar Lexical si ya lo tienes
// import RichText from "@/components/RichText";

const dictionaries = {
  es: {
    eyebrow: "Sobre Nosotros",
    fallbackText: "Cargando historia...",
  },
  en: {
    eyebrow: "About Us",
    fallbackText: "Loading history...",
  },
};

type Props = {
  params: Promise<{ locale: Locales }>;
};

export default async function AboutPage({ params }: Props) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;

  const payload = await getPayload({ config: configPromise });

  // 2. Consultamos el Global de Payload para el idioma actual
  const aboutData = await payload.findGlobal({
    slug: "about-page",
    locale: locale,
  });

  if (!aboutData) return notFound();

  const t = dictionaries[locale as "es" | "en"] || dictionaries.es;

  // Extraemos la URL segura de la imagen principal
  const mainImageUrl =
    aboutData.mainImage && typeof aboutData.mainImage !== "number"
      ? aboutData.mainImage.url
      : null;

  return (
    <div className="min-h-screen bg-background font-sans text-muted-foreground pb-20">
      {/* =========================================================
          1. HERO SECTION (Título e introducción dinámica)
         ========================================================= */}
      <div className="max-w-4xl mx-auto text-center pt-20 pb-16 px-4">
        <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block animate-fade-in">
          {t.eyebrow}
        </span>
        <h1 className="font-serif text-4xl md:text-5xl text-foreground font-bold mb-6 leading-tight">
          {aboutData.title}
        </h1>
      </div>

      {/* =========================================================
          2. HISTORIA (Layout Asimétrico: Imagen + Contenido)
         ========================================================= */}
      <div className="max-w-6xl mx-auto px-4 mb-24">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Contenedor de la Imagen con Marco Decorativo */}
          <div className="w-full lg:w-1/2 relative aspect-4/3 md:aspect-video lg:aspect-4/3">
            {/* Efecto de fondo 3D */}
            <div className="absolute -bottom-4 -left-4 w-full h-full bg-primary/10 rounded-2xl -z-10 hidden md:block"></div>

            {mainImageUrl ? (
              <Image
                src={mainImageUrl}
                alt={aboutData.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="rounded-2xl shadow-xl object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-muted rounded-2xl flex items-center justify-center">
                <span>No image provided</span>
              </div>
            )}
          </div>

          {/* Bloque de Texto Enriquecido (Lexical) */}
          <div className="w-full lg:w-1/2">
            <div className="prose prose-slate dark:prose-invert prose-lg max-w-none text-muted-foreground">
              {/* Cuando tengas tu componente renderizador de Lexical descomentas esto: */}
              {/* <RichText content={aboutData.content} /> */}

              {/* Fallback temporal para visualización */}

              <RichText data={aboutData.content} className="leading-relaxed" />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. FRANJA DE MÉTRICAS / VALORES (Dinámica desde Array)
         ========================================================= */}
      {aboutData.metrics && aboutData.metrics.length > 0 && (
        <div className="border-y border-border bg-card shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center  md:divide-x divide-border">
              {aboutData.metrics.map((metric) => (
                <div key={metric.id}>
                  <div className="text-4xl font-serif text-primary font-bold mb-1">
                    {metric.value}
                  </div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          4. BLOQUES DE MISIÓN, VISIÓN Y VALORES
         ========================================================= */}
      {aboutData.missionVision && aboutData.missionVision.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 items-start">
            {aboutData.missionVision.map((block) => {
              return (
                <div
                  key={block.id}
                  className="bg-card p-8 md:p-10 rounded-3xl border border-border shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col h-full"
                >
                  {/* Ícono animado sutilmente al hacer hover */}
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 transition-transform ">
                    <DynamicIcon
                      name={block.icon}
                      className="w-6 h-6 text-primary"
                    />
                  </div>

                  <h3 className="font-serif text-xl text-foreground font-bold mb-3">
                    {block.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {block.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
