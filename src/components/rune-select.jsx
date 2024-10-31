import React from "react";
import runes from "../data/runes.json";

const RunesComponent = ({ rune, onSelectChange, visible }) => {
  //change color of the select text based on the rune type
  const [runeRarity, setRuneRarity] = React.useState([
    { select1: "normal", select2: "", select3: "", select4: "" },
  ]);

  if (!visible) return null;

  const handleSelectChange = (key, value) => {
    //split the value to get the rune type
    const runeRarity = value.split(",")[0];

    setRuneRarity((prevState) => ({
      ...prevState,
      [key]: runeRarity || "",
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
          <option value="" key=" ">
            Select a rune stat
          </option>
          {Object.keys(runes.additionalStats).map((runeType) =>
            runes.additionalStats[runeType].map((runeStat) => (
              <option
                key={runeType + "," + runeStat.stats + "," + runeStat.operator}
                value={
                  runeType + "," + runeStat.stats + "," + runeStat.operator
                }
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
