
const DashboardHeader = ({ userName, userRole }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleDisplay = () => {
    switch (userRole) {
      case 'tenant-landlord':
        return 'Tenant & Landlord';
      case 'landlord':
        return 'Landlord';
      case 'tenant':
        return 'Tenant';
      default:
        return 'User';
    }
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">
        {getGreeting()}, {userName || 'there'}! 👋
      </h1>
      <p className="text-gray-600 mt-2">
        Welcome to your {getRoleDisplay()} dashboard. Here's what's happening with your account.
      </p>
    </div>
  );
};

export default DashboardHeader;