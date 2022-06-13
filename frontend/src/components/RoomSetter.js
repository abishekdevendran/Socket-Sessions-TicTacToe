import React, { useContext, useEffect, useState } from "react";
import DarkModeContext from "../contexts/DarkModeContext";
import toast from "react-hot-toast";
import { generateSlug } from "random-word-slugs";
import { useNavigate } from "react-router-dom";

const RoomSetter = ({
  joinHandler,
  roomCode,
  setRoomCode,
  join,
  setJoin,
  sessionCheck,
  setRoomExists,
}) => {
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  const roomHandler = () => {
    console.log("roomHandler");
    if (sessionCheck(false)) {
      setRoomExists(true);
      setRoomCode(generateSlug());
    }
  };

  return (
    <div className="roomsetter flex flex-col justify-center items-center bg-bg-primary w-5/6 h-3/5 sm:rounded-tr-[10rem] rounded-tr-[5rem] sm:rounded-bl-[10rem] rounded-bl-[5rem] drop-shadow-md p-10 text-center md:w-3/5 md:h-5/6">
      <h1
        className={`pb-10 text-3xl sm:text-5xl md:text-7xl font-semibold ${
          darkMode
            ? "bg-gradient-to-r from-pink-500 to-violet-500"
            : "bg-gradient-to-r from-indigo-300 to-purple-400"
        }  bg-clip-text text-transparent ease-in-out duration-300`}
      >
        Let's Begin
      </h1>
      {join && (
        <input
          type="text"
          placeholder="Room Code"
          required
          className=" shadow-inner text-center bg-transparent border-b-2 text-primary w-full max-w-screen-sm mb-5 valid:border-green-600 invalid:border-red-600 rounded-tr-3xl rounded-bl-3xl text-3xl"
          onChange={(e) => setRoomCode(e.target.value)}
        />
      )}
      {join && (
        <div className="form-container w-full min-h-1/6 flex flex-row justify-center">
          <button
            className="text-secondary text-1xl sm:text-2xl md:text-3xl bg-brand-primary rounded-bl-xl p-3 pb-4 mx-5 w-44 transition-all ease-in-ease-out duration-300 h-full"
            onClick={joinHandler}
          >
            Join!
          </button>
          <button
            className="text-secondary text-1xl sm:text-2xl md:text-3xl bg-brand-primary rounded-tr-xl p-3 pb-4 mx-5 w-44 transition-all ease-in-ease-out duration-300 h-full"
            onClick={() => setJoin(false)}
          >
            Go Back
          </button>
        </div>
      )}
      {!join && (
        <div className="button-container w-full min-h-1/6 flex flex-row justify-center">
          <button
            className="text-secondary text-1xl sm:text-2xl md:text-3xl bg-brand-primary rounded-bl-xl p-3 pb-4 mx-5 w-44 transition-all ease-in-ease-out duration-300 h-full"
            onClick={roomHandler}
          >
            Create Room
          </button>
          <button
            className="text-secondary text-1xl sm:text-2xl md:text-3xl bg-brand-primary rounded-tr-xl p-3 pb-4 mx-5 w-44 transition-all ease-in-ease-out duration-300 h-full"
            onClick={joinHandler}
          >
            Join Room
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomSetter;
