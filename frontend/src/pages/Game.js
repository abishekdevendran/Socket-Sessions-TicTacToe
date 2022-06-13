import React, {
  useContext,
  useLayoutEffect,
  useState,
  useEffect,
  useReducer,
} from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import PlayerCard from "../components/PlayerCard";
import { returningCheckRoom, roomJoined } from "../helpers/socketFunctions";
import RoomSetter from "../components/RoomSetter";
import toast from "react-hot-toast";
import Board from "../components/Board";
import SocketContext from "../contexts/SocketContext";

const Game = () => {
  const { gameIdUrl } = useParams();
  const { user, sessionCheck } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  const [join, setJoin] = useState(false);
  const [firstPlayer, setFirstPlayer] = useState({
    name: user.name,
    wins: 0,
    isPlayer: true,
  });
  const [secondPlayer, setSecondPlayer] = useState({
    name: "Waiting for player to join...",
    wins: 0,
    isPlayer: false,
  });
  const [roomCode, setRoomCode] = useState(null);
  const [roomExists, setRoomExists] = useState(false);
  const [isMatchInProgress, setIsMatchInProgress] = useState(false);
  const [isFirstPlayer, setIsFirstPlayer] = useState(false);
  const [turn, toggleTurn] = useReducer(
    (state) => (state === "X" ? "O" : "X"),
    "X"
  );
  const [myTurn, setMyTurn] = useState("");

  const joinHandler = async () => {
    console.log("joinHandler");
    if (sessionCheck(false)) {
      if (!join) {
        setJoin(true);
      } else {
        if (roomCode?.length > 0) {
          socket.emit("checkRoom", roomCode);
        } else {
          toast("Please enter a room code", { type: "error" });
        }
      }
    }
  };

  useEffect(() => {
    if (roomExists) {
      navigate(`/game/${roomCode}`);
      socket.emit("joinRoom", { roomCode: roomCode, user: user.name });
    }
  }, [roomExists]);

  //the socket cleanups are very important and annoying
  useEffect(() => {
    if (socket !== null) {
      socket.on("roomJoined", ({ player1, player2 }) => {
        console.log("roomJoined");
        toast("New Player joined Room", { type: "success" });
        setFirstPlayer({
          name: player1,
          wins: 0,
          isPlayer: player1 == null ? false : true,
        });
        setSecondPlayer({
          name: player2,
          wins: 0,
          isPlayer: player2 == null ? false : true,
        });
        console.log(player1, player2);
        if (player1 && player2) {
          if (player1 === user.name) {
            setMyTurn("X");
            setIsFirstPlayer(true);
          }
          else{
            setMyTurn("O");
          }
          setIsMatchInProgress(true);
          toast("Match in Progress", { type: "success" });
        }
      });
      socket.on("returningCheckRoom", (res) => {
        if (res === 1) {
          setRoomExists(true);
        } else if (res === 0) {
          toast("Room does not exist", { type: "error" });
          setRoomExists(false);
        } else if (res === 2) {
          toast("Room is full", { type: "error" });
          setRoomExists(false);
        } else {
          toast("Room Closed", { type: "error" });
          setRoomExists(false);
        }
      });
    }
    return () => {
      socket.off("roomJoined");
      socket.off("returningCheckRoom");
    };
  }, [setRoomExists,setIsFirstPlayer,isFirstPlayer,setMyTurn,myTurn,toggleTurn]);

  useEffect(() => {
    if (!roomExists) {
      console.log("gameIdUrl:", gameIdUrl);
      if (gameIdUrl) {
        setRoomCode(gameIdUrl);
        setJoin(true);
        socket.emit("checkRoom", gameIdUrl);
      }
    }
  }, [gameIdUrl, roomExists]);

  useLayoutEffect(() => {
    document.title = `${user.name}'s Game`;
  }, [user]);

  //Todo: Cleanup effects and remove socket dependency. socket.on are just eventlisteners. Bind on init. [] dependency array.

  return user.isLoggedIn ? (
    <div className={`w-full h-screen bg-bg-secondary flex ${isFirstPlayer?"flex-col-reverse":"flex-col"} md:flex-row items-center justify-around pt-20`}>
      <PlayerCard
        playerName={firstPlayer.name}
        mirror={!isFirstPlayer?true:false}
        turn={turn}
        myTurn={myTurn}
        isMatchInProgress={isMatchInProgress}
      />
      {!roomExists ? (
        <RoomSetter
          joinHandler={joinHandler}
          roomCode={roomCode}
          setRoomCode={setRoomCode}
          join={join}
          setJoin={setJoin}
          sessionCheck={sessionCheck}
          setRoomExists={setRoomExists}
        />
      ) : (
        <div className="flex flex-col justify-center items-center bg-bg-primary w-5/6 h-1/2 sm:rounded-tr-[10rem] rounded-tr-[5rem] sm:rounded-bl-[10rem] rounded-bl-[5rem] drop-shadow-md text-center md:w-3/5 md:h-5/6">
          <Board
            isMatchInProgress={isMatchInProgress}
            setIsMatchInProgress={setIsMatchInProgress}
            roomCode={roomCode}
            isFirstPlayer={isFirstPlayer}
            turn={turn}
            myTurn={myTurn}
            toggleTurn={toggleTurn}
          />
        </div>
      )}
      <PlayerCard
        playerName={secondPlayer.name}
        mirror={!isFirstPlayer?false:true}
        turn={turn}
        myTurn={myTurn}
        isMatchInProgress={isMatchInProgress}
      />
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default Game;
