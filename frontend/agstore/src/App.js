import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Header from './layouts/Header';
import Footer from './layouts/Footer';

const App = () => {
  return (
    // --- START: ADDED FLEXBOX CLASSES ---
    <div className="d-flex flex-column min-vh-100">
      <Header />
      {/* The main content area will now grow to push the footer down */}
      <main className='py-3 flex-grow-1'>
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
    // --- END: ADDED FLEXBOX CLASSES ---
  );
};

export default App;