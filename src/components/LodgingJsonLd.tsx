import { buildLodgingJsonLd, type LodgingJsonLdInput } from "@/lib/lodging-json-ld";

export function LodgingJsonLd(props: LodgingJsonLdInput) {
  const data = buildLodgingJsonLd(props);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
