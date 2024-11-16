import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function Homepage() {
  const navigate = useNavigate();
  const [clientName, setClientName] = useState("");

  const decodeCookies = () => {
    const token = Cookies.get("clientToken");
    console.log("Token", token);

    if (!token) {
      console.log("No token! - backend");
      return;
    }
    try {
      const decodedToken = jwtDecode(token);
      const clientToken = decodedToken.clientDetails;

      console.log("Client name--->", clientToken.name); // it's working

      if (clientToken) {
        setClientName(clientToken); // Ensure setClientToken is defined
      } else {
        console.error("clientDetails not found in decoded token");
      }
    } catch (error) {
      console.log("Failed to decode token: ", error);
    }
  };

  useEffect(() => {
    decodeCookies();
  }, []);

  return (
    <div className="w-full text-center">
      {clientName ? (
        <>
          <h1>Welcome to Innocent Restuarant, {clientName.name}</h1>
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
