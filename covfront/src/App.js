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
import Messages from "./pages/Messages";
import MyRides from "./pages/MyRides";
import Profile from "./pages/ProfilePage";
import Register from "./pages/Register";
import RideDetails from "./pages/RideDetails";
import SearchRides from "./pages/SearchRides";
import Notifications from "./pages/Notifications";
import Entreprise from './pages/Entreprise';
import APropos from './pages/APropos';
import Equipe from './pages/Equipe';
import Carrieres from './pages/Carrieres';
import Presse from './pages/Presse';
import Postuler from './pages/Postuler';
import Support from './pages/Support';
import CentreAide from './pages/CentreAide';
import Contact from './pages/Contact';
import Securite from './pages/Securite';
import SignalerProbleme from './pages/SignalerProbleme';
import Legal from './pages/Legal';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import MentionsLegales from './pages/MentionsLegales';

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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
