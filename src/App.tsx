import { Routes, Route } from "react-router-dom";
import AccountTypePage from "./AccountTypePage";
import UserLoginPage from "./UserLoginPage";
import OrgLoginPage from "./OrgLoginPage";
import RegisterUserPage from "./RegisterUserPage";
import RegisterOrgPage from "./RegisterOrgPage";
import UploadProfileImg from "./UploadProfileImg";
import Dashboard from "./Dashboard";
import "./App.css";

//component that routes users to different pages in the app

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AccountTypePage />}></Route>
        <Route path="/UserLogin" element={<UserLoginPage />}></Route>
        <Route path="/OrgLogin" element={<OrgLoginPage />}></Route>
        <Route path="/RegisterUser" element={<RegisterUserPage />}></Route>
        <Route path="/RegisterOrg" element={<RegisterOrgPage />}></Route>
        <Route path="/UploadImg" element={<UploadProfileImg />}></Route>
        <Route path="/Dashboard" element={<Dashboard />}></Route>
      </Routes>
    </>
  );
};

export default App;
