// This component takes in props containing event name, organization, time, and description

import React from "react";
import { useNavigate } from "react-router-dom";

interface EventCardProps {
	_id: string;
	title: string;
	date: string;
	time: string;
	location: string;
	link: string;
}

const EventCard: React.FC<EventCardProps> = ({
	_id,
	title,
	date,
	time,
	location,
	link,
}) => {
	const navigate = useNavigate();

	const handleCardClick = () => {
		navigate(`/event/${_id}`, {
			state: {
				_id,
				title,
				date,
				time,
				location,
				link,
			},
		});
	};

	return (
		<>
			<div
				className="flex flex-col   mt-10 w- px-5  "
				onClick={handleCardClick}
			>
				<div className="flex flex-col w-full mr-10 rounded-md border-2 text-left ">
					<h1 className="text-xl ml-3 mt-3 ">{title}</h1>
					<span className="text-gray-300 font-bold ml-3 ">Date: {date}</span>
					<span className="text-left ml-3">
						Time: {time}
						<a
							href={link}
							target="_blank"
							rel="noopener noreferrer"
							className=" text-blue-500 cursor-pointer hover:text-blue-700"
						>
							{" "}
							View Event
						</a>
					</span>

					<span className="text-left ml-3 mt-5 mb-5 inline-flex">
						<img
							className="h-5 w-5"
							src="https://www.svgrepo.com/show/376955/map-marker.svg"
						/>{" "}
						Location: {location}{" "}
						<span className="ml-10 inline-flex">
							<img
								className="h-5 w-5 mr-1"
								src="https://cdn-icons-png.flaticon.com/512/12/12783.png"
							/>{" "}
							RSVP
						</span>
					</span>
				</div>
			</div>
			{/* <div>
      <h2>{title}</h2>
      <p>Date: {date}</p>
      <p>Time: {time}</p>
      <p>Location: {location}</p>
      <a href={link} target="_blank" rel="noopener noreferrer">
        View Event
      </a>
    </div> */}
		</>
	);
};
{
	/* */
}
export default EventCard;
