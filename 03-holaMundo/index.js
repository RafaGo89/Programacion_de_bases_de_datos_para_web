// Importar el paquete express previamente instalado
const express = require("express");
// Crear la apliación del servidor web basado en express
const app = express();
// Establecemos el número de puerto de escucha
const port = 3000;

//Establecer los servicios de recepción de peticiones del cliente
// y de respuesta del servidor
// "req" = "Request" (Petición del cliente)
// "res" = "Response" (Respuesta del servidor)
app.get("/", (req, res) => {
  res.send("Hola mundo");
});

// Iniciar el servidor para que empiece a escuchar peticiones del cliente
// en el puerto especificado
app.listen(port, () => {
  console.log(
    `Servidor escuchando peticiones en el puerto ${port}. Ctrl + C para terminar...`,
  );
});
