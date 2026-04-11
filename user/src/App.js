import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/header";
import Footer from "./components/footer";

import Home from "./pages/home";
import Browsejob from "./pages/browsejob";
import Aboutas from "./pages/aboutas";
import Candidates from "./pages/candidates";
import Jobdetails from "./pages/jobdetails";
import Blog from "./pages/blog";
import Singleblog from "./pages/singleblog";
import Contact from "./pages/conact";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Resume from "./pages/resume";
import Uploadresume from "./pages/uploadresume";
import Candidatedetails from "./pages/candidatedetails";
import Application from "./pages/application";
import Editresume from "./pages/editresume";
import Notifications from "./pages/notifications";

function App() {
  return (
    <Router>

      <Routes>

        {/* ===== WITHOUT HEADER/FOOTER ===== */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/uploadresume" element={<Uploadresume />} />
        <Route path="/candidate/:id" element={<Candidatedetails />} />

        {/* ===== WITH HEADER + FOOTER ===== */}
        <Route
          path="*"
          element={
            <>
              <Header />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/browsejob" element={<Browsejob />} />
                <Route path="/aboutas" element={<Aboutas />} />
                <Route path="/candidates" element={<Candidates />} />

                {/* ✅ IMPORTANT FIX */}
                <Route path="/jobdetails/:id" element={<Jobdetails />} />


                <Route path="/blog" element={<Blog />} />
                <Route path="/singleblog" element={<Singleblog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/application" element={<Application />} />
                <Route path="/editresume" element={<Editresume />} />
                <Route path="/notifications" element={<Notifications />} />
              </Routes>

              <Footer />
            </>
          }
        />

      </Routes>

    </Router>
  );
}

export default App;