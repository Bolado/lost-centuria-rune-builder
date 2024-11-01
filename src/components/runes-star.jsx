const RunesStar = ({ setCurrentRune, currentRune, runeSetSubset }) => {
  return (
    <div className="relative w-96 h-96 border-2 border-black m-4">
      {/* Circle 1 (Top) */}
      <div
        className={`absolute flex items-center justify-center w-20 h-20 bg-blue-800 rounded-full left-1/2 top-8 -translate-x-1/2 cursor-pointer hover:drop-shadow-[0_0_0.25rem_rgba(255,255,255,1)] ${
          currentRune === 1 ? "drop-shadow-[0_0_0.25rem_rgba(255,215,0,1)]" : ""
        }`}
        onClick={() => setCurrentRune(1)}
      >
        <img
          src="https://swrunebuilder.com/images/Rune-slot-1.png"
          alt="Rune Slot 1"
          className="w-15 h-auto"
        />
        <p className="pt-4 absolute text-white text-2xl font-runes">
          {runeSetSubset.set?.character}
        </p>
      </div>

      {/* Circle 2 (Top Right) */}
      <div
        className={`absolute flex items-center justify-center w-20 h-20 bg-blue-800 rounded-full right-12 top-1/4 cursor-pointer hover:drop-shadow-[0_0_0.25rem_rgba(255,255,255,1)] ${
          currentRune === 2 ? "drop-shadow-[0_0_0.25rem_rgba(255,215,0,1)]" : ""
        }`}
        onClick={() => setCurrentRune(2)}
      >
        <img
          src="https://swrunebuilder.com/images/Rune-slot-2.png"
          alt="Rune Slot 2"
          className="w-15 h-auto mt-1"
        />
        <p className="pr-2 pt-1 absolute text-white text-2xl font-runes">
          {runeSetSubset.subset?.character}
        </p>
      </div>

      {/* Circle 3 (Bottom Right) */}
      <div
        className={`absolute flex items-center justify-center w-20 h-20 bg-blue-800 rounded-full right-12 bottom-1/4 cursor-pointer hover:drop-shadow-[0_0_0.25rem_rgba(255,255,255,1)] ${
          currentRune === 3 ? "drop-shadow-[0_0_0.25rem_rgba(255,215,0,1)]" : ""
        }`}
        onClick={() => setCurrentRune(3)}
      >
        <img
          src="https://swrunebuilder.com/images/Rune-slot-3.png"
          alt="Rune Slot 3"
          className="w-15 h-auto"
        />
        <p className="pr-2 absolute text-white text-2xl font-runes">
          {runeSetSubset.set?.character}
        </p>
      </div>

      {/* Circle 4 (Bottom) */}
      <div
        className={`absolute flex items-center justify-center w-20 h-20 bg-blue-800 rounded-full left-1/2 bottom-8 -translate-x-1/2 cursor-pointer hover:drop-shadow-[0_0_0.25rem_rgba(255,255,255,1)] ${
          currentRune === 4 ? "drop-shadow-[0_0_0.25rem_rgba(255,215,0,1)]" : ""
        }`}
        onClick={() => setCurrentRune(4)}
      >
        <img
          src="https://swrunebuilder.com/images/Rune-slot-4.png"
          alt="Rune Slot 4"
          className="w-15 h-auto"
        />
        <p className="pb-4 absolute text-white text-2xl font-runes">
          {runeSetSubset.subset?.character}
        </p>
      </div>

      {/* Circle 5 (Bottom Left) */}
      <div
        className={`absolute flex items-center justify-center w-20 h-20 bg-blue-800 rounded-full left-12 bottom-1/4 cursor-pointer hover:drop-shadow-[0_0_0.25rem_rgba(255,255,255,1)] ${
          currentRune === 5 ? "drop-shadow-[0_0_0.25rem_rgba(255,215,0,1)]" : ""
        }`}
        onClick={() => setCurrentRune(5)}
      >
        <img
          src="https://swrunebuilder.com/images/Rune-slot-5.png"
          alt="Rune Slot 5"
          className="w-15 h-auto"
        />
        <p className="pl-2 absolute text-white text-2xl font-runes">
          {runeSetSubset.set?.character}
        </p>
      </div>

      {/* Circle 6 (Top Left) */}
      <div
        className={`absolute flex items-center justify-center w-20 h-20 bg-blue-800 rounded-full left-12 top-1/4 cursor-pointer hover:drop-shadow-[0_0_0.25rem_rgba(255,255,255,1)] ${
          currentRune === 6 ? "drop-shadow-[0_0_0.25rem_rgba(255,215,0,1)]" : ""
        }`}
        onClick={() => setCurrentRune(6)}
      >
        <img
          src="https://swrunebuilder.com/images/Rune-slot-6.png"
          alt="Rune Slot 6"
          className="w-15 h-auto mt-1"
        />
        <p className="pl-2 pt-1 absolute text-white text-2xl font-runes">
          {runeSetSubset.subset?.character}
        </p>
      </div>
    </div>
  );
};

export default RunesStar;
