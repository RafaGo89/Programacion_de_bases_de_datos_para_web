const express = require("express");

const app = express();

const port = 4000;

// Variable para incrementar automáticamente el id del posteo
let lastId = 3;

// Arreglo de objetos que simula una tabla de una base de datos
// para el ejemplo de posteos en un blog
const blogPost = [
    {
        id: 1,
        title: "Geografía china",
        content:
            "El territorio de la República Popular China se extiende en gran parte de Asia Oriental. Es el tercer país más grande del mundo por área territorial, después de Rusia y Canadá,​ es el cuarto por área total, luego de Rusia, Canadá y, dependiendo de la definición de área total, Estados Unidos.",
        autor: "Julia Maldonado",
        postDate: new Date(),
        views: 0,
    },
    {
        id: 2,
        title: "Riqueza en China",
        content:
            "En 2020, China era el segundo país del mundo, después de Estados Unidos, en número total de multimillonarios y número total de millonarios, con 698 multimillonarios chinos y 4.4 millones de millonarios.",
        autor: "Julia Maldonado",
        postDate: new Date(),
        views: 0,
    },
    {
        id: 3,
        title: "Amazon Web Services",
        content:
            "Amazon Web Services (AWS abreviado) es una colección de servicios de computación en la nube pública (también llamados servicios web) que en conjunto forman una plataforma de computación en la nube, ofrecidas a través de Internet por Amazon.com. Es usado en aplicaciones populares como Dropbox, Foursquare, HootSuite.",
        autor: "Fernando Herrera",
        postDate: new Date(),
        views: 0,
    },
];

// Configurar el servidor para revisir datos en formato JSON y en formato x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    // Dar una respuesta en formato JSON
    res.json({ message: "La página principal" });
});

// GET para toda la colección
app.get("/blogposts", (req, res) => {
    // Regresar el arreglo completo
    res.json(blogPost);
});

// GET para un posteo específico de acuerdo a su ID
app.get("/blogposts/:id", (req, res) => {
    // Leer de la petición el ID incluido en la URL y convertirlo a un entero
    const idNum = parseInt(req.params.id);

    // Obtener el objeto en el arreglo que corresponde al ID dado
    const assignarPost = blogPost.find(p => p.id === idNum);

    // Determinar si no se encontró el posteo
    if (!assignarPost) {
        return res.status(404).json({ message: "Posteo no encontrado" });
    }

    // Actualizar número de vistas
    assignarPost.views++;

    res.json(assignarPost);
});

// POST para subir un nuevo posteo al servidor
app.post("/blogposts", (req, res) => {
    // Recibir la información del nuevo posteo contenido en el
    // cuerpo de la petición del cliente
    // leer los elementos por desestructuración
    let { title, content, autor } = req.body;

    // Eliminar posibles espacios en blancos, verificando previamente que exista el dato
    if (title) title = title.trim();
    if (content) content = content.trim();
    if (autor) autor = autor.trim();

    // Verificar que existan todos los datos y que no estén vacíos
    if (!title || !content || !autor) {
        return res.status(400).json({ message: "Datos incompletos" });
    }

    // Crear el nuevo post como un objeto
    const newPost = {
        id: ++lastId,
        title, // title: title
        content,
        autor,
        postDate: new Date(),
        views: 0,
    };

    // Agregar el nuevo posteo al final del arreglo
    blogPost.push(newPost);

    res.status(201).json(newPost);
});

// PATCH para actualizar alguno o algunos de los siguientes parametros:
// title, content o author
// De un solo posteo en particular
app.patch("/blogposts/:id", (req, res) => {
    // Leer de la petición el ID incluido en la URL y convertirlo a un entero
    const idNum = parseInt(req.params.id);

    // Obtener el ID en el arreglo del posteo seleccionado
    const idxArr = blogPost.findIndex(p => p.id === idNum);

    // Verificar si no hay ningún posteo con el indice buscado
    if (idxArr === -1) {
        return res.status(404).json({ message: "Posteo no encontrado" });
    }

    // Verificar si el body está vacío
    if (!req.body) {
        return res.status(400).json({ message: "Datos imcompletos" });
    }

    // Obtener los datos actualizados del cuerpo de la petición
    let title, content, autor;

    if (req.body.title) title = req.body.title;
    if (req.body.content) content = req.body.content;
    if (req.body.autor) autor = req.body.autor;

    // Eliminar posibles espacios en blancos, verificando previamente que exista el dato
    if (title) title = title.trim();
    if (content) content = content.trim();
    if (autor) autor = autor.trim();

    // Verificar si al menos un elemento existe
    if (!title && !content && !autor) {
        return res.status(400).json({ message: "Datos imcompletos" });
    }

    // Actualizar el posteo
    if (title) blogPost[idxArr].title = title;
    if (content) blogPost[idxArr].content = content;
    if (autor) blogPost[idxArr].autor = autor;

    //
    res.status(201).json(blogPost[idxArr]);
});

// DELETE para eliminar un posteo en particular
app.delete("/blogposts/:id", (req, res) => {
    // Leer de la petición el ID incluido en la URL y convertirlo a un entero
    const idNum = parseInt(req.params.id);

    // Obtener el ID en el arreglo del posteo seleccionado
    const idxArr = blogPost.findIndex(p => p.id === idNum);

    // Verificar si no hay ningún posteo con el indice buscado
    if (idxArr === -1) {
        return res.status(404).json({ message: "Posteo no encontrado" });
    }

    // Eliminar el elemento del arreglo con el método splice()
    const deletedPost = blogPost.splice(idxArr, 1);

    res.status(200).json(deletedPost[0]);
});

app.use((req, res) => {
    res.status(404);

    res.json({ message: "Recurso no encontrado" });
});

app.use((err, req, res) => {
    res.status(500).json({ message: "Error del servidor" });
});

app.listen(port, () => {
    console.log(
        `Servidor escuchando peticiones en el puerto ${port}. Ctrl + C para terminar...`,
    );
});
