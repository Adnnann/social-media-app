import mongoose from "mongoose";

import User from "../models/User.js";
import Post from "../models/Post.js";

const seedPosts = async () => {
  await Post.deleteMany({});
  const users = await User.find({});

  let posts = [];

  for (let i = 0; i < 100; i++) {
    let commentUser = users[Math.floor(Math.random() * users.length)];
    let commentLikesUser = users[Math.floor(Math.random() * users.length)];
    let repliesUser = users[Math.floor(Math.random() * users.length)];

    posts.push({
      userId: users[i]._id,
      firstName: users[i].firstName,
      lastName: users[i].lastName,
      location: users[i].location,
      description: "This is a test post",
      userPicturePath: users[i].picturePath,
      picturePath: "post1.jpeg",
      likes: [
        {
          userId: users[Math.floor(Math.random() * users.length)]._id,
          firstName: users[Math.floor(Math.random() * users.length)].firstName,
          lastName: users[Math.floor(Math.random() * users.length)].lastName,
          picturePath:
            users[Math.floor(Math.random() * users.length)].picturePath,
        },
      ],
      comments: [
        {
          _id: mongoose.Types.ObjectId(),
          userId: commentUser._id,
          firstName: commentUser.firstName,
          lastName: commentUser.lastName,
          content: `This is a ${i} test comment from ${commentUser.firstName}`,
          picturePath: commentUser.picturePath,

          likes: [
            {
              _id: mongoose.Types.ObjectId(),
              userId: commentLikesUser._id,
              firstName: commentLikesUser.firstName,
              lastName: commentLikesUser.lastName,
              picturePath: commentUser.picturePath,
            },
          ],

          replies: [
            {
              _id: mongoose.Types.ObjectId(),
              userId: repliesUser._id,
              firstName: repliesUser.firstName,
              lastName: repliesUser.lastName,
              content: `This is a ${i} test reply from ${repliesUser.firstName}`,
              picturePath: repliesUser.picturePath,
            },
          ],
        },
      ],
    });
  }

  return posts;
};

mongoose
  .connect(
    "mongodb+srv://socialEcho:Q4ztYqBkPSdrBkC8@cluster0.hbhrs.mongodb.net/socialMedia?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
    seedPosts().then((data) => {
      Post.insertMany(data)
        .then(() => {
          console.log("Posts added");
          mongoose.connection.close(() => {
            console.log("Connection closed");
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  })

  .catch((err) => {
    console.log(err);
  });
