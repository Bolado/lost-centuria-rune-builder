import { initialBuildState } from "../pages/build/builder";

export const serializeBuildState = (state) => {
  // Create minimal representation of state
  const compressedState = {
    // Monster ID only
    m: state.monster,

    // Rune sets (main and sub)
    rs: state.runeSet.main,
    rss: state.runeSet.sub,

    // Current rune slot
    crs: state.currentRuneSlot,

    // Compress runes array to minimal format
    r: state.runes.map(
      (rune) =>
        // Only include non-empty stats
        rune.stats
          .map((stat) =>
            stat.name
              ? {
                  n: stat.name, // stat name
                  r: stat.rarity, // first letter of rarity (n/r/e/l)
                  v: stat.value, // value
                  o: stat.operator, // operator
                  e: stat.enchant || 0, // Add enchants
                }
              : null
          )
          .filter(Boolean) // Remove empty stats
    ),
  };

  // Convert to Base64
  return btoa(JSON.stringify(compressedState));
};

export const deserializeBuildState = (
  encoded,
  baseState = initialBuildState
) => {
  try {
    const decoded = JSON.parse(atob(encoded));

    // Create a deep clone of the base state
    const state = JSON.parse(JSON.stringify(baseState));

    // Update monster if present in decoded data
    if (decoded.m) {
      state.monster = decoded.m;
    }

    // Update rune sets if present
    if (decoded.rs) {
      state.runeSet.main = decoded.rs;
    }
    if (decoded.rss) {
      state.runeSet.sub = decoded.rss;
    }

    // Update current rune slot if present
    if (decoded.crs) {
      state.currentRuneSlot = decoded.crs;
    }

    // Update runes if present
    if (decoded.r) {
      decoded.r.forEach((runeData, index) => {
        if (runeData && index < state.runes.length) {
          runeData.forEach((stat, statIndex) => {
            if (stat && statIndex < state.runes[index].stats.length) {
              state.runes[index].stats[statIndex] = {
                name: stat.n,
                rarity: stat.r,
                value: stat.v,
                operator: stat.o,
                enchant: stat.e || 0,
              };
            }
          });
        }
      });
    }

    return state;
  } catch (error) {
    console.error("Failed to deserialize build state:", error);
    return baseState;
  }
};
