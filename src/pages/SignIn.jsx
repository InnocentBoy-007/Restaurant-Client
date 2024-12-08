import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [forgotPasswordFlag, setForgotPasswordFlag] = useState(false);

  const clientDetails = {
    clientDetails: {
      email,
      password,
    },
  };

  const signIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(clientDetails);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API1}/signin`,
        clientDetails,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setLoading(false);
      Cookies.set("clientToken", response.data.token); // it last for only 15 minutes
      Cookies.set("clientRefreshToken", response.data.refreshToken);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
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
      {forgotPasswordFlag ? (
        <>
          <h1>Forgot password</h1>
          <button onClick={() => setForgotPasswordFlag(false)}>Sign In</button>
        </>
      ) : (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md mt-5">
          <h2 className="text-2xl font-bold mb-4 text-center">SignIn</h2>

          <form onSubmit={signIn}>
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
              <p
                className="font-style: italic text-sm mt-1 cursor-pointer inline-block"
                onClick={() => setForgotPasswordFlag(true)}
              >
                Forgot password?
              </p>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <div>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/user/signUp")}
              style={{ cursor: "pointer" }}
            >
              Sing up
            </span>
          </div>
        </div>
      )}
    </>
  );
}
