import axios from "axios";

class FetchDetails {
    async FetchClientDetails(token) {
<<<<<<< HEAD
        if (!token || typeof token !== 'string') return alert("Token is either invalid or not found!");
=======
        if (!token) {
            return alert("Token is either invalid or not found!");
        }
>>>>>>> 3dc62eaae14ac43a8c03e5158f6677af51892a19
        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/account/details`;

        try {
            const response = await axios.get(URL, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });
            const { clientDetails } = response.data;

            return { clientDetails, success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message)
            } else if (error.request) {
<<<<<<< HEAD
                alert("Network error! Please try again later!");
=======
                alert("Network erro! Please try again later!");
>>>>>>> 3dc62eaae14ac43a8c03e5158f6677af51892a19
            } else {
                alert("An unexpected error occured while trying to fetch client details!");
            }
        }
    }

    async FetchProductDetails() {
        const URL = `${import.meta.env.VITE_BACKEND_API2}/product/details`;

        try {
            const response = await axios.get(URL, { headers: { "Content-Type": "application/json" } });
            const { products } = response.data;

            return { productDetails: products, success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message)
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
<<<<<<< HEAD
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
=======
            const { products, message } = response.data;

            return { productDetails: products, message, success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message)
            } else if (error.request) {
                alert("Network error! An unexpected error occured while trying to fetch product details!");
            } else {
                alert("An unexpected error occured while trying to fetch product details!");
>>>>>>> 3dc62eaae14ac43a8c03e5158f6677af51892a19
            }
        }
    }

    async TrackOrderDetails(token) {
<<<<<<< HEAD
        if (!token || typeof token !== 'string') return alert("Token is either invalid or not found!");
=======
        if (!token) return alert("Token is either invalid or is not found!");
>>>>>>> 3dc62eaae14ac43a8c03e5158f6677af51892a19
        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/orders/track_orders`;

        try {
            const response = await axios.get(URL, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });
<<<<<<< HEAD
            const {orderDetails} = response.data;

            return {orderDetails, success:true};
        } catch (error) {
            console.error(error);
            if (error.response) {
                return {message:error.response.data.message};
=======
            const { orderDetails } = response.data;

            return { orderDetails, success: true };
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message)
>>>>>>> 3dc62eaae14ac43a8c03e5158f6677af51892a19
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
