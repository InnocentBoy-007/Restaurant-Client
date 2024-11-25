import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Homepage() {
  const navigate = useNavigate();
  const [clientName, setClientName] = useState("");
  const token = Cookies.get("clientToken");
  const [loading, setLoading] = useState(false);

  const decodeCookies = () => {
    if (!token) {
      console.log("No token! - backend");
      return;
    }
    try {
      const decodedToken = jwtDecode(token);

      const clientToken = decodedToken.clientDetails;

      console.log("Client name--->", clientToken); // it's working

      if (clientToken) {
        setClientName(clientToken.name); // Ensure setClientToken is defined
      } else {
        console.error("clientDetails not found in decoded token");
      }
    } catch (error) {
      console.log("Failed to decode token: ", error);
    }
  };

  const logOut = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API1}/clientLogOut`,
        {},
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

      // Reset clientName state
      setClientName("");

      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    decodeCookies();
  }, [token]);

  return (
    <div className="w-full text-center">
      {clientName ? (
        <>
          <h1>Welcome to Innocent Restuarant, {clientName}</h1>
          <button style={{ border: "2px solid red" }} onClick={logOut}>
            {loading ? "logging out..." : "log out"}
          </button>
        </>
      ) : (
        <>
          <h1>Welcome to Innocent Restaurant</h1>
          <div className="flex justify-center gap-4 mt-2">
            <button onClick={() => navigate("/signUp")}>SignUp</button>
            <button onClick={() => navigate("/signIn")}>SignIn</button>
          </div>
        </>
      )}
      <button
        onClick={() => navigate("/products")}
        className="text-blue-600 border border-red-800 mt-2"
      >
        Products
      </button>
    </div>
  );
}
