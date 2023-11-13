import mongoose from "mongoose";

const postSchema = mongoose.Schema(
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
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: [
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
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],

    comments: [
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
        content: {
          type: String,
          required: true,
        },
        picturePath: String,
        createdAt: {
          type: Date,
          default: Date.now(),
        },
        likes: [
          {
            userId: {
              type: String,
              required: true,
              default: "",
            },
            firstName: {
              type: String,
              required: true,
              default: "",
            },
            lastName: {
              type: String,
              required: true,
              default: "",
            },
            picturePath: {
              type: String,
              required: true,
              default: "",
            },
            createdAt: {
              type: Date,
              default: Date.now(),
            },
          },
        ],

        replies: [
          {
            userId: {
              type: String,
              required: true,
              default: "",
            },
            firstName: {
              type: String,
              required: true,
            },
            lastName: {
              type: String,
              required: true,
            },
            content: {
              type: String,
              required: true,
            },
            picturePath: String,
            likes: [
              {
                firstName: {
                  type: String,
                  required: true,
                },
                lastName: {
                  type: String,
                  required: true,
                },
                content: {
                  type: String,
                  required: true,
                },
                picturePath: String,
              },
            ],
            createdAt: {
              type: Date,
              default: Date.now(),
            },
          },
        ],
      },
    ],
  },

  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
