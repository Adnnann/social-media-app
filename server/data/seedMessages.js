import mongoose from "mongoose";
import Message from "../models/Message.js";
import User from "../models/User.js";

const createMessages = async (user1, user2) => {
  const messages = [
    {
      senderId: user1._id,
      receiverId: user2._id,
      text: "Hello Marina",
      senderName: user1.firstName + " " + user1.lastName,
      receiverName: user2.firstName + " " + user2.lastName,
      createdAt: Date.now(),
      isRead: 0,
    },
    {
      senderId: user2._id,
      receiverId: user1._id,
      senderName: user2.firstName + " " + user2.lastName,
      receiverName: user1.firstName + " " + user1.lastName,
      text: "Hello Adnan",
      createdAt: Date.now(),
      isRead: 0,
    },
    {
      senderId: user1._id,
      receiverId: user2._id,
      senderName: user1.firstName + " " + user1.lastName,
      receiverName: user2.firstName + " " + user2.lastName,
      text: "How are you?",
      createdAt: Date.now(),
      isRead: 0,
    },
    {
      senderId: user2._id,
      receiverId: user1._id,
      senderName: user2.firstName + " " + user2.lastName,
      receiverName: user1.firstName + " " + user1.lastName,
      text: "I am fine. How are you?",
      createdAt: Date.now(),
      isRead: 0,
    },
    {
      senderId: user1._id,
      receiverId: user2._id,
      senderName: user1.firstName + " " + user1.lastName,
      receiverName: user2.firstName + " " + user2.lastName,
      text: "I am fine too. Thanks for asking.",
      createdAt: Date.now(),
      isRead: 0,
    },
    {
      senderId: user2._id,
      receiverId: user1._id,
      senderName: user2.firstName + " " + user2.lastName,
      text: "You are welcome.",
      createdAt: Date.now(),
      isRead: 0,
    },

    {
      senderId: user1._id,
      receiverId: user2._id,
      senderName: user1.firstName + " " + user1.lastName,
      receiverName: user2.firstName + " " + user2.lastName,
      text: "Hello Marina",
      createdAt: Date.now(),
      isRead: 0,
    },
    {
      senderId: user2._id,
      receiverId: user1._id,
      senderName: user2.firstName + " " + user2.lastName,
      receiverName: user1.firstName + " " + user1.lastName,
      text: "Hello Adnan",
      createdAt: Date.now(),
      isRead: 0,
    },
    {
      senderId: user1._id,
      receiverId: user2._id,
      senderName: user1.firstName + " " + user1.lastName,
      receiverName: user2.firstName + " " + user2.lastName,
      text: "How are you?",
      createdAt: Date.now(),
      isRead: 0,
    },
    {
      senderId: user2._id,
      receiverId: user1._id,
      senderName: user2.firstName + " " + user2.lastName,
      receiverName: user1.firstName + " " + user1.lastName,
      text: "I am fine. How are you?",
      createdAt: Date.now(),
      isRead: 0,
    },
    {
      senderId: user1._id,
      receiverId: user2._id,
      senderName: user1.firstName + " " + user1.lastName,
      text: "I am fine too. Thanks for asking.",
      createdAt: Date.now(),
      isRead: 0,
    },
  ];

  return messages;
};

mongoose
  .connect(
    "mongodb+srv://socialEcho:Q4ztYqBkPSdrBkC8@cluster0.hbhrs.mongodb.net/socialMedia?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(async () => {
    console.log("Connected to MongoDB");
    await Message.deleteMany({});
  })
  .then(async () => {
    const user1 = await User.findOne({ firstName: "Adnan" });
    const user2 = await User.findOne({ firstName: "Marina" });
    const messages = await createMessages(user1, user2);

    await Message.insertMany(messages);

    mongoose.connection.close(() => {
      console.log("Connection closed");
    });
  })
  .catch((err) => {
    console.log(err);
  });
