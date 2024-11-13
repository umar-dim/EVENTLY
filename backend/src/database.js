const mongoose = require("mongoose");
const eventModel = require("./models/events.js");
const url = process.env.DATABASE_URL || "empty";

//connect to mongodb in order to interact with db
mongoose
	.connect(url)
	.then(async () => console.log("MongoDB connected"))
	.catch((err) => console.log("MongoDB connection error:", err));

// Model definition - only creates it if it doesn't already exist in the database
const Event = mongoose.models.Event || mongoose.model("Event", eventModel);

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
