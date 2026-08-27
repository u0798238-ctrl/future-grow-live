import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll window for public pages (to prevent glitch in dashboard)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
