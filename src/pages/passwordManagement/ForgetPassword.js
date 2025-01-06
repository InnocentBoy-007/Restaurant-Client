import axios from "axios";
import Cookies from "js-cookie";

/**
 * set the cookies while requesting an OTP
 * if nothing goes wrong keep the cookies as it is
 * if anything goes wrong delete the cookies
 *
 * should I directly login after the password is set?
 * should I make the user login again using the new password?
 */

class GenerateNewPassword {
    async requestOTP(data) {
        if (!data || typeof data !== 'object') return alert("Invalid body!");

        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/password/forgot-password/verify/email`

        try {
            const response = await axios.post(URL, data, { headers: { "Content-Type": "application/json" } });
            const { token, refreshToken, message } = response.data;
            Cookies.set("clientToken", token);
            Cookies.set("clientRefreshToken", refreshToken);
            alert(message);

            return { success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message)
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occurred while trying to request an OTP!");
            }
        }
    }

    // add refreshToken later
    async confirmOTP(data, token) {
        if (!data || typeof data !== 'object') return alert("Invalid body!");
        if (!token || typeof token !== 'string') return alert("Invalid token!");

        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/password/forgot-password/verify/otp`;

        try {
            const response = await axios.post(URL, data, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });
            alert(response.data.message);

            return { success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message)
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to confirm the otp!");
            }
        }
    }

    // add refreshToken later
    async setNewPassword(data, token) {
        if (!data || typeof data !== 'object') return alert("Invalid body!");
        if (!token || typeof token !== 'string') return alert("Invalid token!");

        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/password/forgot-password/change-password`;

        try {
            const response = await axios.post(URL, data, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });
            alert(response.data.message);

            return { success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to set new password!");
            }
        }
    }
}

const generateNewPassword = new GenerateNewPassword();
export default generateNewPassword;
