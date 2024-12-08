import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");

  const cleanUp = () => {
    setName("");
    setEmail("");
    setGender("");
    setPassword("");
    setPhoneNo("");
    setAddress("");
  };

  // testing
  const signUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API1}/signup`,
        {
          clientDetails: { name, email, gender, password, phoneNo, address },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert(response.data.message);
      navigate("/verify");
    } catch (error) {
      console.error(error);
      navigate("/signUp");
    } finally {
      setLoading(false);
      cleanUp();
    }
  };
  return (
    <>
      <div
        className="w-full bg-blue-500 p-4 text-center"
        onClick={() => navigate("/")}
      >
        Home
      </div>
      <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md mt-5">
        <h2 className="text-2xl font-bold mb-4 text-center">SignUp</h2>

        <form onSubmit={signUp}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <div className="mt-1">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                  className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  required
                />
                <span className="ml-2">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                  className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  required
                />
                <span className="ml-2">Female</span>
              </label>
              {/* Add more options as needed */}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="password">
              password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="phoneNo">
              Phone
            </label>
            <input
              type="text"
              name="phoneNo"
              id="phoneNO"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="address">
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        <div>
          Already have an account.{" "}
          <span
            onClick={() => navigate("/user/signIn")}
            style={{ cursor: "pointer" }}
          >
            Login
          </span>
        </div>
      </div>
    </>
  );
}
