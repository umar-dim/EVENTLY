//handle when user isnt authenticated

import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import EventCard from "./components/event";
const Dashboard: React.FC = () => {
  // const navigate = useNavigate();
  interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    link: string;
  }
  //make states into object
  // interface currentUser {
  //   profileImg: string;
  //   username: string;
  // }
  const [profileImg, setProfileImg] = useState();
  const [username, setUsername] = useState();
  const [events, setEvents] = useState<Event[] | null>(null);
  useEffect(() => {
    async function getDashboardData() {
      const request = await fetch("https://demo.evently.wiki/api/dashboard", {
        method: "GET",
        credentials: "include",
      });
      // console.log(window.document.cookie);

      const result = await request.json();
      const message = result.error ? result.error : "";
      console.log(message);

      console.log(result);
      setProfileImg(result.data);
      setUsername(result.username);
      setEvents(result.events);
    }
    getDashboardData();
  }, []);

  //for the star icon switch between a full one and one thats not full when a user clicks on the img

  return (
    <>
      <div className="font-bold text-black">
        <Navbar profileImgUrl={profileImg || "empty"} />
        <h1 className="fixed top-28 left-0 ml-5 text-4xl">
          {`Welcome back, ${username}!`}
        </h1>
        <div className="mt-40 ml-5">
          {events &&
            events.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                location={event.location}
                link={event.link}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
