import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";
import MovieCard from "../components/MovieCard";

export default function AllMovies() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [total, setTotal] = useState(0);

  const [q, setQ] = useState("");
  const [genres, setGenres] = useState([]);
  const [minRating, setMinRating] = useState("");
  const [maxRating, setMaxRating] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  const GENRES = [
    "Action",
    "Drama",
    "Comedy",
    "Horror",
    "Sci-Fi",
    "Romance",
    "Thriller",
    "Animation",
  ];

  
  const toggleGenre = (g) => {
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };


  async function load() {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
        q: q || undefined,
        genres: genres.length ? genres.join(",") : undefined,
        minRating: minRating || undefined,
        maxRating: maxRating || undefined,
        yearFrom: yearFrom || undefined,
        yearTo: yearTo || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      };
      const res = await api.get("/movies", { params });
      setMovies(res.data.data || []);
      setTotal(Number(res.data.total || 0));
    } finally {
      setLoading(false);
    }
  }

  
  useEffect(() => {
    load();
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const applyFilters = async () => {
    setPage(1);
    await load();
  };
  const resetFilters = async () => {
    setQ("");
    setGenres([]);
    setMinRating("");
    setMaxRating("");
    setYearFrom("");
    setYearTo("");
    setPage(1);
    await load();
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="h1 mt-6 mb-4">All Movies</h1>

      
      <div className="card p-4 grid md:grid-cols-4 gap-3">
        <input
          className="input"
          placeholder="Search..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <input
          className="input"
          type="number"
          min={0}
          max={10}
          step="0.1"
          placeholder="Min rating"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        />

        <input
          className="input"
          type="number"
          min={0}
          max={10}
          step="0.1"
          placeholder="Max rating"
          value={maxRating}
          onChange={(e) => setMaxRating(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            className="input"
            type="number"
            placeholder="Year from"
            value={yearFrom}
            onChange={(e) => setYearFrom(e.target.value)}
          />
          <input
            className="input"
            type="number"
            placeholder="Year to"
            value={yearTo}
            onChange={(e) => setYearTo(e.target.value)}
          />
        </div>

        <div className="md:col-span-3 flex flex-wrap gap-2">
          {GENRES.map((g) => {
            const selected = genres.includes(g);
            return (
              <button
                key={g}
                type="button"
                onClick={() => toggleGenre(g)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    toggleGenre(g);
                  }
                }}
                aria-pressed={selected}
                className={`px-3 py-2 rounded-lg border transition shadow-sm
                  hover:shadow-md hover:shadow-slate-900/10 dark:hover:shadow-black/30
                  ${
                    selected
                      ? "bg-primary text-white border-primary"
                      : "border-slate-300 dark:border-slate-700 hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
                  }`}
              >
                {g}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button className="btn" onClick={applyFilters}>
            Apply
          </button>
          <button
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100/60 dark:hover:bg-slate-800/60"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </div>

      
      {loading ? (
        <div className="py-10">
          <Loader />
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {movies.map((m) => (
              <MovieCard key={m._id} movie={m} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 my-8">
            <button
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>
            <div className="px-4 py-2">{page}</div>
            <button
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-50"
              disabled={page * limit >= total}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

