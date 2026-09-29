import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import { Dashboard } from "./pages/Dashboard";
import { NewProposal } from "./pages/NewProposal";
import { ClientProposal } from "./pages/ClientProposal";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/proposals/new" element={<NewProposal />} />
        <Route path="/p/:token" element={<ClientProposal />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
