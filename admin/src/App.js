import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Sidebar from "./components/sidebar";
import Footer from "./components/footer";
import Login from "./pages/login";
import Logout from "./pages/logout";
import Dashboard from "./pages/dashboard";
import Viewjob from "./pages/viewjob";
import Viewemployer from "./pages/viewemployer";
import Monitoringjobseeker from "./pages/monitoringjobseeker";
import Manageprofile from "./pages/manageprofile";
import "./App.css";

/* ===== DASHBOARD LAYOUT ===== */
const DashboardLayout = ({ children }) => (
  <>
    <Header />

    <div className="dashboard-wrapper">
      <Sidebar />

      <div className="page-content">
        {children}
      </div>
    </div>

    <Footer />
  </>
);


function App() {
  return (
    <BrowserRouter>

        {/* Default Home Page */}
        <Routes>

  {/* Default Page → Login */}
  <Route path="/" element={<Dashboard />} />

  {/* Auth Pages */}
  <Route path="/login" element={<Login />} />
  <Route path="/logout" element={<Logout />} />

  {/* Dashboard Pages */}
  <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
  <Route path="/Viewemployer" element={<DashboardLayout><Viewemployer /></DashboardLayout>} />
  <Route path="/viewjob" element={<DashboardLayout><Viewjob /></DashboardLayout>} />
  <Route path="/monitoringjobseeker" element={<DashboardLayout><Monitoringjobseeker /></DashboardLayout>} />
  <Route path="/manageprofile" element={<DashboardLayout><Manageprofile /></DashboardLayout>} />

</Routes>

    </BrowserRouter>
  );
}

export default App;