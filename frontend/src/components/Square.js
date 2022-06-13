import React, { useContext } from "react";
import toast from "react-hot-toast";
import { BiCircle, BiX } from "react-icons/bi";
import SocketContext from "../contexts/SocketContext";

const Square = ({
  value,
  id,
  turn,
  myTurn,
  toggleTurn,
  setBoard,
  board,
  isMatchInProgress,
  roomCode,
}) => {
  const { socket } = useContext(SocketContext);
  const clickHandler = (event) => {
    if (board[id] === null && isMatchInProgress && myTurn==turn) {
      console.log("clickHandler",turn,myTurn);
      let newBoard = [...board];
      newBoard[id] = turn;
      socket.emit("boardUpdate", newBoard, roomCode);
      // clearTimeout(timeoutFunction);
      // toast("Timer Deferred");
    }
  };
  return (
    <div
      className={`flex items-center justify-center align-center bg-brand-grey-secondary hover:opacity-60 row-span-1 col-span-1 drop-shadow-md ${
        value === "X" && "bg-orange-600"
      } ${value === "O" && "bg-blue-600"} ${
        isMatchInProgress ? "cursor-pointer" : "cursor-not-allowed"
      } ${myTurn == turn ? "cursor-pointer" : "cursor-not-allowed"}`}
      onClick={clickHandler}
    >
      {value === "X" && <BiX className="text-white text-5xl" />}
      {value === "O" && <BiCircle className="text-white text-5xl" />}
      {/* {id} */}
    </div>
  );
};

export default Square;
