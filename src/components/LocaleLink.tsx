"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LocalLink({ href, children, ...props }: any) {
  const { locale } = useParams();

  // Si el href ya empieza con http o es un ancla #, no lo tocamos
  const isExternal = href.startsWith("http") || href.startsWith("#");
  const localizedHref = isExternal ? href : `/${locale}${href}`;

  return (
    <Link href={localizedHref} {...props}>
      {children}
    </Link>
  );
}
