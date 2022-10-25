const db = require("../database/models");
function userLoggedMiddleware(req, res, next) {
  res.locals.isLogged = false;

  let cookieEmail = req.cookies.userEmail;
  if (cookieEmail != undefined && req.session.userLogged == undefined) {
    db.User.findOne({
      where: {
        Email: cookieEmail,
      },
    })
      .then((user) => {
        req.session.userLogged = user;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (req.session.userLogged) {
    res.locals.isLogged = true;
    res.locals.userLogged = req.session.userLogged;
  }

  next();
}

module.exports = userLoggedMiddleware;
