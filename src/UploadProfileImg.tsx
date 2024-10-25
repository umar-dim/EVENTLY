import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const UploadProfileImg: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile != null) {
      setFile(selectedFile);
    }
  }

  async function uploadImgFile(event: any) {
    event.preventDefault();
    if (file == null) {
      alert("field is empty");
    } else {
      const formData = new FormData();
      const userId = localStorage.getItem("userId");
      formData.append("profileImg", file);
      if (!userId) {
        alert("not authenticated");
      } else {
        formData.append("userId", userId);
        //   let request = await fetch("http://localhost:3000/uploadImg", {
        const result = await axios.post(
          "https://demo.evently.wiki/uploadImg",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const jsonResult = await result.data;
        const message = jsonResult.error ? jsonResult.error : "";
        console.log(message);
        if (message.length > 0) {
          alert(message);
          navigate("/UserLogin");
        } else {
          navigate("/UserLogin");
        }
      }
    }
  }
  console.log(file);

  return (
    <>
      <div
        style={{ backgroundColor: "#ffff" }}
        className=" rounded-xl  w-[450px] h-[540px] shadow-md space-x-5"
      >
        <form onSubmit={uploadImgFile}>
          <h1 className="mt-10 text-black text-xl font-bold py-5">
            File Upload
          </h1>
          <div className="flex flex-col justify-start ml-5 mt-8">
            <label className="mt text-black font-bold text-left">
              Upload your Profile Picture
            </label>
            <span className="text-left text-gray-300 font-bold mt-5 text-sm">
              Please upload the file you want to share
            </span>
            <div className="flex justify-center items-center mt-3 border border-gray-300 w-96 h-36">
              <label
                className="text-blue-500 font-bold cursor-pointer"
                htmlFor="file"
              >
                Choose File{" "}
                <span className="block text-black font-bold text-sm overflow-hidden">
                  {file ? `Selected file is: ${file.name}` : ""}
                </span>
              </label>
              <input
                id="file"
                type="file"
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          <button className="mt-8 w-72 h-10 bg-blue-500 rounded-sm font-bold text-white">
            Add Image
          </button>
        </form>
      </div>
    </>
  );
};

export default UploadProfileImg;
