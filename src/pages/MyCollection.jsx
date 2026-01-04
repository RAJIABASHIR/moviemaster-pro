import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import api from "../api/axios";
import Loader from "../components/Loader";
import MovieCardSkeleton from "../components/MovieCardSkeleton";
import toast from "react-hot-toast";

export default function MyCollection() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }
      // ⬇️ use the token directly here
      const token = await user.getIdToken();
      const { data } = await api.get("/movies/me/collection", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(data || []);
    } catch (e) {
      // If token is stale, force refresh once
      if (e?.response?.status === 401 && auth.currentUser) {
        try {
          const fresh = await auth.currentUser.getIdToken(true);
          const { data } = await api.get("/movies/me/collection", {
            headers: { Authorization: `Bearer ${fresh}` },
          });
          setItems(data || []);
        } catch (e2) {
          console.error(e2);
          toast.error("Failed to load your collection.");
          setItems([]);
        }
      } else {
        console.error(e);
        toast.error("Failed to load your collection.");
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Re-run when auth state changes
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/login");
      else load();
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(idMaybe) {
    const id = idMaybe ?? null;
    if (!id) return toast.error("Missing movie id");

    try {
      const user = auth.currentUser;
      if (!user) return navigate("/login");
      const token = await user.getIdToken();
      await api.delete(`/movies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");
      load();
    } catch (e) {
      console.error(e);
      toast.error("Delete failed.");
    }
  }

  if (loading || !items) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="mt-6 mb-4">My Collection</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="mt-6 mb-4">My Collection</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((m) => {
          const id = m.id ?? m._id; // support either shape
          return (
            <div key={id} className="card p-3 flex flex-col">
              <img src={m.posterUrl} alt={m.title} className="poster" />
              <div className="mt-3 font-semibold">{m.title}</div>
              <div className="text-sm text-slate-500">
                {m.genre} • {m.releaseYear}
              </div>
              <div className="mt-auto flex gap-2">
                <Link to={`/dashboard/update-movie/${id}`} className="btn w-full">
                  Edit
                </Link>
                <button
                  className="px-4 py-2 rounded-xl border w-full"
                  onClick={() => remove(id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
