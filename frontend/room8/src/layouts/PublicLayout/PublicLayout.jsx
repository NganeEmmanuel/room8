// layouts/PublicLayout.jsx
import Navbar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import { Outlet } from "react-router-dom"

const PublicLayout = ({  isAuthenticated }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="flex-grow px-1 py-2">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
