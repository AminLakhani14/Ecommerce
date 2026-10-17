import { Navigate, Outlet } from 'react-router-dom';
import { useAppDispatch as useDispatch, useAppSelector as useSelector } from '../redux/hooks';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute;