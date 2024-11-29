import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// Define the refreshAccessToken function
export const refreshAccessToken = async (navigate) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_API1}/user/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("clientRefreshToken")}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Set the new tokens in cookies
    Cookies.set("clientToken", response.data.token);
    Cookies.set("clientRefreshToken", response.data.refreshToken);

    return response.data.token; // Return the new token if needed
  } catch (error) {
    console.error("Failed to refresh token:", error);
    // Handle error (e.g., redirect to login if refresh fails)
    // Optionally, clear cookies and navigate to login
    Cookies.remove("clientToken");
    Cookies.remove("clientRefreshToken");
    navigate("/signIn");
  }
};

// Export the function
export default refreshAccessToken;
