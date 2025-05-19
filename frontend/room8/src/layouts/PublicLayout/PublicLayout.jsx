// layouts/PublicLayout.jsx
import Navbar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";

const PublicLayout = ({ children, isAuthenticated }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="flex-grow px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
