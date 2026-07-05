import { useState, useEffect } from "react";
import { X } from "lucide-react";

import { fetchCategories, createCourse, updateCourse } from "../config/api";

function CourseForm({ course, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    category: "",
    level: "beginner",
    price: 0,
    thumbnail: "",
    tags: "",
    published: true,
  });
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (course) {
      setFormData(course);
    }
  }, [course]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        slug: course.slug || "",
        shortDescription: course.shortDescription || "",
        description: course.description || "",
        category: course.category?._id || "",
        level: course.level || "beginner",
        price: course.price || 0,
        thumbnail: course.thumbnail || "",
        tags: course.tags?.join(", ") || "",
        published: course.published !== false,
        studentsCount: course.studentsCount || 0,
        sections: course.sections || [],
      });
    }
  }, [course]);

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
      ...(name === "title" && !course ? { slug: generateSlug(value) } : {}),
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [...(prev.sections || []), { title: "", lessons: [] }],
    }));
  };

  const addLesson = (i) => {
    setFormData((prev) => {
      const updated = [...prev.sections];
      updated[i].lessons = updated[i].lessons || [];
      updated[i].lessons.push({
        title: "",
        videoUrl: "",
        duration: 0,
      });
      return { ...prev, sections: updated };
    });
  };

  const handleSectionChange = (i, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.sections];
      updated[i][field] = value;
      return { ...prev, sections: updated };
    });
  };

  const handleLessonChange = (i, j, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.sections];
      updated[i].lessons[j][field] = value;
      return { ...prev, sections: updated };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.shortDescription.trim())
      newErrors.shortDescription = "Short description is required";
    if (formData.price < 0) newErrors.price = "Price cannot be negative";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (course) {
        // EDIT
        await updateCourse(course._id, formData);
      } else {
        // CREATE
        await createCourse(formData);
      }

      onSave(); // اقفل المودال / ارجع للدASHBOARD
    } catch (err) {
      alert(err.message);
    }
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const newErrors = validate();

  //   if (Object.keys(newErrors).length > 0) {
  //     setErrors(newErrors);
  //     return;
  //   }

  //   const selectedCategory = categories.find(
  //     (c) => c._id === formData.category,
  //   );

  //   const courseData = {
  //     ...formData,
  //     price: parseFloat(formData.price) || 0,
  //     tags: formData.tags
  //       .split(",")
  //       .map((t) => t.trim())
  //       .filter(Boolean),
  //     category: selectedCategory || null,
  //     _id: course?._id || Date.now().toString(),
  //     studentsCount: course?.studentsCount || 0,
  //     sections: course?.sections || [],
  //     author: course?.author || { name: "Admin", email: "admin@example.com" },
  //     createdAt: course?.createdAt || new Date().toISOString(),
  //   };

  //   onSave(courseData);
  // };

  return (
    <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            {course ? "Edit Course" : "Add New Course"}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Course Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Complete React Developer Course"
              className={`input-field ${errors.title ? "border-destructive" : ""}`}
            />
            {errors.title && (
              <p className="text-destructive text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="complete-react-developer-course"
              className={`input-field ${errors.slug ? "border-destructive" : ""}`}
            />
            {errors.slug && (
              <p className="text-destructive text-sm mt-1">{errors.slug}</p>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Short Description *
            </label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="A brief summary of the course"
              className={`input-field ${errors.shortDescription ? "border-destructive" : ""}`}
            />
            {errors.shortDescription && (
              <p className="text-destructive text-sm mt-1">
                {errors.shortDescription}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed course description..."
              rows={4}
              className="input-field resize-none"
            />
          </div>

          {/* Category & Level */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
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
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="input-field"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Price & Thumbnail */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`input-field ${errors.price ? "border-destructive" : ""}`}
              />
              {errors.price && (
                <p className="text-destructive text-sm mt-1">{errors.price}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Students Count
              </label>
              <input
                type="number"
                name="studentsCount"
                placeholder="Enter students"
                value={formData.studentsCount}
                onChange={handleChange}
                min="0"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Thumbnail URL
              </label>
              <input
                type="url"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="input-field"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="react, javascript, frontend"
              className="input-field"
            />
          </div>

          {/* Published */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="published"
              id="published"
              checked={formData.published}
              onChange={handleChange}
              className="w-5 h-5 rounded border-border accent-bony-500 focus:ring-bony-800"
            />
            <label
              htmlFor="published"
              className="text-sm font-medium text-foreground"
            >
              Publish course immediately
            </label>
          </div>
          {/* ===== SECTIONS ===== */}
          <div>
            <h3 className="font-semibold mb-3">Sections</h3>

            {(formData.sections || []).map((section, i) => (
              <div key={i} className="border p-3 rounded mb-3">
                <input
                  type="text"
                  placeholder="Section Title"
                  value={section.title}
                  onChange={(e) =>
                    handleSectionChange(i, "title", e.target.value)
                  }
                  className="input-field mb-2"
                />

                {(section.lessons || []).map((lesson, j) => (
                  <div key={j} className="ml-3 mb-2">
                    <input
                      type="text"
                      placeholder="Lesson Title"
                      value={lesson.title}
                      onChange={(e) =>
                        handleLessonChange(i, j, "title", e.target.value)
                      }
                      className="input-field mb-1"
                    />

                    <input
                      type="text"
                      placeholder="Video URL"
                      value={lesson.videoUrl}
                      onChange={(e) =>
                        handleLessonChange(i, j, "videoUrl", e.target.value)
                      }
                      className="input-field mb-1"
                    />

                    <input
                      type="number"
                      placeholder="Duration (min)"
                      value={lesson.duration}
                      onChange={(e) =>
                        handleLessonChange(i, j, "duration", e.target.value)
                      }
                      className="input-field"
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => addLesson(i)}
                  className="btn-outline mt-2"
                >
                  + Add Lesson
                </button>
              </div>
            ))}

            <button type="button" onClick={addSection} className="btn-primary">
              + Add Section
            </button>
          </div>
          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onCancel}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              {course ? "Update Course" : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CourseForm;
