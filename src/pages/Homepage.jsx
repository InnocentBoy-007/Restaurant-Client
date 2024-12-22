import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import refreshAccessToken from "./RefreshToken";
import { FetchClientDetails } from "../components/FetchDetails";

export default function Homepage() {
  const navigate = useNavigate();

  const [clientName, setClientName] = useState("");
  const [clientTitle, setClientTitle] = useState("");
  const token = Cookies.get("clientToken");
  const [loading, setLoading] = useState(false);

  const fetchClientDetails = async () => {
    try {
      const response = await FetchClientDetails();
      setClientName(response.clientDetails.username);
      setClientTitle(response.clientDetails.title);
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log(error.response.message);
      }
    }
  };

  useEffect(() => {
    if (token) {
      fetchClientDetails();
    }
  }, []);

  const logOut = async (e) => {
    e.preventDefault();
    setLoading(true);
    const URL = `${import.meta.env.VITE_BACKEND_API1}/account/logout`;
    try {
      const response = await axios.delete(URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setLoading(false);
      setClientName("");
      alert(response.data.message);

      // Clear the token from cookies
      Cookies.remove("clientToken");
      Cookies.remove("clientRefreshToken");

      // Reset clientName state
      navigate("/");
    } catch (error) {
      if ((error.response.data.message = "Invalid token - backend")) {
        const newToken = await refreshAccessToken(navigate);
        if (newToken) {
          return logOut(e);
        }
      } else {
        console.log(error);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <>
        <div className="w-full text-center flex justify-center flex-col">
          {clientName ? (
            <>
              <h1>
                Welcome to Coffee Restuarant, {clientTitle}. {clientName}
              </h1>
              <div className="flex gap-2 justify-center">
                <button className="border border-red-600 p-1" onClick={logOut}>
                  {loading ? "logging out..." : "log out"}
                </button>
                <button
                  className="border border-red-600 p-1"
                  onClick={() => navigate("/user/profile")}
                >
                  Profile
                </button>
              </div>
            </>
          ) : (
            <>
              <h1>Welcome to Coffee Restaurant</h1>
              <div className="flex justify-center gap-4 mt-2">
                <button
                  onClick={() => navigate("/user/signUp")}
                  className="border border-red-700 p-2"
                >
                  SignUp
                </button>
                <button
                  onClick={() => navigate("/user/signIn")}
                  className="border border-red-700 p-2"
                >
                  SignIn
                </button>
              </div>
            </>
          )}
          <div>
            <button
              onClick={() => navigate("/user/products")}
              className="text-blue-600 border border-red-800 mt-2 p-2"
            >
              Products
            </button>
          </div>
        </div>
      </>
    </>
  );
}
