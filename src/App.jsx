import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import { VerifyOTP } from "./pages/VerifyOTP";
import SignIn from "./pages/signIn";
import SignUp from "./pages/signUp";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} index />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/verifyotp" element={<VerifyOTP />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
