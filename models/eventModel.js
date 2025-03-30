import mongoose from "mongoose";

// const eventSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     image: { type: String, default: "" }, // ✅ Base64 or Cloudinary URL
//     date: { type: Date, required: true },
//     location: { type: String, required: true },

//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     createdByRole: {
//       type: String,
//       enum: ["admin", "head"],
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// const Event = mongoose.model("Event", eventSchema);
// export default Event;
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "" }, // ✅ Base64 or Cloudinary URL
    date: { type: Date, required: true },
    location: { type: String, required: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdByRole: {
      type: String,
      enum: ["admin", "head", "student", "user"], // ✅ Added "student" and "user"
      required: true,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
