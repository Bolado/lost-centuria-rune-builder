import React from "react";
import monsters from "../../data/monsters.json";
import runes from "../../data/runes.json";
import RuneStatSelector from "../../components/rune-select";
import RunesStar from "../../components/runes-star";

function NewBuild() {
  const [selectedMonster, setSelectedMonster] = React.useState(null);
  const [runesState, setRunesState] = React.useState(
    Array(6).fill({ select1: "", select2: "", select3: "", select4: "" })
  );
  const [currentRune, setCurrentRune] = React.useState(1);
  const [statSums, setStatSums] = React.useState({});
  const [bonuses, setBonuses] = React.useState({});
  const [setBonus, setSetBonus] = React.useState({ set: {}, subset: {} });
  const [verbalSetBonus, setVerbalSetBonus] = React.useState({});
  const [runeSetSubset, setRuneSetSubset] = React.useState({
    set: {},
    subset: {},
  });

  const handleChange = (index, selectStatNumber, value) => {
    const updatedRunes = [...runesState];
    updatedRunes[index] = { ...updatedRunes[index], [selectStatNumber]: value };
    setRunesState(updatedRunes);
  };

  React.useEffect(() => {
    const sums = runesState.reduce((acc, rune) => {
      ["select1", "select2", "select3", "select4"]
        .filter((key) => rune[key])
        .forEach((key) => {
          const [, stat, value, operator] = rune[key].split(",");
          const numericValue = parseFloat(value);

          if (stat && !isNaN(numericValue)) {
            const statKey = stat + operator;
            acc[statKey] = (acc[statKey] || 0) + numericValue;
          }
        });

      return acc;
    }, {});
    setStatSums(sums);
  }, [runesState]);

  React.useEffect(() => {
    if (!selectedMonster) return;

    const bonuses = {
      hp: 0,
      atk: 0,
      def: 0,
      acc: 0,
      cdd: 0,
      cr: 0,
      cd: 0,
      res: 0,
      pen: 0,
    };

    if (runeSetSubset.set?.name) {
      const bonus = {
        "atk%": 32,
        "hp%": 32,
        "def%": 32,
      };

      Object.keys(bonus).forEach((key) => {
        calculateBonusStats(key, selectedMonster, bonus, bonuses);
      });
    }

    if (runeSetSubset.subset?.name) {
      const bonus = {
        "atk+": 160,
        "hp+": 2400,
        "def+": 160,
      };
      Object.keys(bonus).forEach((key) => {
        calculateBonusStats(key, selectedMonster, bonus, bonuses);
      });
    }

    // Calculate main stats
    Object.keys(statSums).forEach((key) =>
      calculateBonusStats(key, selectedMonster, statSums, bonuses)
    );

    // Calculate set bonuses
    [setBonus.set, setBonus.subset].forEach((bonus) => {
      if (bonus?.value) {
        calculateSetBonusStats(selectedMonster, bonus, bonuses);
      }
    });

    setBonuses(bonuses);
  }, [selectedMonster, statSums, setBonus, runeSetSubset]);

  const handleSetSelectChange = (key, value) => {
    const isMainSet = key === "set";
    const rune = runes[isMainSet ? "runeSets" : "runeSubsets"].find(
      (runeItem) => runeItem.name === value
    );

    setSetBonus((prevState) => ({
      ...prevState,
      [isMainSet ? "set" : "subset"]: rune?.value ? rune : {},
    }));

    setVerbalSetBonus((prevState) => ({
      ...prevState,
      [isMainSet ? "set" : "subset"]: rune?.value ? {} : rune,
    }));

    setRuneSetSubset((prevState) => ({
      ...prevState,
      [isMainSet ? "set" : "subset"]: rune,
    }));
  };

  return (
    <div>
      <h1 className="cinzel text-4xl text-center my-8">New Build</h1>
      <div className="flex flex-col lg:flex-row w-full mb-4">
        <div className="lg:basis-1/3 bg-slate-500/10 m-4 p-4 rounded-md">
          {selectedMonster ? (
            <div className="flex flex-col">
              <img
                src={selectedMonster.icon}
                alt={selectedMonster.name}
                className="w-20 h-26 mx-auto object-cover"
              />
              <p className="text-xl font-bold text-center">
                {selectedMonster.name}
              </p>
              {["hp", "atk", "def", "acc", "cdd", "cr", "cd", "res", "pen"].map(
                (stat) => (
                  <div className="flex flex-row justify-between gap-2">
                    <p className="text-lg font-bold  basis-2/4">
                      {stat.toUpperCase()}:
                    </p>
                    <p className="basis-1/4 text-end">
                      {selectedMonster.baseStats[stat]}
                    </p>
                    <div className="basis-1/4">
                      {bonuses[stat] !== 0 && (
                        <p className="text-green-400">+{bonuses[stat]}</p>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="w-full text-center font-bold text-4xl content-center h-full">
              Select a monster
            </div>
          )}
          <div className="pt-2">
            {selectedMonster && verbalSetBonus.set?.fullSetBonus && (
              <div>
                <p className="font-bold text-lg">Set Bonus:</p>
                <p>
                  {verbalSetBonus.set.name}: {verbalSetBonus.set.fullSetBonus}
                </p>
              </div>
            )}

            {selectedMonster && verbalSetBonus.subset?.fullSetBonus && (
              <div>
                <p className="font-bold text-lg">Subset Bonus:</p>
                <p>
                  {verbalSetBonus.subset.name}:{" "}
                  {verbalSetBonus.subset.fullSetBonus}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="lg:basis-2/3 bg-slate-500/10 m-4 p-4 rounded-md flex flex-wrap">
          <div className="flex flex-row gap-2 mb-4 w-full">
            <div className="basis-1/2">
              <p className="block font-bold text-lg">Rune Set:</p>
              <select
                className="w-full p-2 rounded-md text-black font-bold"
                onChange={(e) => handleSetSelectChange("set", e.target.value)}
              >
                <option value=""></option>
                {runes.runeSets.map((runeSet) => (
                  <option key={runeSet.name} value={runeSet.name}>
                    {runeSet.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="basis-1/2">
              <p className="block font-bold text-lg">Rune Subset:</p>
              <select
                className="w-full p-2 rounded-md text-black  font-bold"
                onChange={(e) =>
                  handleSetSelectChange("subset", e.target.value)
                }
              >
                <option value=""></option>
                {runes.runeSubsets.map((runeSet) => (
                  <option key={runeSet.name} value={runeSet.name}>
                    {runeSet.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="lg:basis-1/2 flex flex-wrap w-full justify-center">
            <RunesStar
              setCurrentRune={setCurrentRune}
              currentRune={currentRune}
              runeSetSubset={runeSetSubset}
            />
          </div>
          <div className="lg:basis-1/2 flex flex-wrap gap-2 items-center w-full">
            {runesState.map((rune, i) => (
              <RuneStatSelector
                currentRuneId={i}
                selectedRune={rune}
                onStatChange={(key, value) => handleChange(i, key, value)}
                currentRune={currentRune}
                isVisible={i === currentRune - 1}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="m-4 bg-slate-500/10 rounded-md p-4">
        <div className="w-full flex flex-wrap">
          {monsters
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((monster) => (
              <div
                key={monster.id}
                className="m-2 p-2 flex flex-col items-center w-20 text-center cursor-pointer hover:bg-slate-500/20 rounded-md"
                onClick={() =>
                  setSelectedMonster(monsters.find((m) => m.id === monster.id))
                }
              >
                <img
                  src={monster.icon}
                  alt={monster.name}
                  className="w-16 h-22 object-cover	"
                />
                <div>{monster.name}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default NewBuild;

function calculateBonusStats(key, selectedMonster, statSums, bonuses) {
  const stat = key.slice(0, -1);
  const operator = key.slice(-1);

  if (operator === "+") {
    bonuses[stat] =
      bonuses[stat] + selectedMonster.baseStats[stat] + statSums[key];
    bonuses[stat] = Math.round(bonuses[stat]);
    bonuses[stat] = bonuses[stat] - selectedMonster.baseStats[stat];
  }
  if (operator === "%") {
    if (stat === "hp" || stat === "atk" || stat === "def") {
      bonuses[stat] =
        bonuses[stat] + selectedMonster.baseStats[stat] * (statSums[key] / 100);
      bonuses[stat] = Math.round(bonuses[stat]);
    } else {
      bonuses[stat] =
        bonuses[stat] + selectedMonster.baseStats[stat] + statSums[key];
      bonuses[stat] = Math.round(bonuses[stat]);
      bonuses[stat] = bonuses[stat] - selectedMonster.baseStats[stat];
    }
  }

  return bonuses;
}

function calculateSetBonusStats(selectedMonster, setBonus, bonuses) {
  const { fullSetBonus: stat, operator, value } = setBonus;
  const baseValue = selectedMonster.baseStats[stat];

  const isPercentageStat =
    operator === "%" && ["hp", "atk", "def"].includes(stat);

  bonuses[stat] = Math.round(
    bonuses[stat] +
      (isPercentageStat
        ? baseValue * (value / 100)
        : baseValue + value - baseValue)
  );

  return bonuses;
}
