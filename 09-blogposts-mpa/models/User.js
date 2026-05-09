// Importa paquete para trabajar con MongoDB
const mongoose = require("mongoose");
// Obtener el objeto del esquema del paquete
const Schema = mongoose.Schema;
// Importar el paquete para validar cadenas
const validator = require("validator");
// Importar el paquete para encriptar la contraseña
const bcrypt = require("bcryptjs");

// Crear esquema para los documentos de usuario
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
    minlength: [2, "Name must have at least 2 characters"],
    maxlength: [100, "Name must be at most 100 characters long"],
  },
  email: {
    // El identificador de usuario para el sistema
    type: String,
    required: [true, "Please provide your email"],
    lowercase: true,
    unique: true, // No se permiten documentos con el mismo email
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password must have at least 8 characters"],
    select: false, // No mostrar la constraseña al consultar los datos del usuario
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (pass) {
        return pass === this.password;
      },
      message: "Passwords are not the same",
    },
  },
});

// Middleware para encriptar automáticamente la contraseña antes de guardar
// el documento en la base de datos de MongoDB
userSchema.pre("save", async function (next) {
  // Verificar si no se modificó la contraseña para no encriptar una contraseña
  // previamente encriptada
  if (!this.isModified("password")) {
    // No continuar con la encriptación y pasar el control al siguiente
    // elemento de middleware
    return next();
  }

  // Encriptar la contraseña y reemplazada por la contraseña no encriptada
  this.password = await bcrypt.hash(this.password, 12);

  // No guardar la propidad de confirmación de la contraseña
  this.passwordConfirm = undefined;

  // Continuar con el siguiente elemento de middleware
  next();
});

/**
 * Método de instancia (del usuario) para comprobar si la contraseña provista
 * por el usuario al iniciar sesión corresponde o no a la contraseña guardada en
 * la base de datos de ese usuario.
 */
userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Crear el modelo a partir del esquema
const User = mongoose.model("User", userSchema);

// Exportar el modelo
module.exports = User;
