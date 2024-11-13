const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Define the Event schema if it doesn't already exist
const eventSchema = new Schema({
	title: { type: String, required: true },
	date: { type: String, required: true },
	time: { type: String, required: true },
	location: { type: String, required: false },
	link: { type: String, required: true },
});

// Save the schema model to the Event variable
const Event = model("Event", eventSchema);
module.exports = Event;
