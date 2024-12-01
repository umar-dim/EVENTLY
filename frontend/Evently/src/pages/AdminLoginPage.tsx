import { useState } from "react";

const AdminLoginPage: React.FC = () => {
	interface Form {
		email: string;
		password: string;
	}

	const [formData, setFormData] = useState<Form>({
		email: "",
		password: "",
	});

	function handleForm(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	}

	async function handleLogin(event: React.FormEvent) {
		event.preventDefault();
		if (formData.email === "" || formData.password === "") {
			alert("Please fill out all fields.");
		} else {
			try {
				const request = await fetch("http://localhost:3000/admin-login", {
					method: "POST",
					credentials: "include",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: formData.email,
						password: formData.password,
					}),
				});

				if (!request.ok) {
					const result = await request.json();
					const message = result.error || "Login failed.";
					console.error(message);
					alert(message);
				} else {
					window.location.href = "/AdminDashboard";
					console.log("Redirecting to Admin Dashboard...");
				}
			} catch (error) {
				console.error("Error during login:", error);
				alert("Something went wrong. Please try again later.");
			}
		}
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div
				style={{ backgroundColor: "#ffffff" }}
				className="rounded-xl w-[450px] h-[400px] shadow-md p-5 space-y-5"
			>
				<h1 className="text-center text-2xl font-bold text-black">
					Admin Login
				</h1>
				<form onSubmit={handleLogin} className="space-y-4">
					<input
						className="w-full h-10 pl-2 py-2 bg-white text-black border-gray-300 border rounded"
						type="email"
						id="email"
						name="email"
						placeholder="Admin Email"
						onChange={handleForm}
						value={formData.email}
					/>
					<input
						className="w-full h-10 pl-2 py-2 bg-white text-black border-gray-300 border rounded"
						type="password"
						id="password"
						name="password"
						placeholder="Password"
						onChange={handleForm}
						value={formData.password}
					/>
					<button
						type="submit"
						className="w-full h-10 bg-blue-500 rounded text-white font-bold hover:bg-blue-700 transition duration-300"
					>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default AdminLoginPage;
