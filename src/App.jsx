import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import { ClientVerification } from "./pages/ClientVerification";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import ProductPage from "./pages/ProductPage";
import { VerifyAddToCartOTP } from "./pages/VerifyAddToCartOTP";
import Cart from "./pages/Cart";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} index />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/clientVerification" element={<ClientVerification />} />
          <Route path="/verifyaddtocartotp" element={<VerifyAddToCartOTP />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
