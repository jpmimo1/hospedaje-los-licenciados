import assert from "node:assert/strict";
import test from "node:test";
import { closeRoomGallery, openRoomGallery, roomGalleryHref, roomGalleryOpener } from "./room-gallery-history";

function browser(href: string, state: unknown = null) {
  const entries = [{ href: new URL(href, "https://example.com").href, state }];
  let index = 0;
  let backs = 0;
  let replaces = 0;
  const history = {
    get state() { return entries[index].state; },
    pushState(state: unknown, _title: string, href: string) {
      entries.splice(index + 1);
      entries.push({ href: new URL(href, entries[index].href).href, state });
      index++;
    },
    replaceState(state: unknown, _title: string, href: string) {
      entries[index] = { href: new URL(href, entries[index].href).href, state };
      replaces++;
    },
    back() { if (index > 0) index--; backs++; },
    forward() { if (index < entries.length - 1) index++; },
  };
  const stub = { get location() { return new URL(entries[index].href); }, history };
  Object.defineProperty(globalThis, "window", { value: stub, configurable: true });
  return { entries, history, get href() { return stub.location.href; }, get backs() { return backs; }, get replaces() { return replaces; } };
}

const trigger = { isConnected: true } as HTMLElement;
test.after(() => { Reflect.deleteProperty(globalThis, "window"); });

test("URL changes preserve unrelated repeated parameters and the hash", () => {
  const href = "/en/room/family?campaign=a&campaign=b#photos";
  const opened = roomGalleryHref(href, true);
  assert.equal(opened, "/en/room/family?campaign=a&campaign=b&showGallery=true#photos");
  assert.equal(roomGalleryHref(opened, false), href);
});

test("opening creates exactly one entry, with back/forward and button close staying on the room", () => {
  const b = browser("/es/room/familiar?campaign=a#photos", { __NA: true });
  assert.equal(openRoomGallery(trigger), true);
  assert.equal(openRoomGallery(trigger), false);
  assert.equal(b.entries.length, 2);
  assert.equal(Object.hasOwn(b.history.state as object, "__NA"), false);
  assert.equal(roomGalleryOpener(), trigger);
  b.history.back();
  assert.ok(!b.href.includes("showGallery"));
  b.history.forward();
  assert.ok(b.href.includes("showGallery=true"));
  assert.equal(closeRoomGallery(), "back");
  assert.equal(b.href, "https://example.com/es/room/familiar?campaign=a#photos");
  assert.equal(closeRoomGallery(), null);
  assert.equal(b.entries.length, 2);
});

test("direct access closes with replace, without leaving the page or adding entries", () => {
  const b = browser("/en/room/family?campaign=a&showGallery=true#photos");
  assert.equal(closeRoomGallery(), "replace");
  assert.equal(b.href, "https://example.com/en/room/family?campaign=a#photos");
  assert.equal(b.backs, 0);
  assert.equal(b.replaces, 1);
  assert.equal(b.entries.length, 1);
});

test("a marker from a previous document/session is not trusted", () => {
  const b = browser("/en/room/family?showGallery=true#photos", {
    roomGallery: { sessionId: "previous-session", openedHref: "/en/room/family?showGallery=true#photos" },
  });
  assert.equal(closeRoomGallery(), "replace");
  assert.equal(b.backs, 0);
  assert.equal(b.href, "https://example.com/en/room/family#photos");
});

test("changing another parameter while open uses replace and preserves the new value", () => {
  const b = browser("/es/room/familiar?campaign=a#photos");
  openRoomGallery(trigger);
  b.history.replaceState(b.history.state, "", "/es/room/familiar?campaign=b&showGallery=true#photos");
  assert.equal(closeRoomGallery(), "replace");
  assert.equal(b.href, "https://example.com/es/room/familiar?campaign=b#photos");
  assert.equal(b.backs, 0);
});
