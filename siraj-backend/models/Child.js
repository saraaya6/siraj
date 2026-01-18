const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  memorizedAyat: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Child', childSchema);
