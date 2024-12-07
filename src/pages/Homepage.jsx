import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import refreshAccessToken from "./RefreshToken";

export default function Homepage() {
  const navigate = useNavigate();
  const [clientName, setClientName] = useState("");
  const token = Cookies.get("clientToken");
  const [loading, setLoading] = useState(false);

  const fetchClientDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API1}/user/details`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setClientName(response.data.clientDetails.name);
    } catch (error) {
      console.error(error);
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
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_API1}/user/logout`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setLoading(false);
      alert(response.data.message);

      // Clear the token from cookies
      Cookies.remove("clientToken");
      Cookies.remove("clientRefreshToken");

      // Reset clientName state
      setClientName("");
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
    <div className="w-full text-center">
      {clientName ? (
        <>
          <h1>Welcome to Coffee Restuarant, {clientName}</h1>
          <button style={{ border: "2px solid red" }} onClick={logOut}>
            {loading ? "logging out..." : "log out"}
          </button>
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
      <button
        onClick={() => navigate("/user/products")}
        className="text-blue-600 border border-red-800 mt-2 p-2"
      >
        Products
      </button>
    </div>
  );
}
