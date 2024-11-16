import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");

  const clientDetails = {
    clientDetails: {
      name,
      email,
      password,
      phoneNo,
      address,
    },
  };

  const cleanUp = () => {
    setName("");
    setEmail("");
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
        `${import.meta.env.VITE_BACKEND_API1}/clientSignUp`,
        clientDetails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      cleanUp();
      setLoading(false);
      alert(response.data.message);
      navigate("/clientVerification");
      console.log("You clicked the signUp button!");
    } catch (error) {
      cleanUp();
      setLoading(false);
      console.log(error);
      navigate("/signUp");
    }
  };
  return (
    <>
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
      </div>
    </>
  );
}
