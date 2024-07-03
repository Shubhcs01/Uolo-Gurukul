const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 15,
  },
  imageUrl:{
    type:String
  },
  key: {
    type: String,
  }
});

module.exports = mongoose.model("Team", userSchema);
