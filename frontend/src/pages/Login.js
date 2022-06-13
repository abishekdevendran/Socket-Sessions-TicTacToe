import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import Form from "../components/Form";

const Login = () => {
  const { user,setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [uname, setUname] = useState("");
  const [pass, setPass] = useState("");

  const submitHandler = async (event) => {
    event.preventDefault();
    const data = {
      uname: uname,
      pword: pass,
    };
    try {
      const response = await fetch("/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      toast(result.message);
      if (result.status === "Success") {
        setUser({
          name: uname,
          isLoggedIn: true,
          loginCount: result.loginCount,
        });
        navigate("/game");
      }
    } catch (err) {
      toast("Authentication server unavailable");
    }
  };

  useEffect(() => {
    document.title = "Login";
  }, []);

  return !user.isLoggedIn ? (
    <Form formContext="Login" submitHandler={submitHandler} setUname={setUname} setPass={setPass}/>
  ) : (
    <Navigate to="/game" replace />
  );
};

export default Login;
