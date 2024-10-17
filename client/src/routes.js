import App, { Home } from "./App";
import Clients from "./Clients";
import Client from "./Client";
import Blogs from "./Blogs";
import EstateBoard from "./EstateBoard"; // Added EstateBoard import
import NetWorthBoard from "./NetWorthBoard"; // Added NetWorthBoard import
import CardGameBoard from "./CardGameBoard"; // Added CardGameBoard import

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "clients",
        element: <Clients />,
      },
      {
        path: "clients/:id",
        element: <Client />,
      },
      {
        path: "blogs",
        element: <Blogs />,
      },
      {
        path: "estateboard", // Added EstateBoard route
        element: <EstateBoard />,
      },
      {
        path: "networthboard", // Added NetWorthBoard route
        element: <NetWorthBoard />,
      },
      {
        path: "card-game-board", // Added CardGameBoard route
        element: <CardGameBoard />,
      },
    ],
  },
];

export { routes };
