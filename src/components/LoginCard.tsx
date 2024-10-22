//card style component where users can login
//use a prop in order to know if this is an org logging in or a user
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginCard: React.FC = () => {
  interface Form {
    email: string;
    password: string;
  }
  const navigate = useNavigate();
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
      let request = await fetch("https://demo.evently.wiki/login", {
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

      const result = await request.json();
      const message = result.error ? result.error : "";
      console.log(message);
      if (message.length > 0) {
        alert(`${message}`);
      } else {
        console.log(result);
        navigate("/dashboard");
      }
    }
  }

  return (
    <>
      <div
        style={{ backgroundColor: "#ffff" }}
        className=" rounded-xl  w-[450px] h-[540px] shadow-md space-x-5"
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
              Sign in with Google
            </span>
          </div>
        </button>
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
