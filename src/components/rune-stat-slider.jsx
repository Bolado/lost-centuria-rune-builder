import React, { memo, useCallback } from "react";

// Define available rarity levels with their corresponding visual styles
const RARITY_LEVELS = [
  { value: "normal", color: "bg-gray-500", textColor: "text-gray-500" },
  { value: "rare", color: "bg-green-500", textColor: "text-green-500" },
  { value: "epic", color: "bg-purple-500", textColor: "text-purple-500" },
  { value: "legendary", color: "bg-orange-500", textColor: "text-orange-500" },
];

// Memoized slider component for selecting rune rarity levels
const RaritySlider = memo(
  ({ slotName, currentRarity, onRarityChange, disabled }) => {
    // Convert rarity string to numerical index for slider
    const currentValue = RARITY_LEVELS.findIndex(
      (level) => level.value === currentRarity
    );

    // Handle slider value changes, converting numerical index back to rarity string
    const handleChange = useCallback(
      (newValue) => {
        if (!disabled) {
          onRarityChange(slotName, RARITY_LEVELS[newValue].value);
        }
      },
      [disabled, onRarityChange, slotName]
    );

    // Handle clicks on rarity marker buttons
    const handleMarkerClick = useCallback(
      (index) => {
        if (!disabled) {
          handleChange(index);
        }
      },
      [disabled, handleChange]
    );

    return (
      <div className="w-full mx-auto space-y-4">
        <div className="relative h-8">
          {/* Background track for the slider */}
          <div className="absolute h-2 w-full rounded-full bg-gray-200 top-1/2 -translate-y-1/2" />

          {/* Colored progress track showing current rarity level */}
          <div
            className={`absolute h-2 rounded-full ${RARITY_LEVELS[currentValue].color} top-1/2 -translate-y-1/2 transition-all duration-200`}
            style={{
              width: `${(currentValue / (RARITY_LEVELS.length - 1)) * 100}%`,
            }}
          />

          {/* Clickable markers for each rarity level */}
          <div className="absolute w-full flex justify-between px-1 top-1/2 -translate-y-1/5">
            {RARITY_LEVELS.map((rarity, index) => (
              <button
                key={index}
                onClick={() => handleMarkerClick(index)}
                disabled={disabled}
                className={`w-4 h-4 rounded-full -mt-2 z-10 transition-all duration-200
                ${index <= currentValue ? rarity.color : "bg-gray-300"}
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

          {/* Hidden range input for keyboard/screen reader accessibility */}
          <input
            type="range"
            min="0"
            max={RARITY_LEVELS.length - 1}
            value={currentValue}
            onChange={(e) => handleChange(parseInt(e.target.value))}
            disabled={disabled}
            className="absolute w-full h-2 top-1/2 -translate-y-1/2 opacity-0 cursor-pointer"
          />
        </div>
      </div>
    );
  }
);

RaritySlider.displayName = "RaritySlider";
export default RaritySlider;
