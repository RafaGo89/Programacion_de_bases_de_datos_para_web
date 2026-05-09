const BlogPost = require("../models/BlogPost");

exports.getRoot = async (req, res, next) => {
  try {
    const posts = await BlogPost.find(
      {},
      { title: 1, userId: 1, postDate: 1 }
    ).populate({ path: "userId" });
    console.log(posts);
    res.render("index", { posts });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getAbout = (req, res, next) => {
  res.render("about");
};

exports.getContact = (req, res, next) => {
  res.render("contact");
};
