import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out transform 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}
            >
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
                        <Link to="/" className="text-xl font-bold tracking-tight">
                            MovieMaster<span className="text-primary">Pro</span>
                        </Link>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1">
                        <SidebarLink to="/dashboard" end>Dashboard Home</SidebarLink>
                        <SidebarLink to="/dashboard/profile">My Profile</SidebarLink>
                        <SidebarLink to="/dashboard/my-collection">My Collection</SidebarLink>
                        <SidebarLink to="/dashboard/add-movie">Add Movie</SidebarLink>
                        <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                            <Link to="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                ← Back to Site
                            </Link>
                        </div>
                    </nav>

                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 lg:hidden">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="w-full btn btn-ghost"
                        >
                            Close Sidebar
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Navbar */}
                <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen((prev) => !prev)}
                        className="lg:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                        ☰
                    </button>

                    <div className="flex-1 lg:flex-none"></div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 focus:outline-none"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                    {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
                                </div>
                                <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-200">
                                    {user?.displayName || "User"}
                                </span>
                                <span className="text-xs text-slate-400">▼</span>
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800">
                                        <p className="text-sm font-medium truncate">{user?.displayName || "User"}</p>
                                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                    </div>
                                    <Link
                                        to="/dashboard/profile"
                                        className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        to="/dashboard"
                                        className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        Dashboard Home
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setProfileOpen(false);
                                            handleLogout();
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Backdrop for dropdown */}
                        {isProfileOpen && (
                            <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)}></div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

function SidebarLink({ to, children, end = false }) {
    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors
        ${isActive
                    ? "bg-primary text-white shadow-sm shadow-primary/30"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                }`
            }
        >
            {children}
        </NavLink>
    );
}
