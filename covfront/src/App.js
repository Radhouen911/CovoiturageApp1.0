import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";

import Footer from "./components/Footer";
import Header from "./components/Header";
import { AuthProvider } from "./contexts/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import APropos from "./pages/APropos";
import Carrieres from "./pages/Carrieres";
import CentreAide from "./pages/CentreAide";
import Contact from "./pages/Contact";
import Cookies from "./pages/Cookies";
import CreateRide from "./pages/CreateRide";
import CreateTicket from "./pages/CreateTicket"; // New import
import Entreprise from "./pages/Entreprise";
import Equipe from "./pages/Equipe";
import Home from "./pages/Home";
import Legal from "./pages/Legal";
import Login from "./pages/Login";
import MentionsLegales from "./pages/MentionsLegales";
import Messages from "./pages/Messages";
import MyRides from "./pages/MyRides";
import MyTicketsPage from "./pages/MyTicketsPage";
import Notifications from "./pages/Notifications";
import Postuler from "./pages/Postuler";
import Presse from "./pages/Presse";
import Privacy from "./pages/Privacy";
import Profile from "./pages/ProfilePage";
import Register from "./pages/Register";
import RideDetails from "./pages/RideDetails";
import SearchRides from "./pages/SearchRides";
import Securite from "./pages/Securite";
import SignalerProbleme from "./pages/SignalerProbleme";
import Support from "./pages/Support";
import Terms from "./pages/Terms";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchRides />} />
              <Route path="/search-rides" element={<SearchRides />} />
              <Route path="/create-ride" element={<CreateRide />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-rides" element={<MyRides />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/ride/:id" element={<RideDetails />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/entreprise" element={<Entreprise />} />
              <Route path="/about" element={<APropos />} />
              <Route path="/team" element={<Equipe />} />
              <Route path="/careers" element={<Carrieres />} />
              <Route path="/press" element={<Presse />} />
              <Route path="/postuler" element={<Postuler />} />
              <Route path="/support" element={<Support />} />
              <Route path="/help" element={<CentreAide />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/safety" element={<Securite />} />
              <Route path="/report" element={<SignalerProbleme />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/mentions" element={<MentionsLegales />} />
              <Route path="/legal-notice" element={<MentionsLegales />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/create-ticket" element={<CreateTicket />} />
              <Route path="/my-tickets" element={<MyTicketsPage />} />{" "}
              {/* New route */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
