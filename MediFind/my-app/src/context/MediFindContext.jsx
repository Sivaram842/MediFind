// src/context/MediFindContext.jsx
import React, { createContext, useEffect, useState, useMemo } from "react";
import API from "../utils/axiosInstance.js";

export const MediFindContext = createContext(null);

const MediFindProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null); // For pharmacy search
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Add page state for navigation
  const [currentPage, setCurrentPage] = useState("home"); // default page

  // Fetch user profile when token changes
  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const { data } = await API.get("/api/users/profile");
          setUser(data);
        } catch (err) {
          logout(); // token might be invalid
        }
      }
    };
    fetchUser();
  }, [token]);

  // Auth
  const register = async (formData) => {
    const { data } = await API.post("/api/users/register", formData);
    return data;
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await API.post("/api/users/login", { email, password });
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setUser(data.user);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setUser(null);
    setLocation(null);
    setError(null);
    setCurrentPage("login"); // ✅ Redirect to login after logout
  };

  // Pharmacy CRUD
  const addPharmacy = async (pharmacyData) => {
    const { data } = await API.post("/api/pharmacies", pharmacyData);
    return data;
  };

  const getAllPharmacies = async () => {
    const { data } = await API.get("/api/pharmacies");
    return data;
  };

  const getPharmacyById = async (id) => {
    const { data } = await API.get(`/api/pharmacies/${id}`);
    return data;
  };

  const updatePharmacy = async (id, updateData) => {
    const { data } = await API.put(`/api/pharmacies/${id}`, updateData);
    return data;
  };

  const deletePharmacy = async (id) => {
    const { data } = await API.delete(`/api/pharmacies/${id}`);
    return data;
  };

  // Medicine CRUD
  const addMedicine = async (medicineData) => {
    const { data } = await API.post("/api/medicines", medicineData);
    return data;
  };

  const getAllMedicines = async () => {
    const { data } = await API.get("/api/medicines");
    return data;
  };

  const getMedicineById = async (id) => {
    const { data } = await API.get(`/api/medicines/${id}`);
    return data;
  };

  const updateMedicine = async (id, updateData) => {
    const { data } = await API.put(`/api/medicines/${id}`, updateData);
    return data;
  };

  const deleteMedicine = async (id) => {
    const { data } = await API.delete(`/api/medicines/${id}`);
    return data;
  };

  const value = useMemo(
    () => ({
      token,
      setToken,
      user,
      setUser,
      login,
      register,
      logout,
      location,
      setLocation,
      loading,
      error,
      setError,
      // ✅ Page navigation state
      currentPage,
      setCurrentPage,
      // Pharmacy functions
      addPharmacy,
      getAllPharmacies,
      getPharmacyById,
      updatePharmacy,
      deletePharmacy,
      // Medicine functions
      addMedicine,
      getAllMedicines,
      getMedicineById,
      updateMedicine,
      deleteMedicine,
    }),
    [token, user, location, loading, error, currentPage]
  );

  return (
    <MediFindContext.Provider value={value}>
      {children}
    </MediFindContext.Provider>
  );
};

export default MediFindProvider;
