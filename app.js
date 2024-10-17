import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import { engine } from "express-handlebars";
import indexRoute from "./routes/index.js";
import signaturesRoute from "./routes/signatures.js";
import errorRoute from "./routes/error.js";
import debug from "./modules/debug.js";

const app = express();

app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "500mb",
    parameterLimit: 1000000,
  })
);

app.use(bodyParser.json());

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(
  session({
    secret: "lX$Pijn(edR9y6%34,HV",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    // cookie: { secure: !process.env.IS_DEVELOPMENT },
  })
);

app.use("/", indexRoute);
app.use("/signatures", signaturesRoute);
app.use("/error", errorRoute);

export default app;
