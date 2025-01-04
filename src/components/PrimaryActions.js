import axios from "axios"
import Cookies from "js-cookie";

class PrimaryActions {
    async signIn(body) {
        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/account/signIn`;
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
}

const primaryActions = new PrimaryActions();
export default primaryActions;
