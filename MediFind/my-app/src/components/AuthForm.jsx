import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const AuthForm = ({ type }) => {
    const [selectedRole, setSelectedRole] = useState(type === "register" ? null : "user");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "password") {
            checkPasswordStrength(value);
        }
    };

    const checkPasswordStrength = (password) => {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        const mediumRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

        if (strongRegex.test(password)) {
            setPasswordStrength("strong");
        } else if (mediumRegex.test(password)) {
            setPasswordStrength("medium");
        } else {
            setPasswordStrength("weak");
        }
    };

    const validateForm = () => {
        setError("");
        if (type === "register") {
            if (!formData.name.trim()) {
                setError("Name is required");
                return false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                setError("Please enter a valid email address");
                return false;
            }
            if (formData.password.length < 8) {
                setError("Password must be at least 8 characters");
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match");
                return false;
            }
        } else {
            if (!formData.email || !formData.password) {
                setError("Both email and password are required");
                return false;
            }
        }
        return true;
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role: selectedRole.toLowerCase(),
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                navigate("/login", {
                    state: {
                        registrationSuccess: true,
                        email: formData.email
                    }
                });
            } else {
                setError(data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError("Network error. Please check your connection and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role: selectedRole.toLowerCase(),
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("authToken", data.token);
                localStorage.setItem("userRole", data.role || data.user?.role);

                const role = data.role || data.user?.role;
                if (role === "pharmacy") {
                    navigate("/pharmacy/profile");
                } else {
                    navigate("/");
                }
            } else {
                setError(data.message || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Network error. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case "strong": return "bg-green-500";
            case "medium": return "bg-yellow-500";
            case "weak": return "bg-red-500";
            default: return "bg-gray-300";
        }
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case "strong": return "Strong password";
            case "medium": return "Medium strength - add numbers/symbols";
            case "weak": return "Weak password - use more characters";
            default: return "Password strength";
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 relative">
                {type === "register" && !selectedRole && (
                    <div className="relative text-center">
                        <h1 className="text-2xl font-bold mb-6 text-gray-800">Welcome to MediFind</h1>
                        <p className="mb-8 text-gray-500">Please select your role to continue:</p>
                        <div className="space-y-4">
                            <button
                                onClick={() => setSelectedRole("user")}
                                className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                            >
                                Regular User
                            </button>
                            <button
                                onClick={() => setSelectedRole("pharmacy")}
                                className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
                            >
                                Pharmacy Owner
                            </button>
                        </div>
                    </div>
                )}

                {(type === "login" || selectedRole) && (
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-gray-800">
                            {type === "login" ? "Login" : "Register"} as {selectedRole === "pharmacy" ? "Pharmacy" : "User"}
                        </h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        <form onSubmit={type === "register" ? handleRegisterSubmit : handleLoginSubmit} className="space-y-4">
                            {type === "register" && (
                                <div>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                    required
                                />
                                {type === "register" && formData.password && (
                                    <div className="mt-2">
                                        <div className="w-full bg-gray-300 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${getPasswordStrengthColor()}`}
                                                style={{
                                                    width: passwordStrength === "weak" ? "33%" :
                                                        passwordStrength === "medium" ? "66%" : "100%",
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-xs mt-1 text-gray-600">
                                            {getPasswordStrengthText()}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {type === "register" && (
                                <div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                                        required
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 ${type === "login" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
                                    } text-white rounded-lg font-semibold transition ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : type === "login" ? (
                                    "Login"
                                ) : (
                                    "Register"
                                )}
                            </button>
                        </form>

                        <div className="mt-4 text-center text-sm text-gray-600">
                            {type === "login" ? (
                                <p>
                                    Don't have an account?{" "}
                                    <button
                                        onClick={() => navigate("/register")}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Register here
                                    </button>
                                </p>
                            ) : (
                                <p>
                                    Already have an account?{" "}
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Login here
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <button
                    onClick={() => navigate("/")}
                    className="mt-4 text-sm px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                    ← Back to Home
                </button>
            </div>
        </div>
    );
};

export default AuthForm;