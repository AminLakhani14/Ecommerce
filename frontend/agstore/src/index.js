import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';

// Import Components
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Import Pages
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShippingPage from './pages/ShippingPage';
import OrderPage from './pages/OrderPage';
import ThankYouPage from './pages/ThankYouPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CategoryPage from './pages/CategoryPage';
import SalePage from './pages/SalePage';

// Admin Pages
import ProductListPage from './pages/Admin/ProductListPage';
import ProductCreatePage from './pages/Admin/ProductCreatePage';
import ProductEditPage from './pages/Admin/ProductEditPage';
import SubCategoryPage from './pages/SubCategoryPage'; 
import FilteredProductPage from './pages/FilteredProductPage';
import ProfilePage from './pages/ProfilePage';
import OrderListPage from './pages/Admin/OrderListPage';
import FAQPage from './pages/FAQ';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      {/* --- Public Routes --- */}
      <Route index={true} path='/' element={<HomePage />} />
      <Route path='/product/:id' element={<ProductPage />} />
      <Route path='/cart' element={<CartPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/about' element={<AboutPage />} />
      <Route path='/faq' element={<FAQPage />} />
      <Route path='/contact' element={<ContactPage />} />
      <Route path='/category/:categoryName' element={<CategoryPage />} />
      <Route path='/sale' element={<SalePage />} />
      <Route path='/thankyou' element={<ThankYouPage />} />
      <Route path='/profile' element={<ProfilePage />} />
      <Route path='/products/subcategory/:subCategoryName' element={<SubCategoryPage />} />
      <Route path='/products/:category/:subCategory' element={<FilteredProductPage />} />
      <Route path='' element={<PrivateRoute />}>
        <Route path='/shipping' element={<ShippingPage />} />
        <Route path='/order/:id' element={<OrderPage />} />
        <Route path='/order/:id/thankyou' element={<ThankYouPage />} />
      </Route>

      {/* --- Admin Routes (Must be logged in AND an admin) --- */}
      <Route path='' element={<AdminRoute />}>
        <Route path='/admin/productlist' element={<ProductListPage />} />
        <Route path='/admin/product/create' element={<ProductCreatePage />} />
        <Route path='/admin/product/:id/edit' element={<ProductEditPage />} />
        <Route path='/admin/orderlist' element={<OrderListPage />} /> 
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);