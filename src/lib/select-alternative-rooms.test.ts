import assert from "node:assert/strict";
import test from "node:test";
import type { Room } from "@/payload-types";
import { selectAlternativeRooms } from "./select-alternative-rooms";

function room(id: number, capacity: Room["capacity"], price: number, slug = `room-${id}`): Room {
  return {
    id,
    name: `Room ${id}`,
    slug,
    capacity,
    price,
    bedConfiguration: "1-double",
    bathroomType: "private",
    roomSize: 20,
    featured: false,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  };
}

const current = room(1, 2, 100);
const ids = (rooms: Room[]) => rooms.map(({ id }) => id);

test("excludes the current room and duplicate IDs, without mutating candidates", () => {
  const candidates = [room(3, 2, 105), current, room(2, 2, 100), room(2, 2, 100)];
  const before = [...candidates];
  assert.deepEqual(ids(selectAlternativeRooms(current, candidates)), [2, 3]);
  assert.deepEqual(candidates, before);
});

test("prioritizes matching capacity and then closest price, regardless of featured", () => {
  const candidates = [room(2, 3, 100), room(3, 2, 80), room(4, 2, 105)];
  assert.deepEqual(ids(selectAlternativeRooms(current, candidates)), [4, 3]);
});

test("fills remaining places by capacity distance before price distance", () => {
  const candidates = [room(2, 2, 150), room(3, 4, 100), room(4, 3, 110), room(5, 1, 130)];
  assert.deepEqual(ids(selectAlternativeRooms(current, candidates)), [2, 4]);
});

test("breaks capacity and price ties by ID independently of input order or names", () => {
  const candidates = [room(12, 3, 95), room(2, 1, 105), room(8, 3, 105)];
  candidates[0].name = "A translated name";
  const expected = [2, 8];
  assert.deepEqual(ids(selectAlternativeRooms(current, candidates)), expected);
  assert.deepEqual(ids(selectAlternativeRooms(current, [...candidates].reverse())), expected);
});

test("rejects missing and unsafe slugs while retaining the localized slug", () => {
  const invalid = ["", " ", "room/name", "room?x=1", "room#photo", "room%2Fname", "..", ".", "room name", "room\\name"];
  const candidates = invalid.map((slug, i) => room(i + 2, 2, 100, slug));
  candidates.push(room(20, 2, 110, "habitación-familiar"));
  assert.equal(selectAlternativeRooms(current, candidates)[0].slug, "habitación-familiar");
  assert.equal(selectAlternativeRooms(current, candidates).length, 1);
});

test("handles zero and one alternative", () => {
  assert.deepEqual(selectAlternativeRooms(current, []), []);
  assert.deepEqual(selectAlternativeRooms(current, [current]), []);
  assert.deepEqual(ids(selectAlternativeRooms(current, [room(2, 2, 100)])), [2]);
});

test("ranks missing capacity last when the current capacity is known", () => {
  assert.deepEqual(ids(selectAlternativeRooms(current, [room(2, null, 100), room(3, 5, 150)])), [3, 2]);
});

test("uses price distance and ID if the current capacity is missing", () => {
  const candidates = [room(2, 1, 110), room(3, 2, 100), room(4, null, 102)];
  assert.deepEqual(ids(selectAlternativeRooms(room(1, null, 100), candidates)), [3, 4]);
});
