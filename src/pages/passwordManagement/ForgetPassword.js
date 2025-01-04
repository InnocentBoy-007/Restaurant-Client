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
    async requestOTP(body) {
        if (!body || typeof body !== 'object') return alert("Invalid body!");

        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/password/forgot-password/verify/email`

        try {
            const response = await axios.post(URL, body, { headers: { "Content-Type": "application/json" } });
            Cookies.set("clientToken", response.data.token);
            Cookies.set("clientRefreshToken", response.data.refreshToken);

            alert(response.data.message);
        } catch (error) {
            console.error(error);
            if (error.response) alert(error.response.data.message);
        }
    }

    // add refreshToken later
    async verifyOTP(body, token) {
        if (!body || typeof body !== 'object') return alert("Invalid body!");
        if (!token || typeof token !== 'string') return alert("Invalid token!");

        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/password/forgot-password/verify/otp`;

        try {
            const response = await axios.post(URL, body, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });

            alert(response.data.message);
        } catch (error) {
            console.error(error);
            if (error.response) alert(error.response.data.message);
        }
    }

    // add refreshToken later
    async setNewPassword(body, token) {
        if (!body || typeof body !== 'object') return alert("Invalid body!");
        if (!token || typeof token !== 'string') return alert("Invalid token!");

        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/password/forgot-password/change-password`;

        try {
            const response = await axios.post(URL, body, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });

            alert(response.data.message);
        } catch (error) {
            console.error(error);
            if (error.response) alert(error.response.data.message)
        }
    }
}

const generateNewPassword = new GenerateNewPassword();
export default generateNewPassword;
