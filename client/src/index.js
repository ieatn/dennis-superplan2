import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import { domain, clientId } from "./config";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { MultiBackend, getBackendOptions } from "@minoru/react-dnd-treeview";
import { QuestionnaireProvider } from "./QuestionnaireContext";
import { EstateBoardProvider } from "./EstateBoardContext";
import { routes } from "./routes";

// Create your router configuration
const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <QuestionnaireProvider>
          <EstateBoardProvider>
            <RouterProvider router={router} />
          </EstateBoardProvider>
        </QuestionnaireProvider>
      </DndProvider>
    </Auth0Provider>
  </React.StrictMode>
);
