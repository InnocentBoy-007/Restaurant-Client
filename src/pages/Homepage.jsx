import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import primaryActions from "../components/PrimaryActions";
import fetchDetails from "../components/FetchDetails";
import { isTokenExpired } from "../components/isTokenExpired";
import { RefreshToken } from "../components/RefreshToken";

export default function Homepage() {
  const navigate = useNavigate();

  let [token, setToken] = useState(Cookies.get("clientToken"));
  const refreshToken = Cookies.get("clientRefreshToken");

  const [clientName, setClientName] = useState("");
  const [clientTitle, setClientTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoutFlag, setLogoutFlag] = useState(false);

  const checkToken = async () => {
    if (refreshToken && isTokenExpired(token)) {
      const newToken = await RefreshToken(refreshToken);
      Cookies.set("clientToken", newToken.token);
      setToken(newToken.token);
    }
  };

  const fetchClientDetails = async () => {
    await checkToken();
    if (token) {
      const response = await fetchDetails.FetchClientDetails(token);
      setClientName(response.clientDetails.username);
      setClientTitle(response.clientDetails.title);
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, [token]);

  const logOut = async (e) => {
    await checkToken();
    e.preventDefault();
    setLoading(true);
    if (token) {
      const response = await primaryActions.Logout(token);
      if (response.success) {
        setLoading(false);
        setClientName("");

        // Clear the token from cookies
        Cookies.remove("clientToken");
        Cookies.remove("clientRefreshToken");

        // Reset clientName state
        navigate("/");
      } else {
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
              <div>
                {clientTitle && clientName ? (
                  <h1>
                    Welcome to Coffee Restuarant, {clientTitle} {clientName}
                  </h1>
                ) : (
                  <h1>Welcome to Coffee Restuarant</h1>
                )}
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  className="border border-red-600 p-1"
                  onClick={() => setLogoutFlag(true)}
                >
                  Log out
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
                  onClick={() => navigate("/")} // signIn page
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
        {logoutFlag && (
          <div className="flex flex-col items-center mt-10">
            <h1>Are you sure you want to log out?</h1>
            <div className="flex justify-center gap-10 mt-5">
              <button
                className="w-32 bg-green-800 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition duration-200"
                onClick={logOut}
              >
                {loading ? "Loging Out..." : "Yes"}
              </button>
              <button
                className="w-32 bg-red-800 text-white font-semibold py-2 rounded-md hover:bg-red-600 transition duration-200"
                onClick={() => setLogoutFlag(false)}
              >
                No
              </button>
            </div>
          </div>
        )}
      </>
    </>
  );
}
