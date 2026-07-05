import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, BookOpen, User, LogOut } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [showLogout, setShowLogout] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/courses", label: "Courses" },
    ...(role === "admin" ? [{ path: "/dashboard", label: "Dashboard" }] : []),
    { path: "/contact", label: "Contact" },
    isLoggedIn && { path: "/watchlist", label: "My Watchlist" },
    // { path: "/watchlist", label: "Watchlist" },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    setIsLoggedIn(!!token);
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    sessionStorage.removeItem("sessionId");
    sessionStorage.removeItem("sessionStart");
    setIsLoggedIn(false);
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-card shadow-sm sticky top-0 z-50 ">
      <div className="container-main">
        <div className="flex items-center justify-between h-16 ">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LearnHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? "text-primary font-semibold" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {/* <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="btn-primary text-sm py-2">
              Get Started
            </Link> */}
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="nav-link btn-primary text-sm py-2 text-center text-white hover:text-white"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2">
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {/* <Link
                  to="/watchlist"
                  className={`nav-link py-2 ${isActive("/watchlist") ? "text-primary font-semibold" : ""}`}
                >
                  Watchlist
                </Link> */}
                <button
                  onClick={() => setShowLogout(true)}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-800 hover:scale-[1.02] transition"
                >
                  <LogOut size={20} />
                </button>
                {showLogout && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-[300px] text-center">
                      <h2 className="text-lg font-semibold mb-2">Logout</h2>

                      <p className="text-sm text-gray-500 mb-4">
                        Are you sure you want to logout?
                      </p>

                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setShowLogout(false)}
                          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={handleLogout}
                          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link py-2 ${isActive(link.path) ? "text-primary font-semibold" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border pt-4 flex flex-col gap-3">
                {/* <Link
                  to="/login"
                  className="nav-link py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link> */}
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/login"
                      className="nav-link py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/watchlist" className="nav-link py-2">
                      Watchlist
                    </Link>
                    <button
                      onClick={() => setShowLogout(true)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition"
                    >
                      <LogOut size={30} />
                    </button>
                    {showLogout && (
                      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-lg w-[300px] text-center">
                          <h2 className="text-lg font-semibold mb-2">Logout</h2>

                          <p className="text-sm text-gray-500 mb-4">
                            Are you sure you want to logout?
                          </p>

                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => setShowLogout(false)}
                              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                            >
                              Cancel
                            </button>

                            <button
                              onClick={handleLogout}
                              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                            >
                              Logout
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
