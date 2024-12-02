//handle when user isnt authenticated

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import EventCard from "../components/Event";

const AdminDashboard: React.FC = () => {
  // const navigate = useNavigate();
  interface Event {
    _id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    link: string;
  }

  const [profileImg, setProfileImg] = useState();
  // const [username, setUsername] = useState();
  const username = "Admin";
  const [events, setEvents] = useState<Event[] | null>(null);
  useEffect(() => {
    async function getDashboardData() {
      const request = await fetch("http://localhost:3000/admin-dashboard", {
        method: "GET",
        credentials: "include",
      });
      // console.log(window.document.cookie);

      const result = await request.json();
      // const message = result.error ? result.error : "";
      // console.log(message);

      setProfileImg(result.data);
      setEvents(result.events);
    }
    getDashboardData();
  }, []);

  //for the star icon switch between a full one and one thats not full when a user clicks on the img

  return (
    <>
      <div className="font-bold text-black">
        <Navbar profileImgUrl={"empty"} admin={true} />
        <h1 className="fixed top-28 left-0 ml-5 text-4xl">
          {`Welcome, ${username}!`}
        </h1>
        <div className="mt-40 ml-5">
          {events &&
            events.map((event) => (
              <EventCard
                key={event._id}
                _id={event._id}
                title={event.title}
                date={event.date}
                time={event.time}
                location={event.location}
                link={event.link}
                username={username || ""}
                profileImg={profileImg || "empty"}
                admin={true}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
