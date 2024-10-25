//handle when user isnt authenticated

import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
const Dashboard: React.FC = () => {
  // const navigate = useNavigate();

  //make states into object
  // interface currentUser {
  //   profileImg: string;
  //   username: string;
  // }
  const [profileImg, setProfileImg] = useState();
  const [username, setUsername] = useState();

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

      // console.log(result);
      setProfileImg(result.data);
      setUsername(result.username);
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
        <div className="fixed top-40 flex flex-col left-0 ml-5 mt-10 w- px-5 ">
          <div className="flex flex-col w-full mr-10 rounded-md border-2 text-left ">
            <h1 className="text-xl ml-3 mt-3 ">ACM event</h1>
            <span className="text-gray-300 font-bold ml-3 ">
              Date: May 25,2025
            </span>
            <span className="text-left ml-3">
              Description: Join us at the **Tech Innovators Conference 2024**,
              where visionary leaders, cutting-edge startups, and industry
              pioneers come together to explore the future of technology. This
              year's theme, **"Shaping Tomorrow's World,"** will feature keynote
              speeches from top tech CEOs, interactive workshops on AI and
              blockchain, live demonstrations of the latest gadgets, and
              opportunities to network with fellow innovators. Whether you're a
              tech enthusiast, developer, or entrepreneur, this event is the
              place to discover trends, collaborate on groundbreaking ideas, and
              drive the next wave of technological innovation. Date: June 14-16,
              2024 Location: Silicon Valley Convention Center RSVP today and be
              a part of the next technological revolution!
            </span>

            <span className="text-left ml-3 mt-5 mb-5 inline-flex">
              <img
                className="h-5 w-5"
                src="https://www.svgrepo.com/show/376955/map-marker.svg"
              />{" "}
              SCE{" "}
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
      </div>
    </>
  );
};

export default Dashboard;
