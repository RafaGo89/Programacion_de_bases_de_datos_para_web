// Importar paquete mongoose para trabajar con MongoDB desde Node.js
const mongoose = require("mongoose");

// Obtener el objeto del esquema del paquete
const Schema = mongoose.Schema;

// Definir el esquema para los documentos de los posteos del blog
const equiposFutbolEsquema = new Schema({
    nombreEquipo: {
        type: String,
        require: true,
    },
    anioFundacion: {
        type: Number,
        require: true,
    },
    pais: {
        type: String,
        require: true,
    },
    publicadoPor: {
        type: String,
        require: true,
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
