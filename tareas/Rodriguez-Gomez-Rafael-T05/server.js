// Importar paquete mongoose para trabajar con MongoDB desde Node.js
const mongoose = require("mongoose");

// Importar el modelo para trabajar con documentos de MongoDB
const EquiposFutbol = require("./models/equiposFutbol");

const express = require("express");

const app = express();

const port = 4007;

// Conectarse a la base de datos (si no existe la crea)
mongoose
    .connect("mongodb://127.0.0.1:27017/equiposfutboldb")
    .then(() => console.log("Conectando al servidor de MongoDB"))
    .catch((err) => {
        console.log(`Error de MongoDB ${err}`);
    });

// Configurar el servidor para revisir datos en formato JSON y en formato x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET para la página principal
app.get("/", (req, res) => {
    res.json({
        status: "success",
        data: { message: "Esta es la página principal" },
    });
});

// GET para toda la colección de equipos de futbol
app.get("/equipos", async (req, res) => {
    try {
        // Leer todos los documentos
        const equipos = await EquiposFutbol.find({}, { __v: 0 });

        // Regresar todos los posteos
        res.status(200).json({
            status: "success",
            data: { equiposFutbol: equipos },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", message: err });
    }
});

// GET para un equipos específico de acuerdo a su ID
app.get("/equipos/:id", async (req, res) => {
    try {
        // Leer de la petición el ID incluido en la URL
        const idEquipo = req.params.id;

        // Buscar un equipo por la ID leída
        const equipo = await EquiposFutbol.findById(idEquipo, { __v: 0 });

        // Verificar si no se encontró el equipos
        if (!equipo) {
            return res.status(404).json({
                status: "fail",
                message: `Equipo con ID '${idEquipo}' no encontrado`,
            });
        }

        // Regresar el equipo encontrado
        res.status(200).json({
            status: "success",
            data: { equipoFutbol: equipo },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", message: err });
    }
});

// POST para subir un nuevo equipo a la base de datos
app.post("/equipos", async (req, res) => {
    try {
        // Verificar si el body está vacío
        if (!req.body) {
            return res.status(400).json({
                status: "fail",
                message: "Datos enviados incompletos",
            });
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
            return res.status(400).json({
                status: "fail",
                message: "Datos enviados incompletos",
            });
        }

        // Crear el nuevo equipo como un objeto
        const nuevoEquipo = {
            nombreEquipo,
            anioFundacion,
            pais,
            publicadoPor,
        };

        // Crear documento de MongoDB
        const nuevoDocumento = await EquiposFutbol.create(nuevoEquipo);

        // Verificar si se creo el documento
        if (!nuevoDocumento) {
            return res.status(500).json({
                status: "error",
                message: "No fue posible crear el documento",
            });
        }

        // Regresar el documento creado
        res.status(201).json({
            status: "sucess",
            data: { nuevoEquipo: nuevoDocumento },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", message: err });
    }
});

// PATCH para actualizar alguno o algunos de los siguientes parametros:
// title, content o author
// De un solo posteo en particular
app.patch("/equipos/:id", async (req, res) => {
    try {
        // Verificar si el body está vacío
        if (!req.body) {
            return res.status(400).json({
                status: "fail",
                message: "Datos enviados incompletos",
            });
        }

        // Leer de la petición el ID incluido en la URL
        const idEquipo = req.params.id;

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
            return res.status(400).json({
                status: "fail",
                message: "Datos enviados incompletos",
            });
        }

        // Buscar el equipo por su ID y actualizar los campos
        const equipoActualizado = await EquiposFutbol.findByIdAndUpdate(
            idEquipo,
            {
                nombreEquipo,
                anioFundacion,
                pais,
                publicadoPor,
            },
        );

        // Verificar si se encontró el documento
        if (!equipoActualizado) {
            return res.status(400).json({
                status: "fail",
                message: `Equipo con ID '${idEquipo}' no encontrado`,
            });
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
app.delete("/equipos/:id", async (req, res) => {
    try {
        // Leer de la petición el ID incluido en la URL
        const idEquipo = req.params.id;

        // Eliminar el documento
        const equipoBorrado = await EquiposFutbol.findByIdAndDelete(idEquipo);

        // Verificar si se encontró el documento
        if (!equipoBorrado) {
            return res.status(404).json({
                status: "fail",
                message: `Equipo con ID '${idEquipo}' no encontrado`,
            });
        }

        // Regresar mensaje de éxito
        res.status(200).json({
            status: "success",
            data: { equipoBorrado: equipoBorrado },
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "error", message: err });
    }
});

// Manejador de recursos no encontrados
app.use((req, res) => {
    res.status(404).json({ status: "fail", message: "Recurso no encontrado" });
});

// Manejador de errores del servidor
app.use((err, req, res) => {
    res.status(500).json({ status: "error", message: "Error del servidor" });
});

// Poner el servidor a escuchar peticiones
app.listen(port, () => {
    console.log(
        `Servidor escuchando peticiones en el puerto ${port}. Ctrl + C para terminar...`,
    );
});
