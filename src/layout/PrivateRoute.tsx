import { useState } from "react";
import { Navigate, RouteProps } from "react-router-dom";

type PrivateRouteProps = RouteProps & {
  children: React.ReactNode;
};

export function PrivateRoute({ children }: PrivateRouteProps) {
//   const isLoggedIn = useAppSelector(isAuthenticated)
    const [isLoggedIn, setIsLoggedIn] = useState(true)
  return isLoggedIn ? (
    <div className="min-h-screen">
      <div className="flex">        
        {children}
      </div>
    </div>
  ) : (
    <Navigate to="/" />
  );
}
