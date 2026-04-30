import { tsukubaGw2026Trip } from "./trips/2026-gw-tsukuba";
import { kagawa2026Trip } from "./trips/2026-kagawa";
import { nagano2025Trip } from "./trips/2025-nagano";

export const trips = [tsukubaGw2026Trip, kagawa2026Trip, nagano2025Trip].sort(
  (left, right) => right.startDate.localeCompare(left.startDate),
);

export const latestTrip = trips[0];

export const getTripById = (tripId: string) =>
  trips.find((trip) => trip.id === tripId);
