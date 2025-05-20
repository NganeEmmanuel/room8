import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="bg-gray-100 h-full w-64 p-4 shadow-md">
      <ul className="space-y-4">
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/listings">My Listings</Link></li>
        <li><Link to="/admin/bids">My Bids</Link></li>
        <li><Link to="/admin/profile">Profile</Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;
