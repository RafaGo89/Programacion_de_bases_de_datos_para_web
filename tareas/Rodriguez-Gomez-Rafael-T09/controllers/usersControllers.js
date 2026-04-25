// exports.getUsers = (req, res, next) => {
//   res.send("respond with a resource");
// };
exports.getNewUser = (req, res, next) => {
    let nombre;
    let email;

    // Extraer de la memoria flash la posible información
    // capturada por el usuario
    const data = req.flash("data")[0];

    // Verificar si hay información
    if (data) {
        nombre = data.nombre;
        email = data.email;
    }

    // Extraer de la memoria flash los mensajes de error
    const validationErrors = req.flash("validationErrors");

    res.render("register", { validationErrors, nombre, email });
};

exports.getLogInUser = (req, res, next) => {
    let email;

    // Extraer de la memoria flash la posible información
    // capturada por el usuario
    const data = req.flash("data")[0];

    // Verificar si hay información
    if (data) {
        email = data.email;
    }

    // Extraer de la memoria flash los mensajes de error
    const validationErrors = req.flash("validationErrors");

    res.render("login", { validationErrors, email });
};
