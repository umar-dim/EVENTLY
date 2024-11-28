import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./components/Navbar";

interface EventDetailsData {
	title: string;
	date: string;
	time: string;
	location: string;
	description: string;
}

const EventAdminDetails: React.FC = () => {
	const { eventTitle } = useParams<{ eventTitle: string }>(); // Get the event title from the URL
	const [event, setEvent] = useState<EventDetailsData | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchEventDetails() {
			try {
				const response = await fetch(
					`http://localhost:3000/events/${encodeURIComponent(eventTitle || "")}`
				);
				if (!response.ok) {
					throw new Error("Event not found");
				}
				const data = await response.json();
				setEvent(data);
			} catch (err: any) {
				setError(err.message);
			}
		}

		if (eventTitle) {
			fetchEventDetails();
		}
	}, [eventTitle]);

	if (error) {
		return (
			<div>
				<Navbar profileImgUrl="empty" />
				<div className="mt-20 mx-5 text-red-500">
					<h1>Error</h1>
					<p>{error}</p>
				</div>
			</div>
		);
	}

	if (!event) {
		return (
			<div>
				<Navbar profileImgUrl="empty" />
				<div className="mt-20 mx-5">
					<h1>Loading...</h1>
				</div>
			</div>
		);
	}

	return (
		<div>
			<Navbar profileImgUrl="empty" />
			<div className="mt-20 mx-5">
				<h1 className="text-3xl font-bold">{event.title}</h1>
				<p className="mt-2">Date: {event.date}</p>
				<p>Time: {event.time}</p>
				<p>Location: {event.location}</p>
				<p className="mt-5">{event.description}</p>
				<div className="mt-10 flex gap-5">
					<button
						className="bg-green-500 text-white px-5 py-2 rounded-md"
						onClick={() => console.log("show qr clicked")}
					>
						Show Qr Code
					</button>
				</div>
			</div>
		</div>
	);
};

export default EventAdminDetails;
