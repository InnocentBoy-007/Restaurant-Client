import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import primaryActions from "../components/PrimaryActions";
import generateNewPassword from "./passwordManagement/ForgetPassword";

export default function SignIn() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordFlag, setForgotPasswordFlag] = useState(false);

  const signIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      clientDetails: {
        email,
        password,
      },
    };

    try {
      await primaryActions.signIn(body);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
    }
  };

  // function to send OTP to reset the password
  const requestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await generateNewPassword.requestOTP({ email });
      if (response) {
        setLoading(false);
        setEmail("");
        navigate("/user/password");
      }
    } catch (error) {
      setEmail("");
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
          <div className="p-2 w-full text-center mt-5">
            <h1>Forgot password?</h1>
            <form onSubmit={requestOTP}>
              <div className="mb-4 w-[50%] mx-auto">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  placeholder="Enter your email to sent OTP"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4 justify-center">
                <button className="border border-red-600 p-1" type="submit">
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
                <button
                  onClick={() => setForgotPasswordFlag(false)}
                  className="border border-red-600 p-1"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
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
