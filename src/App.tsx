import { Suspense } from "react";
import Header from "./layout/Header";
import {  BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Spinner } from "./components/Spinner";
import Footer from "./layout/Footer";
import LandingPage from "./pages/guest/LandingPage";
import Login from "./pages/guest/Login";
import Register from "./pages/guest/Register";

export default function App() {
  return (
    <Router>
      <Suspense fallback={<Spinner />}>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="reset-password" element={<ResetPassword />} /> */}
          <Route path="*" element={<Navigate to="/" />} />
                </Routes>
        <Footer />
      </Suspense>
    </Router>
  )
}