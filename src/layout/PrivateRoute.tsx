import { Route, useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../state-control/store/hooks";
import { isAuthenticated } from "../state-control/features/authSlice";
import { useEffect } from "react";

type PrivateRouteProps = {
  path?: string
  children: React.ReactNode;
};

export function PrivateRoute({ children, path }: PrivateRouteProps) {
  const isLoggedIn = useAppSelector(isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!isLoggedIn) {
      // Store the current location in localStorage to redirect the user
      // back to this location after successful login
      localStorage.setItem("previousLocation", location.pathname);
      navigate("/login");
    }
  }, [isLoggedIn, navigate, location]);

  if (!isLoggedIn) {
    return null;
  }

  return (

    <div className="min-h-screen">
      <div className="">{children}</div>
    </div>
  );
}
