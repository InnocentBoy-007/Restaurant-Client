import axios from "axios"

class PrimaryActions {
    async SignIn(data) {
        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/account/signIn`;
        try {
            const response = await axios.post(URL, data, { headers: { "Content-Type": "application/json" } });
            const { token, refreshToken, message } = response.data;
            alert(message);
            return { token, refreshToken, success: true };
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message)
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to sign in!");
            }
        }
    }

    async Logout(token) {
        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/account/logout`

        try {
            const response = await axios.delete(URL, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });

            alert(response.data.message);

            return { success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to logout!");
            }
        }
    }
}

const primaryActions = new PrimaryActions();
export default primaryActions;
