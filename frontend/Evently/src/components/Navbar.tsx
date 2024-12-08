import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {
  profileImgUrl: string;
  admin: boolean;
}

const Navbar: React.FC<Props> = ({ profileImgUrl, admin }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  async function Logout() {
    let request = await fetch("https://www.evently.wiki/logout", {
      method: "GET",
      credentials: "include",
    });

    const result = await request.json();
    const message = result.error ? result.error : "";
    console.log(message);
    if (message.length > 0) {
      alert(`Server error`);
      navigate("/UserLogin");
    } else {
      console.log(result);
      navigate("/UserLogin");
    }
  }

  const commonNavItems = (
    <>
      {admin ? (
        <>
          <span
            onClick={() => navigate("/AdminDashboard")}
            className="block py-2 px-4 cursor-pointer hover:bg-yellow-300"
          >
            Admin Dashboard
          </span>
          <span
            onClick={async () => {
              let request = await fetch("https://www.evently.wiki/admin-fetch-events", {
                method: "GET",
                credentials: "include",
              });
              const result = await request.json();
              const message = result.error ? result.error : result.success;
              console.log(message);
              alert(message);
              
            }}
            className="block py-2 px-4 cursor-pointer hover:bg-green-400"
          >
            Fetch Events
          </span>
        </>
      ) : (
        <>
          <span
            onClick={() => navigate("/rsvp")}
            className="block py-2 px-4 cursor-pointer hover:bg-blue-500"
          >
            Rsvp Events
          </span>
          <span
            onClick={() => navigate("/about")}
            className="block py-2 px-4 cursor-pointer hover:bg-blue-500"
          >
            About
          </span>
        </>
      )}

      <span
        onClick={Logout}
        className="block py-2 px-4 cursor-pointer hover:bg-red-400"
      >
        Logout
      </span>
    </>
  );

  return (
    <nav
      className={`fixed top-0 left-0 w-full ${
        admin ? "bg-yellow-400" : "bg-blue-600"
      } text-white font-bold z-50`}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-2">
        <h1
          onClick={() =>
            admin ? navigate("/AdminDashboard") : navigate("/Dashboard")
          }
          className="text-xl cursor-pointer"
        >
          Evently
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {commonNavItems}
          <img
            src={profileImgUrl}
            className="h-10 w-10 rounded-full ml-4"
            alt="Profile"
          />
        </div>

        {/* Mobile Hamburger Menu */}
        <button
          className="block md:hidden focus:outline-none p-2 rounded-md bg-white"
          onClick={toggleMobileMenu}
        >
          <svg
            className="h-8 w-8 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden ${
            admin ? "bg-yellow-400" : "bg-blue-600"
          } text-white`}
        >
          {commonNavItems}
          <div className="flex justify-center items-center py-2">
            <img
              src={profileImgUrl}
              className="h-16 w-16 rounded-full"
              alt=""
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
