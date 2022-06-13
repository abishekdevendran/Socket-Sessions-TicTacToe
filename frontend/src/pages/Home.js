import React, { useContext, useEffect } from "react";
import { NavLink,Navigate } from "react-router-dom";
import DarkModeContext from "../contexts/DarkModeContext";
import userContext from "../contexts/UserContext";

const Home = () => {
    const { darkMode } = useContext(DarkModeContext);
    const {user}=useContext(userContext);
    useEffect(() => {
        document.title = "Tic-Tac-Toe";
    },[]);
  return user.isLoggedIn ? (
    <Navigate to="/game" replace />
  ) : (
    <div className="w-full h-screen bg-bg-secondary flex items-center justify-around transition-all ease-in-ease-out duration-300 overflow-hidden">
      <div className="flex flex-col justify-center items-center bg-bg-primary w-3/4 h-2/4 sm:w-2/4 sm:h-3/4 sm:mt-32 sm:rounded-tl-[10rem] rounded-tl-[5rem] sm:rounded-br-[10rem] rounded-br-[5rem] drop-shadow-md p-10 text-center transition-all ease-in-ease-out duration-300">
        <h1
          className={`pb-10 text-7xl sm:text-8xl md:text-9xl font-semibold ${
            darkMode
              ? "bg-gradient-to-r from-pink-500 to-violet-500"
              : "bg-gradient-to-r from-indigo-300 to-purple-400"
          }  bg-clip-text text-transparent transition-all ease-in-out duration-300`}
        >
          Hello.
        </h1>
        <div className="text-primary text-xl sm:text-2xl md:text-3xl mb-5">
          New Player? Click{" "}
          <NavLink to="signup" className="text-brand-secondary">
            here
          </NavLink>{" "}
          to sign up.
        </div>
        <div className="text-primary text-xl sm:text-2xl md:text-3xl">
          Existing Player? Click{" "}
          <NavLink to="Login" className="text-brand-secondary">
            here
          </NavLink>{" "}
          to login.
        </div>
      </div>
    </div>
  );
};

export default Home;
