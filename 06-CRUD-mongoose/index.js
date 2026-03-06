// Importar paquete mongoose para trabajar con MongoDB desde Node.js
const mongoose = require("mongoose");

// Importar el modelo para trabajar con documentos de MongoDB
const BlogPost = require("./models/blogPosts");

// Arreglo de objetos para construir documentos de MongoDB
const posteos = [
    {
        title: "Geografía china",
        content:
            "El territorio de la República Popular China se extiende en gran parte de Asia Oriental. Es el tercer país más grande del mundo por área territorial, después de Rusia y Canadá,​ es el cuarto por área total, luego de Rusia, Canadá y, dependiendo de la definición de área total, Estados Unidos.",
        autor: "Julia Maldonado",
    },
    {
        title: "Riqueza en China",
        content:
            "En 2020, China era el segundo país del mundo, después de Estados Unidos, en número total de multimillonarios y número total de millonarios, con 698 multimillonarios chinos y 4.4 millones de millonarios.",
        autor: "Julia Maldonado",
    },
    {
        title: "Amazon Web Services",
        content:
            "Amazon Web Services (AWS abreviado) es una colección de servicios de computación en la nube pública (también llamados servicios web) que en conjunto forman una plataforma de computación en la nube, ofrecidas a través de Internet por Amazon.com. Es usado en aplicaciones populares como Dropbox, Foursquare, HootSuite.",
        autor: "Fernando Herrera",
    },
];

// Conectarse a la base de datos blogpostsdb (si no existe la crea)
mongoose
    .connect("mongodb://127.0.0.1:27017/blogpostsdb")
    .then(() => console.log("Conectado al servidor de MongoDB"))
    .catch((err) => {
        console.log(`Error de MongoDB: ${err}`);
    });

/**
 * Función asíncrona para crear un documento de un posteo de blog
 * El parametro post es un objeto de JS del cual se creará el documento de MongoDB
 */
async function crearDocumento(post) {
    try {
        // Crear documento de MongoDB
        const newPost = await BlogPost.create(post);

        // Verificar si se creo el documento
        if (!newPost) {
            console.log("No fue posible crear el documento");
            process.exit(1); // Terminar ejecución con código de error
        }
        // Mostrar documento creado
        console.log(newPost);
    } catch {
        console.log(err);
        process.exit(1); // Terminar ejecución con código de error
    }
}

/**
 * Función para crear varios documentos apartir del arreglo de objetos
 * "posteos"
 */

async function crearDocumentos() {
    try {
        // Recorrer el arreglo para crear los documentos
        for (let posteo of posteos) {
            await crearDocumento(posteo);
        }

        console.log("Documentos creados exitosamente");
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1); // Terminar ejecución con código de error
    }
}

/**
 * Función para leer todos los documentos de la colección de MongoDB
 */
async function leerDocumentos() {
    try {
        // Leer todos los documentos
        const posts = await BlogPost.find({}, { __v: 0 });

        // Mostrar los documentos
        console.log(posts);
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1); // Terminar ejecución con código de error
    }
}

/**
 * Función para leer UN SOLO documento de la colección de MongoDB,
 * apartir de su ID
 */
async function leerDocumento(id) {
    try {
        const post = await BlogPost.findById(id, { __v: 0 });

        // Verificar si no se encontró el documento
        if (!post) {
            console.log("Documento no encontrado");
            process.exit(1);
        }

        // Mostrar el documento
        console.log(post);

        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1); // Terminar ejecución con código de error
    }
}

async function actualizarDocumento(id, { title, content, author }) {
    try {
        const updatedPost = await BlogPost.findByIdAndUpdate(id, {
            title,
            content,
            author,
        });

        // Verificar si se encontró el documento
        if (!updatedPost) {
            console.log("Documento no encontrado");
            process.exit(1);
        }

        console.log("Documento actualizado correctamente");

        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1); // Terminar ejecución con código de error
    }
}

/**
 * Llamadas a funciones para trabajar con documentos de MongoDB
 */

// crearDocumentos();
// leerDocumentos();
// leerDocumento("69ab2996e398b055989fa9d7");
actualizarDocumento("69ab2996e398b055989fa9d7", {
    author: "Rafael Gómez",
    title: "País Chino",
});