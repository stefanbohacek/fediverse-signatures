import express from "express";
import debug from "../modules/debug.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.render("../views/error.handlebars", {error: req.query.error});
});

export default router;
