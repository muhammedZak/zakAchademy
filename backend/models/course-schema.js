const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide title'],
    unique: [true, 'Title already exist'],
    trim: true,
  },
  overview: {
    type: 'String',
    required: [true, 'Please provide overview'],
    trim: true,
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  studentsEnrolled: [
    {
      student: { type: mongoose.Schema.ObjectId, ref: 'User' },
      enrollmentDate: { type: Date, default: Date.now },
    },
  ],
  learnings: {
    type: Array,
  },
  level: {
    type: String,
    required: [true, 'Please provide Student level'],
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All level'],
  },
  duration: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  banner: {
    type: String,
  },
  price: {
    type: Number,
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true,
  },
  requirements: {
    type: Array,
  },
  sections: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Section',
    },
  ],
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
