import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Login from "./components/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";

const isTokenValid = () => {
  const authtoken = localStorage.getItem("authToken");
  const expiry = localStorage.getItem("tokenExpiry");
  if (!authtoken || !expiry) return false;
  return Date.now() <= new Date(expiry).getTime();
};

function AppWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(isTokenValid());
  const navigate = useNavigate();

  useEffect(() => {
    if (!isTokenValid()) {
      // Token expired or missing
      localStorage.removeItem("authToken");
      localStorage.removeItem("tokenExpiry");
      setIsAuthenticated(false);
      navigate("/"); // Redirect to login
    }
  }, [navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={<Login setIsAuthenticated={setIsAuthenticated} />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            {/* <ChatWidget /> */}
            <Layout setIsAuthenticated={setIsAuthenticated} />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
