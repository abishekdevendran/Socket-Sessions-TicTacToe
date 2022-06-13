import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import DarkModeContext from "../contexts/DarkModeContext";

const Form = ({formContext,submitHandler,setUname,setPass}) => {
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen bg-bg-secondary flex items-center justify-around transition-all ease-in-ease-out duration-300">
      <div className="flex flex-col justify-center items-center bg-bg-primary w-3/4 h-3/5 sm:w-2/4 sm:h-3/4 sm:mt-32 sm:rounded-tl-[10rem] rounded-tl-[5rem] sm:rounded-br-[10rem] rounded-br-[5rem] drop-shadow-md p-10 text-center transition-all ease-in-ease-out duration-300">
        <h1
          className={`pb-10 text-5xl sm:text-7xl md:text-8xl font-semibold transition-all ease-in-ease-out duration-300 ${
            darkMode
              ? "bg-gradient-to-r from-pink-500 to-violet-500"
              : "bg-gradient-to-r from-indigo-300 to-purple-400"
          }  bg-clip-text text-transparent`}
        >
          {formContext}
        </h1>
        <form
          onSubmit={submitHandler}
          className="wrapper w-full text-1xl sm:text-2xl md:text-3xl"
        >
          <div className="wrapper w-full text-1xl sm:text-2xl md:text-3xl">
            <input
              type="text"
              placeholder="Username"
              required
              className=" shadow-inner text-center bg-transparent border-b-2 text-primary w-full max-w-screen-sm mb-5 valid:border-green-600 invalid:border-red-600 rounded-tl-3xl"
              onChange={(e) => setUname(e.target.value)}
            />
          </div>
          <div className="wrapper w-full text-1xl sm:text-2xl md:text-3xl">
            <input
              type="password"
              placeholder="Password"
              required
              className=" shadow-inner text-center bg-transparent border-b-2 text-primary w-full max-w-screen-sm mb-5 valid:border-green-600 invalid:border-red-600 rounded-br-3xl "
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <div className="container flex justify-center mb-5 h-2/6">
            <button
              type="submit"
              className="text-secondary text-1xl sm:text-2xl md:text-3xl bg-brand-primary rounded-br-xl p-2 mx-2 w-44 transition-all ease-in-ease-out duration-300"
            >
              {formContext}💪
            </button>
            <button
              type="reset"
              className="text-secondary text-1xl sm:text-2xl md:text-3xl bg-brand-primary rounded-br-xl p-2 mx-2 w-44 transition-all ease-in-ease-out duration-300"
              onClick={() => {
                navigate("/");
              }}
            >
              Go Back😿
            </button>
          </div>
        </form>
        <div className="text-primary text-1xl sm:text-2xl md:text-3xl">
          Existing User? Click{" "}
          <NavLink to={`/${formContext==="Login"?"signup":"login"}`} className="text-brand-secondary">
            here
          </NavLink>{" "}
          to {formContext==="Login"?"Signup":"Login"} instead.
        </div>
      </div>
    </div>
  );
}

export default Form