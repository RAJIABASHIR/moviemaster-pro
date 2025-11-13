import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import MovieCard from "../components/MovieCard";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/Loader";


const POSTER_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='420'>
       <rect fill='#1f2937' width='100%' height='100%'/>
       <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
             fill='white' font-size='28' font-family='system-ui, -apple-system, Segoe UI, Roboto, sans-serif'>
         No Poster
       </text>
     </svg>`
  );

export default function Home() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalMovies: 0, totalUsers: 0 });
  const [top, setTop] = useState([]);
  const [recent, setRecent] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [s, t, r] = await Promise.allSettled([
          api.get("/stats"),
          api.get("/movies/top-rated?limit=5"),
          api.get("/movies/recent?limit=6"),
        ]);

        if (!mounted) return;

        if (s.status === "fulfilled") {
          setStats({
            totalMovies: Number(s.value.data?.totalMovies) || 0,
            totalUsers: Number(s.value.data?.totalUsers) || 0,
          });
        } else {
          setStats({ totalMovies: 0, totalUsers: 0 });
          console.warn("Stats failed:", s.reason);
        }

        const topData = t.status === "fulfilled" ? (t.value.data || []) : [];
        const recentData = r.status === "fulfilled" ? (r.value.data || []) : [];
        if (t.status !== "fulfilled") console.warn("Top rated failed:", t.reason);
        if (r.status !== "fulfilled") console.warn("Recent failed:", r.reason);

        setTop(topData);
        setRecent(recentData);

        const feat = recentData.length ? recentData : topData;
        setFeatured(feat);
        setIdx(0);
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!featured.length) return;
    const id = setInterval(() => setIdx(i => (i + 1) % featured.length), 4000);
    return () => clearInterval(id);
  }, [featured]);

  const genres = useMemo(
    () => ["Action","Drama","Comedy","Horror","Sci-Fi","Romance","Thriller","Animation"],
    []
  );

  if (loading) {
    return (
      <div className="container">
        <section className="mt-6">
          <div className="card p-10 text-center">
            <Loader />
            <p className="muted mt-4">Loading…</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Hero */}
      <section className="mt-6">
        {featured.length ? (
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={featured[idx]?.posterUrl || POSTER_FALLBACK}
              alt={featured[idx]?.title || "Featured movie"}
              className="w-full h-[420px] object-cover"
              loading="lazy"
              onError={(e) => {
                if (e.currentTarget.src !== POSTER_FALLBACK) {
                  e.currentTarget.src = POSTER_FALLBACK;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 p-6 sm:p-8 text-white">
              <h1 className="h1 mb-2">{featured[idx]?.title || "Featured"}</h1>
              <p className="max-w-xl opacity-90">
                {(featured[idx]?.plotSummary || "").slice(0, 160)}
                {(featured[idx]?.plotSummary || "").length > 160 ? "..." : ""}
              </p>
              <div className="mt-4 flex gap-2">
                {featured[idx]?._id && (
                  <Link to={`/movies/${featured[idx]._id}`} className="btn">View Details</Link>
                )}
                <Link to="/movies" className="btn-outline">Browse All</Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-10 text-center">
            <h1 className="h1 mb-2">Welcome to MovieMaster Pro</h1>
            <p className="muted mb-6">No featured movies yet. Add your first movie to get started.</p>
            <div className="flex gap-2 justify-center">
              {user ? (
                <Link to="/movies/add" className="btn">Add a Movie</Link>
              ) : (
                <Link to="/register" className="btn">Create Account</Link>
              )}
              <Link to="/movies" className="btn-outline">Browse</Link>
            </div>
          </div>
        )}
      </section>

      {/* Stats */}
      <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total Movies" value={Number(stats.totalMovies) || 0} />
        <Stat label="Total Users" value={Number(stats.totalUsers) || 0} />
        <Stat label="Top Rated" value={top.length} />
        <Stat label="Recently Added" value={recent.length} />
      </section>

      {/* Top Rated */}
      <div className="text-center">
      <Section title="Top Rated Movies">
        {top.length ? (
          <Grid>{top.map(m => <MovieCard key={m._id} movie={m} />)}</Grid>
        ) : (
          <EmptyRow text="No top rated movies yet." />
        )}
      </Section>
       </div>
      {/* Recently Added */}
      <div className="text-center">
      <Section title="Recently Added">
        {recent.length ? (
          <Grid>{recent.map(m => <MovieCard key={m._id} movie={m} />)}</Grid>
        ) : (
          <EmptyRow text="No recent movies yet." />
        )}
      </Section>
      </div>
{/* Genres */}
<div className="text-center">
<Section title="Genres">
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
    {genres.map(g => (
      <div
        key={g}
        className="card p-4 text-center cursor-pointer
                   transition-all duration-200
                   hover:shadow-lg hover:-translate-y-0.5
                   hover:ring-1 hover:ring-primary/30"
      >
        {g}
      </div>
    ))}
  </div>
</Section>
</div>


      {/* About */}
      <div className="text-center">
      <Section title="About MovieMaster Pro">
        <p className="max-w-3xl mx-auto text-left leading-relaxed muted">
      MovieMaster Pro lets you browse, filter, and organize your favorite films.
      Build personal collections, maintain a watchlist, and discover top rated and
      recent titles with a clean, responsive UI.
    </p>
     </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-12">
      <h2 className="h2 mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{children}</div>;
}

function Stat({ label, value }) {
  return (
    <div className="card p-5 text-center">
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm muted mt-1">{label}</div>
    </div>
  );
}

function EmptyRow({ text }) {
  return <div className="card p-6 text-center muted">{text}</div>;
}