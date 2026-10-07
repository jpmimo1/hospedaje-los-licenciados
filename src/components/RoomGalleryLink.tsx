"use client";

import { useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { LocalLink } from "@/components/LocaleLink";
import { openRoomGallery } from "@/lib/room-gallery-history";

function subscribeToHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

function getHash() {
  return window.location.hash;
}

type RoomGalleryLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  "aria-label": string;
};

export function RoomGalleryLink({ href, ...props }: RoomGalleryLinkProps) {
  const searchParams = useSearchParams();
  const hash = useSyncExternalStore(subscribeToHash, getHash, () => "");
  const params = new URLSearchParams(searchParams.toString());
  params.set("showGallery", "true");

  const open = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented || event.button !== 0 ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    ) return;

    event.preventDefault();
    openRoomGallery(event.currentTarget);
  };

  return (
    <LocalLink
      {...props}
      href={`${href.split("?")[0]}?${params}${hash}`}
      onClick={open}
      aria-haspopup="dialog"
      data-room-gallery-trigger
    />
  );
}
