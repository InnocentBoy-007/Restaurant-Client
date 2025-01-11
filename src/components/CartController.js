import axios from "axios";

class CartController {
    async AddProductsToCart(productId, token) {
        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/cart/${productId}/add`
        try {
            const response = await axios.post(URL, {}, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });
            const { addedProduct, message } = response.data;
            if (response) {
                alert(message);
                return { products: addedProduct };
            }

            return true;
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to add the product!");
            }
            return false;
        }
    }

    async RemoveProductsFromCart(productId, token) {
        const URL = `${import.meta.env.VITE_BACKEND_API1}/v1/customers/cart/${productId}/delete`
        try {
            const response = await axios.delete(URL, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, withCredentials: true });

            return {message: response.data.message, success:true};
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.message);
            } else if (error.request) {
                alert("Network error! Please try again later!");
            } else {
                alert("An unexpected error occured while trying to remove the product from the cart!");
            }

            return false;
        }
    }
}

const cartController = new CartController();
export default cartController;
