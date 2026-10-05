import { getPayload } from "payload";
import configPromise from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { DynamicIcon } from "@/components/DynamicIcon";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";

type TLocale = "es" | "en";

interface IPoliciesPageProps {
  params: Promise<{ locale: string }>;
}

const dictionary = {
  es: {
    seoTitle: "Políticas del hospedaje | Los Licenciados Cusco",
    seoDesc:
      "Consulta las condiciones de reserva, pagos y cancelaciones, los horarios de llegada y salida y las normas de Los Licenciados en San Sebastián, Cusco.",
    title: "Políticas del hospedaje",
    subtitle:
      "Conoce las condiciones de reserva y las normas para tu estadía. Si tienes alguna consulta, escríbenos antes de confirmar tu reserva.",
    reference:
      "Los horarios corresponden a la hora de Perú. Las tarifas están expresadas en soles (PEN).",
    empty:
      "Estamos actualizando esta información. Contáctanos para consultar las condiciones antes de reservar.",
  },
  en: {
    seoTitle: "Guesthouse Policies | Los Licenciados Cusco",
    seoDesc:
      "Read the booking, payment and cancellation conditions, check-in and check-out times, and house rules for Los Licenciados in San Sebastián, Cusco.",
    title: "Guesthouse policies",
    subtitle:
      "Find out about our booking conditions and house rules. If you have any questions, please contact us before confirming your reservation.",
    reference:
      "All times are local to Peru. Prices are in Peruvian soles (PEN).",
    empty:
      "We’re updating this information. Please contact us to check the conditions before booking.",
  },
} satisfies Record<
  TLocale,
  {
    seoTitle: string;
    seoDesc: string;
    title: string;
    subtitle: string;
    reference: string;
    empty: string;
  }
>;

function getValidLocale(locale: string): TLocale {
  if (locale !== "es" && locale !== "en") {
    notFound();
  }

  return locale;
}

export async function generateMetadata({
  params,
}: IPoliciesPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = getValidLocale(rawLocale);
  const t = dictionary[locale];

  return {
    title: t.seoTitle,
    description: t.seoDesc,
    alternates: {
      canonical: `${SITE_URL}/${locale}/policies`,
      languages: {
        es: `${SITE_URL}/es/policies`,
        en: `${SITE_URL}/en/policies`,
      },
    }
  };
}

export default async function PoliciesPage({
  params,
}: IPoliciesPageProps) {
  const { locale: rawLocale } = await params;
  const locale = getValidLocale(rawLocale);
  const t = dictionary[locale];

  const payload = await getPayload({ config: configPromise });

  const { docs: policies } = await payload.find({
    collection: "policies",
    locale,
    sort: "createdAt",
    pagination: false,
  });

  return (
    <div className="bg-background min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t.title}
          </h1>

          <p className="text-muted-foreground text-lg">
            {t.subtitle}
          </p>

          <p className="text-muted-foreground text-sm mt-3">
            {t.reference}
          </p>
        </div>

        {policies.length === 0 ? (
          <p className="text-center text-muted-foreground">
            {t.empty}
          </p>
        ) : (
          <div className="space-y-12">
            {policies.map((policy) => (
              <section
                key={policy.id}
                aria-labelledby={`policy-${policy.id}`}
                className="flex flex-col md:flex-row gap-8 pb-12 border-b border-border last:border-0"
              >
                <div className="md:w-1/3 flex items-start">
                  <div className="gap-4 flex items-center">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary-600 shrink-0">
                      <DynamicIcon
                        name={policy.icon || undefined}
                        className="w-8 h-8"
                        aria-hidden="true"
                      />
                    </div>

                    <h2
                      id={`policy-${policy.id}`}
                      className="font-serif text-2xl font-bold text-foreground"
                    >
                      {policy.title}
                    </h2>
                  </div>
                </div>

                <div className="md:w-2/3 prose prose-stone dark:prose-invert max-w-none text-muted-foreground">
                  {policy.content && (
                    <RichText data={policy.content} />
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}