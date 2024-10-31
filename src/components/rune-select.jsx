import React, { useState } from "react";
import runes from "../data/runes.json";

const RunesComponent = ({ rune, onSelectChange, visible }) => {
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
              .filter(
                (runeStat) =>
                  !Object.values(selectedStats).includes(runeStat.stats) ||
                  selectedStats[key] === runeStat.stats
              )
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
