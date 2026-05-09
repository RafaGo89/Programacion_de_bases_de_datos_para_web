// Importa paquete para trabajar con MongoDB
const mongoose = require("mongoose");
// Obtener el objeto del esquema del paquete
const Schema = mongoose.Schema;

// Definir el esquema para los documentos de los posteos de blog
const blogPostSchema = new Schema({
  title: {
    type: String,
    required: [true, "Please provide a post title"],
    minlength: [3, "Title must have at least 3 characters"],
    maxlength: [150, "Title must be at most 150 characters long"],
    trim: true, // Quitar posibles espacios en blanco antes y despuéss
  },
  content: {
    type: String,
    required: [true, "Please provide some content"],
    minlength: [10, "Content must have at least 10 characters"],
    maxlength: [20000, "Content must be at most 20,000 characters long"],
    trim: true,
  },
  // author: {
  //   type: String,
  //   required: true,
  // },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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

// Crear el modelo a partir del esquema (el nombre de la colección de
// documentos se toma del primerargumento en plural y en minúsculas,
// es decir, blogposts)
const BlogPost = mongoose.model("BlogPost", blogPostSchema);

// Export el modelo
module.exports = BlogPost;
