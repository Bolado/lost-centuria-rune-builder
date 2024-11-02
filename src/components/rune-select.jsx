import React, { useState } from "react";
import runes from "../data/runes.json";
import RaritySlider from "./rune-stat-slider";

const STAT_SLOTS = ["select1", "select2", "select3", "select4"];

const RESTRICTED_STATS = {
  1: "atk%",
  2: "atk+",
  3: "hp%",
  4: "hp+",
  5: "def%",
  6: "def+",
};

const RuneStatSelector = ({ onStatChange, currentRuneId, isVisible }) => {
  const [rarityBySlot, setRarityBySlot] = useState({
    select1: "normal",
    select2: "normal",
    select3: "normal",
    select4: "normal",
  });

  const [statsBySlot, setStatsBySlot] = useState({
    select1: "",
    select2: "",
    select3: "",
    select4: "",
  });

  const [selectedRune, setSelectedRune] = useState({
    select1: "",
    select2: "",
    select3: "",
    select4: "",
  });

  React.useEffect(() => {
    Object.keys(statsBySlot)
      .filter((statItem) => selectedRune[statItem] !== "")
      .forEach((statItem) => {
        const [stat, operator] = selectedRune[statItem].split(",");
        const selectedValueUpdated = runes.additionalStats[
          rarityBySlot[statItem]
        ].find((r) => r.stats === stat && r.operator === operator);

        onStatChange(
          statItem,
          `${rarityBySlot[statItem]},${selectedValueUpdated.stats},${selectedValueUpdated.value},${operator}`
        );
      });
  }, [rarityBySlot, onStatChange, statsBySlot, selectedRune]);

  if (!isVisible) return null;

  const handleStatSelection = (slotName, selectedValue) => {
    const [stat, operator] = selectedValue.split(",");

    setStatsBySlot((prevStats) => ({
      ...prevStats,
      [slotName]: stat || "",
    }));

    const selectedValueUpdated = runes.additionalStats[
      rarityBySlot[slotName]
    ].find((r) => r.stats === stat && r.operator === operator);

    setSelectedRune((prevRunes) => ({
      ...prevRunes,
      [slotName]: `${selectedValueUpdated.stats},${operator}`,
    }));

    onStatChange(
      slotName,
      `${rarityBySlot[slotName]},${selectedValueUpdated.stats},${selectedValueUpdated.value},${operator}`
    );
  };

  const isStatAvailable = (stat, slotName, currentRuneId) => {
    const isStatAlreadySelected =
      !Object.values(statsBySlot).includes(stat.stats) ||
      statsBySlot[slotName] === stat.stats;

    const isStatRestrictedForRune =
      `${stat.stats}${stat.operator}` === RESTRICTED_STATS[currentRuneId + 1];
    return isStatAlreadySelected && !isStatRestrictedForRune;
  };

  return (
    <div className="space-y-2 w-full md:max-w-96 md:mx-auto">
      {STAT_SLOTS.map((slotName) => (
        <div>
          <select
            key={slotName}
            value={selectedRune[slotName]}
            onChange={(e) => handleStatSelection(slotName, e.target.value)}
            className={`w-full p-2 rounded-md font-bold text-black`}
          >
            <option value="">Select a rune stat</option>
            {runes.additionalStats.normal
              .filter((stat) => isStatAvailable(stat, slotName, currentRuneId))
              .map((stat) => (
                <option
                  key={`${stat.stats},${stat.operator}`}
                  value={`${stat.stats},${stat.operator}`}
                  className={`font-bold`}
                >
                  {stat.name}
                </option>
              ))}
          </select>
          <RaritySlider
            currentSlot={slotName}
            setRarityBySlot={setRarityBySlot}
            disabled={!statsBySlot[slotName]}
          />
        </div>
      ))}
    </div>
  );
};

export default RuneStatSelector;
