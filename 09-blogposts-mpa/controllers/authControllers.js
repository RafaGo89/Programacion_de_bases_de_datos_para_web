/**
 * Controladores para autenticación y autorización de usuarios.
 */

// Importar el modelo para los usuarios
const User = require("../models/User");
// Importar el paquete para JWT
const jwt = require("jsonwebtoken");

// Ruta: /users/singup para dar de alta un nuevo usuario
exports.signup = async (req, res, next) => {
  try {
    // Obtener la información del formulario de la  página Register
    const { name, email, password, passwordConfirm } = req.body;

    // Crear documento de usuario en la base de datos
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    /** Autorización usando JSON Web Tokens **/

    // Crear JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Construir objeto de opciones para la cookie donde se guardará el token
    const cookieOptions = {
      // Expira al mismo tiempo que el token (expresado en milisegundos)
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24
      ),
      // Para que no ser leída directamente por las personas, sino que sea s´lo
      // enviada y recibida por el navegador
      httpOnly: true,
    };

    // Agregar cookie en la respuesta al cliente
    res.cookie("jwt", token, cookieOptions);

    // Redirigir a la página principal
    res.redirect(303, "/");
  } catch (err) {
    //console.log(err);
    // Considerar el error de duplicidad de correo electrónico construyendo
    // manualmente el mensaje de error
    let validationErrors;

    if (err.code === 11000) {
      validationErrors = ["The provided email has already been registered"];
    } else {
      // Extraer los mensajes de error del objeto err
      validationErrors = Object.values(err.errors).map(
        (error) => error.message
      );
    }

    // console.log(validationErrors);
    // Poner el arreglo de mensajes de error en la memoria flash de la petición
    req.flash("validationErrors", validationErrors);

    // Guardar en memoria flash la posible información capturada por el usuario
    req.flash("data", req.body);

    // Redireccionar a la página para capturar un nuevo posteo
    res.redirect(303, "/users/new");
  }
};

// Controlador para presentar la página de inició de sesión
exports.signin = async (req, res, next) => {
  try {
    // Obtener información del usuario
    const { email, password } = req.body;

    console.log({ email, password });

    // Verificar si no se recibió el email y la contraseña
    if (!email || !password) {
      // Construir manualmente el mensaje de error y poner en la memoria flash
      req.flash("validationErrors", ["Please provide email and password"]);
      // Guardar posible información guardada por el usuario
      req.flash("data", req.body);
      // Redirigir a la página de inicio de sesión
      return res.redirect(303, "/users/login");
    }

    // Intentar recuperar usuario con el email dado, incluyendo la contraseña
    const user = await User.findOne({ email }).select("+password");

    // Verificar si no existe el usuario o si la contraseña no es correcta
    if (!user || !(await user.correctPassword(password))) {
      // Generar manualmente el mensaje de error y colocar en memoria flash
      req.flash("validationErrors", ["Incorrect email or password"]);
      // Guardar posible información capturada por el usuario
      req.flash("data", req.body);
      // Redirigir a la página de inicio de sesión
      return res.redirect(303, "/users/login");
    }

    /** Autorización usando JSON Web Tokens **/

    // Crear JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Construir objeto de opciones para la cookie donde se guardará el token
    const cookieOptions = {
      // Expira al mismo tiempo que el token (expresado en milisegundos)
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24
      ),
      // Para que no ser leída directamente por las personas, sino que sea s´lo
      // enviada y recibida por el navegador
      httpOnly: true,
    };

    // Agregar cookie en la respuesta al cliente
    res.cookie("jwt", token, cookieOptions);

    res.redirect(303, "/");
  } catch (err) {
    // Extraer los mensajes de error del objeto err
    const validationErrors = Object.values(err.errors).map(
      (error) => error.message
    );
    // console.log(validationErrors);
    // Poner el arreglo de mensajes de error en la memoria flash de la petición
    req.flash("validationErrors", validationErrors);

    // Guardar en memoria flash la posible información capturada por el usuario
    req.flash("data", req.body);

    // Redireccionar a la página para capturar un nuevo posteo
    res.redirect(303, "/users/login");
  }
};

/**
 * Controlador para fin de sesión que sobrescribe el JWT en la cookie.
 */
exports.signout = (req, res, next) => {
  // Opciones para la cookie
  const cookieOptions = {
    // Forzar a que expire en 10 segundos
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  };
  // Sobrescribir el token en la cookie
  res.cookie("jwt", "loggedOut", cookieOptions);

  // Redireccionar a la página de inicio de sesión
  res.redirect(303, "/users/login");
};

/**
 * Middleware de un controlador para proteger el acceso a los recursos.
 * Verificar si el usuario tiene un JWT válido.
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

    // Verificar la validez del token (si no es válido se lanza un error)
    // y obtener la información del id del usuario
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Obtener el usuario que corresponde al id guardado en el token
    const currentUser = await User.findById(decoded.id);

    // Verificar si el usuario no existe
    if (!currentUser) {
      // Redirigir a la página de inicio de sesión
      return res.redirect(303, "/users/login");
    }

    // Guardar el objeto del usuario en el objeto de la petición para poder
    // usado en los siguientes pasos de middleware
    req.user = currentUser;

    // Pasar el control al siguiente elemento de middleware
    next();
  } catch (err) {
    // Redirigir a la página de inicio de sesión
    return res.redirect(303, "/users/login");
  }
};

/**
 * Middleware para verificar si el usuario ha iniciado o no sesión.
 * Si el usuario ha iniciado sesión, guardar su información en el objeto
 * de la petición y en el objeto de la respuesta.
 */
exports.isLoggedIn = async (req, res, next) => {
  try {
    // Asumir que el usuario no ha iniciado sesión
    // locals es una varible global para pasar información a una página EJS
    res.locals.user = undefined;

    // Obtener token de la cookie
    const token = req.cookies.jwt;

    // Verificar si no existe el token
    if (!token) {
      // Pasar control al siguiente elemento de middleware
      return next();
    }

    // Verificar validez del token y obtener información del token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Verificar si no existe el usuario
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      // Pasar control al siguiente elemento de middleware
      return next();
    }

    // Poner objeto del usuario en la variable locals para ser utilizado por
    // las páginas EJS
    res.locals.user = currentUser;

    // Poner objeto del usuario en el objeto de la petición para poder ser usado
    // por los siguientes elementos de middleware
    req.user = currentUser;

    // Pasar control al siguiente elemento de middleware
    return next();
  } catch (err) {
    // Pasar control al siguiente elemento de middleware
    return next();
  }
};
