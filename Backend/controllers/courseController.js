const Course = require("../models/Course");

exports.createCourse = async (req, res) => {
  try {
    const data = req.body;
    const course = new Course(data);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const q = {};

    //  Filter by category SLUG
    if (req.query.category) {
      const category = await Category.findOne({
        slug: req.query.category,
      });

      if (category) {
        q.category = category._id;
      } else {
        // no category found -> return empty
        return res.json([]);
      }
    }

    // Tag filter
    if (req.query.tag) {
      q.tags = req.query.tag;
    }

    let query = Course.find(q).populate("category author", "name slug email");

    // Optional limit
    const limit = parseInt(req.query.limit, 10);
    if (!isNaN(limit) && limit > 0) {
      query = query.limit(limit);
    }

    const courses = await query.sort({ createdAt: -1 });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      "category author",
      "name email",
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
