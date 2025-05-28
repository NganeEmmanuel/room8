import { Link, useLocation } from "react-router-dom";

const Navbar = ({ isAuthenticated }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItemClass = (path) =>
    `text-gray-800 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md ${
      currentPath === path ? "text-blue-600 font-medium" : ""
    }`;

  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center font-sans">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-600 tracking-tight">
        <Link to="/home">Room8</Link>
      </div>

      {/* Navigation Links */}
      <ul className="flex space-x-6 items-center text-base">
        <li>
          <Link to="/home" className={navItemClass("/home")}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/listings" className={navItemClass("/listings")}>
            Browse Listings
          </Link>
        </li>
        <li>
          <Link to="/OurServices" className={navItemClass("/ourServices")}>
            Our Services
          </Link>

        </li>
        <li>
          <Link to="/listings" className={navItemClass("/about")}>
            Our Team
          </Link>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <Link to="/admin/dashboard" className={navItemClass("/admin/dashboard")}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/profile" className={navItemClass("/admin/profile")}>
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={() => {/* logout logic */}}
                className="text-gray-800 hover:text-red-500 transition-colors duration-200 px-3 py-2"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className={navItemClass("/login")}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-sm">
                Signup
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
