import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { Spinner } from "./components/Spinner";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import { PrivateRoute } from "./layout/PrivateRoute";
import axios from "axios";

axios.defaults.baseURL = 'http://127.0.0.1:8080/';
axios.defaults.withCredentials = true;

const LandingPage = lazy(() => import("./pages/guest/LandingPage"));
const Login = lazy(() => import("./pages/guest/Login"));
const Register = lazy(() => import("./pages/guest/Register"));
const Orders = lazy(() => import("./pages/orders/Orders"));
const Dashboard = lazy(() => import("./pages/user/Dashboard"));

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
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                 {" "}
                <Dashboard /> {" "}
               </PrivateRoute>
            }
          />

        </Routes>
        <Footer />
      </Suspense>
    </Router>
  )
}
