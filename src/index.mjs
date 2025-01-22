import express from "express";
import indexRouter from "./routes/index.routes.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

// import "./strategies/local-strategy.mjs";
import "./strategies/discord-strategy.mjs";

//https://www.youtube.com/watch?v=--TQwiNIw28&list=PL_cUvD4qzbkwjmjy-KjbieZ8J9cGwxZpC

const app = express();

mongoose.mongoose
  .connect("mongodb://batata:69@localhost:27017/test")
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(`Error: ${err}`));

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "anso the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60_000 * 60,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(indexRouter);

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

//registra o middleware globalemnte
// app.use(loggingMiddleware);

const PORT = process.env.PORT || 3000;

// app.get("/", loggingMiddleware, (req, res) => {
//   res.status(201).send({ msg: "Hello!" });
// });

app.get(
  "/",
  // (req, res, next) => {
  //   console.log("Base URL 1");
  //   next();
  // },
  // (req, res, next) => {
  //   console.log("Base URL 2");
  //   next();
  // },
  // (req, res, next) => {
  //   console.log("Base URL 3");
  //   next();
  // },
  (req, res) => {
    console.log(req.session);
    console.log(req.session.id);
    req.session.visited = true;
    res.cookie("hello", "world", { maxAge: 10_000, signed: true });

    res.status(201).send({ msg: "Hello!" });
  }
);

app.post("/api/auth_passport", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

app.get("/api/auth/status_passport", (req, res) => {
  console.log(`Inside /auth/status endpoint`);

  if (!req.user) {
    return res.sendStatus(401);
  }

  console.log(req.user);
  console.log(req.session);
  console.log(req.sessionID);

  return res.send(req.user);
});

app.post("/api/auth/logout", (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }

  req.logout((err) => {
    if (err) {
      return res.sendStatus(400);
    }

    res.sendStatus(200);
  });
});

// app.use(loggingMiddleware, (req, res, next) => {
//   console.log("middleware 2");
//   next();
// });

app.post("/api/auth", (req, res) => {
  const {
    body: { username, password },
  } = req;

  const findUser = mockUsers.find((user) => user.username === username);

  if (!findUser || findUser.password !== password) {
    return res.status(401).send({ msg: "BAD CREDENTIALS" });
  }

  req.session.user = findUser;

  return res.status(200).send(findUser);
});

app.get("/api/auth/status", (req, res) => {
  if (!req.session) {
    res.status(401).send({ msg: "NOT AUTH" });
  }

  console.log(req.session);

  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log("auth get");
    console.log(session);
  });

  if (!req.session.passport) {
    return res.status(401).send({ msg: "NOT AUTH" });
  }

  return req.user
    ? res.status(200).send(req.user)
    : res.status(401).send({ msg: "NOT AUTH" });
});

app.post("/api/cart", (req, res) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }

  const { body: item } = req;
  const { cart } = req.session;

  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }

  return res.status(201).send(item);
});

app.get("/api/cart", (req, res) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }

  return res.send(req.session.cart ?? []);
});

app.get("/api/auth/discord", passport.authenticate("discord"));
app.get(
  "/api/auth/discord/redirect",
  passport.authenticate("discord"),
  (req, res) => {
    console.log(req.session);
    console.log(req.user);
    res.sendStatus(200);
  }
);

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
