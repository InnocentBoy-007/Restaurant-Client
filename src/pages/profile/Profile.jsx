import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();
  const token = Cookies.get("clientToken");
  if (!token) {
    navigate("/");
  }
  const [clientDetails, setClientDetails] = useState({});

  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteAccountFlag, setDeleteAccountFlag] = useState(false);
  const [accountDeleteLoading, setAccountDeleteLoading] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API1}/details`,
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setClientDetails(response.data.clientDetails);
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log(error.response.data.message);
      }
    }
  };

  const deleteAccount = async (e) => {
    e.preventDefault();
    setAccountDeleteLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API1}/details/delete`,
        { password: confirmPassword },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      alert(response.data.message);
      Cookies.remove("clientToken");
      Cookies.remove("clientRefreshToken");
    } catch (error) {
      setAccountDeleteLoading(false);
      console.error(error);
      if (error.response) {
        console.log(error.response.data.message);
      }
    } finally {
      setAccountDeleteLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserDetails();
    }
  }, [token]);

  return (
    <>
      <div
        className="bg-blue-300 p-4 text-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        Back
      </div>
      <div className="mt-2 p-2">
        <h1>
          Welcome to the profile,{" "}
          {clientDetails.gender === "male" ? "Mr. " : "Ms. "}
          {clientDetails.name}
        </h1>
      </div>
      <div>
        <table className="w-full border border-red-300 mt-2">
          <thead>
            <tr>
              <th>Account ID</th>
              <th>Email</th>
              <th>Phone No</th>
              <th>Gender</th>
              <th>Address</th>
              <th>
                <div className="flex gap-2 justify-center">
                  <button className="border border-green-600 p-1">Edit</button>
                  {!deleteAccountFlag && (
                    <button
                      className="border border-red-600 p-1"
                      onClick={() => setDeleteAccountFlag(true)}
                    >
                      Delete Account
                    </button>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            <td>{clientDetails._id}</td>
            <td>{clientDetails.email}</td>
            <td>{clientDetails.phoneNo}</td>
            <td>{clientDetails.gender}</td>
            <td>{clientDetails.address}</td>
          </tbody>
        </table>
      </div>
      {deleteAccountFlag && (
        <div className="text-center mt-5">
          <h1>Are you sure you want to delete the account?</h1>
          <form onSubmit={deleteAccount}>
            <div className="mb-4 w-[40%] mx-auto">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password to delete the account"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 justify-center">
              {accountDeleteLoading ? (
                <h1>Loading...</h1>
              ) : (
                <>
                  <button className="border border-red-600 p-1" type="submit">
                    Sure
                  </button>
                  <button
                    className="border border-blue-600 p-1"
                    onClick={() => setDeleteAccountFlag(false)}
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
}
