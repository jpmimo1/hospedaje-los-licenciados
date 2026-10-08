import { getPayload } from "payload";
import type { Metadata } from "next";
import configPromise from "@payload-config";
import Image from "next/image";
import { notFound } from "next/navigation";
import { DynamicIcon } from "@/components/DynamicIcon";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Container } from "@/components/Container";
import { PageIntro } from "@/components/PageIntro";
import { SectionHeading } from "@/components/SectionHeading";
import { LocalLink } from "@/components/LocaleLink";
import { ArrowRight } from "lucide-react";

const dictionary = {
  es: {
    seoTitle: "Nuestro hospedaje familiar en Cusco | Los Licenciados",
    seoDescription:
      "Conoce la historia de Los Licenciados, un hospedaje familiar en San Sebastián, Cusco, donde cuidamos la limpieza y te recibimos con un trato cercano.",
    roomsTitle: "Encuentra tu habitación",
    roomsDescription:
      "Conoce nuestras opciones y elige la que mejor se adapte a tu estadía.",
    viewRooms: "Ver habitaciones",
  },
  en: {
    seoTitle: "Our Family-Run Guesthouse in Cusco | Los Licenciados",
    seoDescription:
      "Discover the story of Los Licenciados, a family-run guesthouse in San Sebastián, Cusco, with clean rooms and a warm, personal welcome.",
    roomsTitle: "Find your room",
    roomsDescription:
      "Explore our options and choose the room that best suits your stay.",
    viewRooms: "View rooms",
  },
};

type Props = {
  params: Promise<{ locale: Locales }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = dictionary[locale] || dictionary.es;

  return { title: t.seoTitle, description: t.seoDescription };
}

export default async function AboutPage({ params }: Props) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  const t = dictionary[locale] || dictionary.es;

  const payload = await getPayload({ config: configPromise });

  const aboutData = await payload.findGlobal({
    slug: "about-page",
    locale: locale,
  });

  if (!aboutData) return notFound();

  const mainImageUrl =
    aboutData.mainImage && typeof aboutData.mainImage !== "number"
      ? aboutData.mainImage.url
      : null;

  return (
    <div className="min-h-screen bg-background font-sans text-muted-foreground pb-20">
      {/* =========================================================
          1. HERO SECTION
         ========================================================= */}
      <PageIntro title={aboutData.title} />

      {/* =========================================================
          2. HISTORY
         ========================================================= */}
      <Container width="content" className="mb-24">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2 relative aspect-4/3 md:aspect-video lg:aspect-4/3">
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

          <div className="w-full lg:w-1/2">
            <div className="prose prose-slate dark:prose-invert prose-lg max-w-none text-muted-foreground">
              <RichText data={aboutData.content} className="leading-relaxed" />
            </div>
          </div>
        </div>
      </Container>

      {/* =========================================================
          3. METRICS
         ========================================================= */}
      {aboutData.metrics && aboutData.metrics.length > 0 && (
        <div className="border-y border-border bg-card shadow-sm">
          <Container width="content" className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 text-center divide-y md:divide-y-0 md:divide-x divide-border">
              {aboutData.metrics.map((metric) => (
                <div key={metric.id} className="min-w-0 break-words py-6 md:py-0 md:px-6">
                  <div className="text-4xl font-serif text-primary font-bold mb-1">
                    {metric.value}
                  </div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </div>
      )}

      {/* =========================================================
          4. MISSION, VISION & VALUES
         ========================================================= */}
      {aboutData.missionVision && aboutData.missionVision.length > 0 && (
        <Container width="content" className="py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {aboutData.missionVision.map((block) => {
              return (
                <div
                  key={block.id}
                  className="bg-card p-8 md:p-10 rounded-3xl border border-border shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col h-full min-w-0 break-words"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 transition-transform ">
                    <DynamicIcon
                      name={block.icon}
                      className="w-6 h-6 text-primary"
                    />
                  </div>

                  <h2 className="font-serif text-xl text-foreground font-bold mb-3">
                    {block.title}
                  </h2>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {block.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      )}
      <Container width="content">
        <section className="border-t border-border pt-12 md:pt-16 text-center">
          <SectionHeading title={t.roomsTitle} description={t.roomsDescription} />
          <LocalLink
            href="/rooms"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-2 font-semibold text-foreground hover:bg-muted transition-colors"
          >
            {t.viewRooms}
            <ArrowRight className="w-4 h-4 shrink-0" />
          </LocalLink>
        </section>
      </Container>
    </div>
  );
}
