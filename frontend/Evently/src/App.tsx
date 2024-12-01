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
				</Routes>
			</GoogleOAuthProvider>
		</>
	);
}

export default App;
