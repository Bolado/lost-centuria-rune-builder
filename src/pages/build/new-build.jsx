import React from "react";
import monsters from "../../data/monsters.json";
import runes from "../../data/runes.json";
import ButtonPrimary from "../../components/button-primary";
import RunesComponent from "../../components/rune-select";

function NewBuild() {
  const [selectedMonster, setSelectedMonster] = React.useState(null);
  const [runesState, setRunesState] = React.useState(
    Array(6).fill({ select1: "", select2: "", select3: "", select4: "" })
  );
  const [currentRune, setCurrentRune] = React.useState(1);
  const [statSums, setStatSums] = React.useState({});
  const [bonuses, setBonuses] = React.useState({});
  const handleChange = (index, selectStatNumber, value) => {
    const updatedRunes = [...runesState];
    updatedRunes[index] = { ...updatedRunes[index], [selectStatNumber]: value };
    setRunesState(updatedRunes);
  };

  React.useEffect(() => {
    const sums = runesState.reduce((acc, rune) => {
      ["select1", "select2", "select3", "select4"].forEach((key) => {
        if (rune[key]) {
          const [, stat, value, operator] = rune[key].split(",");
          const numericValue = parseFloat(value);
          const statKey = stat + operator;
          if (stat && !isNaN(numericValue)) {
            if (!acc[statKey]) {
              acc[statKey] = 0;
            }
            acc[statKey] += numericValue;
          }
        }
      });
      return acc;
    }, {});
    setStatSums(sums);
  }, [runesState]);

  React.useEffect(() => {
    if (selectedMonster) {
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
      Object.keys(statSums).forEach((key) => {
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
              bonuses[stat] +
              selectedMonster.baseStats[stat] * (statSums[key] / 100);
            bonuses[stat] = Math.round(bonuses[stat]);
          } else {
            bonuses[stat] =
              bonuses[stat] + selectedMonster.baseStats[stat] + statSums[key];
            bonuses[stat] = Math.round(bonuses[stat]);
            bonuses[stat] = bonuses[stat] - selectedMonster.baseStats[stat];
          }
        }
      });

      setBonuses(bonuses);
    }
  }, [selectedMonster, statSums]);

  return (
    <div>
      <h1 className="cinzel text-4xl text-center my-8">New Build</h1>
      <div className="flex flex-row w-full wrap mb-4">
        <div className="basis-1/2 bg-slate-500/10 m-4 p-4 rounded-md">
          {selectedMonster ? (
            <div className="flex flex-col">
              <img
                src={selectedMonster.icon}
                alt={selectedMonster.name}
                className="w-20 h-20 mx-auto"
              />
              <p className="text-xl font-bold text-center">
                {selectedMonster.name}
              </p>
              {["hp", "atk", "def", "acc", "cdd", "cr", "cd", "res", "pen"].map(
                (stat) => (
                  <div className="flex flex-row justify-between w-[30%]">
                    <p>
                      {stat.toUpperCase()}: {selectedMonster.baseStats[stat]}
                    </p>
                    {bonuses[stat] !== 0 && (
                      <p className="text-green-400">+{bonuses[stat]}</p>
                    )}
                  </div>
                )
              )}
            </div>
          ) : (
            <div>Select a monster</div>
          )}
        </div>
        <div className="basis-1/2 bg-slate-500/10 m-4 p-4 rounded-md">
          <div className="flex flex-row gap-2 mb-4">
            <div className="basis-1/2">
              <p className="block font-bold text-lg">Rune Set:</p>
              <select className="w-full p-2 rounded-md text-black font-bold">
                {runes.runeSets.map((runeSet) => (
                  <option key={runeSet.id} value={runeSet.id}>
                    {runeSet.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="basis-1/2">
              <p className="block font-bold text-lg">Rune Subset:</p>
              <select className="w-full p-2 rounded-md text-black  font-bold">
                {runes.runeSubsets.map((runeSet) => (
                  <option key={runeSet.id} value={runeSet.id}>
                    {runeSet.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-row gap-2">
            <div className="basis-1/2 flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map((runeNumber) => (
                <ButtonPrimary
                  key={runeNumber}
                  onClick={() => setCurrentRune(runeNumber)}
                >
                  Rune {runeNumber}
                </ButtonPrimary>
              ))}
            </div>

            <div className="basis-1/2 flex flex-wrap gap-2">
              {runesState.map((rune, i) => (
                <RunesComponent
                  key={i}
                  rune={rune}
                  onSelectChange={(key, value) => handleChange(i, key, value)}
                  visible={i === currentRune - 1}
                />
              ))}
            </div>
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
                  className="w-16 h-16"
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
