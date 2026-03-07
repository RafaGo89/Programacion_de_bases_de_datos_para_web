// Importar paquete mongoose para trabajar con MongoDB desde Node.js
const mongoose = require("mongoose");

// Importar el modelo para trabajar con documentos de MongoDB
const EquiposFutbol = require("./models/equiposFutbol");

// Arreglo de objetos para construir documentos de MongoDB
const equiposAIncluir = [
    {
        nombreEquipo: "Manchester United Football Club",
        anioFundacion: 1878,
        pais: "Inglaterra",
        publicadoPor: "Rafael Rodríguez",
    },
    {
        nombreEquipo: "Club Atlético de San Luis",
        anioFundacion: 2013,
        pais: "México",
        publicadoPor: "Rafael Rodríguez",
    },
];

// Conectarse a la base de datos (si no existe la crea)
mongoose
    .connect("mongodb://127.0.0.1:27017/equiposfutboldb")
    .then(() => console.log("Conectando al servidor de MongoDB"))
    .catch((err) => {
        console.log(`Error de MongoDB ${err}`);
    });

/**
 * Función asíncrona para crear un documento de un equipo de futbol
 */

async function crearDocumento(equipo) {
    try {
        // Crear documento de MongoDB
        const nuevoEquipo = await EquiposFutbol.create(equipo);

        // Verificar si se creo el documento
        if (!nuevoEquipo) {
            console.log("No fue posible crear el documento");
            process.exit(1); // Terminar ejecución con código de error
        }

        // Mostrar documento creado
        console.log(nuevoEquipo);
    } catch (err) {
        console.log(err);
        process.exit(1); // Terminar ejecución con código de error
    }
}

/**
 * Función para crear varios documentos apartir del arreglo de objetos
 * "equiposAIncluir"
 */
async function crearDocumentos() {
    try {
        // Recorrer el arreglo para crear los documentos
        for (let equipo of equiposAIncluir) {
            await crearDocumento(equipo);
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
        const equipos = await EquiposFutbol.find(
            {},
            { __v: 0, fechaPublicacion: 0 },
        );

        // Mostrar los documentos
        console.log(equipos);
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
        const equipo = await EquiposFutbol.findById(id, {
            __v: 0,
            fechaPublicacion: 0,
        });

        // Verificar si no se encontró el documento
        if (!equipo) {
            console.log("Documento no encontrado");
            process.exit(1);
        }

        // Mostrar el documento
        console.log(equipo);

        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1); // Terminar ejecución con código de error
    }
}

/**
 * Función para actualizar uno o más campos de un documento, buscado
 * con base en su ID
 */
async function actualizarDocumento(
    id,
    { nombreEquipo, anioFundacion, pais, publicadoPor },
) {
    try {
        const equipoActualizado = await EquiposFutbol.findByIdAndUpdate(id, {
            nombreEquipo,
            anioFundacion,
            pais,
            publicadoPor,
        });

        // Verificar si se encontró el documento
        if (!equipoActualizado) {
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
 * Función para eliminar un documento particular
 */
async function eliminarDocumento(id) {
    try {
        // Eliminar el documento
        const equipoEliminado = await EquiposFutbol.findByIdAndDelete(id);

        // Verificar si se encontró el documento
        if (!equipoEliminado) {
            console.log("Documento no encontrado");
            process.exit(1);
        }

        console.log("Documento eliminado exitosamente");
        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

/**
 * Llamadas a funciones
 */

// crearDocumentos();
// leerDocumentos();
// leerDocumento("69aca4e1be44bac86694b48c");

// actualizarDocumento("69aca4e1be44bac86694b48c", {
//     nombreEquipo: "Sociedade Esportiva Palmeiras",
//     anioFundacion: 1914,
//     pais: "Brasil",
// });

// eliminarDocumento("69aca4e1be44bac86694b48c");
