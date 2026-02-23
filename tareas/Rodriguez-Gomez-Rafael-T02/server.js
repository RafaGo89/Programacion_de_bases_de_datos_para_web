// Importar el paquete express previamente instalado
const express = require("express");
//Importar el paquete "path" de Node (no es necesario instalarlo previamente)
const path = require("path");
// Crear la apliación del servidor web basado en express
const app = express();
// Establecemos el número de puerto de escucha
const port = 3000;

// Especificar la ruta de la carpeta "public" con contenido estático
app.use(express.static(path.resolve(__dirname, "public")));

// Establecer los servicios de recepción de peticiones del cliente
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.get("/about", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "about.html"));
});

app.get("/contact", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "contact.html"));
});

// Manejo de rutas que no coinciden con ninguna de las anteriores
app.use((req, res) => {
    // Cambiar el código de estatus a "no encontrado"
    res.status(404);

    res.sendFile(path.resolve(__dirname, "public", "notFound.html"));
});

// Manejo de errores del servidor, donde el primer argumento
//  la callback function
app.use((err, req, res) => {
    res.status(500);

    res.sendFile(path.resolve(__dirname, "public", "error.html"));
});

// Iniciar el servidor para que empiece a escuchar peticiones del cliente
// en el puerto especificado
app.listen(port, (req, res) => {
    console.log(
        `Servidor escuchando peticiones en el puerto ${port}. Ctrl + C para terminar...`,
    );
});
