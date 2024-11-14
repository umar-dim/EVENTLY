import { useNavigate } from "react-router-dom";

interface Props {
  profileImgUrl: string;
}

const Navbar: React.FC<Props> = ({ profileImgUrl }) => {
  const navigate = useNavigate();
  async function Logout() {
    let request = await fetch("http://localhost:3000/logout", {
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
  return (
    <>
      <div
        style={{ backgroundColor: "#4070F4" }}
        className="fixed top-0 left-0  flex flex-row items-center text-white font-bold  w-full py-2"
      >
        <h1 className="ml-8 text-xl">Evently</h1>
        <span className="ml-16 cursor-pointer">Profile</span>
        <span className="ml-5 cursor-pointer">Events</span>
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
};

export default Navbar;
