import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import Loader from "../components/Loader";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function DashboardHome() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [myCollectionCount, setMyCollectionCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                // 1. Fetch Global Stats
                const { data: globalStats } = await api.get("/stats");
                setStats(globalStats);

                // 2. Fetch My Collection Count (if logged in)
                if (user) {
                    const token = await user.getIdToken();
                    const { data: myMovies } = await api.get("/movies/me/collection", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setMyCollectionCount(myMovies.length);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, [user]);

    if (loading) return <Loader />;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header>
                <h1 className="h1 mb-2">Welcome back, {user?.displayName || "User"}!</h1>
                <p className="text-slate-500">
                    Here's what's happening with the movie database today.
                </p>
            </header>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 border-l-4 border-l-primary">
                    <h3 className="text-lg font-semibold mb-1">My Collection</h3>
                    <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                        {myCollectionCount}
                    </p>
                    <p className="text-sm text-slate-500 mt-2">Movies added by you</p>
                </div>

                <div className="card p-6 border-l-4 border-l-emerald-500">
                    <h3 className="text-lg font-semibold mb-1">Total Movies</h3>
                    <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                        {stats?.totalMovies || 0}
                    </p>
                    <p className="text-sm text-slate-500 mt-2">In the global database</p>
                </div>

                <div className="card p-6 border-l-4 border-l-amber-500">
                    <h3 className="text-lg font-semibold mb-1">Total Users</h3>
                    <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                        {stats?.totalUsers || 0}
                    </p>
                    <p className="text-sm text-slate-500 mt-2">Registered members</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart: Release Year Distribution */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-4">Movies by Year</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.releaseYearDistribution || []}>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                    cursor={{ fill: "transparent" }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: Genre Distribution */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Genres</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats?.genreDistribution || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {(stats?.genreDistribution || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Movies Table */}
            <div className="card overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-lg font-semibold">Recently Added Movies</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3">Movie</th>
                                <th className="px-6 py-3">Genre</th>
                                <th className="px-6 py-3">Rating</th>
                                <th className="px-6 py-3">Year</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {(stats?.recentMovies || []).map((movie, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-3">
                                        <img src={movie.posterUrl} alt="" className="w-8 h-10 object-cover rounded bg-slate-200" />
                                        {movie.title}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{movie.genre}</td>
                                    <td className="px-6 py-4 text-slate-500">⭐ {movie.rating}</td>
                                    <td className="px-6 py-4 text-slate-500">{movie.releaseYear}</td>
                                </tr>
                            ))}
                            {(!stats?.recentMovies || stats.recentMovies.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                                        No movies found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
