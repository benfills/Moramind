import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage";
import Signup from "./pages/signup";
import Login from "./pages/login";
import Forgotpassword from "./pages/forgotpassword";
import Dashboard from "./pages/dashboard";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/forgotpassword" element={<Forgotpassword />}/>
        <Route path="/dashboard" element={<Dashboard />}/>
      </Routes>
    </div>
  );
}
