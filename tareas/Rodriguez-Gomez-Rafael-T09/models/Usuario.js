// Importar paquete mongoose para trabajar con MongoDB desde Node.js
const mongoose = require("mongoose");

// Obtener el objeto del esquema del paquete
const Schema = mongoose.Schema;

// Importar el paquete validor de cadenas
const validator = require("validator");

// Importar el paquete para encriptar contraseña
const brcrypt = require("bcryptjs");

// Crear el esquema para los documentos de usuario
const usuarioEsquema = new Schema({
    nombre: {
        type: String,
        required: [true, "Por favor, ingrese su nombre"],
        minlength: [2, "El nombre debe de tener al menos 2 caracteres"],
        maxlength: [100, "El nombre debe de tener como máxima 100 caracteres"],
    },
    email: {
        // Será el indentificador de usuario para el sistema
        type: String,
        required: [true, "Por favor, ingrese su email"],
        lowercase: true,
        unique: true, // No se permiten documentos con el mismo email
        validate: [validator.isEmail, "Por favor, ingrese un email válido"],
    },
    password: {
        type: String,
        required: [true, "Por favor, ingrese una contraseña"],
        minlength: [8, "La contraseña debe de tener al menos 8 caracteres"],
        //No mostrar la contraseña al consultar los datos del usuario
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "Por favor, confirma tu contraseña"],
        validate: {
            validator: function (pass) {
                return pass === this.password;
            },
            message: "Las contraseñas no son iguales",
        },
    },
});

// Middleware para encriptar automáticamente la contrseña antes de guardarla
// en mongoDB
usuarioEsquema.pre("save", async function (next) {
    // Verificar si no modifico la contrseña para no encriptar una
    // contraseña previamente encriptada
    if (!this.isModified("password")) {
        // No continuar con la encriptación y pasar el control al
        // siguiente elemento del middleware
        return next();
    }

    // Encriptar la contraseña y reemplazarla por la contraseña no encriptada
    this.password = await brcrypt.hash(this.password, 12);

    // No guardar la propiedad de confirmación de la contraseña
    this.passwordConfirm = undefined;

    // Continuar con el siguiente elemento del middleware
    next();
});

// Crear el modelo apartir del esquema
const Usuario = mongoose.model("Usuario", usuarioEsquema);

// Exportar el modelo
module.exports = Usuario;
