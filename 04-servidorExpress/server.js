// Importar el paquete express previamente instalado
const express = require("express");
//Importar el paquete "path" de Node (no es necesario instalarlo previamente)
const path = require("path");
// Crear la apliación del servidor web basado en express
const app = express();
// Establecemos el número de puerto de escucha
const port = 3000;

// Especificar la ruta de la carpeta "public" con contenido estático
// La constante "__dirname" contiene la ruta en el equipo actual de la carpeta de Node
app.use(express.static(path.resolve(__dirname, "public")));

//Establecer los servicios de recepción de peticiones del cliente
// y de respuesta del servidor
// "req" = "Request" (Petición del cliente)
// "res" = "Response" (Respuesta del servidor)
app.get("/", (req, res) => {
  // Enviar al cliente el archivo index.html
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
  // Enviar al cliente el archivo about.html
  res.sendFile(path.resolve(__dirname, "public", "about.html"));
});

app.get("/contact", (req, res) => {
  // Enviar al cliente el archivo contact.html
  res.sendFile(path.resolve(__dirname, "public", "contact.html"));
});

// Manejo de rutas que no coinciden con ninguna de las anteriores
app.use((req, res) => {
  // Cambiar el código de estatus a "no encontrado"
  res.status(404);
  // Enviar al cliente el archivo notFound.html
  res.sendFile(path.resolve(__dirname, "public", "notFound.html"));
});

// Manejo de errores del servidor, donde el primer argumento la callback function
// debe de ser un objecto de error
app.use((err, req, res) => {
  // Cambiar el código de estatus a
  res.status(500);
  // Enviar al cliente el archivo error.html
  res.sendFile(path.resolve(__dirname, "public", "error.html"));
});

// Iniciar el servidor para que empiece a escuchar peticiones del cliente
// en el puerto especificado
app.listen(port, () => {
  console.log(
    `Servidor escuchando peticiones en el puerto ${port}. Ctrl + C para terminar...`,
  );
});
