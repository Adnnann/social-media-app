import mongoose, { connect, mongo } from "mongoose";
import User from "../models/User.js";

const users = [
  {
    firstName: "test",
    lastName: "me",
    email: "aaaaaaa@test.com",
    password: "123456",
    picturePath: "p11.jpeg",
    friends: [],
    location: "San Fran, CA",
    occupation: "Software Engineer",
    password: "123456",
    viewedProfile: [],
    impressions: 0,
    createdAt: 1115211422,
    updatedAt: 1115211422,
    __v: 0,
  },
  {
    firstName: "Steve",
    lastName: "Ralph",
    email: "thataaa@test.com",
    password: "123456",
    picturePath: "p3.jpeg",
    friends: [],
    location: "New York, CA",
    occupation: "Degenerate",
    password: "123456",
    viewedProfile: [],
    impressions: 0,
    createdAt: 1595589072,
    updatedAt: 1595589072,
    __v: 0,
  },
  {
    firstName: "Some",
    lastName: "Guy",
    email: "someguy@test.com",
    password: "123456",
    picturePath: "p4.jpeg",
    friends: [],
    location: "Canada, CA",
    occupation: "Data Scientist Hacker",
    password: "123456",
    viewedProfile: [],
    impressions: 0,
    createdAt: 1288090662,
    updatedAt: 1288090662,
    __v: 0,
  },
  {
    firstName: "Whatcha",
    lastName: "Doing",
    email: "whatchadoing@test.com",
    password: "123456",
    picturePath: "p6.jpeg",
    friends: [],
    location: "Korea, CA",
    occupation: "Educator",
    password: "123456",
    viewedProfile: [],
    impressions: 0,
    createdAt: 1219214568,
    updatedAt: 1219214568,
    __v: 0,
  },
  {
    firstName: "Jane",
    lastName: "Doe",
    email: "janedoe@test.com",
    password: "123456",
    picturePath: "p5.jpeg",
    friends: [],
    location: "Utah, CA",
    occupation: "Hacker",
    password: "123456",
    viewedProfile: [],
    impressions: 0,
    createdAt: 1493463661,
    updatedAt: 1493463661,
    __v: 0,
  },
  {
    firstName: "Harvey",
    lastName: "Dunn",
    email: "harveydunn@test.com",
    password: "123456",
    picturePath: "p7.jpeg",
    friends: [],
    location: "Los Angeles, CA",
    occupation: "Journalist",
    password: "123456",
    viewedProfile: [],
    impressions: 0,
    createdAt: 1381326073,
    updatedAt: 1381326073,
    __v: 0,
  },
  {
    firstName: "Carly",
    lastName: "Vowel",
    email: "carlyvowel@test.com",
    password: "123456",
    picturePath: "p8.jpeg",
    friends: [],
    location: "Chicago, IL",
    occupation: "Nurse",
    password: "123456",
    viewedProfile: [],
    impressions: 0,
    createdAt: 1714704324,
    updatedAt: 1642716557,
    __v: 0,
  },
  {
    firstName: "Jessica",
    lastName: "Dunn",
    email: "jessicadunn@test.com",
    password: "123456",
    picturePath: "p9.jpeg",
    friends: [],
    location: "Washington, DC",
    occupation: "A Student",
    password: "123456",
    viewedProfile: [],
    impressions: 0,
    createdAt: 1369908044,
    updatedAt: 1359322268,
    __v: 0,
  },
  {
    firstName: "Adnan",
    lastName: "Ovcina",
    email: "adnann@test.com",
    password: "123456",
    picturePath: "p9.jpeg",
    friends: [],
    location: "Washington, DC",
    occupation: "A Student",
    password: "123456",
    viewedProfile: [],
    impressions: 0,
    createdAt: 1369908044,
    updatedAt: 1359322268,
    __v: 0,
  },
  {
    firstName: "Marina",
    lastName: "Ovcina",
    email: "marina@test.com",
    password: "123456",
    picturePath: "p9.jpeg",
    friends: [],
    location: "Washington, DC",
    occupation: "A Student",
    password: "123456",
    viewedProfile: [],
    impressions: 0,
    createdAt: 1369908044,
    updatedAt: 1359322268,
    __v: 0,
  },
];

for (let i = 0; i < 100; i++) {
  users.push({
    firstName: "test",
    lastName: "me",
    email: `neko-${i}@test.com`,
    picturePath: "p7.jpeg",
    friends: [],
    location: "Los Angeles, CA",
    occupation: "Journalist",
    password: "123456",
    viewedProfile: [],
    impressions: 0,
    createdAt: 1381326073,
    updatedAt: 1381326073,
    __v: 0,
  });
}

mongoose
  .connect(
    "mongodb+srv://socialEcho:Q4ztYqBkPSdrBkC8@cluster0.hbhrs.mongodb.net/socialMedia?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    User.deleteMany({})
      .then(() => {
        User.insertMany(users)
          .then(() => {
            console.log("Users added");
            mongoose.connection.close(() => {
              console.log("Connection closed");
            });
          })
          .catch((error) => console.log(`ERROR: ${error} did not add users`));
      })
      .catch((error) => console.log(`ERROR: ${error} did not delete users`));
  })
  .catch((error) => console.log(`ERROR: ${error} did not connect`));
