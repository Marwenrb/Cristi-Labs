import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Ventures from "../pages/Ventures/Ventures";
import GlobalTrade from "../pages/GlobalTrade/GlobalTrade";
import Vision from "../pages/Vision/Vision";
import Store from "../pages/Store/Store";
import Contact from "../pages/Contact/Contact";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { path: "", element: <Home /> },
            { path: "ventures", element: <Ventures /> },
            { path: "global-trade", element: <GlobalTrade /> },
            { path: "vision", element: <Vision /> },
            { path: "store", element: <Store /> },
            { path: "contact", element: <Contact /> },
        ],
    },
]);

export default router;
