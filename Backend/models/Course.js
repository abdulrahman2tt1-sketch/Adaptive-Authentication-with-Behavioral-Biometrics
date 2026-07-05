const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: String,
  lessons: [{ title: String, videoUrl: String, duration: Number }]
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  shortDescription: { type: String },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  level: { type: String, enum: ['beginner','intermediate','advanced'], default: 'beginner' },
  price: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
  thumbnail: { type: String },
  tags: [String],
  sections: [sectionSchema],
  studentsCount: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
