import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useState } from "react";
import Layout from "./components/Layout";
import { IoChatbox } from "react-icons/io5";
import ChatWidget from "./components/chatbox";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <Router>
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
              <Layout setIsAuthenticated={setIsAuthenticated}></Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
