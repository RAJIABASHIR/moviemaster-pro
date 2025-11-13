import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto p-6 text-center mt-16">
      <h1 className="mb-2">404</h1>
      <p className="mb-6">Page not found.</p>
      <Link to="/" className="btn">Go Home</Link>
    </div>
  );
}