import React, { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: null,
    isLoggedIn: false,
    loginCount: 0,
  });

  
    const sessionCheck = async (toastFlag=true) => {
      const value = localStorage.getItem("user");
      try {
        const res = await fetch("/session");
        const data = await res.json();
        if (!data.signal) {
          console.log("user reset");
          if (value !== null) {
            console.log("value not null");
            toast(data.message);
            localStorage.removeItem("user");
          }
          setUser({ name: null, isLoggedIn: false, loginCount: 0 });
          if(!toastFlag) return false;
        } else {
          console.log("existing user set");
          toastFlag && toast(data.message);
          localStorage.setItem("user", JSON.stringify(user));
          setUser({
            name: data.user,
            isLoggedIn: true,
            loginCount: data.loginCount,
          });
        }
      } catch (err) {
        console.log(err);
      }
    };

  // useEffect(() => {
  //   const value = localStorage.getItem("user");
  //   console.log(value);
  //   if (value === null) {
  //     localStorage.setItem("user", JSON.stringify(user));
  //   } else {
  //     setUser(JSON.parse(value));
  //   }
  // }, []);

  useEffect(() => {
    sessionCheck();
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("user", JSON.stringify(user));
  // }, [user]);
  return (
    <UserContext.Provider value={{ user: user, setUser: setUser, sessionCheck: sessionCheck }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
