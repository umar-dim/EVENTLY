import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
// import Navbar from "./Navbar";

interface EventPageProps {
	_id: string;
	title: string;
	date: string;
	time: string;
	location: string;
	link: string;
	description: string; // Add a description field
	organization: string; // Add organization field if needed
}

const EventPage: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();

	// Use location state to get event details
	const event: EventPageProps = location.state || {
		_id: "",
		title: "Unknown Event",
		date: "Unknown Date",
		time: "Unknown Time",
		location: "Unknown Location",
		link: "",
	};

	// Handlers
	const handleRSVP = () => {
		// Add logic for RSVP, e.g., API call to register
		alert(`You have RSVPed for: ${event.title}`);
	};

	const handleOpenCamera = () => {
		// Logic for opening the camera (e.g., QR scanning)
		alert("Opening camera...");
	};

	return (
		<>
			<Navbar profileImgUrl="placeholder.jpg" /> {/* Reuse Navbar */}
			<div className="flex flex-col items-center mt-10">
				<h1 className="text-4xl font-bold mb-5">{event.title}</h1>
				<div className="w-3/4 p-5 border-2 rounded-lg shadow-md">
					<p className="text-lg">
						<strong>Date:</strong> {event.date}
					</p>
					<p className="text-lg">
						<strong>Time:</strong> {event.time}
					</p>
					<p className="text-lg">
						<strong>Location:</strong> {event.location}
					</p>
					<a
						href={event.link}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-500 hover:text-blue-700"
					>
						View Event
					</a>
					<div className="flex mt-5 space-x-4">
						<button
							onClick={handleRSVP}
							className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
						>
							RSVP
						</button>
						<button
							onClick={handleOpenCamera}
							className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
						>
							Open Camera
						</button>
					</div>
				</div>
				<button
					onClick={() => navigate(-1)} // Navigate back to the previous page
					className="mt-5 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700"
				>
					Go Back
				</button>
			</div>
		</>
	);
};

export default EventPage;
