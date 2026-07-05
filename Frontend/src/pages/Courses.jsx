import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { mockCourses, mockCategories } from "../data/mockData";
import { fetchCategories, fetchCourses } from "../config/api";

function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );
  const [selectedLevel, setSelectedLevel] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [coursesData, categoriesData] = await Promise.all([
          fetchCourses(),
          fetchCategories(),
        ]);

        setCourses(coursesData.data || coursesData);
        setCategories(categoriesData.data || categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.shortDescription
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || course.category?.slug === selectedCategory;
    const matchesLevel = !selectedLevel || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedLevel("");
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedLevel;

  // animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="py-8 md:py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container-main">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            All Courses
          </h1>
          <p className="text-muted-foreground">
            Discover our collection of {courses.length}+ courses
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden btn-outline flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>

            {/* Filters (Desktop) */}
            <div className="hidden md:flex gap-4 ">
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="input-field w-48"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.slug} className=" ">
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="input-field w-40"
              >
                <option value="">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="md:hidden mt-4 p-4 bg-card rounded-lg border border-border"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="input-field w-full"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Level
                    </label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="input-field w-full"
                    >
                      <option value="">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery("")}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  {categories.find((c) => c.slug === selectedCategory)?.name}
                  <button onClick={() => handleCategoryChange("")}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              {selectedLevel && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm capitalize">
                  {selectedLevel}
                  <button onClick={() => setSelectedLevel("")}>
                    <X className="w-4 h-4" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-destructive hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
        </motion.div>

        {/* Results */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredCourses.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-20 h-20 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No courses found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              Showing {filteredCourses.length}{" "}
              {filteredCourses.length === 1 ? "course" : "courses"}
            </p>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {filteredCourses.map((course) => (
                <motion.div key={course._id} variants={cardVariants}>
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default Courses;

// import { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { Search, Filter, X } from "lucide-react";
// import CourseCard from "../components/CourseCard";
// import LoadingSpinner from "../components/LoadingSpinner";
// import { mockCourses, mockCategories } from "../data/mockData";
// import { fetchCategories, fetchCourses } from "../config/api";

// function Courses() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [courses, setCourses] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState(
//     searchParams.get("category") || "",
//   );
//   const [selectedLevel, setSelectedLevel] = useState("");
//   const [showFilters, setShowFilters] = useState(false);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const [coursesData, categoriesData] = await Promise.all([
//           fetchCourses(),
//           fetchCategories(),
//         ]);

//         // لو الـ API بيرجع { data: [...] }
//         setCourses(coursesData.data || coursesData);
//         setCategories(categoriesData.data || categoriesData);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const categoryParam = searchParams.get("category");
//     if (categoryParam) {
//       setSelectedCategory(categoryParam);
//     }
//   }, [searchParams]);

//   const filteredCourses = courses.filter((course) => {
//     const matchesSearch =
//       course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       course.shortDescription
//         ?.toLowerCase()
//         .includes(searchQuery.toLowerCase());
//     const matchesCategory =
//       !selectedCategory || course.category?.slug === selectedCategory;
//     const matchesLevel = !selectedLevel || course.level === selectedLevel;
//     return matchesSearch && matchesCategory && matchesLevel;
//   });

//   const handleCategoryChange = (slug) => {
//     setSelectedCategory(slug);
//     if (slug) {
//       setSearchParams({ category: slug });
//     } else {
//       setSearchParams({});
//     }
//   };

//   const clearFilters = () => {
//     setSearchQuery("");
//     setSelectedCategory("");
//     setSelectedLevel("");
//     setSearchParams({});
//   };

//   const hasActiveFilters = searchQuery || selectedCategory || selectedLevel;

//   return (
//     <div className="py-8 md:py-12">
//       <div className="container-main">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
//             All Courses
//           </h1>
//           <p className="text-muted-foreground">
//             Discover our collection of {courses.length}+ courses
//           </p>
//         </div>

//         {/* Search and Filters */}
//         <div className="mb-8">
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search Bar */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//               <input
//                 type="text"
//                 placeholder="Search courses..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="input-field pl-12"
//               />
//             </div>

//             {/* Filter Toggle (Mobile) */}
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="md:hidden btn-outline flex items-center justify-center gap-2"
//             >
//               <Filter className="w-5 h-5" />
//               Filters
//             </button>

//             {/* Filters (Desktop) */}
//             <div className="hidden md:flex gap-4">
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => handleCategoryChange(e.target.value)}
//                 className="input-field w-48"
//               >
//                 <option value="">All Categories</option>
//                 {categories.map((cat) => (
//                   <option key={cat._id} value={cat.slug}>
//                     {cat.name}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={selectedLevel}
//                 onChange={(e) => setSelectedLevel(e.target.value)}
//                 className="input-field w-40"
//               >
//                 <option value="">All Levels</option>
//                 <option value="beginner">Beginner</option>
//                 <option value="intermediate">Intermediate</option>
//                 <option value="advanced">Advanced</option>
//               </select>
//             </div>
//           </div>

//           {/* Mobile Filters Panel */}
//           {showFilters && (
//             <div className="md:hidden mt-4 p-4 bg-card rounded-lg border border-border">
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Category
//                   </label>
//                   <select
//                     value={selectedCategory}
//                     onChange={(e) => handleCategoryChange(e.target.value)}
//                     className="input-field w-full"
//                   >
//                     <option value="">All Categories</option>
//                     {categories.map((cat) => (
//                       <option key={cat._id} value={cat.slug}>
//                         {cat.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-foreground mb-2">
//                     Level
//                   </label>
//                   <select
//                     value={selectedLevel}
//                     onChange={(e) => setSelectedLevel(e.target.value)}
//                     className="input-field w-full"
//                   >
//                     <option value="">All Levels</option>
//                     <option value="beginner">Beginner</option>
//                     <option value="intermediate">Intermediate</option>
//                     <option value="advanced">Advanced</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Active Filters */}
//           {hasActiveFilters && (
//             <div className="mt-4 flex flex-wrap items-center gap-2">
//               <span className="text-sm text-muted-foreground">
//                 Active filters:
//               </span>
//               {searchQuery && (
//                 <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
//                   Search: {searchQuery}
//                   <button onClick={() => setSearchQuery("")}>
//                     <X className="w-4 h-4" />
//                   </button>
//                 </span>
//               )}
//               {selectedCategory && (
//                 <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
//                   {categories.find((c) => c.slug === selectedCategory)?.name}
//                   <button onClick={() => handleCategoryChange("")}>
//                     <X className="w-4 h-4" />
//                   </button>
//                 </span>
//               )}
//               {selectedLevel && (
//                 <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm capitalize">
//                   {selectedLevel}
//                   <button onClick={() => setSelectedLevel("")}>
//                     <X className="w-4 h-4" />
//                   </button>
//                 </span>
//               )}
//               <button
//                 onClick={clearFilters}
//                 className="text-sm text-destructive hover:underline"
//               >
//                 Clear all
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Results */}
//         {loading ? (
//           <LoadingSpinner />
//         ) : filteredCourses.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="w-20 h-20 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
//               <Search className="w-10 h-10 text-muted-foreground" />
//             </div>
//             <h3 className="text-xl font-semibold text-foreground mb-2">
//               No courses found
//             </h3>
//             <p className="text-muted-foreground mb-4">
//               Try adjusting your search or filter criteria
//             </p>
//             <button onClick={clearFilters} className="btn-primary">
//               Clear Filters
//             </button>
//           </div>
//         ) : (
//           <>
//             <p className="text-muted-foreground mb-6">
//               Showing {filteredCourses.length}{" "}
//               {filteredCourses.length === 1 ? "course" : "courses"}
//             </p>
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredCourses.map((course) => (
//                 <CourseCard key={course._id} course={course} />
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Courses;
