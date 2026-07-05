import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE || "http://localhost:5001/api";

/* =========================
   FETCH
========================= */

async function fetchCourses() {
  const res = await fetch(`${API_BASE_URL}/courses`);
  if (!res.ok) throw new Error("Failed to fetch courses");
  return res.json();
}

async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

async function fetchOneCourse(slug) {
  const res = await fetch(`${API_BASE_URL}/courses/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch course");
  return res.json();
}

/* =========================
   COURSES CRUD
========================= */

const createCourse = async (courseData) => {
  const res = await fetch(`${API_BASE_URL}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(courseData),
  });
  if (!res.ok) throw new Error("Failed to add course");
  return res.json();
};

const updateCourse = async (courseId, courseData) => {
  const res = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(courseData),
  });
  if (!res.ok) throw new Error("Failed to update course");
  return res.json();
};

const deleteCourse = async (courseId) => {
  const res = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete course");
  return res.json();
};

/* =========================
   CATEGORIES CRUD (NEW)
========================= */

// Create category
const createCategory = async (categoryData) => {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(categoryData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || "Failed to create category");
  }
  return res.json();
};

// Update category
const updateCategory = async (categoryId, categoryData) => {
  const res = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(categoryData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || "Failed to update category");
  }
  return res.json();
};

// Delete category
const deleteCategory = async (categoryId) => {
  const res = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete category");
  return res.json();
};

/* =========================
   AXIOS INSTANCE
========================= */

const instance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

function setAuthToken(token) {
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
}

/* =========================
   FORCE LOGOUT
========================= */

function forceLogout(message) {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  sessionStorage.clear();
  alert(message);
  window.location.href = "/login";
}

/* =========================
   RESPONSE INTERCEPTOR
========================= */

instance.interceptors.response.use(
  (response) => {
    if (response.data?.riskLevel === "high") {
      forceLogout(
        "⚠️ Suspicious activity detected on your account. You will be logged out.",
      );
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const riskLevel = error.response?.data?.riskLevel;

    if (status === 401) {
      forceLogout("Your session has expired. You will be logged out.");
    } else if (status === 403) {
      if (riskLevel === "high") {
        forceLogout(
          "⚠️ Suspicious activity detected on your account. You will be logged out.",
        );
      } else {
        forceLogout("Access denied. You will be logged out.");
      }
    }

    return Promise.reject(error);
  },
);

/* =========================
   EXPORTS
========================= */

export {
  fetchCourses,
  fetchCategories,
  fetchOneCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  createCategory,
  updateCategory,
  deleteCategory,
  setAuthToken,
  instance as default,
};
