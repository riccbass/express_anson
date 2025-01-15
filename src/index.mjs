import express from "express";
import indexRouter from "./routes/index.routes.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";

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

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
