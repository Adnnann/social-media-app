import mongoose from "mongoose";

import User from "../models/User.js";
import Post from "../models/Post.js";

const seedPosts = async () => {
  await Post.deleteMany({});
  const users = await User.find({});

  let posts = [];

  for (let i = 0; i < 500; i++) {
    posts.push({
      userId: users[Math.floor(Math.random() * users.length)]._id,
      firstName: users[Math.floor(Math.random() * users.length)].firstName,
      lastName: users[Math.floor(Math.random() * users.length)].lastName,
      location: users[Math.floor(Math.random() * users.length)].location,
      description: "This is a test post",
      userPicturePath:
        users[Math.floor(Math.random() * users.length)].picturePath,
      picturePath: "post1.jpeg",
      likes: new Map([
        [users[Math.floor(Math.random() * users.length)]._id, true],
        [users[Math.floor(Math.random() * users.length)]._id, true],
      ]),
      comments: [
        {
          userId: users[Math.floor(Math.random() * users.length)]._id,
          firstName: users[Math.floor(Math.random() * users.length)].firstName,
          lastName: users[Math.floor(Math.random() * users.length)].lastName,
          comment: `This is a ${i} test comment from ${users.firstName}`,
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
    console.log("Posts added");
  })

  .catch((err) => {
    console.log(err);
  });
