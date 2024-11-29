import { Route, Routes } from "react-router-dom";
import "./App.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import UserLoginPage from "./pages/UserLoginPage";
import Dashboard from "./pages/Dashboard";
import EventPage from "./pages/EventPage";
import RegisterUserPage from "./pages/RegisterUserPage";
import UploadProfileImg from "./pages/UploadProfileImg";
import RsvpPage from "./pages/RsvpPage";

function App() {
	return (
		<>
			<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
				<Routes>
					<Route path="/" element={<UserLoginPage />}></Route>
					<Route path="/RegisterUser" element={<RegisterUserPage />}></Route>
					<Route path="/Dashboard" element={<Dashboard />}></Route>
					<Route path="/UploadImg" element={<UploadProfileImg />}></Route>
					<Route path="/event/:id" element={<EventPage />} />
					<Route path="/rsvp" element={<RsvpPage />} />
				</Routes>
			</GoogleOAuthProvider>
		</>
	);
}

export default App;
