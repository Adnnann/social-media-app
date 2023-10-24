import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { _id, friendId } = req.params;

    console.log(_id, friendId);

    const user = await User.findById(_id);
    const friend = await User.findById(friendId);

    if (user.friends.filter((user) => user._id === friendId).length > 0) {
      user.friends = user.friends.filter((user) => user._id !== friendId);
    } else {
      user.friends = [
        ...user.friends,
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
    const { id, userId } = req.params;
    const viewerProfile = await User.findById(userId);
    const user = await User.findById(id);

    console.log(user.viewedProfile[0]._id.toString());

    if (
      user.viewedProfile.filter((user) => user._id.toString() === userId)
        .length > 0
    ) {
      console.log("already viewed profile");
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
