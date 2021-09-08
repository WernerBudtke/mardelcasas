const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  eMail: { type: String, required: true, unique: true },
  photoURL: { type: String, required: true },
  admin: { type: Boolean, default: false },
  google: { type: Boolean, default: false },
  facebook: { type: Boolean, default: false },
  likedProperties: [{ type: mongoose.Types.ObjectId, ref: "property" }],
  dreamProperty: {}, // completar con el filtro
  validated: { type: Boolean, default: false },
  banned: { type: Boolean, default: false },
  suscribedToNewsLetter: { type: Boolean, default: false },
});
const User = mongoose.model("user", userSchema);
module.exports = User;
