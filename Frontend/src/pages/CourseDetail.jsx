import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Clock,
  Users,
  Star,
  Play,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  BookOpen,
  Award,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { mockCourses } from "../data/mockData";
import { fetchOneCourse } from "../config/api";
import { use } from "react";

function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [activeVideo, setActiveVideo] = useState(null);
  const [watchlistState, setWatchlistState] = useState([]);
  const userId = localStorage.getItem("userId");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const getYouTubeId = (url) => {
    const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
    return match ? match[1] : url;
  };
  useEffect(() => {
    const token = localStorage.getItem("token");

    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem(`watchlist_${userId}`)) || [];
    setWatchlistState(stored);
  }, []);

  const toggleWatchlist = (course) => {
    let watchlist = [...watchlistState];

    const exists = watchlist.find((item) => item._id === course._id);

    if (exists) {
      watchlist = watchlist.filter((item) => item._id !== course._id);
    } else {
      watchlist.push(course);
    }

    localStorage.setItem(`watchlist_${userId}`, JSON.stringify(watchlist));
    setWatchlistState(watchlist);
  };
  const isInWatchlist = () => {
    return watchlistState.some((item) => item._id === course._id);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);

        const data = await fetchOneCourse(slug);
        // لو الـ API بيرجع { course: {...} }
        // عدّل السطر الجاي حسب شكل الريسبونس
        setCourse(data.course || data);
      } catch (error) {
        console.error("Error fetching course:", error);
        setCourse(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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

  const getTotalLessons = () => {
    if (!course?.sections) return 0;
    return course.sections.reduce(
      (acc, section) => acc + (section.lessons?.length || 0),
      0,
    );
  };

  const getTotalDuration = () => {
    if (!course?.sections) return 0;
    return course.sections.reduce((acc, section) => {
      return (
        acc + (section.lessons?.reduce((a, l) => a + (l.duration || 0), 0) || 0)
      );
    }, 0);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen py-12">
        <div className="container-main text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Course not found
          </h1>
          <Link to="/courses" className="btn-primary">
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-foreground text-background py-12 md:py-16">
        <div className="container-main">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-background/70 hover:text-background mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Category */}
              {course.category && (
                <span className="text-primary font-medium mb-3 block">
                  {course.category.name}
                </span>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {course.title}
              </h1>

              {/* Description */}
              <p className="text-background/80 text-lg mb-6">
                {course.shortDescription}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className={getLevelBadgeClass(course.level)}>
                  {course.level}
                </span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-background/60">(2,456 reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-background/80">
                  <Users className="w-5 h-5" />
                  <span>{course.studentsCount?.toLocaleString()} students</span>
                </div>
              </div>

              {/* Author */}
              {course.author && (
                <p className="text-background/70">
                  Created by{" "}
                  <span className="text-background font-medium">
                    {course.author.name}
                  </span>
                </p>
              )}
            </div>

            {/* Course Card */}
            <div className="lg:col-span-1">
              <div className="bg-card text-foreground rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={
                    course.thumbnail ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop"
                  }
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-6">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </span>
                    {course.price > 0 && (
                      <span className="text-muted-foreground line-through">
                        ${(course.price * 1.5).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {isLoggedIn ? (
                    <button
                      className={`w-full px-4 py-2 rounded-lg font-medium transition ${
                        isInWatchlist()
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "btn-outline"
                      }`}
                      onClick={() => toggleWatchlist(course)}
                    >
                      {isInWatchlist()
                        ? "Added to Watchlist ✔"
                        : "Add to Watchlist"}
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="w-full inline-block text-center px-4 py-2 rounded-lg font-medium btn-primary"
                    >
                      Log in to add to Watchlist
                    </Link>
                  )}

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Award className="w-5 h-5 text-muted-foreground" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container-main">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* What You'll Learn */}
              <div className="bg-card rounded-xl p-6 border border-border mb-8">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  What You'll Learn
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "Master core concepts",
                    "Build real-world projects",
                    "Best practices and patterns",
                    "Industry-ready skills",
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Description
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {course.description || course.shortDescription}
                </p>
              </div>

              {/* Course Content */}
              {course.sections && course.sections.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Course Content
                  </h2>
                  {isLoggedIn ? (
                    <>
                      <div className="text-sm text-muted-foreground mb-4">
                        {course.sections.length} sections • {getTotalLessons()}{" "}
                        lessons • {formatDuration(getTotalDuration())} total
                        length
                      </div>
                      <div className="border border-border rounded-xl overflow-hidden">
                        {course.sections.map((section, index) => (
                          <div
                            key={index}
                            className="border-b border-border last:border-b-0"
                          >
                            <button
                              onClick={() => toggleSection(index)}
                              className="w-full flex items-center justify-between p-4 bg-card hover:bg-secondary/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {expandedSections[index] ? (
                                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                ) : (
                                  <div className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition cursor-pointer">
                                    <ChevronDown className="w-5 h-5 text-blue-500" />
                                  </div>
                                )}
                                <span className="font-medium text-foreground">
                                  {section.title}
                                </span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {section.lessons?.length || 0} lessons
                              </span>
                            </button>
                            {expandedSections[index] && section.lessons && (
                              <div className="bg-background">
                                {section.lessons.map((lesson, lessonIndex) => (
                                  <div
                                    key={lessonIndex}
                                    className="flex items-center gap-3 px-4 py-3 border-t border-border"
                                  >
                                    <button
                                      onClick={() =>
                                        setActiveVideo(lesson.videoUrl)
                                      }
                                      className="flex items-center gap-2 px-3 py-2 rounded-lg 
                                      bg-primary/10 hover:bg-primary/20 
                                      text-primary transition-all duration-200
                                      border border-primary/20 hover:border-primary/40"
                                    >
                                      <Play className="w-4 h-4" />
                                      <span className="text-sm font-medium">
                                        Watch Video
                                      </span>
                                    </button>
                                    <span className="flex-1 text-muted-foreground">
                                      {lesson.title}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {formatDuration(lesson.duration || 0)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="w-full inline-block text-center px-4 py-2 rounded-lg font-medium btn-primary"
                    >
                      Please log in to view course content
                    </Link>
                  )}
                </div>
              )}
              {activeVideo && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="w-full max-w-7xl h-[90vh] bg-black rounded-2xl overflow-hidden relative shadow-2xl">
                    {/* Close button */}
                    <button
                      onClick={() => setActiveVideo(null)}
                      className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 text-white w-10 h-10 rounded-full flex items-center justify-center"
                    >
                      ✕
                    </button>

                    {/* Video container */}
                    <div className="w-full h-full">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo)}?autoplay=1`}
                        className="w-full h-full"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Tags */}
            <div className="lg:col-span-1">
              {course.tags && course.tags.length > 0 && (
                <div className="bg-card rounded-xl p-6 border border-border">
                  <h3 className="font-semibold text-foreground mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CourseDetail;
