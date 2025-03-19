// import mongoose from "mongoose";
// const postSchema = new mongoose.Schema(
//   {
//     author: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     content: { type: String },
//     image: { type: String },
//     likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     comments: [
//       {
//         _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Unique ID for each comment
//         content: { type: String },
//         user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         createdAt: { type: Date, default: Date.now },
//       },
//     ],
//   },
//   { timestamps: true }
// );
// const Post = mongoose.model("Post", postSchema);

// export default Post;
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, default: "" },
  image: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      content: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  sharedPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    default: null,
  }, // ✅ New Field for Shared Post
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
