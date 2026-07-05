import { Link } from "react-router-dom";
import { Users, Clock, Star } from "lucide-react";

function CourseCard({ course }) {
  const getLevelBadgeClass = (level) => {
    switch (level) {
      case "beginner":
        return "badge-beginner";
      case "intermediate":
        return "badge-intermediate";
      case "advanced":
        return "badge-advanced";
      default:
        return "badge-beginner";
    }
  };

  const formatStudents = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count;
  };

  return (
    <Link to={`/courses/${course.slug}`} className="card-course group block">
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={
            course.thumbnail ||
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop"
          }
          alt={course.title}
          className="text-bony-500 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={getLevelBadgeClass(course.level)}>
            {course.level}
          </span>
        </div>
        {course.price === 0 && (
          <div className="absolute top-3 right-3">
            <span className="badge-level bg-accent text-accent-foreground">
              Free
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        {course.category && (
          <p className="text-primary text-sm font-medium mb-2">
            {course.category.name}
          </p>
        )}

        {/* Title */}
        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {course.shortDescription}
        </p>

        {/* Author */}
        {course.author && (
          <p className="text-sm text-muted-foreground mb-3">
            By {course.author.name}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{formatStudents(course.studentsCount)} students</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>4.8</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-xl font-bold text-foreground">
            {course.price === 0 ? "Free" : `$${course.price}`}
          </span>
          <span className="text-primary font-medium text-sm group-hover:underline">
            View Course →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;
