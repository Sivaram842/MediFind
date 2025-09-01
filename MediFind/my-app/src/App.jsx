import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { MediFindContext } from "./context/MediFindContext";

import AuthForm from "./components/AuthForm";
import HomePage from "./pages/HomePage";
import PharmacyDashboard from "./pages/pharmacy/PharmacyProfile";
import AddMedicine from "./pages/pharmacy/AddMedicine";
import PharmacyProfile from "./pages/pharmacy/PharmacyProfile";
import MyMedicines from "./pages/pharmacy/MyMedicines";
import MyPharmacies from "./pages/pharmacy/MyPharmacies";
const App = () => {
  const { user, setUser } = useContext(MediFindContext);

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthForm type="login" />} />
          <Route path="/register" element={<AuthForm type="register" />} />
          <Route path="/pharmacy/profile" element={<PharmacyProfile />} />
          <Route path="/pharmacies" element={<MyPharmacies />} />
          <Route path="/medicines" element={<MyMedicines />} />
          {/* Protect these routes if user is not logged in */}
          <Route
            path="/pharmacy-dashboard"
            element={
              user ? (
                <PharmacyDashboard
                  onLogout={() => {
                    setUser(null);
                  }}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/add-medicine"
            element={user ? <AddMedicine /> : <Navigate to="/login" replace />}
          />


          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
