import React, { useState, useCallback, memo } from "react";
import runes from "../data/runes.json";
import RaritySlider from "./rune-stat-slider";

// Define constants for the four stat selection slots available for each rune
const STAT_SLOTS = ["select1", "select2", "select3", "select4"];

// Map of restricted stats for each rune position (1-6). These stats cannot be selected for their respective positions
const RESTRICTED_STATS = {
  1: "atk%",
  2: "atk+",
  3: "hp%",
  4: "hp+",
  5: "def%",
  6: "def+",
};

// Main component for selecting rune stats. Memoized to prevent unnecessary re-renders
const RuneStatSelector = memo(({ onStatChange, currentRuneId, isVisible }) => {
  // Consolidated state object managing rarity levels, selected stats, and their current values
  const [runeState, setRuneState] = useState({
    rarity: {
      select1: "normal",
      select2: "normal",
      select3: "normal",
      select4: "normal",
    },
    stats: {
      select1: "",
      select2: "",
      select3: "",
      select4: "",
    },
    selected: {
      select1: "",
      select2: "",
      select3: "",
      select4: "",
    },
  });

  // Handles rarity changes for a specific slot. Updates both local state and parent component
  const handleRarityChange = useCallback(
    (slotName, newRarity) => {
      setRuneState((prev) => {
        const updatedState = {
          ...prev,
          rarity: {
            ...prev.rarity,
            [slotName]: newRarity,
          },
        };

        // If a stat is selected, recalculate its value with the new rarity
        if (updatedState.selected[slotName]) {
          const [stat, operator] = updatedState.selected[slotName].split(",");
          const selectedValueUpdated = runes.additionalStats[newRarity].find(
            (r) => r.stats === stat && r.operator === operator
          );

          if (selectedValueUpdated) {
            onStatChange(
              slotName,
              `${newRarity},${selectedValueUpdated.stats},${selectedValueUpdated.value},${operator}`
            );
          }
        }

        return updatedState;
      });
    },
    [onStatChange]
  );

  // Manages stat selection changes, updates state and notifies parent component
  const handleStatSelection = useCallback(
    (slotName, selectedValue) => {
      // Handle clearing the selection
      if (!selectedValue) {
        setRuneState((prev) => ({
          ...prev,
          stats: { ...prev.stats, [slotName]: "" },
          selected: { ...prev.selected, [slotName]: "" },
        }));
        onStatChange(slotName, "");
        return;
      }

      // Process new stat selection and update values
      const [stat, operator] = selectedValue.split(",");
      const currentRarity = runeState.rarity[slotName];

      setRuneState((prev) => ({
        ...prev,
        stats: { ...prev.stats, [slotName]: stat || "" },
        selected: { ...prev.selected, [slotName]: `${stat},${operator}` },
      }));

      // Find and apply the corresponding stat value based on current rarity
      const selectedValueUpdated = runes.additionalStats[currentRarity].find(
        (r) => r.stats === stat && r.operator === operator
      );

      if (selectedValueUpdated) {
        onStatChange(
          slotName,
          `${currentRarity},${selectedValueUpdated.stats},${selectedValueUpdated.value},${operator}`
        );
      }
    },
    [onStatChange, runeState.rarity]
  );

  // Determines if a stat can be selected based on existing selections and restrictions
  const isStatAvailable = useCallback(
    (stat, slotName) => {
      const isStatAlreadySelected =
        !Object.values(runeState.stats).includes(stat.stats) ||
        runeState.stats[slotName] === stat.stats;

      const isStatRestrictedForRune =
        `${stat.stats}${stat.operator}` === RESTRICTED_STATS[currentRuneId + 1];

      return isStatAlreadySelected && !isStatRestrictedForRune;
    },
    [currentRuneId, runeState.stats]
  );

  if (!isVisible) return null;

  return (
    <div className="space-y-2 w-full md:max-w-96 md:mx-auto">
      {STAT_SLOTS.map((slotName) => (
        <div key={slotName}>
          <select
            value={runeState.selected[slotName]}
            onChange={(e) => handleStatSelection(slotName, e.target.value)}
            className="w-full p-2 rounded-md font-bold text-black"
          >
            <option value="">Select a rune stat</option>
            {runes.additionalStats.normal
              .filter((stat) => isStatAvailable(stat, slotName))
              .map((stat) => (
                <option
                  key={`${stat.stats},${stat.operator}`}
                  value={`${stat.stats},${stat.operator}`}
                  className="font-bold"
                >
                  {stat.name}
                </option>
              ))}
          </select>
          <RaritySlider
            slotName={slotName}
            currentRarity={runeState.rarity[slotName]}
            onRarityChange={handleRarityChange}
            disabled={!runeState.stats[slotName]}
          />
        </div>
      ))}
    </div>
  );
});

RuneStatSelector.displayName = "RuneStatSelector";
export default RuneStatSelector;
