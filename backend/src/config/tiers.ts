import { Level } from "../models/Level";

// Vilka extrafunktioner som är upplåsta för varje nivå
// alla nivåer kommer se alla tre nivåer men bara upplåsta extrafunktioner är interaktiva. Låsta extrafunktioner (om man är lägre nivå) visas grå-filtrerade med en "uppgradera för att låsa upp"-vibe
export interface TierFeatures {
  maxPlants: number;               // hur många växter man får ha i samlingen
  wateringUnlocked: boolean;       // alltid true, alla nivåer får använda vattenfunktionen
  sunlightUnlocked: boolean;       // Bloomer och uppåt
  nutritionUnlocked: boolean;      // bara Green Thumb
}

export const TIER_FEATURES: Record<Level, TierFeatures> = {
  [Level.GRUNDPAKET]: {
    maxPlants: 3,
    wateringUnlocked: true,
    sunlightUnlocked: false,
    nutritionUnlocked: false,
  },
  [Level.PLUS]: {
    maxPlants: 15,
    wateringUnlocked: true,
    sunlightUnlocked: true,
    nutritionUnlocked: false,
  },
  [Level.FULLSTANDIGT]: {
    maxPlants: Infinity,
    wateringUnlocked: true,
    sunlightUnlocked: true,
    nutritionUnlocked: true,
  },
};

// Hjälper kolla om en specifikt extrafunktion är upplåst för en nivå
// Används i controllern när användaren försöker markera en punkt i extrafunktionen
export function isTrackUnlocked(
  level: Level,
  track: "watering" | "sunlight" | "nutrition"
): boolean {
  const features = TIER_FEATURES[level];
  if (track === "watering") return features.wateringUnlocked;
  if (track === "sunlight") return features.sunlightUnlocked;
  return features.nutritionUnlocked;
}