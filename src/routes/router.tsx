import { createBrowserRouter } from "react-router-dom";
import { ROUTES } from "./routes";
import App from "../app/app";
import ProductsPage from "../pages/products";
import CartPage from "../pages/cart";

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <App />,
    children: [
      {
        index: true,
        element: <ProductsPage />,
      },
      {
        path: ROUTES.CART,
        element: <CartPage />,
      },
    ],
  },
]);
