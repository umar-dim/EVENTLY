import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as React from "react";

//component of the user register page
//card component and users can put their information in order to register

const UserRegisterCard: React.FC = () => {
  interface Form {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Form>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleForm(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  async function registerUser(event: any) {
    event.preventDefault();
    if (
      formData.username === "" &&
      formData.email === "" &&
      formData.password === "" &&
      formData.confirmPassword === ""
    ) {
      alert("field is empty");
    } else {
      let request = await fetch("https://demo.evently.wiki/registerUser", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      //fix this to handle what if its a 404 error
      const result = await request.json();
      const message = result.error ? result.error : "";
      console.log(message);
      if (message.length > 0) {
        alert(`${message}`);
      } else {
        let userId = result.id;
        localStorage.setItem("userId", userId);
        navigate("/UploadImg");
      }
    }
  }

  console.log(formData);

  return (
    <>
      <h1 className="fixed top-28 left-1/2 transform -translate-x-1/2 text-black text-xl font-bold">
        Register
      </h1>
      <div
        style={{ backgroundColor: "#ffff" }}
        className=" rounded-xl  w-[450px] h-[650px] shadow-md space-x-5"
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
        <form onSubmit={registerUser}>
          <input
            className="mt-8  w-72 h-10 pl-2 py-2 bg-white text-black border-gray-300 border"
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            onChange={handleForm}
            value={formData.username}
          />
          <input
            className="mt-8  w-72 h-10 pl-2 py-2 bg-white text-black border-gray-300 border"
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            onChange={handleForm}
            value={formData.email}
          />
          <input
            className="mt-8  w-72 h-10 pl-2 py-2 bg-white text-black border-gray-300 border"
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            onChange={handleForm}
            value={formData.password}
          />
          <input
            className="mt-8  w-72 h-10 pl-2 py-2 bg-white text-black border-gray-300 border"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleForm}
            value={formData.confirmPassword}
          />
          <button className="mt-8 w-72 h-10 bg-blue-500 rounded-sm font-bold text-white">
            Continue
          </button>
        </form>
        <span className="block mt-8 text-gray-500">
          Already have an account?
          <Link to="/UserLogin" id="RouterNavLink">
            <span className="ml-2 text-blue-500 cursor-pointer hover:text-blue-700">
              Log in
            </span>
          </Link>
        </span>
      </div>
    </>
  );
};
export default UserRegisterCard;
