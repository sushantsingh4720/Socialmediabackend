import express from "express";
import session from "express-session";

import { config } from "dotenv";
import passport from "passport";

import { initializingPassport } from "./middleware/passport.js";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
config({ path: "config/.env" });
connectDB();
const port = process.env.PORT || 4000;
const app = express();
initializingPassport(passport);
app.use(
  session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    resave: false,
  })
);
app.use(
  passport.initialize({
    session: { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) },
  })
);
app.use(passport.session());

app.use(express.json());
app.use("/users", userRoute);

app.get("/", (req, res) => {
  res.send("welcome");
});
app.listen(port, (req, res) => {
  console.log(`listening on port ${process.env.BACKEND_URL}`);
});
