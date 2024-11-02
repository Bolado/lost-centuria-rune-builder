import React from "react";

const RARITY_LEVELS = [
  { value: "normal", color: "bg-gray-500", textColor: "text-gray-500" },
  { value: "rare", color: "bg-blue-500", textColor: "text-blue-500" },
  { value: "epic", color: "bg-purple-500", textColor: "text-purple-500" },
  {
    value: "legendary",
    color: "bg-orange-500",
    textColor: "text-orange-500",
  },
];

const RaritySlider = ({ currentSlot, setRarityBySlot, disabled }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (e) => {
    if (!disabled) {
      setValue(parseInt(e.target.value));
    }
  };

  const handleMarkerClick = (index) => {
    if (!disabled) {
      setValue(index);
    }
  };

  React.useEffect(() => {
    if (!disabled) {
      setRarityBySlot((prevRarities) => ({
        ...prevRarities,
        [currentSlot]: RARITY_LEVELS[value].value,
      }));
    }
  }, [value, currentSlot, setRarityBySlot, disabled]);

  return (
    <div className="w-full mx-auto space-y-4">
      {/* Slider Container */}
      <div className="relative h-8">
        {/* Background Track */}
        <div className="absolute h-2 w-full rounded-full bg-gray-200 top-1/2 -translate-y-1/2" />

        {/* Colored Track */}
        <div
          className={`absolute h-2 rounded-full ${RARITY_LEVELS[value].color} top-1/2 -translate-y-1/2 transition-all duration-200`}
          style={{
            width: `${(value / (RARITY_LEVELS.length - 1)) * 100}%`,
          }}
        />

        {/* Markers */}
        <div className="absolute w-full flex justify-between px-1 top-1/2 -translate-y-1/5">
          {RARITY_LEVELS.map((rarity, index) => (
            <button
              key={index}
              onClick={() => handleMarkerClick(index)}
              disabled={disabled}
              className={`w-4 h-4 rounded-full -mt-2 z-10 transition-all duration-200
                ${index <= value ? rarity.color : "bg-gray-300"}
                ${
                  disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:ring-2 hover:ring-offset-2 hover:ring-gray-400 cursor-pointer transform hover:scale-110"
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400
              `}
              aria-label={`Set rarity to ${rarity.value}`}
            />
          ))}
        </div>

        {/* Range Input */}
        <input
          type="range"
          min="0"
          max={RARITY_LEVELS.length - 1}
          value={value}
          onChange={(e) => handleChange(e)}
          disabled={disabled}
          className="absolute w-full h-2 top-1/2 -translate-y-1/2 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default RaritySlider;
