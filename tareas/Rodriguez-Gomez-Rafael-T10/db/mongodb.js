const mongoose = require("mongoose");

/**
 * Función para conectarse a la base de datos de MongoDB que contiene
 * los equipos de futbol.
 */
exports.connectToDb = () => {
  // Obtener la cadena de conexión del archivo de variables de ambiente
  let connString = process.env.LOCAL_DATABASE;
  mongoose
    .connect(connString)
    .then(() => console.log("Conectando al servidor de MongoDB"))
    .catch((err) => {
      console.log(`Error de MongoDB ${err}`);
      process.exit(1);
    });
};
