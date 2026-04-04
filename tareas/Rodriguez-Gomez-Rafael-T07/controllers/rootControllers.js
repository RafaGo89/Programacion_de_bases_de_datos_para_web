const EquiposFutbol = require("../models/equiposFutbol");

exports.getRoot = async (req, res, next) => {
  try {
    const equipos = await EquiposFutbol.find(
      {},
      { nombreEquipo: 1, publicadoPor: 1, fechaPublicacion: 1 },
    );

    // console.log(equipos);

    res.render("index", { equipos });
  } catch (err) {
    console.log(err);
  }
};

exports.getAbout = (req, res, next) => {
  res.render("about");
};

exports.getContact = (req, res, next) => {
  res.render("contact");
};
