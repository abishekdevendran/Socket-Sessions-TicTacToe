import React, { createContext, useEffect, useRef } from "react";
import io from "socket.io-client";
import toast from "react-hot-toast";

const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const socket = useRef();
  socket.current = io({
    reconnection: false,
    closeOnBeforeunload: true,
    "sync disconnect on unload": true,
  });
  useEffect(() => {
    socket.current.on("connect_error", (err) => {
    toast(`Server unavailable at the moment. Error: ${err}`, { type: "error" });
    });
    socket.current.on("disconnect", (err) => {
      toast(`Server disconnected unexpectedly. Error: ${err}`, { type: "error" });
    });
    return ()=>{
      socket.current.off("connect_error");
      socket.current.off("disconnect");
    }
  },[]);
  return (
    <SocketContext.Provider value={{ socket: socket.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
