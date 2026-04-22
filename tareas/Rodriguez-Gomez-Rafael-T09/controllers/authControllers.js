/**
 * Controladores para autenticación y autorización de usuarios
 */

// Importar el modelo para los usuarios
const Usuario = require("../models/Usuario");

// Ruta: /users/signup para dar de alta un nuevo usuario
exports.signup = async (req, res, next) => {
    try {
        // Obtener la información del formulario de la pagina "Registrarse"
        const { nombre, email, password, passwordConfirm } = req.body;

        // Crear documento de usuario en la base de datos
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            password,
            passwordConfirm,
        });

        // Redirigir a la página principal
        res.redirect(303, "/");
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
        res.redirect(303, "/users/new");
    }
};
