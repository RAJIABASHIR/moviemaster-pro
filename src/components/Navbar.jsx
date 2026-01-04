import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const baseItem =
    "px-3 py-2 rounded-xl text-sm transition-colors duration-150 focus:outline-none " +
    "focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900";

  const NavItem = ({ to, end = false, children, className = "" }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        (isActive
          ? `${baseItem} bg-primary text-white shadow-sm`
          : `${baseItem} text-slate-700 dark:text-slate-200 
              hover:bg-slate-100/60 dark:hover:bg-slate-800/60 
              hover:text-slate-900 dark:hover:text-white`) + " " + className
      }
      onClick={() => setOpen(false)}
    >
      {children}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-950/50">
      <nav className="container h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          MovieMaster<span className="text-primary">Pro</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <NavItem to="/" end>Home</NavItem>
          <NavItem to="/movies" end>All Movies</NavItem>
          <NavItem to="/about">About</NavItem>
          {user && <NavItem to="/dashboard">Dashboard</NavItem>}
          {user && <NavItem to="/movies/add">Add Movie</NavItem>}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <span className="hidden sm:block text-sm text-slate-600 dark:text-slate-300">
                {user.displayName || user.email}
              </span>
              <button className="btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn">Register</Link>
            </div>
          )}
          <button
            className="md:hidden px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 
                       hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
          >
            ☰
          </button>
        </div>
      </nav>

      {
        open && (
          <div className="md:hidden border-t border-slate-200/70 dark:border-slate-800/60">
            <div className="container py-3 flex flex-col gap-2">
              <NavItem to="/" end className="py-3">Home</NavItem>
              <NavItem to="/movies" end className="py-3">All Movies</NavItem>
              <NavItem to="/about" className="py-3">About</NavItem>
              {user && <NavItem to="/dashboard" className="py-3">Dashboard</NavItem>}
              {user && <NavItem to="/movies/add" className="py-3">Add Movie</NavItem>}
              {!user && (
                <>
                  <NavItem to="/login" className="py-3">Login</NavItem>
                  <NavItem to="/register" className="py-3">Register</NavItem>
                </>
              )}
            </div>
          </div>
        )
      }
    </header >
  );
}