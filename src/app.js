const express = require("express");
const methodOverride = require("method-override");
const app = express();
//Controllers require
const mainRouter = require("./routes/main");

//middleware
const session = require("express-session");
const cookieParser = require("cookie-parser");
const userLoggedMiddleware = require("./middlewares/userLoggedMiddleware");

//URL encode 
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//Seteo en los formularios put o delete
app.use(methodOverride("_method"));

// view engine setup
app.set("view engine", "ejs");
app.set("views", "src/views");

//Cookies y session
app.use(cookieParser());
app.use(
  session({
    secret: "frase secreta",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(userLoggedMiddleware);

app.use("/", mainRouter);


//Activando servidor express
app.listen(3000, () => {
  console.log("listening in http://localhost:3000");
});
