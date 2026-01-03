
export default function About() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="h1 mb-4">About MovieMaster Pro</h1>
        <p className="text-lg muted max-w-2xl mx-auto">
          Your ultimate destination for discovering, organizing, and tracking your favorite movies.
        </p>
      </div>

      <div className="card p-8 mb-8">
        <h2 className="h2 mb-4">Our Mission</h2>
        <p className="muted leading-relaxed mb-6">
          MovieMaster Pro was built with a simple goal: to help movie enthusiasts keep track of what they've watched
          and discover new favorites. We believe that organizing your movie collection should be as enjoyable as
          watching the movies themselves.
        </p>
        <p className="muted leading-relaxed">
          Whether you're a casual viewer or a dedicated cinephile, MovieMaster Pro provides the tools you need
          to curate your personal library, manage your watchlist, and share your passion for cinema.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="text-4xl mb-4">🎬</div>
          <h3 className="h3 mb-2">Discover</h3>
          <p className="text-sm muted">
            Explore thousands of movies, from latest releases to timeless classics.
          </p>
        </div>
        <div className="card p-6 text-center">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="h3 mb-2">Organize</h3>
          <p className="text-sm muted">
            Create your personal collection and keep track of everything you've watched.
          </p>
        </div>
        <div className="card p-6 text-center">
          <div className="text-4xl mb-4">⭐</div>
          <h3 className="h3 mb-2">Rate & Review</h3>
          <p className="text-sm muted">
            Share your thoughts and ratings with the community to help others decide.
          </p>
        </div>
      </div>
    </div>
  );
}
