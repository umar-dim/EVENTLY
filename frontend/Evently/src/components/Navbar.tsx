import { useNavigate } from "react-router-dom";

interface Props {
  profileImgUrl: string;
  admin: boolean;
}

const Navbar: React.FC<Props> = ({ profileImgUrl, admin }) => {
  const navigate = useNavigate();
  async function Logout() {
    let request = await fetch("https://demo.evently.wiki/logout", {
      method: "GET",
      credentials: "include",
    });

    const result = await request.json();
    const message = result.error ? result.error : "";
    console.log(message);
    if (message.length > 0) {
      alert(`server error`);
      navigate("/UserLogin");
    } else {
      console.log(result);
      navigate("/UserLogin");
    }
  }

  if (admin) { 
    return (
			<>
				<div
					style={{ backgroundColor: "#FFC107" }}
					className="fixed top-0 left-0  flex flex-row items-center text-white font-bold  w-full py-2"
				>
					<h1
						onClick={() => navigate("/AdminDashboard")}
						className="ml-8 text-xl cursor-pointer"
					>
						Evently
					</h1>
					<span onClick={Logout} className="ml-5 cursor-pointer">
						Logout
					</span>
					<img
						src={profileImgUrl}
						className="h-16 w-16 rounded-full ml-auto mr-3"
					/>
				</div>
			</>
		);
  }
  else {
    return (
			<>
				<div
					style={{ backgroundColor: "#4070F4" }}
					className="fixed top-0 left-0  flex flex-row items-center text-white font-bold  w-full py-2"
				>
					<h1
						onClick={() => navigate("/Dashboard")}
						className="ml-8 text-xl cursor-pointer"
					>
						Evently
					</h1>
					{/* <span className="ml-16 cursor-pointer">Profile</span> */}
					<span
						onClick={() => navigate("/rsvp")}
						className="ml-5 cursor-pointer"
					>
						Rsvp Events
					</span>
					<span onClick={Logout} className="ml-5 cursor-pointer">
						Logout
					</span>
					<img
						src={profileImgUrl}
						className="h-16 w-16 rounded-full ml-auto mr-3"
					/>
				</div>
			</>
		);
  }

};

export default Navbar;
