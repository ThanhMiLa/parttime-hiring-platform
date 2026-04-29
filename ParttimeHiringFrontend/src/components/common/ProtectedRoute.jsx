import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken, getCurrentUser } from "../../utils/tokenStorage";

function ProtectedRoute({ children, allowRoles = [] }) {
  const location = useLocation();
  const token = getAccessToken();
  const currentUser = getCurrentUser();
  const userRoles = currentUser?.roles || [];

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowRoles.length > 0) {
    if (userRoles.length === 0) {
      return <Navigate to="/login" replace />;
    }

    const hasRole = allowRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      if (userRoles.includes("EMPLOYER")) {
        return <Navigate to="/employer" replace />;
      }

      if (userRoles.includes("USER") || userRoles.includes("ADMIN")) {
        return <Navigate to="/jobs" replace />;
      }

      return <Navigate to="/login" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;