const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  doctorName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);