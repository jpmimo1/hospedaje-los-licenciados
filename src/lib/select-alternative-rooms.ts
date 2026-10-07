import type { Room } from "@/payload-types";

function capacityDistance(room: Room, current: Room): number {
  if (
    room.capacity == null ||
    current.capacity == null ||
    !Number.isFinite(room.capacity) ||
    !Number.isFinite(current.capacity) ||
    room.capacity <= 0 ||
    current.capacity <= 0
  ) {
    return Infinity;
  }

  return Math.abs(room.capacity - current.capacity);
}

function priceDistance(room: Room, current: Room): number {
  return Number.isFinite(room.price) && Number.isFinite(current.price)
    ? Math.abs(room.price - current.price)
    : Infinity;
}

export function selectAlternativeRooms(current: Room, candidates: Room[]): Room[] {
  const uniqueRooms = new Map<Room["id"], Room>();

  for (const room of candidates) {
    // RoomCard uses the slug as one path segment; reject missing/unsafe values.
    const hasUsableSlug =
      typeof room.slug === "string" &&
      /^(?!\.{1,2}$)[^\s/\\?#%]+$/u.test(room.slug);

    if (room.id !== current.id && hasUsableSlug && !uniqueRooms.has(room.id)) {
      uniqueRooms.set(room.id, room);
    }
  }

  return Array.from(uniqueRooms.values())
    .sort(
      (a, b) =>
        capacityDistance(a, current) - capacityDistance(b, current) ||
        priceDistance(a, current) - priceDistance(b, current) ||
        a.id - b.id,
    )
    .slice(0, 2);
}
