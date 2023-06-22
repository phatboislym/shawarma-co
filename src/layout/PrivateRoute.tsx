import { Navigate, RouteProps } from "react-router-dom";
import { useAppSelector } from "../state-control/store/hooks";
import { isAuthenticated } from "../state-control/features/authSlice";

type PrivateRouteProps = RouteProps & {
  children: React.ReactNode;
};

export function PrivateRoute({ children }: PrivateRouteProps) {
  const isLoggedIn = useAppSelector(isAuthenticated)
   
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
