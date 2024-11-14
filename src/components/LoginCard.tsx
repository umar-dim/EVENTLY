//card style component where users can login
//use a prop in order to know if this is an org logging in or a user
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";

const LoginCard: React.FC = () => {
  interface Form {
    email: string;
    password: string;
  }
  // const navigate = useNavigate();
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
  console.log(formData);

  //change name of login post req

  async function handleLogin(event: any) {
    event.preventDefault();
    if (formData.email === "" || formData.password === "") {
      alert("field is empty");
    } else {
      let request = await fetch("http://localhost:3000/login", {
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
        const message = result.error ? result.error : "";
        console.log(message);

        alert(`${message}`);
      } else {
        window.location.href = "/Dashboard";
        console.log("moving");
      }
    }
  }

  return (
    <>
      <div
        style={{ backgroundColor: "#ffff" }}
        className=" rounded-xl  w-[450px] h-[540px] shadow-md space-x-5"
      >
        <div className="flex items-center justify-center pt-28 rounded-sm   h-11">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              // console.log(credentialResponse);
              if (credentialResponse.credential) {
                const decoded: any = jwtDecode(credentialResponse.credential);
                const email = decoded.email;
                const profileImgUrl = decoded.picture;
                const name = decoded.given_name;
                // console.log(
                //   `email: :${email}, profileImg: ${profileImgUrl}, and name is: ${name}`
                // );
                let request = await fetch(
                  "http://localhost:3000/google-login",
                  {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      name: name,
                      email: email,
                      profileImgUrl: profileImgUrl,
                    }),
                  }
                );
                if (!request.ok) {
                  const result = await request.json();
                  const message = result.error ? result.error : "";
                  console.log(message);

                  alert(`${message}`);
                } else {
                  window.location.href = "http://localhost:5173/Dashboard";
                }
              }
            }}
            onError={() => {
              alert("Login Failed");
            }}
          />
        </div>
        <div className="flex items-center justify-center mt-10 mb-2">
          <span className="border-t border-gray-300 w-1/4"></span>
          <span className="mx-4 text-gray-500">OR</span>
          <span className="border-t border-gray-300 w-1/4"></span>
        </div>
        <form onSubmit={handleLogin}>
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
          <button className="mt-8 w-72 h-10 bg-blue-500 rounded-sm font-bold text-white">
            Continue
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginCard;
