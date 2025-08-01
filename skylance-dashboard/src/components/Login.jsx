import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AirlineImage from "./AirlineImage.jpg";

const Login = ({ setIsAuthenticated }) => {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleLogin = (e) => {
    e.preventDefault();

    if (employeeNumber && password) {
      // Dummy login check
      setIsAuthenticated(true);
      navigate("/dashboard");
    } else {
      alert("Enter employee number and password");
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
