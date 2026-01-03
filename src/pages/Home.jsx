import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import MovieCard from "../components/MovieCard";
import { useAuth } from "../hooks/useAuth";
import Loader from "../components/Loader";
import Hero from "../components/Hero";
import Skeleton from "../components/Skeleton";
import MovieCardSkeleton from "../components/MovieCardSkeleton";


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



  const genres = useMemo(
    () => ["Action", "Drama", "Comedy", "Horror", "Sci-Fi", "Romance", "Thriller", "Animation"],
    []
  );

  if (loading) {
    return (
      <div className="container">
        {/* Hero Skeleton (approx height) */}
        <Skeleton className="w-full h-[60vh] mt-6 mb-12" />

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>

        {/* Section Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Hero */}
      {/* Hero */}
      <Hero movies={featured} />

      {/* Stats */}
      <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total Movies" value={Number(stats.totalMovies) || 0} />
        <Stat label="Total Users" value={Number(stats.totalUsers) || 0} />
        <Stat label="Top Rated" value={top.length} />
        <Stat label="Recently Added" value={recent.length} />
      </section>

      {/* Features */}
      <Features />

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

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

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

      {/* Newsletter */}
      <Newsletter />
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

function Features() {
  const features = [
    { title: "Track Watchlist", icon: "📝", desc: "Keep a list of movies you want to see." },
    { title: "Personal Collection", icon: "💿", desc: "Manage your own library of favorites." },
    { title: "Community Reviews", icon: "⭐", desc: "See what others are saying." },
    { title: "Dark Mode", icon: "🌙", desc: "Easy on the eyes, day or night." },
  ];
  return (
    <Section title="Features">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <div key={i} className="card p-5 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
            <div className="text-3xl mb-2">{f.icon}</div>
            <h3 className="font-bold mb-1">{f.title}</h3>
            <p className="text-sm muted">{f.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Testimonials() {
  const reviews = [
    { user: "Sarah J.", text: "The best app for tracking my movie addiction! Love the clean design." },
    { user: "Mike T.", text: "Finally replaced my spreadsheet. MovieMaster Pro is exactly what I needed." },
    { user: "Emily R.", text: "Great community features and I love the dark mode support." },
  ];
  return (
    <Section title="What Users Say">
      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <div key={i} className="card p-6">
            <div className="flex gap-1 text-yellow-500 mb-2">★★★★★</div>
            <p className="mb-4 italic opacity-90">"{r.text}"</p>
            <div className="font-bold text-sm text-right">- {r.user}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Is it free to use?", a: "Yes, creating an account and tracking movies is completely free." },
    { q: "Can I import my data?", a: "We are working on import features from other popular platforms." },
    { q: "How do I add a movie?", a: "Once logged in, click 'Add Movie' in the navigation bar." },
  ];
  return (
    <Section title="Frequently Asked Questions">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {faqs.map((f, i) => (
          <div key={i} className="card p-5 text-left">
            <h3 className="font-bold mb-2 text-lg">{f.q}</h3>
            <p className="muted">{f.a}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const subscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert(`Thanks for subscribing with ${email}!`);
      setEmail("");
    }
  };
  return (
    <section className="mt-16 mb-8 card p-8 sm:p-12 text-center bg-gradient-to-br from-primary/10 to-transparent">
      <h2 className="h2 mb-4">Stay Included</h2>
      <p className="muted max-w-md mx-auto mb-6">
        Get the latest movie news, trending lists, and feature updates delivered to your inbox.
      </p>
      <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn">Subscribe</button>
      </form>
    </section>
  );
}