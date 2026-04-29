import { Navigate } from "react-router-dom";
import { getCurrentUser, isLoggedIn } from "../../utils/tokenStorage";

function HomeRedirect() {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const currentUser = getCurrentUser();
  const roles = currentUser?.roles || [];

  if (roles.includes("EMPLOYER")) {
    return <Navigate to="/employer" replace />;
  }

  if (roles.includes("USER") || roles.includes("ADMIN")) {
    return <Navigate to="/jobs" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default HomeRedirect;