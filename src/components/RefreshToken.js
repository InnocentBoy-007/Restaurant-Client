import axios from "axios";
import Cookies from "js-cookie";

export const RefreshToken = async (refreshToken, clientId) => {
    Cookies.remove("clientToken");
    const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/token/refresh-token/${clientId}`

    try {
        const response = await axios.post(URL, {}, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${refreshToken}` }, withCredentials: true });
        const { token } = response.data;

        return token;
    } catch (error) {
        console.error(error);
        if (error.response) {
            alert(error.response.data.message);
        } else if (error.request) {
            alert("Network error! Please try again later!");
        } else {
            alert("An unexpected error occured while trying to fetch new token!");
        }
    }
}
