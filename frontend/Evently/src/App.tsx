import { Route, Routes } from "react-router-dom";
import "./App.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import UserLoginPage from "./pages/UserLoginPage";
import Dashboard from "./pages/Dashboard";
import EventPage from "./pages/EventPage";
import RegisterUserPage from "./pages/RegisterUserPage";
import UploadProfileImg from "./pages/UploadProfileImg";
import RsvpPage from "./pages/RsvpPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import EventPageAdmin from "./pages/EventPageAdmin";
import QRCodeGenerator from "./pages/QRCodeGenerator";
import QRReader from "./pages/QRReader";
import SuccessPage from "./pages/SuccessPage";
function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Routes>
          <Route path="/" element={<UserLoginPage />}></Route>
          <Route path="/UserLogin" element={<UserLoginPage />}></Route>
          <Route path="/RegisterUser" element={<RegisterUserPage />}></Route>
          <Route path="/Dashboard" element={<Dashboard />}></Route>
          <Route path="/UploadImg" element={<UploadProfileImg />}></Route>
          <Route path="/event/:id" element={<EventPage />} />
          <Route path="/rsvp" element={<RsvpPage />} />
          <Route path="/AdminLogin" element={<AdminLoginPage />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/admin-event/:id" element={<EventPageAdmin />} />
          <Route path="/qr-generator/:id" element={<QRCodeGenerator />} />
          <Route path="/qr-reader/:id" element={<QRReader />} />
          <Route path="/qr-success" element={<SuccessPage />} />
        </Routes>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
