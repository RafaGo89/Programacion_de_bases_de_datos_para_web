// Importar paquete mongoose para trabajar con MongoDB desde Node.js
const mongoose = require("mongoose");

// Obtener el objeto del esquema del paquete
const Schema = mongoose.Schema;

// Definir el esquema para los documentos de los posteos del blog
const equiposFutbolEsquema = new Schema({
    nombreEquipo: {
        type: String,
        required: [true, "Por favor, ingrese el nombre del equipo"],
        minlength: [
            2,
            "El nombre del equipo debe de tener por lo menos dos caracteres",
        ],
        maxlength: [
            150,
            "El nombre del equipo debe de tener como máximo 150 caracteres",
        ],
        trim: true,
    },
    anioFundacion: {
        type: Number,
        required: [true, "Por favor, ingrese un año de fundación"],
        // Valor mínimo establecido arbitrariamente
        min: [
            1800,
            "El año de fundación del club no puede ser menor al año 1800",
        ],
        // Validación dinámica: el año de fundación no puede ser mayor al año actual
        validate: {
            validator: function (value) {
                const anioActual = new Date().getFullYear();
                return value <= anioActual;
            },
            message: (props) =>
                `El año de fundación (${props.value}) no puede ser mayor al año en curso (${new Date().getFullYear()})`,
        },
    },
    pais: {
        type: String,
        required: [true, "Por favor, ingrese un país"],
        minlength: [3, "El país debe de tener por lo menos tres caracteres"],
        maxlength: [50, "El país debe de tener como máximo 50 caracteres"],
        trim: true,
    },
    publicadoPor: {
        type: String,
        required: true,
    },
    fechaPublicacion: {
        type: Date,
        default: Date.now,
    },
});

// Crear el modelo apartir del esquema
const equiposFutbol = mongoose.model("equiposFutbol", equiposFutbolEsquema);

// Exportar el modelo
module.exports = equiposFutbol;
