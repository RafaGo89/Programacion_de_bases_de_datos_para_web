/**
 * Controladores para autenticación y autorización de usuarios
 */

// Importar el modelo para los usuarios
const Usuario = require("../models/Usuario");

// Importar el paquete para JSON web tokens
const jwt = require("jsonwebtoken");

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

        // Autorización usando JSON web tokens

        // Crear JWT
        const token = jwt.sign(
            { id: nuevoUsuario._id },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            },
        );

        // console.log(token);

        // Construir objeto de opciones para la cookie donde se guardará el token
        const cookieOptions = {
            // Expira el mismo tiempo que el token (expresado en milisegundos)
            expires: new Date(
                Date.now() +
                    process.env.JWT_COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24,
            ),
            // Para que no sea leída directamente por las personas, sino que sea
            // solo recibida y leída por el navegador
            httpOnly: true,
        };

        // Agregar cookie en la respuesta al cliente
        res.cookie("jwt", token, cookieOptions);

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

        // Autorización usando JSON web tokens

        // Crear JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        // console.log(token);

        // Construir objeto de opciones para la cookie donde se guardará el token
        const cookieOptions = {
            // Expira el mismo tiempo que el token (expresado en milisegundos)
            expires: new Date(
                Date.now() +
                    process.env.JWT_COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24,
            ),
            // Para que no sea leída directamente por las personas, sino que sea
            // solo recibida y leída por el navegador
            httpOnly: true,
        };

        // Agregar cookie en la respuesta al cliente
        res.cookie("jwt", token, cookieOptions);

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

/**
 * Controlador para fin de sesión que sobrescribe el JWT en la cookie
 */
exports.signout = (req, res, next) => {
    // Opciones para la cookie
    const cookieOptions = {
        // Forzar a que expire en unos segundos
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    };
    // Sobrescribir el token de la cookie
    res.cookie("jwt", "loggedOut", cookieOptions);

    // Redireccionar a la página de inicio de sesión
    res.redirect(303, "/users/login");
};

/**
 * Middleware de un controlador para proteger el acceso a los recursos
 * Verificar si el usuario tiene un JWT válido
 */
exports.protect = async (req, res, next) => {
    try {
        // Intentar recuperar el JWT de la cookie donde está guardado
        const token = req.cookies.jwt;

        // Verificar si no existe el token
        if (!token) {
            // Redirigir a la página de inicio de sesión
            return res.redirect(303, "/users/login");
        }

        // Verificar la válidez del token (si no es válido se lanza un error)
        // y obtener la información del id del usuario
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        // Obtener el usuario que corresponde al id guardado en el token
        const currentUser = await Usuario.findById(decoded.id);

        // Verificar si el usuario no existe
        if (!currentUser) {
            // Redirigir a la página de inicio de sesión
            return res.redirect(303, "/users/login");
        }

        // Guardar el objeto del usuario en el objeto de la petición
        // para poder usarlo en los siguientes pasos del middleware
        req.user = currentUser;

        // Pasar el control al siguiente elemento del middleware
        next();
    } catch (err) {
        // Redirigir a la página de inicio de sesión
        return res.redirect(303, "/users/login");
    }
};

/**
 * Middleware para verificar si el usuario ha iniciado sesión o no
 * Si el usario ha iniciado sesión, guardar su información en el objeto
 * de la petición y en el objeto de la respuesta
 */
exports.isLoggedIn = async (req, res, next) => {
    try {
        // Asumir que el usuario no ha iniciado sesión
        // locals es una variable global para pasar
        // información a una página EJS
        res.locals.user = undefined;

        // Obtener token de la cookie
        const token = req.cookies.jwt;

        // Verificar si no existe el token
        if (!token) {
            // Pasar control al siguiente elemento del middleware
            return next();
        }

        // Verificar válidez del token y obtener información del token
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        // Verificar si no existe el usuario
        const currentUser = await Usuario.findById(decoded.id);

        if (!currentUser) {
            // Pasar control al siguiente elemento del middleware
            return next();
        }

        // Poner objeto del usuario en la variable local para ser utilizado
        // por las páginas EJS
        res.locals.user = currentUser;

        // Poner objeto del usuario en el objeto de la petición para poder
        // ser usado por los siguientes elementos del middleware
        req.user = currentUser;

        // Pasar control al siguiente elemento del middleware
        return next();
    } catch (err) {
        // Pasar control al siguiente elemento del middleware
        return next();
    }
};
