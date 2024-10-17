import express from "express";
import debug from "../modules/debug.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.render("../views/home.handlebars", {});

  // if (user) {
  //   req.session.user = user;
  //   console.log("req.session.user (index)", req.session.user);
  //   res.redirect("/signatures");
  // } else {
  //   res.render("../views/home.handlebars", {});
  // }
});

export default router;
