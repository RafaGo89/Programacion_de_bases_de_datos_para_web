const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// Para el paso de mensajes de error
const cookieSession = require("cookie-session");
const flash = require("connect-flash");

const indexRouter = require("./routes/rootRoutes");
const usersRouter = require("./routes/usersRoutes");
const equiposRouter = require("./routes/equiposRoutes");

const authControllers = require("./controllers/authControllers");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Activar la sesión de usuario para guardar la información en el cliente
// de los mensajes de error y los datos ya capturados (p. ej. nombre del equipo)
app.use(
    cookieSession({
        name: "cookieSession",
        secret: process.env.COOKIE_SESSION_SECRET,
        resave: false,
        saveUnitialized: false,
    }),
);

// Activar el middleware de flash para el paso de información entre
// funciones del servidor
app.use(flash());

// Agregar middleware para verificar si el usuario inició sesión
app.use(authControllers.isLoggedIn);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/equipos", equiposRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
