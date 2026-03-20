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

// Minimal fallback — no layout shift
const PageLoader = () => (
  <div style={{
    width: '100vw',
    height: '100vh',
    background: 'var(--bg-void)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}>
    <div style={{
      width: '32px',
      height: '1px',
      background: 'var(--accent)',
    }} />
  </div>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { path: "",            element: <Suspense fallback={<PageLoader />}><Home /></Suspense> },
            { path: "ventures",    element: <Suspense fallback={<PageLoader />}><Ventures /></Suspense> },
            { path: "global-trade",element: <Suspense fallback={<PageLoader />}><GlobalTrade /></Suspense> },
            { path: "vision",      element: <Suspense fallback={<PageLoader />}><Vision /></Suspense> },
            { path: "store",       element: <Suspense fallback={<PageLoader />}><Store /></Suspense> },
            { path: "contact",     element: <Suspense fallback={<PageLoader />}><Contact /></Suspense> },
        ],
    },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
