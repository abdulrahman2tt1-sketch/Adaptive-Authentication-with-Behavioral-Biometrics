import { useWatchlist } from "../context/WatchlistContext";

const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <div>
      <h1>My Watchlist</h1>

      {watchlist.length === 0 ? (
        <p>No courses yet</p>
      ) : (
        watchlist.map((course) => (
          <div key={course.id}>
            <h3>{course.title}</h3>

            <button onClick={() => removeFromWatchlist(course.id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Watchlist;
