import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { UserContextProvider } from "./contexts/UserContext";
import { DarkModeContextProvider } from "./contexts/DarkModeContext";
import { SocketContextProvider } from "./contexts/SocketContext";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Game from "./pages/Game";

function App() {
  useEffect(() => {
    const pageSetter = () => {
      let viewheight = window.innerHeight;
      let viewwidth = window.innerWidth;
      let viewport = document.querySelector("meta[name=viewport]");
      viewport.setAttribute(
        "content",
        "height=" + viewheight + ", width=" + viewwidth + ", initial-scale=1.0"
      );
    };
    pageSetter();
  }, []);
  return (
    <DarkModeContextProvider>
      <UserContextProvider>
        <SocketContextProvider>
          <Navbar />
          <Toaster
            position="top-center"
            toastOptions={{
              className:
                "text-primary bg-bg-secondary ease-in-ease-out duration-1000",
            }}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="game/:gameIdUrl" element={<Game />} />
            <Route path="game" element={<Game />} />
          </Routes>
        </SocketContextProvider>
      </UserContextProvider>
    </DarkModeContextProvider>
  );
}

export default App;
