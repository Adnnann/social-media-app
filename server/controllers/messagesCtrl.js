import Message from "./../models/Message.js";
import User from "../models/User.js";
import { jwtDecode } from "jwt-decode";

export const postMessage = async (req, res) => {
  const { message } = req.body;

  const receiverId = req.params.userId;
  const senderId = req.params.id;

  const receivedMessage = {
    receiverId,
    senderId,
    message,
  };

  let conversation = [];

  conversation = await Message.findOne({
    receiverId: receiverId,
    senderId: senderId,
  });

  const receiver = await User.findById(receiverId);
  const sender = await User.findById(senderId);

  conversation = new Message(receivedMessage);
  conversation.receiverName = receiver.firstName + " " + receiver.lastName;
  conversation.senderName = sender.firstName + " " + sender.lastName;
  conversation.isRead = false;
  conversation.createdAt = Date.now();
  conversation.senderId = sender._id;
  conversation.receiverId = receiver._id;
  conversation.text = message;

  try {
    await conversation.save();
    const chats = await Message.find({
      $or: [
        { receiverId: receiverId, senderId: senderId },
        { receiverId: senderId, senderId: receiverId },
      ],
    });

    res.status(201).json(chats);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const readMessage = async (req, res) => {
  const { receiverId, senderId } = req.params;

  try {
    const chats = await Message.find({
      $or: [
        { receiverId: receiverId, senderId: senderId },
        { receiverId: senderId, senderId: receiverId },
      ],
    });

    res.status(201).json(chats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserChats = async (req, res) => {
  const { receiverId } = jwtDecode(req.cookies.token).id;

  try {
    const chats = await Message.find({ receiverId: receiverId });

    if (chats.length === 0) return res.status(201).json([]);

    res.status(201).json(chats);
  } catch (error) {
    res.status(401).json(`Error: ${error.message}`);
  }
};

export const markMessagesRead = async (req, res) => {
  const { receiverId } = req.params;

  try {
    const chats = await Message.find({ receiverId: receiverId });

    let allUsers = await User.find({});

    let senders = [];

    chats.map((chat) => {
      chat.map((message) => {
        if (message.receiverId.toString() !== receiverId) {
          senders.push(
            allUsers.filter(
              (user) => user._id.toString() === message.senderId.toString()
            )
          );
          message.isRead = true;
        }
      });
    });
    senders = senders.flatMap((sender) => sender);

    res.status(201).json({ chats, senders: [...new Set(senders)] });
  } catch (error) {
    res.status(401).json(`Error: ${error.message}`);
  }
};
