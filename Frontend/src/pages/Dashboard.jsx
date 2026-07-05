import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  MoreVertical,
  AlertTriangle,
  Tag,
  X,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import CourseForm from "../components/CourseForm";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchCategories,
} from "../config/api";

// ─────────────────────────────────────────────
//  Category Form Modal
// ─────────────────────────────────────────────
function CategoryForm({ category, onSave, onCancel }) {
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Auto-generate slug from name
  const generateSlug = (val) =>
    val
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    // Only auto-update slug if not editing an existing category
    if (!category) setSlug(generateSlug(val));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({ name: name.trim(), slug: slug.trim() });
    } catch (err) {
      // Show the actual server error message if available
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-6 w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            {category ? "Edit Category" : "Add New Category"}
          </h2>
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Category Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Web Development"
              className="input-field py-2 text-sm"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Slug
              <span className="text-muted-foreground font-normal ml-1">
                (auto-generated)
              </span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. web-development"
              className="input-field py-2 text-sm text-muted-foreground"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {saving
                ? "Saving..."
                : category
                  ? "Save Changes"
                  : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Categories View (full CRUD)
// ─────────────────────────────────────────────
function CategoriesView({ externalShowForm, onExternalFormClose }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  // Open form when header "Add New Category" button is clicked
  useEffect(() => {
    if (externalShowForm) {
      setEditingCategory(null);
      setShowForm(true);
      onExternalFormClose();
    }
  }, [externalShowForm]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSave = async (data) => {
    if (editingCategory) {
      const updated = await updateCategory(editingCategory._id, data);
      setCategories((prev) =>
        prev.map((c) => (c._id === editingCategory._id ? updated : c)),
      );
    } else {
      const created = await createCategory(data);
      setCategories((prev) => [created, ...prev]);
    }
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setShowForm(true);
    setActiveMenu(null);
  };

  const toggleMenu = (id) => setActiveMenu(activeMenu === id ? null : id);

  return (
    <>
      {/* Table Card */}
      <div className="bg-card rounded-xl border border-border">
        {/* Card header */}
        <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            All Categories
          </h2>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 py-2 text-sm"
            />
          </div>
        </div>

        {/* Body */}
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No categories found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "Try a different search term"
                : "Get started by creating your first category"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setShowForm(true);
                }}
                className="btn-primary"
              >
                Add Category
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden md:table-cell">
                    Slug
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((cat, idx) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    {/* Index */}
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {idx + 1}
                    </td>

                    {/* Name */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                          <Tag className="w-4 h-4 text-amber-600" />
                        </div>
                        <p className="font-medium text-foreground">
                          {cat.name}
                        </p>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-sm text-muted-foreground font-mono">
                        {cat.slug || "—"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Desktop */}
                        <div className="hidden md:flex items-center gap-1">
                          <button
                            onClick={() => openEdit(cat)}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(cat._id)}
                            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </div>

                        {/* Mobile */}
                        <div className="relative md:hidden">
                          <button
                            onClick={() => toggleMenu(cat._id)}
                            className="p-2 hover:bg-secondary rounded-lg"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {activeMenu === cat._id && (
                            <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
                              <button
                                onClick={() => openEdit(cat)}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-secondary text-sm w-full"
                              >
                                <Pencil className="w-4 h-4" /> Edit
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteConfirm(cat._id);
                                  setActiveMenu(null);
                                }}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-destructive/10 text-destructive text-sm w-full"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground text-center mb-2">
              Delete Category?
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              This action cannot be undone. All courses under this category may
              be affected.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────
//  Placeholder views
// ─────────────────────────────────────────────
function MessagesView() {
  return (
    <div className="bg-card rounded-xl border border-border p-12 text-center">
      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-1">Messages</h3>
      <p className="text-muted-foreground">Messages inbox coming soon.</p>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Main Dashboard
// ─────────────────────────────────────────────
function Dashboard() {
  const [activeView, setActiveView] = useState("dashboard");

  // ── Courses state ──
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  // ── Category add button state (lifted so header btn works) ──
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddCourse = () => {
    setEditingCourse(null);
    setShowForm(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowForm(true);
    setActiveMenu(null);
  };

  const handleSaveCourse = async (courseData) => {
    setLoading(true);
    try {
      if (editingCourse) {
        const updated = await updateCourse(editingCourse._id, courseData);
        setCourses((prev) =>
          prev.map((c) => (c._id === editingCourse._id ? updated : c)),
        );
      } else {
        const newCourse = await createCourse(courseData);
        setCourses((prev) => [newCourse, ...prev]);
      }
      setShowForm(false);
      setEditingCourse(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    setLoading(true);
    try {
      await deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = (courseId) =>
    setActiveMenu(activeMenu === courseId ? null : courseId);

  const totalStudents = courses.reduce(
    (acc, c) => acc + (c.studentsCount || 0),
    0,
  );
  const totalRevenue = courses.reduce(
    (acc, c) => acc + (c.price * c.studentsCount || 0),
    0,
  );
  const publishedCourses = courses.filter((c) => c.published).length;

  const stats = [
    {
      icon: BookOpen,
      label: "Total Courses",
      value: courses.length,
      iconBg: "bg-blue-500",
    },
    {
      icon: Users,
      label: "Total Students",
      value: totalStudents.toLocaleString(),
      iconBg: "bg-emerald-500",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      iconBg: "bg-amber-500",
    },
    {
      icon: TrendingUp,
      label: "Published",
      value: publishedCourses,
      iconBg: "bg-purple-500",
    },
  ];

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

  const VIEW_META = {
    dashboard: { title: "Dashboard", sub: "Manage your courses and content" },
    courses: { title: "Courses", sub: "Browse and manage all courses" },
    categories: { title: "Categories", sub: "Manage course categories" },
    students: { title: "Students", sub: "View and manage your students" },
    messages: { title: "Messages", sub: "Your inbox" },
  };
  const meta = VIEW_META[activeView] || VIEW_META.dashboard;

  const CoursesSection = () => (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">All Courses</h2>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 py-2 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No courses found
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "Try a different search term"
              : "Get started by creating your first course"}
          </p>
          {!searchQuery && (
            <button onClick={handleAddCourse} className="btn-primary">
              Create Course
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                  Course
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden md:table-cell">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden lg:table-cell">
                  Level
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden sm:table-cell">
                  Students
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-foreground hidden lg:table-cell">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCourses.map((course) => (
                <tr
                  key={course._id}
                  className="hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          course.thumbnail ||
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=80&h=50&fit=crop"
                        }
                        alt={course.title}
                        className="w-16 h-10 object-cover rounded hidden sm:block"
                      />
                      <div>
                        <p className="font-medium text-foreground line-clamp-1">
                          {course.title}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1 md:hidden">
                          {course.category?.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {course.category?.name || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className={getLevelBadgeClass(course.level)}>
                      {course.level}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium text-foreground">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-muted-foreground">
                      {course.studentsCount?.toLocaleString() || 0}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.published
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {course.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <div className="hidden md:flex items-center gap-1">
                        <Link
                          to={`/courses/${course.slug}`}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </Link>
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(course._id)}
                          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </button>
                      </div>
                      <div className="relative md:hidden">
                        <button
                          onClick={() => toggleMenu(course._id)}
                          className="p-2 hover:bg-secondary rounded-lg"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {activeMenu === course._id && (
                          <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-10 py-1 min-w-[120px]">
                            <Link
                              to={`/courses/${course.slug}`}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-secondary text-sm"
                            >
                              <Eye className="w-4 h-4" /> View
                            </Link>
                            <button
                              onClick={() => handleEditCourse(course)}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-secondary text-sm w-full"
                            >
                              <Pencil className="w-4 h-4" /> Edit
                            </button>
                            <button
                              onClick={() => {
                                setDeleteConfirm(course._id);
                                setActiveMenu(null);
                              }}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-destructive/10 text-destructive text-sm w-full"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <div className="flex-1 min-w-0 py-8">
        <div className="container-main">
          {/* ── Header ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {meta.title}
              </h1>
              <p className="text-muted-foreground">{meta.sub}</p>
            </div>

            {/* Add Course button */}
            {(activeView === "dashboard" || activeView === "courses") && (
              <button
                onClick={handleAddCourse}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Course
              </button>
            )}

            {/* Add Category button */}
            {activeView === "categories" && (
              <button
                onClick={() => setShowCategoryForm(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Category
              </button>
            )}
          </div>

          {/* ── VIEW: dashboard ── */}
          {activeView === "dashboard" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-xl p-5 border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <CoursesSection />
            </>
          )}

          {/* ── VIEW: courses ── */}
          {activeView === "courses" && <CoursesSection />}

          {/* ── VIEW: categories ── */}
          {activeView === "categories" && (
            <CategoriesView
              externalShowForm={showCategoryForm}
              onExternalFormClose={() => setShowCategoryForm(false)}
            />
          )}

          {/* ── VIEW: messages ── */}
          {activeView === "messages" && <MessagesView />}
        </div>
      </div>

      {/* Course Form Modal */}
      {showForm && (
        <CourseForm
          course={editingCourse}
          onSave={handleSaveCourse}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Course Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 max-w-sm w-full">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground text-center mb-2">
              Delete Course?
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              This action cannot be undone. The course and all its content will
              be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCourse(deleteConfirm)}
                className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
