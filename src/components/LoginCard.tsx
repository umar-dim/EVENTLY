//card style component where users can login

const LoginCard: React.FC = () => {
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
        <input
          className="mt-8  w-72 h-10 pl-2 py-2 bg-white border-gray-300 border"
          type="email"
          id="email"
          name="email"
          placeholder="Email"
        />
        <input
          className="mt-8  w-72 h-10 pl-2 py-2 bg-white border-gray-300 border"
          type="text"
          id="password"
          name="password"
          placeholder="Password"
        />
        <button className="mt-8 w-72 h-10 bg-blue-500 rounded-sm font-bold text-white">
          Continue
        </button>
      </div>
    </>
  );
};

export default LoginCard;
