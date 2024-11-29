import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import { ClientVerification } from "./pages/ClientVerification";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import BackupJWT from "./pages/BackupJWT";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} index />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/clientVerification" element={<ClientVerification />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/Orders" element={<Orders />} />
          <Route path="/backupjwt" element={<BackupJWT />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
