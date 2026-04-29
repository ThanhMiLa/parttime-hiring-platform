import { Link, useLocation, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Bell, LogOut, Building2, UserCircle2 } from "lucide-react";
import {
  getCurrentUser,
  getAccessToken,
  getRefreshToken,
  clearAuthData,
} from "../../utils/tokenStorage";
import { logoutService } from "../../services/authService";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = getCurrentUser();
  const isLoggedIn = !!getAccessToken();
  const userRoles = currentUser?.roles || [];
  const isEmployer = userRoles.includes("EMPLOYER");

  async function handleLogout() {
    try {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (accessToken && refreshToken) {
        await logoutService({
          accessToken,
          refreshToken,
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthData();
      navigate("/login");
    }
  }

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to={isEmployer ? "/employer" : "/jobs"} className="brand">
          <span className="brand-mark">
            <BriefcaseBusiness size={18} />
          </span>
          <span className="brand-text">JobPortal</span>
        </Link>

        <nav className="nav-links">
          {isLoggedIn ? (
            <>
              {isEmployer ? (
                <>
                  <Link
                    to="/employer"
                    className="nav-link"
                    style={{ color: isActive("/employer") ? "#135bec" : "#4c669a" }}
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/profile"
                    className="nav-link"
                    style={{ color: isActive("/profile") ? "#135bec" : "#4c669a" }}
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/jobs"
                    className="nav-link"
                    style={{ color: isActive("/jobs") ? "#135bec" : "#4c669a" }}
                  >
                    Jobs
                  </Link>

                  <Link
                    to="/my-applications"
                    className="nav-link"
                    style={{ color: isActive("/my-applications") ? "#135bec" : "#4c669a" }}
                  >
                    Đã ứng tuyển
                  </Link>

                  <Link
                    to="/profile"
                    className="nav-link"
                    style={{ color: isActive("/profile") ? "#135bec" : "#4c669a" }}
                  >
                    Profile
                  </Link>
                </>
              )}

              <button
                className="btn btn-secondary"
                type="button"
                style={{ padding: 10, borderRadius: 10 }}
              >
                <Bell size={18} />
              </button>

              <span className="nav-user" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                {isEmployer ? <Building2 size={16} /> : <UserCircle2 size={16} />}
                Xin chào, {currentUser?.displayName || currentUser?.username}
              </span>

              <button
                className="btn btn-secondary"
                onClick={handleLogout}
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;