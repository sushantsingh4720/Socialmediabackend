import LocalStrategy from "passport-local";
import bcrypt from "bcryptjs";
LocalStrategy.Strategy;
import User from "../models/userModel.js";
const initializingPassport = (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username }).select("+password");

        if (!user)
          return done(null, false, {
            message: "Incorrect username or password.",
          });

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) return done(null, false);
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });
};
const isAuthenticated = (req, res, next) => {
  if (req.user) return next();
  res.status(401).json({ message: "Please login or signup" });
};

export { initializingPassport, isAuthenticated };
