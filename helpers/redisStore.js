require("dotenv").config();
const SECRET = process.env.SECRET || "secret";
const session = require("express-session");

const { createClient } = require("redis");
const redisClient = createClient({ legacyMode: true });
redisClient.connect().catch(console.error);
const RedisStore = require("connect-redis")(session);
const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  saveUninitialized: false,
  secret: SECRET,
  resave: false,
  httpOnly: true,
  proxy: true,
  name: "tictactoe-session",
  cookie: {
    secure: true,
    maxAge: 1000 * 60 * 30, //30 mins
    sameSite: "none",
  },
});

module.exports = { sessionMiddleware };
