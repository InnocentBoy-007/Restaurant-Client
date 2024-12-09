import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import { ClientVerification } from "./pages/ClientVerification";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import BackupJWT from "./pages/BackupJWT";
import ForgotPassword from "./pages/passwordManagement/forgotPassword";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} index />
          <Route path="/user/signUp" element={<SignUp />} />
          <Route path="/user/signIn" element={<SignIn />} />
          <Route path="/user/products" element={<ProductPage />} />
          <Route path="/user/verify" element={<ClientVerification />} />
          <Route path="/user/products/cart" element={<Cart />} />
          <Route path="/user/orders" element={<Orders />} />
          <Route path="/backupjwt" element={<BackupJWT />} />
          <Route path="/user/password" element={<ForgotPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
