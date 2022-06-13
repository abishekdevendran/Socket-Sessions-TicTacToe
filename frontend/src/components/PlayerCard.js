import React, { useContext } from "react";
import DarkModeContext from "../contexts/DarkModeContext";

const PlayerCard = ({
  playerName,
  mirror,
  turn,
  myTurn,
  isMatchInProgress,
}) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div className="flex flex-col justify-center items-center bg-bg-primary w-5/6 h-1/6 sm:rounded-tl-[10rem] rounded-tl-[5rem] sm:rounded-br-[10rem] rounded-br-[5rem] drop-shadow-md text-center md:h-5/6 md:w-1/6 whitespace-nowrap overflow-hidden text-ellipsis ">
      {/* hover:animate-scroll-text */}
      <h1
        className={`text-2xl sm:text-3xl md:text-4xl font-semibold p-20  ${
          darkMode
            ? "bg-gradient-to-r from-pink-500 to-violet-500"
            : "bg-gradient-to-r from-indigo-300 to-purple-400"
        }  bg-clip-text text-transparent ease-in-out duration-300 ${
          !playerName === null ? "blur-md" : "blur-0"
        } ${mirror ? "md:-rotate-90" : "md:rotate-90"} ${isMatchInProgress?"blur-0":"blur-md"}`}
      >
        {playerName}
      </h1>
      <div
        className={`absolute inset-0 flex justify-center items-center -z-10 bg-bg-secondary scale-y-0 ${
          !isMatchInProgress
            ? ""
            : mirror
            ? turn === myTurn
              ? ""
              : "animate-round-timer"
            : turn === myTurn
            ? "animate-round-timer"
            : ""
        }`}
      />
      <div
        className={`absolute inset-0 flex justify-center items-center -z-50 bg-bg-primary`}
      />
    </div>
  );
};

export default PlayerCard;
