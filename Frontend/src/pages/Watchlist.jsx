import { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import { Link } from "react-router-dom";

function Watchlist() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const data = JSON.parse(localStorage.getItem(`watchlist_${userId}`)) || [];
    setWatchlist(data);
  }, []);

  return (
    <div className="container-main py-12">
      <h1 className="text-3xl font-bold mb-6">My Watchlist</h1>

      {watchlist.length === 0 ? (
        <>
          <p className="text-muted-foreground text-lg">
            No courses in watchlist yet. Start exploring and add some!
          </p>

          <Link to="/courses" className="btn-primary px-6 inline-block mt-6">
            Add some courses
          </Link>
        </>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
          <Link to="/courses" className="btn-primary px-6 inline-block mt-6">
            Add More courses
          </Link>
        </>
      )}
    </div>
  );
}

export default Watchlist;
