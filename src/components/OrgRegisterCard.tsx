import { Link } from "react-router-dom";

//component thats styled as a card and where orgs can put their info
//to register

const OrgRegisterCard: React.FC = () => {
  return (
    <>
      <h1 className="fixed top-40 left-1/2 transform -translate-x-1/2 text-black text-xl font-bold">
        Register
      </h1>
      <div
        style={{ backgroundColor: "#ffff" }}
        className=" rounded-xl  w-[450px] h-[580px] shadow-md space-x-5"
      >
        <button className="mt-24 ml-5 bg-blue-500 font-bold text-white text-center py-2 rounded-sm w-72 h-11">
          <div className="flex flex-row">
            <div className="ml-1 -mt-1  flex justify-center items-center h-8 w-8 bg-gray-50 border-none">
              <img
                className="  h-6 w-6 object-cover"
                src="https://user-images.githubusercontent.com/194400/70987158-4069c900-20b7-11ea-892e-8a2e1166b6b7.png"
              />
            </div>
            <span className="text-white font-bold ml-10">
              Sign up with Google
            </span>
          </div>
        </button>
        <div className="flex items-center justify-center mt-10 mb-2">
          <span className="border-t border-gray-300 w-1/4"></span>
          <span className="mx-4 text-gray-500">OR</span>
          <span className="border-t border-gray-300 w-1/4"></span>
        </div>
        <input
          className="mt-8  w-72 h-10 pl-2 py-2 bg-white border-gray-300 border"
          type="text"
          id="orgname"
          name="orgname"
          placeholder="Org Name"
        />
        <input
          className="mt-8  w-72 h-10 pl-2 py-2 bg-white border-gray-300 border"
          type="email"
          id="email"
          name="email"
          placeholder="Email"
        />
        <input
          className="mt-8  w-72 h-10 pl-2 py-2 bg-white border-gray-300 border"
          type="text"
          id="password"
          name="password"
          placeholder="Password"
        />
        <button className="mt-8 w-72 h-10 bg-blue-500 rounded-sm font-bold text-white">
          Continue
        </button>
        <span className="block mt-8 text-gray-500">
          Already have an account?
          <Link to="/OrgLogin" id="RouterNavLink">
            <span className="ml-2 text-blue-500 cursor-pointer hover:text-blue-700">
              Log in
            </span>
          </Link>
        </span>
      </div>
    </>
  );
};
export default OrgRegisterCard;
