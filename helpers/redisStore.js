require("dotenv").config();
const SECRET = process.env.SECRET || "secret";
const session = require("express-session");

const { createClient } = require("redis");
const redisClient = createClient({ legacyMode: true, process.env.NODE_ENV==="production"&&url:process.env.REDIS_URL });
redisClient.connect().then(console.log("redis connected successfully")).catch(console.error("redis connection failed"));
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
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // must be 'none' to enable cross-site delivery
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 30, //30 mins
  },
});

module.exports = { sessionMiddleware };
