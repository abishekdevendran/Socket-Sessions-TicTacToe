import toast from "react-hot-toast";

export const roomJoined = (player1,setFirstPLayer, player2,setSecondPlayer) => {
  console.log("yass");
  if (player1 !== null) {
    setFirstPLayer({
      name: player1,
      wins: 0,
    });
  }
  if (player2 !== null) {
    setSecondPlayer({
      name: player2,
      wins: 0,
    });
  }
};

export const returningCheckRoom = (res) => {
  if (res === 1) {
    // setRoomExists(true);
  } else if (res === 0) {
    toast("Room does not exist", { type: "error" });
  } else {
    toast("Room is full", { type: "error" });
  }
};