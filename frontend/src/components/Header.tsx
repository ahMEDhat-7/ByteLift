import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-content">
        <div
          className="logo"
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
        >
          <span className="logo-icon">📁</span>
          <span className="logo-text">ByteLift</span>
        </div>

        <div className="header-right">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {isAuthenticated && (
            <div className="header-actions">
              <div className="user-info">
                <span className="user-avatar">👤</span>
                <span className="user-email">{user?.username}</span>
              </div>
              <button className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
