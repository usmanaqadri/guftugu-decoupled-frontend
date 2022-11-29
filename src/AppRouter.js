import React, { useState, useMemo } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AboutUs from "./pages/AboutUs";
import GetInvolved from "./pages/GetInvolved";
import Programs from "./pages/Programs";
import Group from "./pages/Group";
import "./index.css";
import App from "./App";
import Navbar from "./components/Navbar";
import { UserContext } from "./UserContext";
import Groups from "./pages/Groups";
import Event from "./pages/Event";
import Events from "./pages/Events";

function AppRouter() {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  return (
    <BrowserRouter>
      <UserContext.Provider value={value}>
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/group" element={<Groups />} />
          <Route path="/event" element={<Events />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/get-involved" element={<GetInvolved />} />
          <Route path="/group/:id" element={<Group />} />
          <Route path="/event/:id" element={<Event />} />
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default AppRouter;
