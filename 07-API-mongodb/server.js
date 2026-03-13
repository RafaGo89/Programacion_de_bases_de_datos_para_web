// Importar paquete mongoose para trabajar con MongoDB desde Node.js
const mongoose = require("mongoose");

// Importar el modelo para trabajar con documentos de MongoDB
const BlogPost = require("./models/blogPosts");

const express = require("express");

const app = express();

const port = 4000;

// Conectarse a la base de datos blogpostsdb (si no existe la crea)
mongoose
    .connect("mongodb://127.0.0.1:27017/blogpostsdb")
    .then(() => console.log("Conectado al servidor de MongoDB"))
    .catch((err) => {
        console.log(`Error de MongoDB: ${err}`);
    });

// Configurar el servidor para revisir datos en formato JSON y en formato x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    // Dar una respuesta en formato JSON
    res.json({
        status: "success",
        data: { message: "API de posteos de blog" },
    });
});

// GET para toda la colección
app.get("/blogposts", async (req, res) => {
    try {
        // Leer todos los documentos
        const posts = await BlogPost.find({}, { __v: 0 });

        // Mostrar los documentos
        console.log(posts);

        // Regresar todos los posteos
        res.status(200).json({ status: "success", data: { blogposts: posts } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", message: err });
    }
});

// GET para un posteo específico de acuerdo a su ID
app.get("/blogposts/:id", async (req, res) => {
    try {
        // Leer de la petición el ID incluido en la URL
        const postId = req.params.id;

        // Leer un solo posteo
        const post = await BlogPost.findById(postId, { __v: 0 });

        // Verificar si no se encontró el documento
        if (!post) {
            return res
                .status(404)
                .json({ status: "fail", message: "Posteo no encontrado" });
        }

        // Actualizar el número de vistas en la base de datos
        await BlogPost.findByIdAndUpdate(postId, { $inc: { views: 1 } });

        // Regresar el posteo encontrado
        res.status(200).json({ status: "success", data: { blogposts: post } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", message: err });
    }
});

// POST para subir un nuevo posteo al servidor
app.post("/blogposts", async (req, res) => {
    try {
        // Verificar si el body está vacío
        if (!req.body) {
            return res
                .status(400)
                .json({ status: "fail", message: "Datos incompletos" });
        }

        // Recibir la información del nuevo posteo contenido en el
        // cuerpo de la petición del cliente
        // leer los elementos por desestructuración
        let { title, content, author } = req.body;

        // Eliminar posibles espacios en blancos, verificando previamente que exista el dato
        if (title) title = title.trim();
        if (content) content = content.trim();
        if (author) author = author.trim();

        // Verificar que existan todos los datos y que no estén vacíos
        if (!title || !content || !author) {
            return res
                .status(400)
                .json({ status: "fail", message: "Datos incompletos" });
        }

        // Crear el nuevo post como un objeto
        const post = {
            title, // title: title
            content,
            author,
        };

        // Crear documento de MongoDB
        const newPost = await BlogPost.create(post);

        // Verificar si se creo el documento
        if (!newPost) {
            return res.status(500).json({
                status: "error",
                message: "No fue posible crear el documento",
            });
        }

        res.status(200).json({ status: "sucess", data: { blogpost: newPost } });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", message: err });
    }
});

// PATCH para actualizar alguno o algunos de los siguientes parametros:
// title, content o author
// De un solo posteo en particular
app.patch("/blogposts/:id", async (req, res) => {
    try {
        // Verificar si el body está vacío
        if (!req.body) {
            return res
                .status(400)
                .json({ status: "fail", message: "Datos incompletos" });
        }

        // Leer de la petición el ID incluido en la URL
        const postId = req.params.id;

        // Obtener los datos actualizados del cuerpo de la petición
        let title, content, author;

        if (req.body.title) title = req.body.title;
        if (req.body.content) content = req.body.content;
        if (req.body.author) author = req.body.author;

        // Eliminar posibles espacios en blancos, verificando previamente que exista el dato
        if (title) title = title.trim();
        if (content) content = content.trim();
        if (author) author = author.trim();

        // Verificar si al menos un elemento existe
        if (!title && !content && !author) {
            return res
                .status(400)
                .json({ status: "fail", message: "Datos imcompletos" });
        }

        const updatedPost = await BlogPost.findByIdAndUpdate(postId, {
            title,
            content,
            author,
        });

        // Verificar si se encontró el documento
        if (!updatedPost) {
            return res
                .status(400)
                .json({ status: "fail", message: "Posteo no encontrado" });
        }

        // Regresar mensaje de éxito
        res.status(200).json({
            status: "success",
            data: null,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", message: err });
    }
});

// DELETE para eliminar un posteo en particular
app.delete("/blogposts/:id", async (req, res) => {
    try {
        // Leer de la petición el ID incluido en la URL
        const postId = req.params.id;

        // Eliminar el documento
        const deletedPost = await BlogPost.findByIdAndDelete(postId);

        // Verificar si se encontró el documento
        if (!deletedPost) {
            return res
                .status(404)
                .json({ status: "fail", message: "Posteo no encontrado" });
        }

        // Regresar mensaje de éxito
        res.status(200).json({
            status: "success",
            data: { blogpost: deletedPost },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", message: err });
    }
});

// Manejador de recursos no encontrados
app.use((req, res) => {
    res.status(404);

    res.json({ status: "fail", message: "Recurso no encontrado" });
});

// Manejador de errores del servidor
app.use((err, req, res) => {
    res.status(500).json({ status: "error", message: "Error del servidor" });
});

app.listen(port, () => {
    console.log(
        `Servidor escuchando peticiones en el puerto ${port}. Ctrl + C para terminar...`
    );
});
