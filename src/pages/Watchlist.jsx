import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";
import MovieCard from "../components/MovieCard";
import toast from "react-hot-toast";

export default function Watchlist() {
  const [wl, setWl] = useState(null);
  async function load() {
    const res = await api.get("/watchlist");
    setWl(res.data);
  }
  useEffect(()=>{ load(); }, []);

  async function remove(movieId) {
    await api.delete(`/watchlist/${movieId}`);
    toast.success("Removed");
    load();
  }

  if (!wl) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="mt-6 mb-4">My Watchlist</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wl.movieIds?.map(m => (
          <MovieCard key={m._id} movie={m}>
            <button className="px-4 py-2 rounded-xl border" onClick={()=>remove(m._id)}>Remove</button>
          </MovieCard>
        ))}
      </div>
    </div>
  );
}