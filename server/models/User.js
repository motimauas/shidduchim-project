const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['candidate', 'shadchan', 'admin'], 
    default: 'candidate' 
  },
  // --- השדה החדש: האם המשתמש מאושר כניסה? ---
  isApproved: { 
    type: Boolean, 
    default: false 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', UserSchema);