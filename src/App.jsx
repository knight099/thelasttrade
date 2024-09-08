/* eslint-disable no-unused-vars */

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { Courses } from "./pages/Courses";
import { Homepage } from "./pages/Homepage";
// import { AdminDashboard } from "./components/AdminDashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/admindashboard" element={<AdminDashboard />} /> */}
          <Route path="/courses" element={<Courses />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
