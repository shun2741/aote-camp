import { tsukubaGw2026Trip } from "./trips/2026-gw-tsukuba";

export const trips = [tsukubaGw2026Trip];

export const latestTrip = trips[0];

export const getTripById = (tripId: string) =>
  trips.find((trip) => trip.id === tripId);
