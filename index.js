const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const helmet = require("helmet");
const { sessionMiddleware } = require("./helpers/redisStore");
const db = require("./helpers/db");
const bcrypt = require("bcrypt");
const path = require("path");

require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();
const server = require("http").createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:*",
    credentials: true,
  },
});
const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

// app.enable("trust proxy");
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:*",
      "https://socket-sessions-tictactoe.herokuapp.com:*",
    ],
    credentials: true,
  })
);
app.use(sessionMiddleware);
io.use(wrap(sessionMiddleware));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
  });
}

app.get("/session", (req, res) => {
  if (req.session.user) {
    res.json({
      message: "Welcome back " + req.session.user,
      signal: true,
      user: req.session.user,
      loginCount: req.session.loginCount,
    });
  } else {
    res.json({ message: "Session expired", signal: false });
  }
});
//Fix response send messages
app.post("/users/login", async (req, res) => {
  if (req.session.user) {
    res.json({ message: "You are already logged in" });
  } else {
    const { uname, pword } = req.body;
    try {
      const user = await db.query("SELECT * FROM users WHERE username = $1", [
        uname,
      ]);
      if (user.rows.length > 0) {
        const isMatch = await bcrypt.compare(pword, user.rows[0].password);
        if (isMatch) {
          req.session.user = uname;
          req.session.loginCount = parseInt(user.rows[0].logincount + 1);
          console.log(req.session.loginCount,req.session.user,"loginCount and user");
          await db.query(
            "UPDATE users SET loginCount = $1 WHERE username = $2",
            [
              parseInt(user.rows[0].logincount + 1),
              // !user.rows[0].isloggedin,
              uname,
            ]
          );
          console.log("response is ready!");
          res.status(200).json({
            message: "Login successful",
            status: "Success",
            loginCount: req.session.loginCount,
          });
        } else {
          res.json({ message: "Wrong password" });
        }
      } else {
        res.json({ message: "User does not exist" });
      }
    } catch (err) {
      console.log(err.message);
    }
  }
});

app.post("/users/signup", async (req, res) => {
  if (req.session.user) {
    res.json({ message: "You are already logged in" });
    console.log("You are already logged in");
  } else {
    const { uname, pword } = req.body;
    try {
      const user = await db.query("SELECT * FROM users WHERE username = $1", [
        uname,
      ]);
      if (user.rows.length > 0) {
        res.json({ message: "User already exists" });
      } else {
        console.log("User being added to db");
        const hashedPassword = await bcrypt.hash(pword, 10);
        const newUser = await db.query(
          "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
          [uname, hashedPassword]
        );
        req.session.user = uname;
        req.session.loginCount = parseInt(1);
        res.status(200).json({
          message: "User created and logged in.",
          status: "Success",
          loginCount: req.session.loginCount,
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  }
});

app.post("/users/logout", async (req, res) => {
  // await db.query("UPDATE users SET isLoggedIn= $1 WHERE username = $2", [
  //   false,
  //   req.body.user,
  // ]);
  req.session.destroy();
  res.clearCookie("tictactoe-session").json({ message: "Logged out" });
});

//enable soft logouts later
// app.post("/users/softLogout", async (req) => {
//   await db.query("UPDATE users SET isLoggedIn= $1 WHERE username = $2", [
//     false,
//     req.body.user,
//   ]);
//   console.log("session soft destroyed");
// });

app.get("/users", async (req, res) => {
  const users = await db.query("SELECT * FROM users");
  console.log(req.session);
  res.send(users.rows);
});

//---------------------------------------------------------------------------------------------------------
//auth in socket.io
// const wrap = (middleware) => (socket, next) =>
//   middleware(socket.request, socket.request.res || {}, next);

// io.use(wrap(sessionMiddleware));

// // only allow authenticated users
// io.use((socket, next) => {
//   const sockSession = socket.request.session;
//   if (sockSession?.user) {
//     console.log("User is authenticated");
//     next();
//   } else {
//     console.log("not authenticated");
//     next();
//   }
// });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id, socket.request.session.user);

  socket.on("joinRoom", async ({ roomCode, user }) => {
    console.log(`User ${user} joined room ${roomCode}`);
    try {
      const testRes = await db.query(
        "SELECT * FROM rooms WHERE roomcode = $1",
        [roomCode]
      );
      if (testRes?.rows.length === 0) {
        console.log("first player inside");
        await db.query(
          "insert into rooms (roomcode, player1) values ($1, $2)",
          [roomCode, user]
        );
        socket.join(roomCode);
        io.in(roomCode).emit("roomJoined", { player1: user, player2: null });
        console.log(user, null, "\n");
      } else if (
        testRes?.rows[0]?.player1 !== null &&
        testRes?.rows[0]?.player2 == null
      ) {
        console.log("second player inside");
        await db.query("update rooms set player2=$1 where roomcode=$2", [
          user,
          roomCode,
        ]);
        socket.join(roomCode);
        io.in(roomCode).emit("roomJoined", {
          player1: testRes.rows[0]?.player1,
          player2: user,
        });
        console.log(testRes.rows[0]?.player1, user, "\n");
      } else {
        console.log("Room already full");
      }
    } catch (err) {
      console.log(err.message);
    }
  });

  socket.on("checkRoom", async (roomCode) => {
    console.log(`Checking room ${roomCode}`);
    try {
      const testRes = await db.query(
        "SELECT * FROM rooms WHERE roomcode = $1",
        [roomCode]
      );
      console.log(
        "roomcheck:",
        testRes?.rows[0]?.player1,
        testRes?.rows[0]?.player2
      );
      if (testRes?.rows[0]?.player1 && !testRes?.rows[0]?.player2) {
        socket.emit("returningCheckRoom", 1);
      } else if (testRes?.rows[0]?.player1 && testRes?.rows[0]?.player2) {
        socket.emit("returningCheckRoom", 2);
      } else {
        socket.emit("returningCheckRoom", 0);
      }
    } catch (err) {
      console.log(err.message);
    }
  });

  socket.on("boardUpdate", (board, roomCode) => {
    console.log(`Board update in room ${roomCode}`);
    io.in(roomCode).emit("boardUpdate", board);
  });

  // socket.on("leaveRoom", ({ roomCode, user }) => {
  //   console.log(`User ${user} left room ${roomCode}`);
  //   socket.leave(roomCode);
  // });

  socket.on("disconnect", async () => {
    try {
      const query = await db.query(
        "SELECT * FROM rooms WHERE player1 = $1 OR player2=$1",
        [socket.request.session.user]
      );
      db.query("DELETE FROM rooms WHERE roomcode=$1", [
        query?.rows[0]?.roomcode,
      ]);
      io.in(query?.rows[0]?.roomcode).emit("returningCheckRoom", 3);
      io.in(query?.rows[0]?.roomcode).socketsLeave(query?.rows[0]?.roomcode);
      console.log("User disconnected:" + socket.request.session.user);
    } catch (err) {
      console.log(err.message);
    }
  });
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/frontend/public/index.html"));
});
server.listen(PORT, () => {
  console.log("listening on port", PORT);
});
