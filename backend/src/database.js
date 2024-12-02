const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const url = process.env.DATABASE_URL || "empty";
//connect to mongodb in order to interact with db
mongoose
  .connect(url)
  .then(async () => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Model definition - only creates it if it doesn't already exist in the database
// const Event = mongoose.models.Event || mongoose.model("Event", eventModel);
const user = require("./models/users.js");
// const user = mongoose.models.User || mongoose.model("User", users);
const bcrypt = require("bcryptjs");

// Function to check for existing events and insert new ones if necessary
async function updateEvents(newEvents) {
  try {
    // Check if the "events" collection already exists
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const eventsCollectionExists = collections.some(
      (col) => col.name === "events"
    );

    if (!eventsCollectionExists) {
      console.log("Events collection does not exist. Creating it now.");
      await mongoose.connection.createCollection("events");
    }

    // Update the "events" collection with new events
    for (const event of newEvents) {
      // Check if the event already exists in the collection based on title and date
      const existingEvent = await Event.findOne({
        title: event.title,
        date: event.date,
      });
      if (!existingEvent) {
        const newEvent = new Event(event);
        await newEvent.save();
        console.log(`Added new event: ${event.title}`);
      } else {
        console.log(`Event already exists: ${event.title}`);
      }
    }
  } catch (err) {
    console.error("Error updating events:", err);
  }
}

async function addUserRsvp(username, eventId, res) {
  // get the user schama form the database and log it
  try {
    // const user = await users.findOne({ username: username });
    const rsvpuser = await user.findOne({ username: username });
    const rsvpevent = await Event.findOne({ _id: eventId });
    // console.log(rsvpuser);
    // console.log(rsvpevent);
    if (rsvpuser.rsvps === undefined) {
      rsvpuser.rsvps = [];
    }

    if (rsvpuser.rsvpsId.includes(eventId)) {
      console.log("Already RSVP'd");

      return res.status(200).json({ error: "Already RSVP'd" });
    } else {
      rsvpuser.rsvpsId.push(eventId);
      rsvpuser.rsvps.push(rsvpevent);
      await rsvpuser.save();
      console.log(rsvpuser);
      return res.status(200).json({ success: "Success! RSVP added" });
    }

    // const test = await Event.findOne({ _id: eventId });
    // console.log(test);
  } catch (err) {
    console.error("Error adding RSVP:", err);
  }
}

async function getRsvpEvents(username) {
  try {
    const user = await user.findOne({ username: username });
    return res.status(200).json({ events: user.rsvps });
  } catch (err) {
    console.error("Error getting events:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

// async function createAdminUser(username, email, password) {
// 	try {
// 		const salt = await bcrypt.genSalt(10);
// 		const hash = await bcrypt.hash(password, salt);
// 		const newAdmin = new user({
// 			username: username,
// 			email: email,
// 			password: hash,
// 			isAdmin: true, // Set the isAdmin field to true
// 		});

// 		console.log(url);
// 		await newAdmin.save();

// 		console.log("Admin user created:", newAdmin);
// 	} catch (err) {
// 		console.error("Error creating admin user:", err);
// 	}
// }

// // call the createAdminUser function to create the admin user
// createAdminUser("admin", "admin@admin.com", "newAdminPassword");

module.exports = { updateEvents, addUserRsvp, getRsvpEvents };
