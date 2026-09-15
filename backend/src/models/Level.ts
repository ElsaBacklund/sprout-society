// De olika nivåerna man kan ha i tjänsten

export enum Level {
  GRUNDPAKET = "grundpaket",
  PLUS = "plus",
  FULLSTANDIGT = "fullstandigt",
}

// Namnen som visas för användaren (temat Sprout Society)
export const LEVEL_DISPLAY_NAME: Record<Level, string> = {
  [Level.GRUNDPAKET]: "Seedling",
  [Level.PLUS]: "Bloomer",
  [Level.FULLSTANDIGT]: "Green Thumb",
};

// Rangordning, används för att kolla om nivån räcker
export const LEVEL_RANK: Record<Level, number> = {
  [Level.GRUNDPAKET]: 1,
  [Level.PLUS]: 2,
  [Level.FULLSTANDIGT]: 3,
};

// Pris för varje nivå (låtsaspengar)
export const LEVEL_PRICE: Record<Level, number> = {
  [Level.GRUNDPAKET]: 0,
  [Level.PLUS]: 99,
  [Level.FULLSTANDIGT]: 199,
};

// Kollar om userLevel är samma eller högre än requiredLevel
export function hasAccess(userLevel: Level, requiredLevel: Level): boolean {
  return LEVEL_RANK[userLevel] >= LEVEL_RANK[requiredLevel];
}