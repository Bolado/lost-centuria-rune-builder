import React, { useCallback, memo } from "react";
import runes from "../data/runes.json";
import RaritySlider from "./rune-stat-slider";

// Define constants for the four stat selection slots available for each rune
const STAT_SLOTS = ["select1", "select2", "select3", "select4"];

// Map of restricted stats for each rune position (1-6)
const RESTRICTED_STATS = {
  1: "atk%",
  2: "atk+",
  3: "hp%",
  4: "hp+",
  5: "def%",
  6: "def+",
};

const RuneStatSelector = memo(
  ({ onStatChange, currentRuneId, isVisible, selectedRune }) => {
    const [enchants, setEnchants] = React.useState({
      select1: 0,
      select2: 0,
      select3: 0,
      select4: 0,
    });

    // Helper to parse the stat string from selectedRune
    const parseStatString = (statString) => {
      if (!statString)
        return { rarity: "normal", stat: "", operator: "", enchant: 0 };
      const [rarity, stat, , operator, enchant] = statString.split(",");
      console.log(statString);
      console.log(rarity, stat, operator, enchant);
      return { rarity, stat, operator, enchant: parseInt(enchant) };
    };

    // Determines if a stat can be selected based on existing selections and restrictions
    const isStatAvailable = useCallback(
      (stat, slotName) => {
        // Get all currently selected stats except for the current slot
        const selectedStats = STAT_SLOTS.filter(
          (slot) => slot !== slotName
        ).map((slot) => {
          const parsed = parseStatString(selectedRune[slot]);
          return parsed.stat;
        });

        const isStatAlreadySelected = !selectedStats.includes(stat.stats);
        const isStatRestrictedForRune =
          `${stat.stats}${stat.operator}` ===
          RESTRICTED_STATS[currentRuneId + 1];

        return isStatAlreadySelected && !isStatRestrictedForRune;
      },
      [currentRuneId, selectedRune]
    );

    const handleEnchantChange = useCallback(
      (slotName, value) => {
        const totalEnchants = Object.keys(enchants).reduce(
          (acc, key) => acc + enchants[key],
          0
        );

        if (totalEnchants + (value - enchants[slotName]) > 5) {
          return;
        }
        setEnchants({
          ...enchants,
          [slotName]: value,
        });

        const currentStat = parseStatString(selectedRune[slotName]);
        if (!currentStat.stat) return;

        const selectedValueUpdated = runes.additionalStats[
          currentStat.rarity
        ].find(
          (r) =>
            r.stats === currentStat.stat && r.operator === currentStat.operator
        );

        // Calculate enchanted value
        let enchantedValue =
          value > 0
            ? selectedValueUpdated.value + value * selectedValueUpdated.enchant
            : selectedValueUpdated.value;

        console.log(enchantedValue);

        onStatChange(
          slotName,
          `${currentStat.rarity},${currentStat.stat},${enchantedValue},${currentStat.operator},${value}`
        );
      },
      [enchants, selectedRune, onStatChange]
    );
    // Handles rarity changes for a specific slot
    const handleRarityChange = useCallback(
      (slotName, newRarity) => {
        const currentStat = parseStatString(selectedRune[slotName]);
        if (!currentStat.stat) return;

        const selectedValueUpdated = runes.additionalStats[newRarity].find(
          (r) =>
            r.stats === currentStat.stat && r.operator === currentStat.operator
        );

        if (selectedValueUpdated) {
          console.log(selectedValueUpdated);
          // update the stats value based on the enchant value
          let enchantedValue =
            enchants[slotName] > 0
              ? selectedValueUpdated.value +
                enchants[slotName] * selectedValueUpdated.enchant
              : selectedValueUpdated.value;

          onStatChange(
            slotName,
            `${newRarity},${selectedValueUpdated.stats},${enchantedValue},${selectedValueUpdated.operator},${enchants[slotName]}`
          );
        }
      },
      [selectedRune, onStatChange, enchants]
    );

    // Handles stat selection changes
    const handleStatSelection = useCallback(
      (slotName, selectedValue) => {
        if (!selectedValue) {
          onStatChange(slotName, "");
          return;
        }

        const [stat, operator] = selectedValue.split(",");
        const currentRarity =
          parseStatString(selectedRune[slotName]).rarity || "normal";

        const selectedValueUpdated = runes.additionalStats[currentRarity].find(
          (r) => r.stats === stat && r.operator === operator
        );

        console.log(selectedValueUpdated);
        if (selectedValueUpdated) {
          let enchantedValue =
            enchants[slotName] > 0
              ? selectedValueUpdated.value +
                enchants[slotName] * selectedValueUpdated.enchant
              : selectedValueUpdated.value;
          onStatChange(
            slotName,
            `${currentRarity},${selectedValueUpdated.stats},${enchantedValue},${selectedValueUpdated.operator},${enchants[slotName]}`
          );
        }
      },
      [selectedRune, onStatChange, enchants]
    );

    if (!isVisible) return null;

    return (
      <div className="space-y-2 w-full md:max-w-96 md:mx-auto">
        {STAT_SLOTS.map((slotName) => {
          const currentStat = parseStatString(selectedRune[slotName]);
          const selectedValue = currentStat.stat
            ? `${currentStat.stat},${currentStat.operator}`
            : "";
          const enchantValue = currentStat.enchant || enchants[slotName];

          return (
            <div key={slotName}>
              <div className="w-full flex flex-row items-center gap-2">
                <select
                  value={selectedValue}
                  onChange={(e) =>
                    handleStatSelection(slotName, e.target.value)
                  }
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
                <input
                  type="number"
                  className="w-full p-2 rounded-md basis-1/5 text-black"
                  min={0}
                  max={5}
                  step={1}
                  onChange={(e) =>
                    handleEnchantChange(slotName, parseInt(e.target.value))
                  }
                  value={enchantValue}
                />
              </div>
              <RaritySlider
                slotName={slotName}
                currentRarity={currentStat.rarity}
                onRarityChange={handleRarityChange}
                disabled={!currentStat.stat}
              />
            </div>
          );
        })}
      </div>
    );
  }
);

RuneStatSelector.displayName = "RuneStatSelector";
export default RuneStatSelector;
