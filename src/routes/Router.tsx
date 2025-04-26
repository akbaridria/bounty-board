import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "./shared/loadable/Loadable";

/* ****Pages***** */
const App = Loadable(lazy(() => import("../view/app")));

const Router = [
  {
    path: "/",
    element: <App />,
    children: [{ path: "*", element: <Navigate to="/" /> }],
  },
];

export default Router;
