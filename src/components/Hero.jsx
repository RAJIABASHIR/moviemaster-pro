import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

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

export default function Hero({ movies = [] }) {
    const { user } = useAuth();
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (!movies.length || paused) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % movies.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [movies.length, paused]);

    if (!movies.length) {
        return (
            <div className="bg-slate-900 h-[60vh] flex items-center justify-center text-center p-6 relative overflow-hidden">
                {/* Background pattern or subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black z-0" />
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
                        Welcome to MovieMaster Pro
                    </h1>
                    <p className="text-slate-300 text-lg mb-8">
                        Discover, track, and curate your personal movie collection.
                    </p>
                    <div className="flex gap-4 justify-center">
                        {user ? (
                            <Link to="/movies/add" className="btn text-lg px-8 py-3 bg-primary hover:bg-primary/90">
                                Add Your First Movie
                            </Link>
                        ) : (
                            <Link to="/register" className="btn text-lg px-8 py-3 bg-primary hover:bg-primary/90">
                                Get Started
                            </Link>
                        )}
                        <Link to="/movies" className="btn-outline text-lg px-8 py-3 text-white border-white hover:bg-white/10">
                            Browse Library
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handlePrev = () => {
        setCurrent((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrent((prev) => (prev + 1) % movies.length);
    };

    return (
        <div
            className="relative h-[65vh] w-full overflow-hidden mb-12 group"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Slides */}
            {movies.map((movie, index) => (
                <div
                    key={movie._id || index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <img
                            src={movie.posterUrl || POSTER_FALLBACK}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                if (e.currentTarget.src !== POSTER_FALLBACK) e.currentTarget.src = POSTER_FALLBACK;
                            }}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/30" />
                    </div>

                    {/* Content */}
                    <div className="container relative h-full flex items-end pb-20 sm:pb-24">
                        <div className="max-w-3xl animate-slide-up">
                            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-white uppercase bg-primary/80 rounded-full backdrop-blur-sm">
                                Featured
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                                {movie.title}
                            </h1>
                            <p className="text-lg md:text-xl text-slate-200 line-clamp-2 md:line-clamp-3 mb-8 max-w-2xl drop-shadow-md">
                                {movie.plotSummary}
                            </p>
                            <div className="flex gap-4">
                                <Link to={`/movies/${movie._id}`} className="btn bg-primary hover:bg-primary/90 text-white border-none text-lg px-8 py-3 shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all">
                                    View Details
                                </Link>
                                <Link to="/movies" className="btn bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 text-lg px-8 py-3 hover:-translate-y-1 transition-all">
                                    Browse All
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Controls */}
            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:border-primary disabled:opacity-50"
                aria-label="Previous slide"
            >
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>

            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:border-primary"
                aria-label="Next slide"
            >
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {movies.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? "bg-primary w-8" : "bg-white/40 hover:bg-white/80"
                            }`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>

            {/* Scroll Hint */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white/50">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
        </div>
    );
}
