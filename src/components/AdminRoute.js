import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // Check if user is logged in AND is an admin
  if (userInfo && userInfo.isAdmin) {
    // If true, render the child component (e.g., ProductCreatePage)
    return <Outlet />;
  } else {
    // If false, redirect them to the login page
    return <Navigate to='/login' replace />;
  }
};

export default AdminRoute;