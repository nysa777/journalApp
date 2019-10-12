var mongoose = require('mongoose');

const JournalSchema = mongoose.Schema({
  title: String,
  journal: String,
  createdDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Journals', JournalSchema)
