import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

import Footer from "./components/Footer";
import Navbar from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";
import CreateRide from "./pages/CreateRide";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyRides from "./pages/MyRides";
import Profile from "./pages/ProfilePage";
import Register from "./pages/Register";
import RideDetails from "./pages/RideDetails";
import SearchRides from "./pages/SearchRides";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchRides />} />
              <Route path="/create-ride" element={<CreateRide />} />
              <Route path="/profilePage" element={<Profile />} />
              <Route path="/myRides" element={<MyRides />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/ride/:id" element={<RideDetails />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
