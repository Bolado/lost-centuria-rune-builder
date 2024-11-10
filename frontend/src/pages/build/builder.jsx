import React from "react";
import monsters from "../../data/monsters.json";
import runes from "../../data/runes.json";
import RuneStatSelector from "../../components/rune-select";
import RunesStar from "../../components/runes-star";
import {
  deserializeBuildState,
  serializeBuildState,
} from "../../utils/serializer";
import { useLoaderData } from "react-router-dom";
import ButtonPrimary from "../../components/button-primary";
import ButtonConfirm from "../../components/button-confirm";

const PERCENTAGE_STATS = ["acc", "cdd", "cr", "cd", "res", "pen"];

// Initial state structure for a build
export const initialBuildState = {
  monster: null,
  currentRuneSlot: 1,
  runeSet: {
    main: null,
    sub: null,
  },
  runes: Array(6)
    .fill()
    .map(() => ({
      stats: Array(4)
        .fill()
        .map(() => ({
          name: "",
          rarity: "normal",
          value: null,
          operator: null,
          enchant: 0,
        })),
    })),
  bonuses: {
    hp: 0,
    atk: 0,
    def: 0,
    acc: 0,
    cdd: 0,
    cr: 0,
    cd: 0,
    res: 0,
    pen: 0,
  },
  statSums: {},
};

