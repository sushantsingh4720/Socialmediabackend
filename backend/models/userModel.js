import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the name"],
    maxLength: [30, "Name cannot exceed 30 charecters"],
    minLength: [4, "Name should have more than 4 charecters"],
  },
  username: {
    type: String,
    required: [true, "Please enter the email"],
    uniqe: true,
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
    minLength: [8, "Password should be greater than 8 charecters"],
    select: false,
  },
  followers: [
    {
      followBy: {
        type: String,
        required: true,
      },
    },
  ],
  follow: [
    {
      followTo: { type: "string", required: true },
    },
  ],
  createdAT: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema);
