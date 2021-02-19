const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const helmet = require("helmet");
const authRouter = require("./auth/authRouter");
const app = express();

const sessionConfig = {
  name: 'yep', 
  secret: 'yummy cookie!',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: false, 
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: true,
}
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(session(sessionConfig));


// application routes
app.use("/api", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if (err instanceof createError.HttpError) {
    res.locals.message = err.message;
    res.locals.status = err.statusCode;
    if (process.env.NODE_ENV === "development") {
      res.locals.error = err;
    }
  }
  console.error(err);
  if (process.env.NODE_ENV === "production" && !res.locals.message) {
    res.locals.message = "ApplicationError";
    res.locals.status = 500;
  }
  if (res.locals.status) {
    res.status(res.locals.status || 500);
    const errObject = { error: res.locals.error, message: res.locals.message };
    return res.json(errObject);
  }
  next(err);
});

module.exports = app;
