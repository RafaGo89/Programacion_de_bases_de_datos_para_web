const createError = require("http-errors");
const EquiposFutbol = require("../models/equiposFutbol");

exports.getEquipo = async (req, res, next) => {
    try {
        // Obtener el id de la url de la página
        const equipoId = req.params.id;

        const equipo = await EquiposFutbol.findById(equipoId, { __v: 0 });

        // Verificar si no se encontró el post
        if (!equipo) {
            return next(createError(404));
        }

        // Mostrar la página con información del equipo de futbol
        res.render("equipo", { equipo });

        // console.log(equipo);
    } catch (err) {
        console.log(err);
        return next(err);
    }
};

/**
 * Controlador para mostrar la página con el formulario para subir un
 * nuevo equipo
 */

exports.getNuevoEquipo = (req, res, next) => {
    let nombreEquipo;
    let anioFundacion;
    let pais;

    // Extraer de la memoria flash los mensajes de error
    const validationErrors = req.flash("validationErrors");

    // Extraer de la memoria flash la posible información capturada
    // por el usuario
    const data = req.flash("data")[0]; // Se guarda en un arreglo

    // Obtener la informació si existe
    if (data) {
        nombreEquipo = data.nombreEquipo;
        anioFundacion = data.anioFundacion;
        pais = data.pais;
    }

    res.render("create", {
        validationErrors,
        nombreEquipo,
        anioFundacion,
        pais,
    });
};

/**
 * Controlador para agregar un nuevo equipo en la base de datos
 */
exports.createEquipo = async (req, res, next) => {
    try {
        // Verificar si no se envio ninguna información
        // if (!req.body) {
        //   return next(createError(400));
        // }

        let { nombreEquipo, anioFundacion, pais } = req.body;

        // El autor al final va a ser el usuario que crea el equipo
        // Temporalmente se pondrá un autor fijo
        const publicadoPor = "Fernando Herrera";

        // Verificar que los datos recibidos sea válidos y quitar espacios
        // en blanco
        // if (nombreEquipo) nombreEquipo = nombreEquipo.trim();
        // if (pais) pais = pais.trim();
        // if (anioFundacion) anioFundacion = anioFundacion;

        // La verficación de si se tiene la información completa se
        // hará con el modelo EquiposFutbol

        // Crear el documento del nuevo equipo en la base de datos
        const nuevoEquipo = await EquiposFutbol.create({
            nombreEquipo,
            anioFundacion,
            pais,
            publicadoPor,
        });

        // Verificar si se creo el documento
        if (!nuevoEquipo) {
            return next(createError(400));
        }

        console.log(nuevoEquipo);

        // Redirigir a la página que muestra el equipo que se acaba de añadir
        res.redirect(303, `/equipos/id/${nuevoEquipo._id}`);
    } catch (err) {
        console.log(err.errors);
        // Extraer los mensajes de error del objeto err
        const validationErrors = Object.values(err.errors).map(
            (error) => error.message,
        );

        // console.log(validationErrors);

        // Poner el arreglo de mensajes de error en la memoria
        // flash de la petición
        req.flash("validationErrors", validationErrors);

        // Guardar en memoria flash la posible información
        // capturada por el usuario
        req.flash("data", req.body);

        // Redireccionar a la página para capturar un nuevo posteo
        res.redirect(303, "/equipos/nuevo");
    }
};
