import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { key } = useLocation();

  useLayoutEffect(() => {
    // Reset before painting the next screen, including category-to-category navigation.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [key]);

  return null;
}
