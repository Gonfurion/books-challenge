const bcryptjs = require("bcryptjs");
const db = require("../database/models");

const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: "authors" }],
    })
      .then((books) => {
        res.render("home", { books });
      })
      .catch((error) => console.log(error));
  },
  bookDetail: (req, res) => {
    // Implement look for details in the database
    db.Book.findByPk(req.params.id, { include: [{ association: "authors" }] })
      .then((book) => {
        res.render("bookDetail", { book, user: req.session.userLogged });
      })
      .catch((error) => console.log(error));
  },
  bookSearch: (req, res) => {
    res.render("search", { books: [] });
  },
  bookSearchResult: (req, res) => {
    // Implement search by title
    let title = req.body.title;
    var condition = title ? { [db.Sequelize.Op.like]: `%${title}%` } : null;

    db.Book.findAll({
      include: [{ association: "authors" }],

      where: { title: condition },
    })
    .then((books) => {
      if (books.length > 0) {
        res.render("search", { books });
      } else {
        res.render("search", { books: [] });
      }
    });
  },
  deleteBook: (req, res) => {
    // Implement delete book
    res.render("home");
  },
  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render("authors", { authors });
      })
      .catch((error) => console.log(error));
  },
  authorBooks: (req, res) => {
    // Implement books by author
    res.render("authorBooks");
  },
  register: (req, res) => {
    res.render("register");
  },
  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category,
    })
      .then(() => {
        res.redirect("/");
      })
      .catch((error) => console.log(error));
  },
  login: (req, res) => {
    // Implement login process
    res.render("login");
  },
  processLogin: (req, res) => {
    // Implement login process
    res.render("home");
  },
  edit: (req, res) => {
    // Implement edit book
    res.render("editBook", { id: req.params.id });
  },
  processEdit: (req, res) => {
    // Implement edit book
    res.render("home");
  },
};

module.exports = mainController;
