// Importar paquete mongoose para trabajar con MongoDB desde Node.js
const mongoose = require("mongoose");

// Obtener el objeto del esquema del paquete
const Schema = mongoose.Schema;

// Definir el esquema para los documentos de los posteos del blog
const blogPostsSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    },
    author: {
        type: String,
        require: true,
    },
    postDate: {
        type: Date,
        default: Date.now,
    },
    views: {
        type: Number,
        default: 0,
    },
});

// Crear el modelo apartir del esquema
const BlogPost = mongoose.model("blogPost", blogPostsSchema);

// Exportar el modelo
module.exports = BlogPost;
