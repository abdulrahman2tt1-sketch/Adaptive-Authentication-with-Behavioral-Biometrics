const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Course = require('../models/Course');
const seedData = require('../seed.json');

router.post('/', async (req, res) => {
  try {
    await Category.deleteMany({});
    await Course.deleteMany({});

    const catMap = {};
    for (const c of seedData.categories) {
      const cat = new Category(c);
      await cat.save();
      catMap[c.slug] = cat._id;
    }

    for (const c of seedData.courses) {
      const course = new Course({
        ...c,
        category: catMap['web-development'] || null
      });
      await course.save();
    }

    res.json({ message: 'Database seeded' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
