import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MediFindContext } from "../../context/MediFindContext";

const Login = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const { login, error, loading } = useContext(MediFindContext);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(credentials.email, credentials.password);
            alert("Login successful!");
            navigate("/");
        } catch (err) {
            alert("Login failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="email"
                placeholder="Email"
                value={credentials.email}
                onChange={handleChange}
                required
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
};

export default Login;
