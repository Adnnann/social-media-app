import User from "../models/User.js";
import { jwtDecode } from "jwt-decode";

/* READ */
export const getUser = async (req, res) => {
  try {
    const id = jwtDecode(req.cookies.token).id;

    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const id = jwtDecode(req.cookies.token).id;
    const user = await User.findById(id);

    const newFriends = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      occupation: user.occupation,
      location: user.location,
      picturePath: user.picturePath,
    };

    if (user.friends.filter((user) => user._id === newFriends._id).length > 0) {
      return res.status(200).json(user.friends);
    }

    user.friends = user.friends.filter((user) => user._id !== user._id);

    user.friends = [...user.friends, newFriends];

    await user.save();

    res.status(200).json(user.friends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { friendId } = req.params;

    const userId = jwtDecode(req.cookies.token).id;

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    user.friends = user.friends.filter((user) => user._id.toString() !== _id);

    if (user.friends.filter((user) => user._id === friendId).length > 0) {
      user.friends = user.friends.filter((user) => user._id !== friendId);
    } else {
      user.friends = [
        ...user.friends.filter((user) => user._id.toString() !== _id),
        {
          _id: friendId,
          firstName: friend.firstName,
          lastName: friend.lastName,
          occupation: friend.occupation,
          location: friend.location,
          picturePath: friend.picturePath,
        },
      ];
    }

    await user.save();

    return res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
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
