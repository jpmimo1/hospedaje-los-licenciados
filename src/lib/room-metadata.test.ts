import assert from "node:assert/strict";
import test from "node:test";
import { buildRoomMetadata } from "./room-metadata";

test("uses the localized name and short description without adding other metadata", () => {
  for (const locale of ["es", "en"] as const) {
    const name = locale === "es" ? "Doble con baño privado" : "Two-Bed Room with Private Bathroom";
    const description = locale === "es" ? "Una habitación para tu estadía en Cusco." : "A room for your stay in Cusco.";
    assert.deepEqual(buildRoomMetadata({
      name, shortDescription: ` ${description} `, capacity: 4, bathroomType: "private",
    }, locale), {
      title: `${name} | Los Licenciados`, description,
    });
  }
});

test("builds natural descriptions in each language when shortDescription is absent or blank", () => {
  assert.equal(buildRoomMetadata({
    name: "Doble con baño privado", shortDescription: "  ", capacity: 4, bathroomType: "private",
  }, "es").description,
  "Doble con baño privado en Los Licenciados, San Sebastián, Cusco, para hasta 4 huéspedes, con baño privado.");
  assert.equal(buildRoomMetadata({
    name: "Two-Bed Room with Private Bathroom", capacity: 4, bathroomType: "private",
  }, "en").description,
  "Two-Bed Room with Private Bathroom at Los Licenciados in San Sebastián, Cusco, for up to 4 guests, with a private bathroom.");
});

test("uses the structured shared bathroom value and singular guest labels", () => {
  assert.equal(buildRoomMetadata({
    name: "Individual", shortDescription: null, capacity: 1, bathroomType: "shared",
  }, "es").description,
  "Individual en Los Licenciados, San Sebastián, Cusco, para hasta 1 huésped, con baño compartido.");
  assert.equal(buildRoomMetadata({
    name: "Single Room", capacity: 1, bathroomType: "shared",
  }, "en").description,
  "Single Room at Los Licenciados in San Sebastián, Cusco, for up to 1 guest, with a shared bathroom.");
});

test("omits unavailable or invalid capacity instead of inventing guest counts", () => {
  for (const capacity of [undefined, null, 0, -1, NaN, Infinity, 1.5]) {
    const room = { name: "Room", capacity, bathroomType: "private" as const };
    assert.equal(buildRoomMetadata(room, "en").description,
      "Room at Los Licenciados in San Sebastián, Cusco, with a private bathroom.");
  }
});
