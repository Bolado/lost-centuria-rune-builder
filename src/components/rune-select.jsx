import React, { useState } from "react";
import runes from "../data/runes.json";

const RunesComponent = ({ rune, onSelectChange, currentRune, visible }) => {
  const [runeRarity, setRuneRarity] = useState({
    select1: "",
    select2: "",
    select3: "",
    select4: "",
  });

  const [selectedStats, setSelectedStats] = useState({
    select1: "",
    select2: "",
    select3: "",
    select4: "",
  });

  // Rune stats that cannot be selected on the current rune
  const runeStatsToFilter = {
    1: "atk%",
    2: "atk+",
    3: "hp%",
    4: "hp+",
    5: "def%",
    6: "def+",
  };

  if (!visible) return null;

  const handleSelectChange = (key, value) => {
    const [runeRarity, stat] = value.split(",");

    setRuneRarity((prevState) => ({
      ...prevState,
      [key]: runeRarity || "",
    }));

    setSelectedStats((prevState) => ({
      ...prevState,
      [key]: stat || "",
    }));

    onSelectChange(key, value);
  };

  return (
    <div>
      {["select1", "select2", "select3", "select4"].map((key) => (
        <select
          key={key}
          value={rune[key]}
          onChange={(e) => handleSelectChange(key, e.target.value)}
          className={`w-full p-2 rounded-md mb-2 font-bold text-black ${runeRarity[key]}`}
        >
          <option value="">Select a rune stat</option>
          {Object.keys(runes.additionalStats).map((runeType) =>
            runes.additionalStats[runeType]
              .filter((runeStat) => {
                // If the rune stat is already selected in a different select, don't show it
                const condition1 = !Object.values(selectedStats).includes(
                  runeStat.stats
                );
                // broad condition to show stats which are not selected
                const condition2 = selectedStats[key] === runeStat.stats;
                // condition to filter stats which cannot be selected on this current rune
                const condition3 =
                  `${runeStat.stats}${runeStat.operator}` ===
                  runeStatsToFilter[currentRune];

                return (condition1 || condition2) & !condition3;
              })
              .map((runeStat) => (
                <option
                  key={`${runeType},${runeStat.stats},${runeStat.value},${runeStat.operator}`}
                  value={`${runeType},${runeStat.stats},${runeStat.value},${runeStat.operator}`}
                  className={`font-bold text-gray-500 ${runeType}`}
                >
                  {runeStat.name}
                </option>
              ))
          )}
        </select>
      ))}
    </div>
  );
};

export default RunesComponent;
