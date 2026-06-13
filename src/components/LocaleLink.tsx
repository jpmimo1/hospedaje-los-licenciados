"use client";

import Link, { type LinkProps } from "next/link";
import { useParams } from "next/navigation";
import type { AnchorHTMLAttributes, ReactNode, MouseEvent } from "react";

type LocalLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children?: ReactNode;
    href: string;
  };

export function LocalLink({
  href,
  children,
  onClick,
  ...props
}: LocalLinkProps) {
  const { locale } = useParams<{ locale: string }>();

  const isExternal = /^(https?:|mailto:|tel:|\/\/)/.test(href);
  const isPureHash = href.startsWith("#");

  let finalHref = href;

  if (!isExternal && !isPureHash) {
    const [pathname, hash] = href.split("#");

    const normalizedPathname =
      !pathname || pathname === "/"
        ? `/${locale}`
        : `/${locale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;

    finalHref = hash ? `${normalizedPathname}#${hash}` : normalizedPathname;
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);

    if (isExternal) return;

    const [targetPath, hash] = finalHref.split("#");

    if (hash) {
      // Determine if we are navigating within the same page to apply smooth scrolling
      const isSamePage = isPureHash || targetPath === window.location.pathname;

      if (isSamePage) {
        const element = document.getElementById(hash);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: "smooth", block: "start" });

          window.history.pushState(null, "", finalHref);
        }
      }
      // If navigating to a different page, we let Next.js handle the routing
      // and the browser handle the native hash jump.
    }
  };

  return (
    <Link href={finalHref} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
