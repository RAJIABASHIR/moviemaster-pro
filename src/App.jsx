import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AllMovies from "./pages/AllMovies";
import MovieDetails from "./pages/MovieDetails";
import AddMovie from "./pages/AddMovie";
import UpdateMovie from "./pages/UpdateMovie";
import MyCollection from "./pages/MyCollection";
import Watchlist from "./pages/Watchlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { useAuth } from "./hooks/useAuth";   // ✅ hook only

function Protected({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user) return <Login />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<AllMovies />} />
          <Route path="/movies/:id" element={<MovieDetails />} />
          <Route path="/movies/add" element={<Protected><AddMovie /></Protected>} />
          <Route path="/movies/update/:id" element={<Protected><UpdateMovie /></Protected>} />
          <Route path="/movies/my-collection" element={<Protected><MyCollection /></Protected>} />
          <Route path="/watchlist" element={<Protected><Watchlist /></Protected>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}