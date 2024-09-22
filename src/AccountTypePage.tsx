import { Link } from "react-router-dom";

//page where users pick if they are a org or a user

const AccountTypePage: React.FC = () => {
  return (
    <>
      <h1 className="fixed top-56 left-1/2 transform -translate-x-1/2 text-xl  font-bold text-black">
        Please select your account type
      </h1>
      <div className="flex flex-row mt-28">
        <Link to="/OrgLogin" id="RouterNavLink">
          <div className="flex flex-col space-y-5 cursor-pointer">
            <img
              className="w-72 h-52 object-cover "
              src="https://allexamnotes.web.app/wp-content/uploads/2023/07/business-organisation.png"
            />
            <span className="text-lg font-bold text-black">Organization</span>
          </div>
        </Link>
        <Link to="/UserLogin" id="RouterNavLink">
          <div className="flex flex-col space-y-5 ml-28 cursor-pointer">
            <img
              className="w-52 h-52 object-cover "
              src="https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png"
            />
            <span className="text-lg font-bold text-black">User</span>
          </div>
        </Link>
      </div>
    </>
  );
};

export default AccountTypePage;
