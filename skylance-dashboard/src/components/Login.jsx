import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AirlineImage from "./AirlineImage.jpg";

const Login = ({ setIsAuthenticated }) => {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!employeeNumber || !password) {
      setErrorMessage("Please enter both employee number and password.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/Auth/login/employee`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employeeNumber, password }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setErrorMessage("Invalid employee number or password.");
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
        return;
      }

      const data = await response.json();

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("tokenExpiry", data.expires);

      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage("Login failed. Please check your network or try again.");
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Left Login Panel */}
      <div className="w-1/2 flex flex-col justify-center items-center bg-white px-12">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold text-blue-600 mb-2">Skylance</h2>
          <h2 className="text-lg font-bold text-gray-600 mb-8">
            Welcome Back!
          </h2>

          <form className="space-y-5" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Employee Number"
              value={employeeNumber}
              onChange={(e) => setEmployeeNumber(e.target.value)}
              className="w-full p-3 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 placeholder-gray-500 focus:ring-blue-500 text-black"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-blue-600 rounded-lg focus:outline-none focus:ring-2 placeholder-gray-500 focus:ring-blue-500 text-black"
            />

            {errorMessage && (
              <div className="text-red-600 text-sm mt-1">{errorMessage}</div>
            )}

            <div className="text-right">
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      {/* Right Image Panel */}
      <div className="w-1/2">
        <img
          src={AirlineImage}
          alt="Airline travel"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
