const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  shadchan: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  candidateBoy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CandidateProfile',
    required: true 
  },
  candidateGirl: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CandidateProfile',
    required: true 
  },
  
  status: { 
    type: String, 
    enum: [
      'Idea',          // רעיון
      'Proposed',      // הוצע
      'Approved',      // אושר ע"י הצדדים
      'FirstDate',     // דייט ראשון
      'Dating',        // בפגישות
      'Engaged',       // ווראט!
      'Dropped'        // ירד
    ],
    default: 'Idea'
  },
  
  shadchanNotes: String, // הערות שדכן
  lastStatusUpdate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', matchSchema);