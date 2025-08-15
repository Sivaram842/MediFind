import API from "../utils/axiosInstance";

export const registerUser = async (userData) => {
    const res = await API.post("/users/register", userData);
    localStorage.setItem("token", res.data.token);
    return res.data;
};

export const loginUser = async (credentials) => {
    const res = await API.post("/users/login", credentials);
    localStorage.setItem("token", res.data.token);
    return res.data;
};
