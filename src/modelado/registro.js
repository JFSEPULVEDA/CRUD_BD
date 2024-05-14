const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
//encriptar el password
//usar libreria bcrypt
UserSchema.pre("save", function (next) {
  //gentSalt => hash =>proceso donde se inserta la contraseña y se le adiciona un codigo
  bcrypt
    .genSalt(15)
    .then((salts) => {
      bcrypt
        .hash(this.password, salts)
        .then((hash) => {
          this.password = hash;
          next();
        })
        .catch((error) => next());
    })
    .catch((error) => next());
});

module.exports = mongoose.model("proyectos_TI", UserSchema);