function Builder() {
  // Load the initial state from the loader data
  const loadedData = useLoaderData();

  const [build, setBuild] = React.useState({
    ...initialBuildState,
    currentRuneSlot: 1, // Ensure this exists in initial state
  });

  // Load the build state from the loader data
  React.useEffect(() => {
    if (loadedData) {
      const decodedState = deserializeBuildState(loadedData, initialBuildState);
      setBuild(decodedState);
    }
  }, [loadedData]);

  // Function to handle monster selection
  const handleMonsterSelect = (selectedMonster) => {
    setBuild((prev) => ({
      ...prev,
      monster: monsters.find((m) => m.id === selectedMonster.id),
      currentRuneSlot: prev.currentRuneSlot,
    }));
  };

  const handleRuneSetChange = (type, value) => {
    const isMainRuneSet = type === "main";
    const runeSet = runes[isMainRuneSet ? "runeSets" : "runeSubsets"].find(
      (set) => set.name === value
    );

    setBuild((prev) => ({
      ...prev,
      runeSet: {
        ...prev.runeSet,
        [isMainRuneSet ? "main" : "sub"]: runeSet || null,
      },
      currentRuneSlot: prev.currentRuneSlot, // Preserve slot
    }));
  };

  const handleRuneStatChange = (runeIndex, statIndex, newStat) => {
    setBuild((prev) => {
      const updatedRunes = [...prev.runes];

      if (!newStat) {
        updatedRunes[runeIndex].stats[statIndex] = {
          name: "",
          rarity: "normal",
          value: null,
          operator: null,
        };
      } else {
        const [rarity, stat, value, operator, enchant] = newStat.split(",");
        updatedRunes[runeIndex].stats[statIndex] = {
          name: stat,
          rarity,
          value: parseFloat(value),
          operator,
          enchant,
        };
      }

      return {
        ...prev,
        runes: updatedRunes,
        currentRuneSlot: prev.currentRuneSlot,
      };
    });
  };

  const handleRuneSlotChange = (slot) => {
    setBuild((prev) => ({
      ...prev,
      currentRuneSlot: slot,
    }));
  };

  // Split the effects to avoid the dependency cycle
  React.useEffect(() => {
    if (!build.monster) return;

    // Calculate stat sums from runes
    const sums = build.runes.reduce((acc, rune) => {
      rune.stats.forEach((stat) => {
        if (stat.name && stat.value) {
          const statKey = stat.name + stat.operator;
          acc[statKey] = (acc[statKey] || 0) + stat.value;
        }
      });
      return acc;
    }, {});

    // Calculate bonuses
    const newBonuses = calculateAllBonuses({
      monster: build.monster,
      statSums: sums,
      runeSet: build.runeSet,
    });

    setBuild((prev) => ({
      ...prev,
      statSums: sums,
      bonuses: newBonuses,
      currentRuneSlot: prev.currentRuneSlot,
    }));
  }, [build.monster, build.runes, build.runeSet]);

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="cinzel text-4xl text-center my-8">Builder</h1>
      <div className="flex flex-col lg:flex-row w-full mb-4">
        {/* Monster Stats Panel */}
        <div className="lg:basis-1/3 bg-slate-500/10 m-4 p-4 rounded-md gap-2 flex flex-col">
          {build.monster ? (
            <div className="flex flex-col">
              <img
                src={build.monster.icon}
                alt={build.monster.name}
                className="w-20 h-26 mx-auto object-cover"
              />
              <p className="text-xl font-bold text-center">
                {build.monster.name}
              </p>
              {Object.entries(build.monster.baseStats).map(([stat, value]) => (
                <div key={stat} className="flex flex-row justify-between gap-2">
                  <p className="text-lg font-bold basis-2/4">
                    {stat.toUpperCase()}:
                  </p>
                  <p className="basis-1/4 text-end">
                    {value}
                    {PERCENTAGE_STATS.includes(stat.toLowerCase()) ? "%" : ""}
                  </p>
                  <div className="basis-1/4">
                    {build.bonuses[stat] !== 0 && (
                      <p className="text-green-400">
                        +{build.bonuses[stat]}
                        {PERCENTAGE_STATS.includes(stat.toLowerCase())
                          ? "%"
                          : ""}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full text-center font-bold text-4xl content-center h-full">
              Select a monster
            </div>
          )}
          {/* Rune Set Bonus Display */}
          {build.monster && build.runeSet.main && (
            <div>
              <p className="font-bold text-lg">Set Bonus:</p>
              <p>{build.runeSet.main.description}</p>
            </div>
          )}
          {build.monster && build.runeSet.sub && (
            <div>
              <p className="font-bold text-lg">Subset Bonus:</p>
              <p>{build.runeSet.sub.description}</p>
            </div>
          )}
          {build.monster && (
            <ButtonPrimary
              className="mt-8"
              onClick={() => {
                saveBuild(build).catch(console.error);
              }}
            >
              Save Build
            </ButtonPrimary>
          )}
          {build.monster && (
            <ButtonConfirm
              className="mt-4"
              onClick={() => {
                newBuild(setBuild);
              }}
            >
              Clear Build
            </ButtonConfirm>
          )}
        </div>

        {/* Rune Selection Panel */}
        <div className="lg:basis-2/3 bg-slate-500/10 m-4 p-4 rounded-md flex flex-wrap justify-center">
          <div className="flex flex-row gap-2 mb-4 w-full">
            <div className="basis-1/2">
              <p className="block font-bold text-lg">Rune Set:</p>
              <select
                className="w-full p-2 rounded-md text-black font-bold"
                onChange={(e) => handleRuneSetChange("main", e.target.value)}
                value={build.runeSet.main?.name || ""}
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
                className="w-full p-2 rounded-md text-black font-bold"
                onChange={(e) => handleRuneSetChange("sub", e.target.value)}
                value={build.runeSet.sub?.name || ""}
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
              setCurrentRune={(slot) => handleRuneSlotChange(slot)}
              currentRune={build.currentRuneSlot}
              runeSet={build.runeSet.main}
              runeSubset={build.runeSet.sub}
            />
          </div>
          <div className="lg:basis-1/2 flex flex-wrap gap-2 items-center w-full">
            {build.runes.map((rune, index) => (
              <RuneStatSelector
                key={index}
                currentRuneId={index}
                selectedRune={{
                  select1: formatRuneStatForSelector(rune.stats[0]),
                  select2: formatRuneStatForSelector(rune.stats[1]),
                  select3: formatRuneStatForSelector(rune.stats[2]),
                  select4: formatRuneStatForSelector(rune.stats[3]),
                }}
                onStatChange={(statKey, value) => {
                  const statIndex = parseInt(statKey.slice(-1)) - 1;
                  handleRuneStatChange(index, statIndex, value);
                }}
                currentRune={build.currentRuneSlot}
                isVisible={index === build.currentRuneSlot - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Monster Selection Grid */}
      <div className="m-4 bg-slate-500/10 rounded-md p-4">
        <div className="w-full flex flex-wrap">
          {monsters
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((monster) => (
              <div
                key={monster.id}
                className="m-2 p-2 flex flex-col items-center w-20 text-center cursor-pointer hover:bg-slate-500/20 rounded-md"
                onClick={() => handleMonsterSelect(monster)}
              >
                <img
                  src={monster.icon}
                  alt={monster.name}
                  className="w-16 h-22 object-cover"
                />
                <div>{monster.name}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to format rune stat for selector
function formatRuneStatForSelector(stat) {
  if (!stat.name) return "";
  return `${stat.rarity},${stat.name},${stat.value},${stat.operator},${stat.enchant}`;
}

// Helper function to calculate all bonuses
function calculateAllBonuses({ monster, statSums, runeSet }) {
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

  if (!monster) return bonuses;

  if (runeSet.main) {
    const bonus = {
      "atk%": 32,
      "hp%": 32,
      "def%": 32,
    };
    Object.keys(bonus).forEach((key) => {
      calculateBonusStats(key, monster, bonus, bonuses);
    });
  }

  if (runeSet.sub) {
    const bonus = {
      "atk+": 160,
      "hp+": 2400,
      "def+": 160,
    };
    Object.keys(bonus).forEach((key) => {
      calculateBonusStats(key, monster, bonus, bonuses);
    });
  }

  // Calculate main set bonuses
  if (runeSet.main) {
    const mainBonus = calculateSetBonus(monster, runeSet.main);
    Object.entries(mainBonus).forEach(([stat, value]) => {
      bonuses[stat] += value;
    });
  }

  // Calculate subset bonuses
  if (runeSet.sub) {
    const subBonus = calculateSetBonus(monster, runeSet.sub);
    Object.entries(subBonus).forEach(([stat, value]) => {
      bonuses[stat] += value;
    });
  }

  // Calculate stat sum bonuses
  Object.entries(statSums).forEach(([key, value]) => {
    const stat = key.slice(0, -1);
    const operator = key.slice(-1);

    if (operator === "+") {
      bonuses[stat] += value;
    } else if (operator === "%" && ["hp", "atk", "def"].includes(stat)) {
      bonuses[stat] += monster.baseStats[stat] * (value / 100);
    } else {
      bonuses[stat] += value;
    }
  });

  // // Round all bonus values
  // Object.keys(bonuses).forEach((key) => {
  //   bonuses[key] = Math.round(bonuses[key]);
  // });

  // limit the decimal places to 2
  Object.keys(bonuses).forEach((key) => {
    bonuses[key] = Math.round(bonuses[key] * 100) / 100;
  });

  return bonuses;
}

// Helper function to calculate set bonus
function calculateSetBonus(monster, set) {
  const bonuses = {};
  if (!set.value) return bonuses;

  const { fullSetBonus: stat, operator, value } = set;
  const baseValue = monster.baseStats[stat];

  if (operator === "%" && ["hp", "atk", "def"].includes(stat)) {
    bonuses[stat] = baseValue * (value / 100);
  } else {
    bonuses[stat] = value;
  }

  return bonuses;
}

export default Builder;

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

const saveBuild = async (build) => {
  const serializedState = serializeBuildState(build);
  const currentId = window.location.pathname.includes("new")
    ? null
    : window.location.pathname.split("/").pop();

  // check if there is a token on cookies and if not open a new tab to login
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token"))
    ?.split("=")[1];
  if (!token) {
    window.open("/api/login", "_blank");
    return;
  }

  try {
    const response = await fetch("/api/build/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(currentId && { id: currentId }),
        build: serializedState,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save build");
    }

    const data = await response.json();

    // Update URL if needed
    if (!window.location.pathname.includes(data.id)) {
      window.history.pushState({}, "", `/build/${data.id}`);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const newBuild = (setBuild) => {
  // reset the url
  window.history.pushState({}, "", "/build/new");

  // Reset the build state
  setBuild(initialBuildState);
};
