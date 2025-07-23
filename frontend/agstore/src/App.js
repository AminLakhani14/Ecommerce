import { Outlet } from 'react-router-dom';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import Sitemap from './components/Sitemap';

const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className='flex-grow-1'>
        <Outlet /> 
      </main>
      <Sitemap />
      <Footer />
    </div>
  );
};

export default App;