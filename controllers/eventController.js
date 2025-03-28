import Event from "../models/eventModel.js";
import cloudinary from "../lib/cloudinary.js"; // ✅ Use Cloudinary if needed

// ✅ Get All Events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name username");
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Create an Event (Only "admin" or "head" users allowed)
export const createEvent = async (req, res) => {
  try {
    const { title, description, image, date, location } = req.body;

    // ✅ Check if user is "admin" or "head"
    if (req.user.role !== "admin" && req.user.userType !== "head") {
      return res
        .status(403)
        .json({ message: "Not authorized to create events" });
    }

    let imageUrl = "";
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newEvent = new Event({
      title,
      description,
      image: imageUrl,
      date,
      location,
      createdBy: req.user._id,
      createdByRole: req.user.role === "admin" ? "admin" : "head",
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete an Event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // ✅ Only allow admin or event creator to delete
    if (
      req.user.role !== "admin" &&
      event.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this event" });
    }

    await Event.findByIdAndDelete(id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error" });
  }
};
