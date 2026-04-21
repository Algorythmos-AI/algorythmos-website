import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Skip the reset when a hash is present so /page#section anchors keep working.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}
