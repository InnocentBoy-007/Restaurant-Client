import axios from "axios";

class ProductController {
    async PlaceOrder(data, token) {
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
                alert("An unexpected error occured while trying to place an order! ");
            }
        }
    }

    async CancelOrdder() {

    }


}

const productController = new ProductController();
export default productController;
