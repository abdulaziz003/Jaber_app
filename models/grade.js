const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true
  },
  office: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Office'
  }
})


module.exports = mongoose.model('Grade', gradeSchema);