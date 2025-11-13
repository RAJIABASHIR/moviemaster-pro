import { Link } from "react-router-dom";

export default function MovieCard({ movie, children }) {
  return (
    <div className="card flex flex-col">
      <img src={movie.posterUrl} alt={movie.title} className="poster" />
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-1">{movie.title}</h3>
        <p className="text-sm text-slate-500 mb-2">{movie.genre} • {movie.releaseYear}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">⭐ {movie.rating}</p>
        <div className="mt-auto flex gap-2">
          <Link to={`/movies/${movie._id}`} className="btn w-full">Details</Link>
          {children}
        </div>
      </div>
    </div>
  );
}