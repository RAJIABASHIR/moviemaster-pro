import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateMovie() {
  const { id } = useParams(); const nav = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  function set(k, v) { setForm(s => ({ ...s, [k]: v })); }

  useEffect(() => {
    api.get(`/movies/${id}`).then(res => setForm(res.data));
  }, [id]);

  if (!form) return null;

  async function submit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...form,
        addedByEmail: undefined,
        addedByUid: undefined,
      };
      const res = await api.put(`/movies/${id}`, payload);
      toast.success("Updated");
      nav(`/movies/${res.data._id}`);
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 card mt-6">
      <h1 className="mb-4">Update Movie</h1>
     <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
  {/* Title */}
  <Field label="Title">
    <input
      className="input w-full"
      placeholder="e.g., The Dark Knight"
      value={form.title}
      onChange={(e) => set("title", e.target.value)}
      autoComplete="off"
    />
  </Field>

  {/* Genre (with quick suggestions) */}
  <Field label="Genre">
    <input
      className="input w-full"
      placeholder="e.g., Action"
      value={form.genre}
      onChange={(e) => set("genre", e.target.value)}
      list="genre-list"
      autoComplete="off"
    />
    <datalist id="genre-list">
      <option>Action</option><option>Drama</option><option>Comedy</option>
      <option>Horror</option><option>Sci-Fi</option><option>Romance</option>
      <option>Thriller</option><option>Animation</option><option>Crime</option>
      <option>Adventure</option><option>Fantasy</option><option>Documentary</option>
    </datalist>
  </Field>

  {/* Release Year */}
  <Field label="Release Year">
    <input
      className="input w-full"
      type="number"
      min="1888"
      max="2100"
      placeholder="e.g., 2008"
      value={form.releaseYear}
      onChange={(e) => set("releaseYear", e.target.value)}
      inputMode="numeric"
    />
  </Field>

  {/* Rating */}
  <Field label="Rating (0–10)">
    <input
      className="input w-full"
      type="number"
      step="0.1"
      min="0"
      max="10"
      placeholder="e.g., 8.8"
      value={form.rating}
      onChange={(e) => set("rating", e.target.value)}
      inputMode="decimal"
    />
  </Field>

  {/* Director */}
  <Field label="Director">
    <input
      className="input w-full"
      placeholder="e.g., Christopher Nolan"
      value={form.director}
      onChange={(e) => set("director", e.target.value)}
      autoComplete="off"
    />
  </Field>

  {/* Cast */}
  <Field label="Cast">
    <input
      className="input w-full"
      placeholder="Comma-separated: Actor 1, Actor 2"
      value={form.cast}
      onChange={(e) => set("cast", e.target.value)}
      autoComplete="off"
    />
  </Field>

  {/* Duration */}
  <Field label="Duration (min)">
    <input
      className="input w-full"
      type="number"
      min="0"
      placeholder="e.g., 152"
      value={form.duration}
      onChange={(e) => set("duration", e.target.value)}
      inputMode="numeric"
    />
  </Field>

  {/* Language */}
  <Field label="Language">
    <input
      className="input w-full"
      placeholder="e.g., English"
      value={form.language}
      onChange={(e) => set("language", e.target.value)}
      list="lang-list"
      autoComplete="off"
    />
    <datalist id="lang-list">
      <option>English</option><option>Spanish</option><option>French</option>
      <option>German</option><option>Hindi</option><option>Bengali</option>
      <option>Chinese</option><option>Japanese</option><option>Korean</option>
      <option>Arabic</option>
    </datalist>
  </Field>

  {/* Country */}
  <Field label="Country">
    <input
      className="input w-full"
      placeholder="e.g., USA"
      value={form.country}
      onChange={(e) => set("country", e.target.value)}
      autoComplete="off"
    />
  </Field>

  {/* Poster URL */}
  <div className="md:col-span-2">
    <Field label="Poster URL">
      <input
        className="input w-full"
        type="url"
        placeholder="https://example.com/poster.jpg"
        value={form.posterUrl}
        onChange={(e) => set("posterUrl", e.target.value)}
        autoComplete="off"
      />
    </Field>
  </div>

  {/* Plot Summary */}
  <div className="md:col-span-2">
    <Field label="Plot Summary">
      <textarea
        className="input w-full"
        rows="4"
        placeholder="Short synopsis…"
        value={form.plotSummary}
        onChange={(e) => set("plotSummary", e.target.value)}
      />
    </Field>
  </div>

  <button className="btn md:col-span-2 justify-center" disabled={loading}>
    {loading ? "Saving…" : "Save"}
  </button>
</form>

      <p className="text-sm text-slate-500 mt-3">Added by: {form.addedByEmail}</p>
    </div>
  );
}
function Field({ label, children }) {
  return <div><label className="label">{label}</label>{children}</div>;
}