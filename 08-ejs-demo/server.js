// Importar el paquete express previamente instalado
const express = require("express");

// Crear la aplicaión del servidor web basado en express
const app = express();

// Establecemos el número de puerto de escucha
const port = 4000;

// Indicar que se utilizará el generador de plantillas EJS
app.set("view engine", "ejs");

// GET Página principal
app.get("/", (req, res) => {
  const tagline = "Ejemplo de variable a enviar a la página web";

  const conFormato = "<h3>Texto con formato HTML</h3>";

  const mascots = [
    { name: "Sammy", organization: "DigitalOcean", birth_date: 2012 },
    { name: "Tux", organization: "Linux", birth_date: 1966 },
    { name: "Moby Dock", organization: "Docker", birth_date: 2013 },
  ];
  // Construir la página HTML a partir de la plantilla EJS y enviarsela al cliente
  res.render("pages/index", {
    tagline,
    conFormato,
    mascots,
  });
});

// GET About
app.get("/about", (req, res) => {
  res.render("pages/about");
});

// Iniciar el servidor para que empiece a escuchar peticiones del cliente
// en el puerto especificado
app.listen(port, () => {
  console.log(
    `Servidor escuchando peticiones en el puerto ${port}. Ctrl + C para terminar...`
  );
});
