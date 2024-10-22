import LoginCard from "./components/LoginCard";
import { Link } from "react-router-dom";

//page where users can log in

const UserLoginPage: React.FC = () => {
  // useEffect(() => {
  //   // Change the body's background color when this component is mounted
  //   document.body.classList.add("#d1d3d4"); // Apply Tailwind background class

  //   return () => {
  //     // Reset the body's background color when this component is unmounted
  //     document.body.classList.remove("#d1d3d4");
  //   };
  // }, []);
  // useEffect(() => {
  //   fetch(import.meta.env.VITE_API_URL)
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => {
  //       console.log(data);
  //     });
  // }, []);
  return (
    <>
      <h1 className="fixed top-56 left-1/2 transform -translate-x-1/2 text-black text-xl font-bold">
        Welcome back, User!
      </h1>
      <LoginCard />
      <span className="block -m-16  text-gray-500">
        Don't have an account?
        <Link to="/RegisterUser" id="RouterNavLink">
          <span className="ml-2 text-blue-500 cursor-pointer hover:text-blue-700">
            Sign Up
          </span>
        </Link>
      </span>
    </>
  );
};

export default UserLoginPage;
