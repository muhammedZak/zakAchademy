const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
    default: 'Section',
  },
  sequenceNumber: Number,
  lecture: [
    {
      title: {
        type: String,
      },
      contentType: {
        type: String,
        enum: ['video', 'quiz', 'notes'],
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      sequenceNumber: Number,
    },
  ],
});

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;
