// exports.getUsers = (req, res, next) => {
//   res.send("respond with a resource");
// };

exports.getNewUser = (req, res, next) => {
  let name;
  let email;

  // Extraer de la memoria flash la posible información captura por el usuario
  const data = req.flash("data")[0];

  // Verificar si hay información
  if (data) {
    name = data.name;
    email = data.email;
  }

  // Extraer de la memoria flash los mensajes de error
  const validationErrors = req.flash("validationErrors");

  res.render("register", { validationErrors, name, email });
};

exports.getLogInUser = (req, res, next) => {
  let email;

  // Extraer de la memoria flash la posible información captura por el usuario
  const data = req.flash("data")[0];

  // Verificar si hay información
  if (data) {
    email = data.email;
  }

  // Extraer de la memoria flash los mensajes de error
  const validationErrors = req.flash("validationErrors");

  res.render("login", { validationErrors, email });
};
