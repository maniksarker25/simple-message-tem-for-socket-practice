import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import MessageBox from "../components/MessageBox"; // This could be the dynamic component
import Notification from "../components/Notification";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    // errorElement: <ErrorPage />, // You can uncomment this for error handling
    children: [
      {
        path: "message/:id", // Dynamic route with `id` as the dynamic parameter
        element: <MessageBox />, // Component that will render for this dynamic route
      },
      {
        path: "notification",
        element: <Notification></Notification>,
      },
    ],
  },
]);

export default router;
