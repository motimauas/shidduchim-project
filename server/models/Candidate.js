const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // מקשר לטבלת המשתמשים
    required: true 
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  age: { type: Number, required: true },
  height: { type: Number, required: true }, // גובה בס"מ
  city: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['single', 'divorced', 'widowed'], 
    default: 'single' 
  },
  
  // השתייכות מגזרית
  sector: { 
    type: String, 
    enum: ['Litvak', 'Chasid', 'Sefaradi', 'Chabad', 'Modern', 'BaalTshuva'],
    required: true 
  },
  
  occupation: { type: String }, // עיסוק
  institution: { type: String }, // ישיבה/סמינר
  
  fatherName: String,
  motherName: String,
  familyBackground: String,

  photos: [String], // לינקים לתמונות
  
  // מה מחפשים?
  lookingFor: {
    minAge: Number,
    maxAge: Number,
    preferredSector: [String],
    description: String
  },

  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('CandidateProfile', candidateSchema);