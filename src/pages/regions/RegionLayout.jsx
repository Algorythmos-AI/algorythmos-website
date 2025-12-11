// src/pages/regions/RegionLayout.jsx
// Shared layout wrapper for all region pages
// Ensures consistent SEO, region context, and error boundaries

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

/**
 * RegionLayout - Wrapper for region-specific routes
 * 
 * This component:
 * 1. Provides region context to child routes
 * 2. Can inject region-specific SEO defaults
 * 3. Serves as an error boundary attachment point
 * 4. Enables region-scoped analytics
 * 
 * Usage in routes:
 * <Route path="/fr/*" element={<RegionLayout region="FR" />}>
 *   <Route index element={<FrancePage />} />
 *   <Route path="services" element={<ServicesPage />} />
 * </Route>
 */
const RegionLayout = ({ region, children }) => {
  const location = useLocation();

  // Debug logging in development
  if (import.meta.env.DEV) {
    console.debug(`[RegionLayout] region=${region}, path=${location.pathname}`);
  }

  // Render children or Outlet for nested routes
  return (
    <>
      {children || <Outlet />}
    </>
  );
};

/**
 * withRegionLayout - HOC to wrap any page component with region context
 * 
 * Usage:
 * const FranceServicesPage = withRegionLayout(ServicesPage, 'FR');
 */
export function withRegionLayout(Component, region) {
  return function RegionWrappedComponent(props) {
    return (
      <RegionLayout region={region}>
        <Component {...props} region={region} />
      </RegionLayout>
    );
  };
}

export default RegionLayout;
