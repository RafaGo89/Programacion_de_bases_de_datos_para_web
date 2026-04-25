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
        // Considerar el error de duplicidad de correo electrónico
        // construyendo manualmente el mensaje de error
        let validationErrors;

        if (err.code === 11000) {
            validationErrors = ["El email ingresado ya está en uso"];
        } else {
            // Extraer los mensajes de error del objeto err
            validationErrors = Object.values(err.errors).map(
                (error) => error.message,
            );
        }

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

// Controlador para presentar la página de inicio de sesión
exports.signin = async (req, res, next) => {
    try {
        // Obtener la información del usuario
        const { email, password } = req.body;

        console.log({ email, password });

        // Verificar si no se recibió el email y la contraseña
        if (!email || !password) {
            // Contruir manualmente el mensaje de error y
            // ponerlo en la memoria flash
            req.flash("validationErrors", [
                "Por favor, ingresa un correo y una contraseña",
            ]);

            // Guardar la posible información guardada por el usuario
            req.flash("data", req.body);

            // Redirigir a la página de inicio de sesión
            return res.redirect(303, "/users/login");
        }

        // Intentar recuperar el usuario con el email dado,
        //  incluyendo la contraseña
        const user = await Usuario.findOne({ email }).select("+password");

        // Verificar si no existe el usuario o si la contraseña no es correcta
        if (!user || !(await user.correctPassword(password))) {
            // Generar manualmente el mensaje de error
            // y mandarlo a la memoria flash
            req.flash("validationErrors", ["Email o contraseña incorrectos"]);

            // Guardar la posible información guardada por el usuario
            req.flash("data", req.body);

            // Redirigir a la página de inicio de sesión
            return res.redirect(303, "/users/login");
        }

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
        res.redirect(303, "/users/login");
    }
};
