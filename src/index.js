import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterComponent from "./component/register";
import LoginComponent from "./component/login";
import LogoutComponent from "./component/logout";
import HomeComponent from "./component/home";
import DetailProductComponent from "./component/detailProduct";
import ProfileComponent from "./component/profile";
import CheckoutComponent from "./component/checkout";
import TransactionsComponent from "./component/transactions";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginComponent />
  },
  {
    path: "/register",
    element: <RegisterComponent />
  },
  {
    path: "/",
    element: <LoginComponent />
  },
  {
    path: "/home",
    element: <HomeComponent />
  },
  {
    path: "/product/:id",
    element: <DetailProductComponent />
  },
  {
    path: "/logout",
    element: <LogoutComponent />
  },
  {
    path: "/profile",
    element: <ProfileComponent />
  },
  {
    path: "/checkout",
    element: <CheckoutComponent />
  },
  {
    path: "/transactions",
    element: <TransactionsComponent />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);