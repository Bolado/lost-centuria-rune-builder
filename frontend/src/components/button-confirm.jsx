import React from "react";

const ButtonConfirm = ({ onClick, children }) => {
  const handleClick = () => {
    if (window.confirm("Are you sure?")) {
      onClick?.();
    }
  };

  return (
    <button
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default ButtonConfirm;
