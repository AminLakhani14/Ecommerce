import { Outlet, useLocation } from 'react-router-dom';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import Sitemap from './components/Sitemap';
import AdminShell from './layouts/AdminShell';
import { SiteBreadcrumbs } from './components/Breadcrumbs';
import ScrollToTop from './components/ScrollToTop';
import './index.css';
import Seo from './components/Seo';

const App = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin/')) return <><Seo /><ScrollToTop /><AdminShell><Outlet /></AdminShell></>;
  return (
    <div className={`d-flex flex-column min-vh-100${pathname === '/' ? ' home-layout' : ''}`}>
      <Seo />
      <ScrollToTop />
      <Header />
      <SiteBreadcrumbs />
      <main className='flex-grow-1'>
        <Outlet /> 
      </main>
      <Sitemap />
      <Footer />
    </div>
  );
};

export default App;
