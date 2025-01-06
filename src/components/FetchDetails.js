import axios from "axios";

class FetchDetails {
    async FetchClientDetails(token) {
        const URL = `${import.meta.env.VITE_BACKEND_API1}/account/details`;

        try {
            const response = await axios.get(URL, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });

            return { clientDetails: response.data.clientDetails };
        } catch (error) {
            console.error(error);
            if (error.response) alert(error.response.data.message);
        }
    }

    async FetchProductDetails() {
        const URL = `${import.meta.env.VITE_BACKEND_API2}/product/details`;

        try {
            const response = await axios.get(URL, { headers: { "Content-Type": "application/json" } });
            if (response) {
                return { productDetails: response.data.products };
            }

            return true;
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message)
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to fetch product details!");
            }

            return false;
        }
    }

    async FetchProductDetails_Cart(token) {
        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/cart/fetch`;
        try {
            const response = await axios.get(URL, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });

            return { productDetails: response.data.products };
        } catch (error) {
            console.error(error);
            if (error.response) alert(error.response.data.message);
        }
    }

    async TrackOrderDetails(token) {
        const URL = `${import.meta.env.VITE_BACKEND_API1
            }/v1/customers/orders/track_orders`;

        try {
            const response = await axios.get(URL, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });

            return { orderDetails: response.data.orderDetails };
        } catch (error) {
            console.error(error);
            if (error.response) alert(error.response.data.message);
        }
    }
}

const fetchDetails = new FetchDetails();
export default fetchDetails;
