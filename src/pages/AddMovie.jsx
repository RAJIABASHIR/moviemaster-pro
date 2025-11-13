import { useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddMovie() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    genre: "",
    releaseYear: "",
    director: "",
    cast: "",
    rating: "",
    duration: "",
    plotSummary: "",
    posterUrl: "",
    language: "English",
    country: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

  const validate = () => {
    const title = form.title.trim();
    if (!title) return "Title is required";

    if (form.releaseYear !== "") {
      const y = Number(form.releaseYear);
      if (!Number.isInteger(y) || y < 1888 || y > 2100) return "Release year must be 1888–2100";
    }
    if (form.rating !== "") {
      const r = Number(form.rating);
      if (Number.isNaN(r) || r < 0 || r > 10) return "Rating must be 0–10";
    }
    if (form.duration !== "") {
      const d = Number(form.duration);
      if (Number.isNaN(d) || d < 0) return "Duration must be a non-negative number";
    }
    if (form.posterUrl.trim() && !/^https?:\/\//i.test(form.posterUrl.trim())) {
      return "Poster URL must start with http:// or https://";
    }
    return null;
  };

  const buildPayload = () => {
    const p = {
      title: form.title.trim(),
      genre: form.genre.trim() || undefined,
      director: form.director.trim() || undefined,
      cast: form.cast.trim() || undefined,
      plotSummary: form.plotSummary.trim() || undefined,
      posterUrl: form.posterUrl.trim() || undefined,
      language: form.language.trim() || undefined,
      country: form.country.trim() || undefined,
      releaseYear: form.releaseYear !== "" ? Number(form.releaseYear) : undefined,
      rating: form.rating !== "" ? Number(form.rating) : undefined,
      duration: form.duration !== "" ? Number(form.duration) : undefined,
    };

    return p;
  };

  async function submit(e) {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    try {
      setLoading(true);
      const res = await api.post("/movies", buildPayload());
      toast.success("Movie added");
      nav(`/movies/${res.data._id}`);
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        e.response?.data?.error ||
        (Array.isArray(e.response?.data?.errors) && e.response.data.errors.join(", ")) ||
        e.message;
      toast.error(msg);
      console.error("POST /movies failed:", e.response?.data || e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 card mt-6">
      <h1 className="h2 mb-4">Add Movie</h1>

  <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
  {/* Title */}
  <Field label="Title">
    <input
      className="input w-full"
      placeholder=""
      required
      value={form.title}
      onChange={(e) => set("title", e.target.value)}
    />
  </Field>
  <Field label="Genre">
    <input
      className="input w-full"
      placeholder=""
      value={form.genre}
      onChange={(e) => set("genre", e.target.value)}
      list="genre-list"
    />
    <datalist id="genre-list">
      <option>Action</option><option>Drama</option><option>Comedy</option>
      <option>Horror</option><option>Sci-Fi</option><option>Romance</option>
      <option>Thriller</option><option>Animation</option><option>Crime</option>
      <option>Adventure</option><option>Fantasy</option><option>Documentary</option>
    </datalist>
  </Field>
  <Field label="Release Year">
    <input
      className="input w-full"
      type="number"
      min="1888"
      max="2100"
      placeholder=""
      value={form.releaseYear}
      onChange={(e) => set("releaseYear", e.target.value)}
    />
  </Field>

  
  <Field label="Rating (0–10)">
    <input
      className="input w-full"
      type="number"
      step="0.1"
      min="0"
      max="10"
      placeholder=""
      value={form.rating}
      onChange={(e) => set("rating", e.target.value)}
    />
  </Field>

  
  <Field label="Director">
    <input
      className="input w-full"
      placeholder=""
      value={form.director}
      onChange={(e) => set("director", e.target.value)}
    />
  </Field>

  
  <Field label="Cast">
    <input
      className="input w-full"
      placeholder=""
      value={form.cast}
      onChange={(e) => set("cast", e.target.value)}
    />
  </Field>

  
  <Field label="Duration (min)">
    <input
      className="input w-full"
      type="number"
      min="0"
      placeholder=""
      value={form.duration}
      onChange={(e) => set("duration", e.target.value)}
    />
  </Field>

  
<Field label="Language">
  <input
    className="input w-full"
    placeholder=""
    onChange={(e) => set("language", e.target.value)}
    list="lang-list"
  />
  <datalist id="lang-list">
    <option>English</option><option>Spanish</option><option>French</option>
    <option>German</option><option>Hindi</option><option>Bengali</option>
    <option>Chinese</option><option>Japanese</option><option>Korean</option>
    <option>Arabic</option>
  </datalist>
</Field>

  
  <Field label="Country">
    <input
      className="input w-full"
      placeholder=""
      value={form.country}
      onChange={(e) => set("country", e.target.value)}
    />
  </Field>

  
  <div className="md:col-span-2">
    <Field label="Poster URL">
      <input
        className="input w-full"
        type="url"
        placeholder=""
        value={form.posterUrl}
        onChange={(e) => set("posterUrl", e.target.value)}
      />
    </Field>
  </div>

  
  <div className="md:col-span-2">
    <Field label="Plot Summary">
      <textarea
        className="input w-full"
        rows="4"
        maxLength={600}
        placeholder=""
        value={form.plotSummary}
        onChange={(e) => set("plotSummary", e.target.value)}
      />
      <div className="mt-1 text-xs muted">
        {(form.plotSummary || "")}
      </div>
    </Field>
  </div>

  <button className="btn md:col-span-2 justify-center" disabled={loading}>
    {loading ? "Saving..." : "Submit"}
  </button>
</form>
</div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}


