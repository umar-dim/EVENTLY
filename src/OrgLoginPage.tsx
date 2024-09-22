import LoginCard from "./components/LoginCard";
import { Link } from "react-router-dom";
import { useEffect } from "react";

//page where orgs can log in

const OrgLoginPage: React.FC = () => {
  useEffect(() => {
    // Change the body's background color when this component is mounted
    document.body.classList.add("#d1d3d4");

    return () => {
      // Reset the body's background color when this component is unmounted
      document.body.classList.remove("#d1d3d4");
    };
  }, []);
  return (
    <>
      <h1 className="fixed top-56 left-1/2 transform -translate-x-1/2 text-black text-xl font-bold">
        Welcome back, Organization!
      </h1>
      <LoginCard />
      <span className="block -m-16  text-gray-500">
        Don't have an account?
        <Link to="/RegisterOrg" id="RouterNavLink">
          <span className="ml-2 text-blue-500 cursor-pointer hover:text-blue-700">
            Sign Up
          </span>
        </Link>
      </span>
    </>
  );
};

export default OrgLoginPage;
