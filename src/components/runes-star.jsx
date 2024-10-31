const RunesStar = ({ setCurrentRune, currentRune }) => {
  return (
    <div className="relative w-96 h-96 border-2 border-black m-4">
      {/* Circle 1 (Top) */}
      <div
        className={`absolute w-20 h-20 bg-blue-800 rounded-full left-1/2 top-8 -translate-x-1/2 cursor-pointer hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] ${
          currentRune === 1 ? "drop-shadow-[0_0_15px_rgba(255,215,0,1)]" : ""
        }`}
        onClick={() => setCurrentRune(1)}
      >
        1
      </div>

      {/* Circle 2 (Top Right) */}
      <div
        className={`absolute w-20 h-20 bg-blue-800 rounded-full right-12 top-1/4 cursor-pointer hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] ${
          currentRune === 2 ? "drop-shadow-[0_0_15px_rgba(255,215,0,1)]" : ""
        }`}
        onClick={() => setCurrentRune(2)}
      >
        2
      </div>

      {/* Circle 3 (Bottom Right) */}
      <div
        className={`absolute w-20 h-20 bg-blue-800 rounded-full right-12 bottom-1/4 cursor-pointer hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] ${
          currentRune === 3 ? "drop-shadow-[0_0_15px_rgba(255,215,0,1)]" : ""
        }`}
        onClick={() => setCurrentRune(3)}
      >
        3
      </div>

      {/* Circle 4 (Bottom) */}
      <div
        className={`absolute w-20 h-20 bg-blue-800 rounded-full left-1/2 bottom-8 -translate-x-1/2 cursor-pointer hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] ${
          currentRune === 4 ? "drop-shadow-[0_0_15px_rgba(255,215,0,1)]" : ""
        }`}
        onClick={() => setCurrentRune(4)}
      >
        4
      </div>

      {/* Circle 5 (Bottom Left) */}
      <div
        className={`absolute w-20 h-20 bg-blue-800 rounded-full left-12 bottom-1/4 cursor-pointer hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] ${
          currentRune === 5 ? "drop-shadow-[0_0_15px_rgba(255,215,0,1)]" : ""
        }`}
        onClick={() => setCurrentRune(5)}
      >
        5
      </div>

      {/* Circle 6 (Top Left) */}
      <div
        className={`absolute w-20 h-20 bg-blue-800 rounded-full left-12 top-1/4 cursor-pointer hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] ${
          currentRune === 6 ? "drop-shadow-[0_0_15px_rgba(255,215,0,1)]" : ""
        }`}
        onClick={() => setCurrentRune(6)}
      >
        6
      </div>
    </div>
  );
};

export default RunesStar;
