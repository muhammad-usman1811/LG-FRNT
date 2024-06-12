import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import LoginPage from "./pages/LoginPage";
import ChatInterface from "./components/ChatInterface";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/app" element={<App />}>
            <Route path="/app/chat" element={<ChatInterface />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </React.StrictMode>
  </Provider>
);
