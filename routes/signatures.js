import "dotenv/config";
import express from "express";
import * as util from "util";
import mysql from "mysql";
import { Filter } from "bad-words";
import getUser from "../modules/getUser.js";
import debug from "../modules/debug.js";
import { sign } from "crypto";

const filter = new Filter();
const router = express.Router();

router.get("/", async (req, res) => {
  let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  
  const instance = req.query.instance;
  const token = req.query.token;
  let pageUrl = req.query.url;
  let signatures = [];

  if (instance && token) {
    const user = await getUser(instance, token);
    req.session.user = user;
    res.redirect("/signatures");
  } else if (req.query.action) {
    if (req.session.user) {
      let fn, rows;

      switch (req.query.action) {
        case "logout":
          delete req.session.user;
          break;
        case "remove":
          fn = util.promisify(connection.query).bind(connection);
          rows = await fn(
            "DELETE from signatures WHERE page_url = ? AND account = ? AND server = ?",
            [pageUrl, req.session.user.username, req.session.user.domain]
          );

          break;
        case "add":
          fn = util.promisify(connection.query).bind(connection);
          rows = await fn(
            "INSERT INTO signatures (page_url, account, server) VALUES (?, ?, ?)",
            [pageUrl, req.session.user.username, req.session.user.domain]
          );

          break;
        default:
          break;
      }
      res.redirect("/signatures");
    } else {
      res.redirect("/");
    }
  } else {
    if (pageUrl) {
      const fn = util.promisify(connection.query).bind(connection);
      try {
        const rows = await fn("SELECT * from signatures WHERE page_url = ?", [
          pageUrl,
        ]);
  
        if (rows && rows.length > 0) {
          signatures = rows.map((signature) => {
            return {
              account: signature.account,
              server: signature.server,
            };
          });
        }
      } catch (error) {
        console.log("error", error);
      }
    }

    signatures = signatures.map((signature) => {
      return {
        account: signature.account,
        server: signature.server,
        account_clean: filter.clean(signature.account),
        server_clean: filter.clean(signature.server),
        url: `https://${signature.server}/@${signature.account}`
      };
    });

    if (req.query.format === "json") {
      res.header("Access-Control-Allow-Origin", "*");
      res.json({
        page_url: pageUrl,
        signatures,
      });
    } else {
      let user = req.session.user;

      res.render("../views/signatures.handlebars", {
        user,
        page_url: pageUrl,
        signatures,
        has_signed: user
          ? signatures
              .map((signature) => `@${signature.account}@${signature.server}`)
              .includes(user.username_full)
          : false,
        is_development: process.env.IS_DEVELOPMENT,
      });
    }
  }
});

export default router;
