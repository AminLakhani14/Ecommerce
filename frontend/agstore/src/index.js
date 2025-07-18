import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
// Pages
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProductCreatePage from './pages/Admin/ProductCreatePage';
import CategoryPage from './pages/CategoryPage';
import AdminRoute from './components/AdminRoute';
import ProductListPage from './pages/Admin/ProductListPage';
import ProductEditPage from './pages/Admin/ProductEditPage';
import SalePage from './pages/SalePage'; 
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={<AdminRoute />}></Route>
      <Route index={true} path='/' element={<HomePage />} />
      <Route path='/product/:id' element={<ProductPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/about' element={<AboutPage />} />
      <Route path='/contact' element={<ContactPage />} />
      <Route path='/category/:categoryName' element={<CategoryPage />} />
      <Route path='/admin/product/create' element={<ProductCreatePage />} />
      <Route path='/admin/productlist' element={<ProductListPage />} />
      <Route path='/admin/product/create' element={<ProductCreatePage />} />
      <Route path='/admin/product/:id/edit' element={<ProductEditPage />} />
      <Route path='/sale' element={<SalePage />} />
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