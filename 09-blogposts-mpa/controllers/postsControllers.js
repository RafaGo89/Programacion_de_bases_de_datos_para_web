const createError = require("http-errors");
const BlogPost = require("../models/BlogPost");

exports.getPost = async (req, res, next) => {
  try {
    const postID = req.params.id;

    const post = await BlogPost.findById(postID, { __v: 0 }).populate({
      path: "userId",
    });

    // Verificar si no se encontró el posteo
    if (!post) {
      return next(createError(404));
    }

    // Actualizar el número de vistas en la base de datos
    await BlogPost.findByIdAndUpdate(postID, { $inc: { views: 1 } });

    // Actualizar el número de vistas en el posteo a presentar
    post.views++;

    // Mostrar la página con la información completa del posteo
    res.render("post", { post });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/**
 * Controlador para mostrar la página con el formulario para subir un nuevo posteo.
 */
exports.getNewPost = (req, res, next) => {
  let title;
  let content;

  // Extraer de la memoria flash los mensajes de error
  const validationErrors = req.flash("validationErrors");

  // Extraer de la memoria flash la posible información capturada por el usuario
  const data = req.flash("data")[0]; // Se guarda en un arreglo

  // Obtener la información, si existe
  if (data) {
    title = data.title;
    content = data.content;
  }

  // Se agrega la bandera createPost para que los scripts de Summernote
  // sólo se agreguen al <head> cuando se presente la página create
  // (es necesario modificar también la página head.ejs para que
  // considere esta bandera)
  res.render("create", { validationErrors, title, content, createPost: true });
};

/**
 * Controlador para crear un nuevo posteo en la base de datos
 */
exports.createPost = async (req, res, next) => {
  try {
    // Verificar si no se envió ninguna información
    // if (!req.body) {
    //   return next(createError(400));
    // }

    let { title, content } = req.body;

    // El autor al final va a ser el usuario que crea el posteo
    // Temporalmente se pondrá un autor fijo
    //const author = "John Wick";

    console.log(req.user);

    const userId = req.user._id;

    // Verificar que los datos recibidos sean válidos
    // Quitar posibles espacios en blanco antes y después del dato
    // if (title) title = title.trim();
    // if (content) content = content.trim();

    // La verificación de si se tiene la información completa se hará
    // con el modelo BlogPost

    // Crear documento del posteo en la base de datos
    const newPost = await BlogPost.create({
      title,
      content,
      //author,
      userId,
    });

    // Verificar si no se creó el documento
    if (!newPost) {
      return next(createError(400));
    }

    console.log(newPost);

    // Redirigir a la página que muestra el posteo que se acaba de crear
    res.redirect(303, `/posts/id/${newPost._id}`);
  } catch (err) {
    //console.log(err.errors);
    // Extraer los mensajes de error del objeto err
    const validationErrors = Object.values(err.errors).map(
      (error) => error.message,
    );
    // console.log(validationErrors);
    // Poner el arreglo de mensajes de error en la memoria flash de la petición
    req.flash("validationErrors", validationErrors);

    // Guardar en memoria flash la posible información capturada por el usuario
    req.flash("data", req.body);

    // Redireccionar a la página para capturar un nuevo posteo
    res.redirect(303, "/posts/new");
  }
};
