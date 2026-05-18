import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    api.post('/analytics/visit', {
      page: location.pathname,
      referrer: document.referrer || 'direct',
    }).catch(() => {});
  }, [location.pathname]);
}
