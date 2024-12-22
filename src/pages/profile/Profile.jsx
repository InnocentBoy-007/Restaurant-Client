import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { FetchClientDetails } from "../../components/FetchDetails";

export default function Profile() {
  const navigate = useNavigate();
  const token = Cookies.get("clientToken");
  if (!token) {
    navigate("/");
  }
  const [clientDetails, setClientDetails] = useState({});

  const [deleteAccountFlag, setDeleteAccountFlag] = useState(false);
  const [editAccountFlag, setEditAccountFlag] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountDeleteLoading, setAccountDeleteLoading] = useState(false);
  const [accountUpdateLoading, setAccountUpdateLoading] = useState(false);

  const [name, setName] = useState(clientDetails.name);
  const [email, setEmail] = useState(clientDetails.email);
  const [phoneNo, setPhoneNo] = useState(clientDetails.phoneNo);
  const [gender, setGender] = useState(clientDetails.gender);
  const [address, setAddress] = useState(clientDetails.address);
  useEffect(() => {
    if (clientDetails) {
      setName(clientDetails.name);
      setEmail(clientDetails.email);
      setPhoneNo(clientDetails.phoneNo);
      setGender(clientDetails.gender);
      setAddress(clientDetails.address);
    }
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await FetchClientDetails();
      setClientDetails(response.clientDetails);
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log(error.response.message);
      }
    }
  };

  const deleteAccount = async (e) => {
    e.preventDefault();
    setAccountDeleteLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API1}/account/details/delete`,
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

  const updateAccount = async (e) => {
    e.preventDefault();
    setAccountUpdateLoading(true);
    const endpoint = `${import.meta.env.VITE_BACKEND_API1}/profile/update`;
    const data = {
      clientDetails: {
        name,
        email,
        gender,
        phoneNo: parseInt(phoneNo),
        address,
      },
    };
    try {
      const response = await axios.patch(endpoint, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      alert(response.data.message);
      fetchUserDetails();
      setEditAccountFlag(false);
    } catch (error) {
      setAccountUpdateLoading(false);
      console.error(error);
      if (error.response) {
        console.log(error.response.data.message);
      }
    } finally {
      setAccountUpdateLoading(false);
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
                  {!editAccountFlag && (
                    <button
                      className="border border-green-600 p-1"
                      onClick={() => setEditAccountFlag(true)}
                    >
                      Edit
                    </button>
                  )}

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
      {editAccountFlag && (
        <>
          <div className="mb-4 text-center mt-5 w-[40%] mx-auto">
            <h1>Edit profile</h1>
            <form onSubmit={updateAccount}>
              <div className="mb-4 mt-2">
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
              <div className="mb-4 mt-2">
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
              <div className="mb-4 mt-2">
                <label className="block text-gray-700" htmlFor="phoneno">
                  Phone No
                </label>
                <input
                  type="text"
                  name="phoneno"
                  id="phoneno"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="mb-4 mt-2">
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="mt-1">
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="radio"
                      value="male"
                      checked={gender === "male"}
                      onChange={(e) => setGender(e.target.value)}
                      className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      required
                    />
                    <span className="ml-2">Male</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="female"
                      checked={gender === "female"}
                      onChange={(e) => setGender(e.target.value)}
                      className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      required
                    />
                    <span className="ml-2">Female</span>
                  </label>
                </div>
              </div>
              <div className="mb-4 mt-2">
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
              <div className="flex gap-2 justify-center">
                {accountUpdateLoading ? (
                  "Updating..."
                ) : (
                  <>
                    <button
                      className="border border-green-600 p-1"
                      type="submit"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setEditAccountFlag(false)}
                      className="border border-red-600 p-1"
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}
