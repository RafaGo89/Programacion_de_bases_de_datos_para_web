const mongoose = require("mongoose");

/**
 * Función para conectarse a la base de datos de MongoDB que contiene los posteos de blog.
 */
exports.connectToDB = () => {
  // Obtener la cadena de conexión del archivo de variables de ambiente
  let connString = process.env.LOCAL_DATABASE;

  mongoose
    .connect(connString)
    .then(() => {
      console.log("Conectado al servidor de MongoDB");
    })
    .catch((err) => {
      console.log(`Error de MongoDB: ${err}`);
      process.exit(1);
    });
};
