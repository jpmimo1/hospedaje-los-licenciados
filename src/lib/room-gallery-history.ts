const stateKey = "roomGallery";
let sessionId: string | undefined;
let opener: HTMLElement | null = null;
let openerPathname: string | undefined;

export function roomGalleryHref(href: string, open: boolean): string {
  const url = new URL(href, "http://localhost");
  if (open) url.searchParams.set("showGallery", "true");
  else url.searchParams.delete("showGallery");
  return `${url.pathname}${url.search}${url.hash}`;
}

export function openRoomGallery(trigger: HTMLElement): boolean {
  const url = new URL(window.location.href);
  if (url.searchParams.get("showGallery") === "true") return false;

  sessionId ??= Array.from(crypto.getRandomValues(new Uint32Array(4))).join("-");
  opener = trigger;
  openerPathname = url.pathname;
  const openedHref = roomGalleryHref(url.href, true);

  // Pass fresh state: Next.js adds its router state and syncs useSearchParams.
  // Copying Next's __NA flag ourselves would bypass that synchronization.
  window.history.pushState(
    { [stateKey]: { sessionId, openedHref } },
    "",
    openedHref,
  );
  return true;
}

export function closeRoomGallery(): "back" | "replace" | null {
  const url = new URL(window.location.href);
  if (url.searchParams.get("showGallery") !== "true") return null;

  const marker = window.history.state?.[stateKey];
  const currentHref = `${url.pathname}${url.search}${url.hash}`;

  // Only entries created in this live session have a known same-page predecessor.
  // Reloaded and directly opened URLs deliberately use replace instead.
  if (sessionId && marker?.sessionId === sessionId && marker.openedHref === currentHref) {
    window.history.back();
    return "back";
  }

  window.history.replaceState(null, "", roomGalleryHref(url.href, false));
  return "replace";
}

export function roomGalleryOpener(): HTMLElement | null {
  return opener?.isConnected && window.location.pathname === openerPathname
    ? opener
    : null;
}
