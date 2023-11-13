import Post from "../models/Post.js";
import User from "../models/User.js";
import { jwtDecode } from "jwt-decode";

/* READ */
export const getUserProfileAndPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    const posts = await Post.find({ userId: userId });
    res.status(200).json({ user, posts });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const id = jwtDecode(req.cookies.token).id;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    } else {
      const userFriends = user.friends.filter(
        (user) => user.friendRequestAccepted === false
      );

      res.status(200).json(userFriends);
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  const { friendId } = req.params;
  const userId = jwtDecode(req.cookies.token).id;
  const friend = await User.findById(friendId);
  const user = await User.findById(userId);

  console.log(friend);

  try {
    await User.findByIdAndUpdate(
      {
        _id: friendId,
      },
      {
        $push: {
          friends: {
            userId: userId,
            friendRequestAccepted: false,
            firstName: user.firstName,
            lastName: user.lastName,
            picturePath: user.picturePath,
            occupation: user.occupation,
            friendRequestStatus: "pending",
          },
        },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        $push: {
          friends: {
            userId: friendId,
            friendRequestAccepted: false,
            firstName: friend.firstName,
            lastName: friend.lastName,
            picturePath: friend.picturePath,
            occupation: friend.occupation,
            friendRequestStatus: "pending",
          },
        },
      },
      { new: true }
    );

    const updatedUser = await User.findById(userId);

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  const { friendId } = req.body;
  const userId = jwtDecode(req.cookies.token).id;

  await User.findByIdAndUpdate(
    {
      _id: userId,
      "friends._id": friendId,
    },
    {
      $set: {
        "friends.$.friendRequestAccepted": true,
      },
    }
  );
};

export const viewProfile = async (req, res) => {
  try {
    const { viewerId } = req.params;
    const userId = jwtDecode(req.cookies.token).id;
    const viewerProfile = await User.findById(viewerId);
    const user = await User.findById(userId);

    if (
      user.viewedProfile.filter((user) => user._id.toString() === userId)
        .length > 0
    ) {
      user.viewedProfile = user.viewedProfile;
    } else {
      user.viewedProfile = [...user.viewedProfile, viewerProfile];
    }

    await user.save();

    return res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUsers = async (req, res) => {
  const { queryTerm } = req.params;

  try {
    let users = [];
    if (queryTerm.split(" ").length > 1) {
      users = await User.find({});
      users = users.filter((user) => {
        return (user.firstName + " " + user.lastName)
          .toLowerCase()
          .includes(queryTerm.toLowerCase());
      });
    } else {
      users = await User.find({
        $or: [
          { firstName: { $regex: queryTerm, $options: "i" } },
          { lastName: { $regex: queryTerm, $options: "i" } },
        ],
      });
    }

    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
