import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Users, Award, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

import CourseCard from "../components/CourseCard";
import CategoryCard from "../components/CategoryCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchCategories, fetchCourses } from "../config/api";

function Index() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const coursesRes = await fetchCourses("?limit=6");
        const categoriesRes = await fetchCategories();

        setCourses(coursesRes.data ?? coursesRes);
        setCategories(categoriesRes.data ?? categoriesRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCourseCountByCategory = (categorySlug) => {
    return courses.filter((c) => c.category?.slug === categorySlug).length;
  };

  const stats = [
    { icon: GraduationCap, value: "50K+", label: "Students" },
    { icon: Play, value: "200+", label: "Courses" },
    { icon: Users, value: "100+", label: "Instructors" },
    { icon: Award, value: "95%", label: "Success Rate" },
  ];

  // reusable animation
  const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true },
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.2 },
                },
              }}
            >
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-bony-800 leading-tight mb-6"
              >
                Learn New Skills
                <span className="text-bony-500 block">Anytime, Anywhere</span>
              </motion.h1>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="text-lg text-muted-foreground mb-8 max-w-lg"
              >
                Access thousands of courses taught by industry experts. Start
                your learning journey today and transform your career.
              </motion.p>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="flex flex-col sm:flex-row gap-4"
              >
                {!isLoggedIn ? (
                  <>
                    <Link
                      to="/courses"
                      className="btn-primary flex items-center justify-center gap-2"
                    >
                      Explore Courses
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                      to="/register"
                      className="btn-outline flex items-center justify-center gap-2"
                    >
                      Get Started Free
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/courses"
                    className="btn-primary flex items-center justify-center gap-2"
                  >
                    Explore Courses
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
              </motion.div>
            </motion.div>

            {/* Right Side Image */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative hidden md:block"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                  alt="Students learning online"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <motion.section
        {...fadeUp}
        className="py-12 bg-card border-y border-border"
      >
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto mb-3 bg-primary/10 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-primary" />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CATEGORIES */}
      <section className="py-16 md:py-20">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="section-title">Browse by Category</h2>

            <p className="section-subtitle">
              Explore our wide range of course categories
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category._id}
                  category={category}
                  courseCount={getCourseCountByCategory(category.slug)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED COURSES */}
      <motion.section {...fadeUp} className="py-16 md:py-20 bg-secondary/30">
        <div className="container-main">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="section-title">Featured Courses</h2>
              <p className="section-subtitle">
                Learn from the best instructors
              </p>
            </div>
            <Link
              to="/courses"
              className="mt-4 md:mt-0 text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all"
            >
              View All Courses
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <motion.div
                  key={course._id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section {...fadeUp} className="py-16 md:py-20">
        <div className="container-main">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of students already learning on LearnHub.
            </p>
            <Link
              to="/register"
              className="btn-accent inline-flex items-center gap-2"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default Index;

// import { useState, useEffect } from "react";

// import { Link } from "react-router-dom";
// import { GraduationCap, Users, Award, ArrowRight, Play } from "lucide-react";
// import CourseCard from "../components/CourseCard";
// import CategoryCard from "../components/CategoryCard";
// import LoadingSpinner from "../components/LoadingSpinner";
// import { mockCourses, mockCategories } from "../data/mockData";
// import { fetchCategories, fetchCourses } from "../config/api";

// function Index() {
//   const [courses, setCourses] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsLoggedIn(!!token);
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         const coursesRes = await fetchCourses("?limit=6");
//         const categoriesRes = await fetchCategories();

//         setCourses(coursesRes.data ?? coursesRes);
//         setCategories(categoriesRes.data ?? categoriesRes);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const getCourseCountByCategory = (categorySlug) => {
//     return courses.filter((c) => c.category?.slug === categorySlug).length;
//   };

//   const stats = [
//     { icon: GraduationCap, value: "50K+", label: "Students" },
//     { icon: Play, value: "200+", label: "Courses" },
//     { icon: Users, value: "100+", label: "Instructors" },
//     { icon: Award, value: "95%", label: "Success Rate" },
//   ];

//   return (
//     <div>
//       {/* Hero Section */}
//       <section className="hero-gradient py-16 md:py-24">
//         <div className="container-main">
//           <div className="grid md:grid-cols-2 gap-12 items-center">
//             <div>
//               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
//                 Learn New Skills
//                 <span className="text-gradient block">Anytime, Anywhere</span>
//               </h1>
//               <p className="text-lg text-muted-foreground mb-8 max-w-lg">
//                 Access thousands of courses taught by industry experts. Start
//                 your learning journey today and transform your career.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 {/* <Link
//                   to="/courses"
//                   className="btn-primary flex items-center justify-center gap-2"
//                 >
//                   Explore Courses
//                   <ArrowRight className="w-5 h-5" />
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="btn-outline flex items-center justify-center gap-2"
//                 >
//                   Get Started Free
//                 </Link> */}
//                 {!isLoggedIn ? (
//                   <>
//                     <Link
//                       to="/courses"
//                       className="btn-primary flex items-center justify-center gap-2"
//                     >
//                       Explore Courses
//                       <ArrowRight className="w-5 h-5" />
//                     </Link>
//                     <Link
//                       to="/register"
//                       className="btn-outline flex items-center justify-center gap-2"
//                     >
//                       Get Started Free
//                     </Link>
//                   </>
//                 ) : (
//                   <Link
//                     to="/courses"
//                     className="btn-primary flex items-center justify-center gap-2"
//                   >
//                     Explore Courses
//                     <ArrowRight className="w-5 h-5" />
//                   </Link>
//                 )}
//               </div>
//             </div>
//             <div className="relative hidden md:block">
//               <div className="relative rounded-2xl overflow-hidden shadow-2xl">
//                 <img
//                   src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
//                   alt="Students learning online"
//                   className="w-full h-auto"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
//               </div>
//               {/* Floating Card */}
//               <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-xl border border-border">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
//                     <Users className="w-6 h-6 text-accent" />
//                   </div>
//                   <div>
//                     <p className="font-bold text-foreground">50K+</p>
//                     <p className="text-sm text-muted-foreground">
//                       Active Learners
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-12 bg-card border-y border-border">
//         <div className="container-main">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {stats.map((stat, index) => (
//               <div key={index} className="text-center">
//                 <div className="w-14 h-14 mx-auto mb-3 bg-primary/10 rounded-xl flex items-center justify-center">
//                   <stat.icon className="w-7 h-7 text-primary" />
//                 </div>
//                 <p className="text-2xl md:text-3xl font-bold text-foreground">
//                   {stat.value}
//                 </p>
//                 <p className="text-sm text-muted-foreground">{stat.label}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Categories Section */}
//       <section className="py-16 md:py-20">
//         <div className="container-main">
//           <div className="text-center mb-12">
//             <h2 className="section-title">Browse by Category</h2>
//             <p className="section-subtitle">
//               Explore our wide range of course categories
//             </p>
//           </div>

//           {loading ? (
//             <LoadingSpinner />
//           ) : (
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//               {categories.map((category) => (
//                 <CategoryCard
//                   key={category._id}
//                   category={category}
//                   courseCount={getCourseCountByCategory(category.slug)}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Featured Courses Section */}
//       <section className="py-16 md:py-20 bg-secondary/30">
//         <div className="container-main">
//           <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
//             <div>
//               <h2 className="section-title">Featured Courses</h2>
//               <p className="section-subtitle">
//                 Learn from the best instructors
//               </p>
//             </div>
//             <Link
//               to="/courses"
//               className="mt-4 md:mt-0 text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all"
//             >
//               View All Courses
//               <ArrowRight className="w-5 h-5" />
//             </Link>
//           </div>

//           {loading ? (
//             <LoadingSpinner />
//           ) : (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {courses.map((course) => (
//                 <CourseCard key={course._id} course={course} />
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 md:py-20">
//         <div className="container-main">
//           <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center">
//             <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
//               Ready to Start Learning?
//             </h2>
//             <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
//               Join thousands of students already learning on LearnHub. Sign up
//               today and get access to all our courses.
//             </p>
//             <Link
//               to="/register"
//               className="btn-accent inline-flex items-center gap-2"
//             >
//               Create Free Account
//               <ArrowRight className="w-5 h-5" />
//             </Link>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default Index;
