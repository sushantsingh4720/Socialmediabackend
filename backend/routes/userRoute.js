import express from "express";
import passport from "passport";
const router = express.Router();
import {
  userLogin,
  userLogout,
  userRegister,
  retrieveSpecificUser,
  followSpecificUser,
  getUserFollowers,
  getUserFollow,
  unfollowSpecificUser,
} from "../controllers/userController.js";

import { isAuthenticated } from "../middleware/passport.js";

router.route("/").post(userRegister);

router.route("/login").post(passport.authenticate("local"), userLogin);

router.route("/logout").post(userLogout);

router.route("/:username").get(isAuthenticated, retrieveSpecificUser);

router.route("/:username/follow").post(isAuthenticated, followSpecificUser);

router.route("/:username/followers").get(isAuthenticated, getUserFollowers);

router
  .route("/:username/follow")
  .get(isAuthenticated, getUserFollow)
  .delete(isAuthenticated, unfollowSpecificUser);

export default router;
