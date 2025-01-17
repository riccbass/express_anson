import express from "express";
import indexRouter from "./routes/index.routes.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";

//https://www.youtube.com/watch?v=--TQwiNIw28&list=PL_cUvD4qzbkwjmjy-KjbieZ8J9cGwxZpC

const app = express();

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
  })
);
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
  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log(session);
  });

  return req.session.user
    ? res.status(200).send(req.session.user)
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

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
