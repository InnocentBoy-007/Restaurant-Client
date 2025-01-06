import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import generateNewPassword from "./ForgetPassword";
import Cookies from "js-cookie";

export default function forgotPassword() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSessionFlag, setOtpSessionFlag] = useState(true);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("clientToken");
  //   const refreshToken = Cookies.get("clientRefreshToken"); // add the refresh token later

  // function to verify otp
  const confirmOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await generateNewPassword.confirmOTP({ otp }, token);
      if (response) {
        setLoading(false);
        setOtpSessionFlag(false);
      }
    } catch (error) {
      Cookies.remove("clientToken");
      Cookies.remove("clientRefreshToken");
      setLoading(false);
      setOtpSessionFlag(false);
    }
  };

  // function to set new password
  const changeNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
      return alert("The confirm password is incorrect!");
    }

    try {
      const response = await generateNewPassword.setNewPassword(
        { newPassword },
        token
      );
      if (response) {
        setLoading(false);
        navigate("/user/signIn");
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setNewPassword("");
      setConfirmPassword("");
      Cookies.remove("clientToken");
      Cookies.remove("clientRefreshToken");
    }
  };
  return (
    <>
      <div className="w-full p-2">
        {otpSessionFlag ? (
          <>
            <form onSubmit={confirmOTP}>
              <div className="mb-4 w-[50%] mx-auto">
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  value={otp}
                  placeholder="Enter your OTP..."
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="border border-red-600 p-1 mt-2"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <form onSubmit={changeNewPassword}>
              <div className="mb-4 w-[50%] mx-auto">
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={newPassword}
                  placeholder="Enter your new password.."
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
                <input
                  type="password"
                  name="confirmpassword"
                  id="confirmpassword"
                  value={confirmPassword}
                  placeholder="Re-enter the new password.."
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="border border-red-600 p-1 mt-2"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
}
