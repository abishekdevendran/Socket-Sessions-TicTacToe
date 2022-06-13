import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
import Square from "./Square";
import SocketContext from "../contexts/SocketContext";
import toast from "react-hot-toast";

const Board = ({isMatchInProgress,setIsMatchInProgress,roomCode,isFirstPlayer,turn,myTurn,toggleTurn}) => {
  const { socket } = useContext(SocketContext);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [history, setHistory] = useReducer((state)=>state-1,9);
  // const timerRef=useRef(null);
  
// const timeoutFunction=()=>setTimeout(()=>{
//   toast("Timer EXEC");
//   setIsMatchInProgress(false);
// },7000);

  useEffect(() => {
    socket.on("boardUpdate",  (board)=>{
      setBoard(board);
      toggleTurn();
    });
    return () => {
      socket.off("boardUpdate");
    }
  }, [socket]);

  // useEffect(() => {
  //   clearTimeout(timerRef.current);
  //   timerRef.current=timeoutFunction;
  //   if(!isMatchInProgress){
  //     clearTimeout(timerRef.current);
  //   }
  //   return ()=>{
  //     clearTimeout(timerRef.current);
  //   }
  // },[isMatchInProgress,timerRef,turn]);

  // useEffect(()=>{
  //   timerRef.current = timeoutFunction;
  //   timerRef.current();
  // },[timerRef])
  
  return (
    <div
      className={`min-w-52 min-h-52 bg-brand-grey-primary w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 grid grid-cols-3 grid-rows-3 gap-2 aspect-square drop-shadow-md ${
        !isMatchInProgress ? "blur-md" : "blur-0"
      }`}
    >
      {board.map((item, index) => {
        return (
          <Square
            key={index}
            id={index}
            value={item}
            turn={turn}
            myTurn={myTurn}
            toggleTurn={toggleTurn}
            setBoard={setBoard}
            board={board}
            isMatchInProgress={isMatchInProgress}
            roomCode={roomCode}
          />
        );
      })}
      <button
        onClick={() => {
          socket.emit("boardUpdate", Array(9).fill(null), roomCode);
        }}
        className="text-center min-w-full"
      >
        Reset
      </button>
    </div>
  );
};

export default Board;
