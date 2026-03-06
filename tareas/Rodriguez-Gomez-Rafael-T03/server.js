const express = require("express");

const app = express();

const port = 3004;

// Variable para incrementar automáticamente el id del posteo
let lastId = 2;

const equiposDeFutbol = [
    {
        id: 1,
        nombreEquipo: "Manchester United Football Club",
        anioFundacion: 1878,
        pais: "Inglaterra",
        publicadoPor: "Rafael Rodríguez",
        fechaPublicacion: new Date(),
    },
    {
        id: 2,
        nombreEquipo: "Club Atlético de San Luis",
        anioFundacion: 2013,
        pais: "México",
        publicadoPor: "Rafael Rodríguez",
        fechaPublicacion: new Date(),
    },
];

// Configurar el servidor para revisir datos en formato JSON y en formato x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET para regresar página principal o root
app.get("/", (req, res) => {
    res.json({ mensaje: "Esta es la página principal" });
});

// GET para regresar toda la colección
app.get("/equipos", (req, res) => {
    res.json(equiposDeFutbol);
});

// GET para obtener un equipo en concreto por su ID
app.get("/equipos/:id", (req, res) => {
    // Leer de la petición el ID incluido en la URL y convertirlo a un entero
    const idNum = parseInt(req.params.id);

    // Obtener el objeto en el arreglo que corresponde al ID dado
    const equipoSolicitado = equiposDeFutbol.find((arr) => arr.id === idNum);

    // Determinar si no se encontró el equipo
    if (!equipoSolicitado) {
        return res
            .status(404)
            .json({ mensaje: `Equipo con ID ${idNum} no encontrado` });
    }

    res.json(equipoSolicitado);
});

// POST para subir un nuevo equipo de fútbol
app.post("/equipos", (req, res) => {
    // Verificar si el body está vacío
    if (!req.body) {
        return res.status(400).json({ mensaje: "Datos enviados incompletos" });
    }
    // Recibir la información del nuevo equipo contenido
    // en el cuerpo de la petición
    let { nombreEquipo, anioFundacion, pais, publicadoPor } = req.body;

    // Eliminar posibles espacios en blancos, verificando previamente que exista el dato
    if (nombreEquipo) nombreEquipo = nombreEquipo.trim();
    if (pais) pais = pais.trim();
    if (publicadoPor) publicadoPor = publicadoPor.trim();

    // Verificar que existan todos los datos y que no estén vacíos
    if (!nombreEquipo || !anioFundacion || !pais || !publicadoPor) {
        return res.status(400).json({ mensaje: "Datos enviados incompletos" });
    }

    // Crear el nuevo equipo como un objeto
    const nuevoEquipo = {
        id: ++lastId,
        nombreEquipo,
        anioFundacion,
        pais,
        publicadoPor,
        fechaPublicacion: new Date(),
    };

    // Agregar el nuevo equipo al final del arreglo
    equiposDeFutbol.push(nuevoEquipo);

    res.status(201).json(nuevoEquipo);
});

// PATCH para actualizar alguno o algunos de los siguientes parametros:
// nombreEquipo, anioFundacion, pais, publicadoPor
// De un solo equipo en particular
app.patch("/equipos/:id", (req, res) => {
    // Leer de la petición el ID incluido en la URL y convertirlo a un entero
    const idNum = parseInt(req.params.id);

    // Obtener el ID en el arreglo del equipo seleccionado
    const idxArr = equiposDeFutbol.findIndex((arr) => arr.id === idNum);

    // Verificar si hay algún equipo con el indice buscado
    if (idxArr === -1) {
        return res
            .status(404)
            .json({ mensaje: `Equipo con ID ${idNum} no encontrado` });
    }

    // Verificar si el body está vacío
    if (!req.body) {
        return res.status(400).json({ mensaje: "Datos enviados incompletos" });
    }

    // Obtener los datos actualizados del cuerpo de la petición
    let nombreEquipo, anioFundacion, pais, publicadoPor;

    if (req.body.nombreEquipo) nombreEquipo = req.body.nombreEquipo;
    if (req.body.anioFundacion) anioFundacion = req.body.anioFundacion;
    if (req.body.pais) pais = req.body.pais;
    if (req.body.publicadoPor) publicadoPor = req.body.publicadoPor;

    // Eliminar posibles espacios en blancos, verificando previamente que exista el dato
    if (nombreEquipo) nombreEquipo = nombreEquipo.trim();
    if (pais) pais = pais.trim();
    if (publicadoPor) publicadoPor = publicadoPor.trim();

    // Verificar si al menos un elemento existe
    if (!nombreEquipo && !anioFundacion && !pais && !publicadoPor) {
        return res.status(400).json({ message: "Datos enviados incompletos" });
    }

    // Actualizar el equipo de fútbol
    if (nombreEquipo) equiposDeFutbol[idxArr].nombreEquipo = nombreEquipo;
    if (anioFundacion) equiposDeFutbol[idxArr].anioFundacion = anioFundacion;
    if (pais) equiposDeFutbol[idxArr].pais = pais;
    if (publicadoPor) equiposDeFutbol[idxArr].publicadoPor = publicadoPor;

    res.status(201).json(equiposDeFutbol[idxArr]);
});

// DELETE para eliminar un posteo en particular
app.delete("/equipos/:id", (req, res) => {
    // Leer de la petición el ID incluido en la URL y convertirlo a un entero
    const idNum = parseInt(req.params.id);

    // Obtener el ID en el arreglo del equipo seleccionado
    const idxArr = equiposDeFutbol.findIndex((arr) => arr.id === idNum);

    // Verificar si hay algún equipo con el indice buscado
    if (idxArr === -1) {
        return res
            .status(404)
            .json({ mensaje: `Equipo con ID ${idNum} no encontrado` });
    }

    // Eliminar del arreglo el equipo solicitado
    const equipoBorrado = equiposDeFutbol.splice(idxArr, 1);

    res.status(200).json(equipoBorrado[0]);
});

// Atrapa-todo para las rutas que no coincidan con lo anterior
app.use((req, res) => {
    res.status(404).json({ mensaje: "Error 404, recurso no encontrado" });
});

// Atrapa errores internos del servidor
app.use((err, req, res) => {
    res.status(500).json({ message: "Error del servidor :(" });
});

// Poner el servidor a esuchar
app.listen(port, () => {
    console.log(
        `Servidor escuchando peticiones en el puerto ${port}. Ctrl + C para terminar...`,
    );
});
