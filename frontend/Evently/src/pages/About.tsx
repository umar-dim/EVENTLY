import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
const About: React.FC = () => {
  const [profileImg, setProfileImg] = useState();

  useEffect(() => {
    async function getDashboardData() {
      const request = await fetch("http://localhost:3000/api/dashboard", {
        method: "GET",
        credentials: "include",
      });
      // console.log(window.document.cookie);

      const result = await request.json();
      const message = result.error ? result.error : "";
      console.log(message);

      setProfileImg(result.data);
    }
    getDashboardData();
  }, []);
  return (
    <>
      <Navbar profileImgUrl={profileImg || ""} admin={false} />
      <h1 className="font-bold text-black">About</h1>
      <p className="text-black">
        Hello, this website is about users seeing the events that are happening
        around uic, rsvping for them, and opening their camera to scan the qr
        code at the event. This will require two devices to test. In order to
        use the site either log in with google or sign in with your account. If
        you dont have an account and dont want to use google then just register.
        Then youll be taken to the dashboard page which has a list of all the
        events happening around campus that we webscraped off of uic's wesbite.
        Choose an event by clicking on one of them. Then click on the green rsvp
        button. It will save your rsvp'd event and you can see your rsvp'd
        events at the rsvp page thats at the navbar. When you go the rsvp page,
        click on one of the events you've rsvp'd for and then click on the blue
        open camera button.This will take you to a page where it ask for camera
        permissons. Click on the Request Camera Permissions and then click the
        start scanning and then it will open up ur camera. Then scan the qr code
        and it will take you to the checked in page. On the admin side, log in
        with these credentials for email and password: admin@admin.com
        newAdminPassword and youll be taken to a dashboard page. Then you'll see
        the same dashboard page with all the events. click on the fetch events
        button to get the latest list uic events click on an event and click
        show qr which will show a new qr code every 100ms. With these qr codes,
        the users will scan these for their rsvp events in order to check in.
      </p>
    </>
  );
};
export default About;
