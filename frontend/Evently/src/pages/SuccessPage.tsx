import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";
const SuccessPage: React.FC = () => {
  const location = useLocation();
  const { profileImg } = location.state || {};
  return (
    <>
      <Navbar profileImgUrl={profileImg} admin={false} />
      <div>
        <h1 className="font-bold text-black">Success your logged in! ✅</h1>
      </div>
    </>
  );
};
export default SuccessPage;
