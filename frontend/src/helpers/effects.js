import { useEffect, useRef } from "react";
import { io } from "socket.io-client";



// export const useSockets = () => {
//   const socket=useRef();
//   useEffect(() => {
//     socket.current = io({ reconnection: false });
//     console.log(socket);
//   },[]);
//   return socket;
// };
