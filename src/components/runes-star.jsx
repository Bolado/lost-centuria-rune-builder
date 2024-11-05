import React from "react";

const RunesStar = ({ setCurrentRune, currentRune, runeSet, runeSubset }) => {
  const baseCircleStyles = `absolute flex items-center justify-center w-16
      lg:w-20 h-16 lg:h-20 bg-blue-800 rounded-full cursor-pointer
      hover:drop-shadow-[0_0_0.25rem_rgba(255,255,255,1)]`;
  return (
    <div className="relative w-full h-full max-h-72 max-w-72 min-w-72 lg:max-w-96 lg:max-h-96 lg:min-w-96 aspect-square border-2 border-black flex items-center justify-center">
      {/* Circle 1 (Top) */}
      <div
        className={`${baseCircleStyles} left-1/2 top-[8%] -translate-x-1/2
          ${
            currentRune === 1
              ? "drop-shadow-[0_0_0.25rem_rgba(255,215,0,1)]"
              : ""
          }`}
        onClick={() => setCurrentRune(1)}
      >
        {runeSet && (
          <div className="relative w-3/4 h-3/4">
            <img
              src="https://swrunebuilder.com/images/Rune-slot-1.png"
              alt="Rune Slot 1"
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <p className="pt-2 lg:pt-4 absolute text-white text-xl lg:text-2xl font-runes">
          {runeSet?.character}
        </p>
      </div>

      {/* Circle 2 (Top Right) */}
      <div
        className={`${baseCircleStyles} right-[12%] top-1/4
          ${
            currentRune === 2
              ? "drop-shadow-[0_0_0.25rem_rgba(255,215,0,1)]"
              : ""
          }`}
        onClick={() => setCurrentRune(2)}
      >
        {runeSubset && (
          <div className="relative w-3/4 h-3/4">
            <img
              src="https://swrunebuilder.com/images/Rune-slot-2.png"
              alt="Rune Slot 2"
              className="w-full h-full object-contain mt-1"
            />
          </div>
        )}
        <p className="pr-2 pt-3 absolute text-white text-xl lg:text-2xl font-runes">
          {runeSubset?.character}
        </p>
      </div>

      {/* Circle 3 (Bottom Right) */}
      <div
        className={`${baseCircleStyles} right-[12%] bottom-1/4
          ${
            currentRune === 3
              ? "drop-shadow-[0_0_0.25rem_rgba(255,215,0,1)]"
              : ""
          }`}
        onClick={() => setCurrentRune(3)}
      >
        {runeSet && (
          <div className="relative w-3/4 h-3/4">
            <img
              src="https://swrunebuilder.com/images/Rune-slot-3.png"
              alt="Rune Slot 3"
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <p className="pr-2 absolute text-white text-xl lg:text-2xl font-runes">
          {runeSet?.character}
        </p>
      </div>

      {/* Circle 4 (Bottom) */}
      <div
        className={`${baseCircleStyles} left-1/2 bottom-[8%] -translate-x-1/2
          ${
            currentRune === 4
              ? "drop-shadow-[0_0_0.25rem_rgba(255,215,0,1)]"
              : ""
          }`}
        onClick={() => setCurrentRune(4)}
      >
        {runeSubset && (
          <div className="relative w-3/4 h-3/4">
            <img
              src="https://swrunebuilder.com/images/Rune-slot-4.png"
              alt="Rune Slot 4"
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <p className="pb-2 lg:pb-4 absolute text-white text-xl lg:text-2xl font-runes">
          {runeSubset?.character}
        </p>
      </div>

      {/* Circle 5 (Bottom Left) */}
      <div
        className={`${baseCircleStyles} left-[12%] bottom-1/4
          ${
            currentRune === 5
              ? "drop-shadow-[0_0_0.25rem_rgba(255,215,0,1)]"
              : ""
          }`}
        onClick={() => setCurrentRune(5)}
      >
        {runeSet && (
          <div className="relative w-3/4 h-3/4">
            <img
              src="https://swrunebuilder.com/images/Rune-slot-5.png"
              alt="Rune Slot 5"
              className="w-full h-full object-contain"
            />
          </div>
        )}
        <p className="pl-2 absolute text-white text-xl lg:text-2xl font-runes">
          {runeSet?.character}
        </p>
      </div>

      {/* Circle 6 (Top Left) */}
      <div
        className={`${baseCircleStyles} left-[12%] top-1/4
          ${
            currentRune === 6
              ? "drop-shadow-[0_0_0.25rem_rgba(255,215,0,1)]"
              : ""
          }`}
        onClick={() => setCurrentRune(6)}
      >
        {runeSubset && (
          <div className="relative w-3/4 h-3/4">
            <img
              src="https://swrunebuilder.com/images/Rune-slot-6.png"
              alt="Rune Slot 6"
              className="w-full h-full object-contain mt-1"
            />
          </div>
        )}
        <p className="pl-2 pt-3 absolute text-white text-xl lg:text-2xl font-runes">
          {runeSubset?.character}
        </p>
      </div>
    </div>
  );
};

export default RunesStar;
