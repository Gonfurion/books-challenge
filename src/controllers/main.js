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
    let bookId = req.params.id;

    db.Booksauthors.destroy({ where: { BookId: bookId }, force: true })
      .then(() => {
        db.Book.destroy({ where: { id: bookId } });
      })
      .then(() => {
        return res.redirect("/");
      })
      .catch((error) => res.send(error));
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
    let ide = req.params.id;
    var condition = ide ? { [db.Sequelize.Op.like]: `%${ide}%` } : null;
    db.Author.findAll({
      include: [{ association: "books" }],

      where: { id: condition },
    })
      .then((authors) => {
        console.log(JSON.stringify(authors, null, 2));

        res.render("authorBooks", { authors });
      })
      .catch((error) => console.log(error));
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
    let toLogin = db.User.findOne({ where: { email: req.body.email } });
    Promise.all([toLogin]).then(([toLogin]) => {
      if (toLogin) {
        let passwordOk = bcryptjs.compareSync(
          req.body.password,
          toLogin.Pass
        );

        if (passwordOk) {
          delete toLogin.Pass;
          req.session.userLogged = toLogin;

          if (req.body.remember_user) {
            res.cookie("userEmail", req.body.email, { maxAge: 1000 * 60 * 60 });
          }

          return res.redirect("/");
        }
        return res.render("login", {
          errors: {
            email: {
              msg: "Las credenciales son inválidas",
            },
          },
        });
      }

      return res.render("login", {
        errors: {
          email: {
            msg: "No se encuentra este email en nuestra base de datos",
          },
        },
      });
    });
  },
  edit: (req, res) => {
    // Implement edit book
    db.Book.findByPk(req.params.id, {
      include: [{ association: "authors" }],
    })
      .then((book) => {
        res.render("editBook", { book, user: req.session.userLogged });
      })
      .catch((error) => console.log(error));
  },
  processEdit: (req, res) => {
    // Implement edit book
    let bookId = req.params.id;
    db.Book.update(
      {
        title: req.body.title,
        cover: req.body.cover,
        descripcion: req.body.descripcion,
      },
      {
        where: { id: bookId },
      }
    )
      .then(() => {
        return res.redirect("/");
      })
      .catch((error) => {
        console.log(error);
      });
  },
  logout: (req, res) => {
    res.clearCookie("userEmail");
    req.session.destroy();
    return res.redirect("/");
  },
};
module.exports = mainController;
