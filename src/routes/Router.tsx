import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "./shared/loadable/Loadable";

const App = Loadable(lazy(() => import("../view/app")));
const BountyDetail = Loadable(lazy(() => import("@/view/bounty-detail")));
const CreateBounty = Loadable(lazy(() => import("@/view/create-bounty")));

const Router = [
  {
    path: "/",
    element: <App />,
    children: [{ path: "*", element: <Navigate to="/" /> }],
  },
  {
    path: "/bounty",
    element: <BountyDetail />,
  },
  {
    path: "/create-bounty",
    element: <CreateBounty />,
  },
];

export default Router;
