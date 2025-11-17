import { useEffect, useState } from "react";
import AuthProvider from "../context/AuthProvider";   
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

export default function MovieDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    api.get(`/movies/${id}`).then(res => setMovie(res.data)).catch(()=>{});
  }, [id]);

  if (!movie) return <Loader />;
  const isOwner = user?.uid && user.uid === movie.addedByUid;

  async function del() {
    try {
      await api.delete(`/movies/${id}`);
      toast.success("Deleted");
      nav("/movies");
    } catch (e) {
      toast.error(e.response?.data?.message || e.message);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 mt-6">
      <div className="grid md:grid-cols-2 gap-6">
        <img src={movie.posterUrl} alt={movie.title} className="w-full rounded-2xl" />
        <div className="card p-4">
          <h1 className="mb-2">{movie.title}</h1>
          <p className="text-slate-500 mb-3">{movie.genre} • {movie.releaseYear} • ⭐ {movie.rating}</p>
          <p className="mb-2"><b>Director:</b> {movie.director}</p>
          <p className="mb-2"><b>Cast:</b> {movie.cast}</p>
          <p className="mb-2"><b>Language:</b> {movie.language}</p>
          <p className="mb-2"><b>Country:</b> {movie.country}</p>
          <p className="mb-4">{movie.plotSummary}</p>
          {isOwner && (
            <div className="flex gap-2">
              <Link to={`/movies/update/${movie._id}`} className="btn">Edit</Link>
              <button className="px-4 py-2 rounded-xl border" onClick={()=>setOpen(true)}>Delete</button>
            </div>
          )}
        </div>
      </div>
      <ConfirmModal
        open={open}
        title="Delete movie?"
        message="This action cannot be undone."
        onConfirm={del}
        onCancel={()=>setOpen(false)}
      />
    </div>
  );
}
