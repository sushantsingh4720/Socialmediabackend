import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
const userRegister = async (req, res) => {
  try {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({ message: "Please fill the all fields" });
    }
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "Username already exists" });
    }
    var salt = await bcrypt.genSalt(10);
    var hashPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      username,
      password: hashPassword,
    });

    if (!user) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json({ message: "Successfully registered" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const userLogin = async (req, res) => {
  res.status(200).json({
    message: "Successfully logged in",
  });
};

const userLogout = async (req, res) => {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.status(200).json({ message: "Successfully logged out" });
    }
  });
};

const retrieveSpecificUser = async (req, res) => {
  const username = req.params.username;
  if (!username)
    return res.status(404).json({ message: "Please enter a username" });
  let user = await User.findOne({ username }).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ success: "true", user });
};

const followSpecificUser = async (req, res) => {
  const username = req.params.username;
  if (!username)
    return res.status(404).json({ message: "Please enter a username" });
  if (username === req.user.username) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  let userTofollowBy = await User.findOne({ username });
  if (!userTofollowBy) {
    return res.status(404).json({ message: "User not found" });
  }

  let alreadyFollowing = userTofollowBy.followers.find(
    (following) => following.followBy.toString() === req.user.username
  );
  if (alreadyFollowing) {
    return res.status(404).json({ message: "AlreadyFollowing" });
  }

  userTofollowBy.followers.push({ followBy: req.user.username });
  userTofollowBy = await userTofollowBy.save();
  if (!userTofollowBy) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  let user = await User.findOne({ username: req.user.username });
  user.follow.push({ followTo: username });
  user = await user.save();
  if (!user) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  res.status(200).json({ user });
};

const getUserFollowers = async (req, res) => {
  const username = req.params.username;
  if (!username)
    return res.status(404).json({ message: "Please enter a username" });
  let user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ followers: user.followers });
};

const getUserFollow = async (req, res) => {
  const username = req.params.username;
  if (!username)
    return res.status(404).json({ message: "Please enter a username" });
  let user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ follow: user.follow });
};

const unfollowSpecificUser = async (req, res) => {
  const username = req.params.username;
  if (!username)
    return res.status(404).json({ message: "Please enter a username" });
  let userTofollowBy = await User.findOne({ username });
  if (!userTofollowBy) {
    return res.status(404).json({ message: "User not found" });
  }
  let filterFollowers = await userTofollowBy.followers.filter((follower) => {
    return follower.followBy.toString() !== req.user.username;
  });

  userTofollowBy.followers = filterFollowers;

  userTofollowBy = await userTofollowBy.save();
  if (!userTofollowBy) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  let user = await User.findOne({ username: req.user.username });

  let filterFollow = await user.follow.filter((follow) => {
    return follow.followTo.toString() !== username;
  });
  user.follow = filterFollow;
  user = await user.save();
  if (!user) {
    return res.status(500).json({ message: "Internal Server Error" });
  }

  res.status(200).json({ success: true, user });
};
export {
  userRegister,
  userLogin,
  userLogout,
  retrieveSpecificUser,
  followSpecificUser,
  getUserFollowers,
  getUserFollow,
  unfollowSpecificUser,
};
