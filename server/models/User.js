import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: [
      {
        userId: {
          type: String,
          required: true,
        },
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },

        picturePath: {
          type: String,
          required: true,
        },
        occupation: {
          type: String,
          required: true,
        },
        friendRequestAccepted: {
          type: Boolean,
          default: false,
        },
        friendRequestStatus: {
          type: String,
          default: "",
        },
      },
    ],
    location: String,
    occupation: String,
    viewedProfile: {
      type: Array,
      default: [],
    },
    impressions: Number,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
