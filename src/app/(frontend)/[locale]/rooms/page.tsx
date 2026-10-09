import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { RoomCard } from "@/components/RoomCard";
import { SITE_URL } from "@/lib/site-url";
import { Container } from "@/components/Container";
import { PageIntro } from "@/components/PageIntro";
import { pageAlternates } from "@/lib/seo-urls";
import { getLocalizedMediaAlts } from "@/lib/get-localized-media-alts";
import { withLocalizedRoomCardAlt } from "@/lib/photo-alt";
import { getSiteContent } from "@/lib/get-site-content";
import { buildSocialMetadata, shareImage } from "@/lib/social-metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

const dictionary = {
  es: {
    title: "Nuestras habitaciones",
    description:
      "Compara nuestras opciones y elige la habitación que mejor se adapte a tu estadía en Cusco.",
    empty: "No hay habitaciones para mostrar por el momento.",
  },
  en: {
    title: "Our rooms",
    description:
      "Compare our options and choose the room that best suits your stay in Cusco.",
    empty: "There are no rooms to display at the moment.",
  },
};

function getValidLocale(locale: string): Locales {
  if (locale !== "es" && locale !== "en") {
    notFound();
  }

  return locale;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = getValidLocale(rawLocale);
  const t = dictionary[locale];
  const siteContent = await getSiteContent(locale);
  const alternates = pageAlternates(SITE_URL, locale, "/rooms");
  const title = `${t.title} | Los Licenciados Cusco`;

  return {
    title,
    description: t.description,
    alternates,
    ...buildSocialMetadata({
      title, description: t.description, locale,
      ...alternates, image: shareImage(siteContent.heroImage, SITE_URL),
    }),
  };
}

export default async function RoomsPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = getValidLocale(rawLocale);
  const t = dictionary[locale];
  const payload = await getPayload({ config: configPromise });

  const { docs: rooms } = await payload.find({
    collection: "rooms",
    locale,
    pagination: false,
  });
  const mediaAlts = await getLocalizedMediaAlts(
    payload,
    locale,
    rooms.map((room) => room.gallery?.[0]?.image),
  );

  return (
    <div className="bg-muted min-h-screen pb-20">
      <PageIntro title={t.title} description={t.description} />
      <Container>
        {rooms.length === 0 ? (
          <p className="text-center text-muted-foreground">{t.empty}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={withLocalizedRoomCardAlt(room, mediaAlts)} locale={locale} headingLevel={2} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
