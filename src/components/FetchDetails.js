import axios from "axios";
import Cookies from "js-cookie";

class FetchDetails {
    async FetchClientDetails(token) {
        if (!token || typeof token !== 'string') return alert("Token is either invalid or not found!");
        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/account/details`;

        try {
            const response = await axios.get(URL, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });
            const { clientDetails } = response.data;

            return { clientDetails };
        } catch (error) {
            console.error(error);
            if (error.response) {
                Cookies.remove("clientToken");
                Cookies.remove("clientRefreshToken");
                alert("Session expired!");
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to fetch client details!");
            }
        }
    }

    async FetchProductDetails() {
        const URL = `${import.meta.env.VITE_BACKEND_API2}/product/details`;

        try {
            const response = await axios.get(URL, { headers: { "Content-Type": "application/json" }, withCredentials: true });
            const { products } = response.data;

            return { productDetails: products, success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                return { noProductMessage: error.response.data.message };
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to fetch product details!");
            }
        }
    }

    async FetchProductDetails_Cart(token) {
        if (!token || typeof token !== 'string') return alert("Token is either invalid or not found!");
        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/cart/fetch`;

        try {
            const response = await axios.get(URL, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });
            const { products } = response.data;

            return { products, success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                return { message: error.response.data.message };
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to fetch product details inside the cart!");
            }
        }
    }

    async TrackOrderDetails(token) {
        if (!token || typeof token !== 'string') return alert("Token is either invalid or not found!");
        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/orders/track_orders`;

        try {
            const response = await axios.get(URL, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });
            const { orderDetails } = response.data;

            return { orderDetails, success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                return { message: error.response.data.message };
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to track order details!");
            }
        }
    }
}

const fetchDetails = new FetchDetails();
export default fetchDetails;
