import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

// LAZY — each page is a separate JS chunk
const Home        = lazy(() => import('../pages/Home/Home'));
const Ventures    = lazy(() => import('../pages/Ventures/Ventures'));
const GlobalTrade = lazy(() => import('../pages/GlobalTrade/GlobalTrade'));
const Vision      = lazy(() => import('../pages/Vision/Vision'));
const Store       = lazy(() => import('../pages/Store/Store'));
const Contact     = lazy(() => import('../pages/Contact/Contact'));

const PageLoader = () => (
  <div style={{
    width: '100vw',
    height: '100vh',
    background: '#0B0B0B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <div style={{
      width: '40px',
      height: '1px',
      background: '#B8924A',
      animation: 'loaderPulse 1.4s ease infinite',
    }} />
  </div>
);

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { path: '',             element: <Suspense fallback={<PageLoader />}><Home /></Suspense> },
            { path: 'ventures',    element: <Suspense fallback={<PageLoader />}><Ventures /></Suspense> },
            { path: 'global-trade',element: <Suspense fallback={<PageLoader />}><GlobalTrade /></Suspense> },
            { path: 'vision',      element: <Suspense fallback={<PageLoader />}><Vision /></Suspense> },
            { path: 'store',       element: <Suspense fallback={<PageLoader />}><Store /></Suspense> },
            { path: 'contact',     element: <Suspense fallback={<PageLoader />}><Contact /></Suspense> },
            { path: '*',           element: <Suspense fallback={<PageLoader />}><Home /></Suspense> },
        ],
    },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
