exports.getRoot = function(req, res, next) {
  res.render('index');
};

exports.getAbout = (req, res, next) => {
  res.render("about");
};

exports.getContact = (req, res, next) => {
  res.render("contact");
};