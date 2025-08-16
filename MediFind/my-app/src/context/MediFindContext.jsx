// src/context/MediFindContext.jsx
import React, { createContext, useEffect, useState, useMemo } from "react";
import axios from "axios";

export const MediFindContext = createContext(null);

const API_BASE_URL = "https://medifind-7.onrender.com" // Change to your backend URL

// Axios instance
const api = axios.create({ baseURL: API_BASE_URL });

const MediFindProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null); // For pharmacy search
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Add page state for navigation
  const [currentPage, setCurrentPage] = useState("home"); // default page

  // Attach token to all requests
  useEffect(() => {
    const id = api.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return () => api.interceptors.request.eject(id);
  }, [token]);

  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const { data } = await api.get("/api/users/profile");
          setUser(data);
        } catch (err) {
          logout(); // token might be invalid
        }
      }
    };
    fetchUser();
  }, [token]);

  const register = async (formData) => {
    const { data } = await api.post("/api/users/register", formData);
    return data;
  };

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await api.post("/api/users/login", { email, password });
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

  // Logout
  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setUser(null);
    setLocation(null);
    setError(null);
    setCurrentPage("login"); // ✅ Redirect to login after logout
  };

  const addPharmacy = async (pharmacyData) => {
    const { data } = await api.post("/api/pharmacies", pharmacyData);
    return data;
  };

  const getAllPharmacies = async () => {
    const { data } = await api.get("/api/pharmacies");
    return data;
  };

  const getPharmacyById = async (id) => {
    const { data } = await api.get(`/api/pharmacies/${id}`);
    return data;
  };

  const updatePharmacy = async (id, updateData) => {
    const { data } = await api.put(`/api/pharmacies/${id}`, updateData);
    return data;
  };

  const deletePharmacy = async (id) => {
    const { data } = await api.delete(`/api/pharmacies/${id}`);
    return data;
  };

  const addMedicine = async (medicineData) => {
    const { data } = await api.post("/api/medicines", medicineData);
    return data;
  };

  const getAllMedicines = async () => {
    const { data } = await api.get("/api/medicines");
    return data;
  };

  const getMedicineById = async (id) => {
    const { data } = await api.get(`/api/medicines/${id}`);
    return data;
  };

  const updateMedicine = async (id, updateData) => {
    const { data } = await api.put(`/api/medicines/${id}`, updateData);
    return data;
  };

  const deleteMedicine = async (id) => {
    const { data } = await api.delete(`/api/medicines/${id}`);
    return data;
  };

  const value = useMemo(
    () => ({
      api,
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
