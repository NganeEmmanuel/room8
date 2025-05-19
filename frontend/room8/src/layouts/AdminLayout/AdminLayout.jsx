// layouts/AdminLayout.jsx
import Navbar from "../../components/NavBar/NavBar";
import Sidebar from "../../components/Sidebar/Sidebar";

const AdminLayout = ({ children, isAuthenticated }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Navbar isAuthenticated={isAuthenticated} />
        <main className="p-4 flex-grow overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
