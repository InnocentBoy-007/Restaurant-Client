import axios from "axios";

class Services {
    async PlaceOrder(data, token) {
        if (!data || typeof data !== 'object') return console.log("Data is either invalid or is not an object!");
        if (!token || typeof token !== 'string') return alert("Token is either invalid or is not a string!");
        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/orders/place_order`;

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
                alert("An unexpected error occured while trying to place an order!");
            }
        }
    }

    async CancelOrder(orderId, token) {
        if (!orderId) return console.log("Invalid orderId!");
        if (!token || typeof token !== 'string') return console.log("Token is either invalid or is not a string!");
        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/orders/cancel_order/${orderId}`

        try {
            const response = await axios.delete(URL, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                console.log("An unexpected error occured while trying to cancel the order!");
            }
        }
    }

    async OrderReceivedConfirmation(orderId, token) {
        if (!orderId) return console.log("Invalid orderId!");
        if (!token || typeof token !== 'string') return alert("Token is either invalid or is not a string!");
        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/orders/receive_confirm/${orderId}`;

        try {
            const response = await axios.post(URL, {}, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });

            alert(response.data.message);

            return true;
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to confirm an order reception!");
            }
        }
    }
}

const services = new Services();
export default services;
