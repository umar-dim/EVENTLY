// This component takes in props containing event name, organization, time, and description

import React from "react";

interface EventCardProps {
	title: string;
	date: string;
	time: string;
	location: string;
	link: string;
}

const EventCard: React.FC<EventCardProps> = ({
	title,
	date,
	time,
	location,
	link,
}) => {
	return (
		<div>
			<h2>{title}</h2>
			<p>Date: {date}</p>
			<p>Time: {time}</p>
			<p>Location: {location}</p>
			<a href={link} target="_blank" rel="noopener noreferrer">
				View Event
			</a>
		</div>
	);
};

export default EventCard;
