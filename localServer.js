import http from "http";
import express from "express";
import session from "express-session";
import path from "path";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy } from "passport-discord";
import memstore from "memorystore"
import bodyParser from "body-parser";
import url from "url";
import fs from "fs";
import { HasPermission, HasPermissionByBits } from "./utils/Get.js";
dotenv.config();
const MemoryStore = memstore(session)

var guildCache = {}

export function initServer(ws) {
    const app = express();
    const server = http.createServer(app);

    app.use(express.static(path.resolve("./views/")));

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));

    passport.use(
        new Strategy({
            clientID: process.env.clientId,
            clientSecret: process.env.clientSecret,
            callbackURL: "http://127.0.0.1:8080/callback",
            scope: ["identify", "guilds"]
        }, (accessToken, refreshToken, profile, done) => {
            // On login we pass in profile with no logic.
            process.nextTick(() => done(null, profile));
        })
    )

    app.use(
        session({
            store: new MemoryStore({ checkPeriod: 86400000 }),
            secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
            resave: false,
            saveUninitialized: false,
            cookie: { secure: false }
        }),
    );

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(bodyParser.json());
    app.use(
        bodyParser.urlencoded({
            extended: true,
        }),
    );
  
    app.locals.domain = "http://192.168.1.81:8080/".split("//")[1];

    const checkAuth = (req, res, next) => {
        if (req.isAuthenticated()) return next();
        req.session.backURL = req.url;
        res.redirect("/login");
    };

    app.get("/", (req, res, next) => {
        res.status(200).sendFile(path.resolve("./views/login.html"))
    });

    app.get("/dashboard", checkAuth, (req, res) => {
        const data = req.session.passport;

        const html = fs.readFileSync(path.resolve("./views/dashboard.html"), { encoding: "utf-8" })
        .replace("{user.username}", data.user.global_name)
        .replace("{user.avatarURL}", `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png`)
        .replace("passportData", JSON.stringify(data))

        res.send(html)
    })

    app.get("/dashboard/guilds", checkAuth, (req, res) => {
        const data = req.session.passport;

        res.status(200).send({ guilds: data.user.guilds })
    });

    app.get("/dashboard/guilds/cache", checkAuth, (req, res) => {
        const data = req.session.passport;
        var responseData = [];

        data.user.guilds.forEach(async element => {
            if (ws.guildCache.includes(element.id) && (HasPermissionByBits("MANAGE_GUILD", element.permissions))) {
                responseData.push({ guild: element, available: true })
                guildCache[element.id] = element
            } else responseData.push({ guild: element, available: false })
        });

        res.status(200).send(responseData)
    })

    app.get("/dashboard/edit", checkAuth, (req, res) => {
        const guildId = req.query.guild;

        if (!guildId) return res.status(400).send("400 Bad Request");
        if (!ws.guildCache.includes(guildId.toString())) return res.status(404).send("404 Not Found");
        if (!HasPermissionByBits("MANAGE_GUILD", guildCache[guildId.toString()]?.permissions)) return res.status(403).send("403 Forbidden. Cannot access due to MANAGE_GUILD permission missing")

        const html = fs.readFileSync(path.resolve("./views/edit.html"), { encoding: "utf-8" })
        .replace("{guild.name}", guildCache[guildId.toString()].name)
        .replace("{guild.iconURL}", guildCache[guildId.toString()].icon ? `https://cdn.discordapp.com/icons/${guildId}/${guildCache[guildId].icon}.png` : "../assets/profile.png")

        res.send(html)
    })

    app.get("/fail", (req, res) => {
        res.status(200).sendFile(path.resolve("./views/fail.html"))
    });

    app.get(
        "/login",
        (req, res, next) => {
            // We determine the returning url.
            if (req.session.backURL) {
                req.session.backURL = req.session.backURL;
            } else if (req.headers.referer) {
                const parsed = new URL(req.headers.referer);
                if (parsed.hostname === app.locals.domain) req.session.backURL = parsed.path;
            } else {
                req.session.backURL = "/";
            }
            // Forward the request to the passport middleware.
            next();
        },
        passport.authenticate("discord"),
    );

    app.get(
        "/callback",
        passport.authenticate("discord", { failureRedirect: "/fail", successRedirect: "/dashboard" }),
        (req, res) => {
            if (req.session.backURL) {
                const backURL = req.session.backURL;
                req.session.backURL = null;
                res.redirect(backURL);
            } else {
                res.redirect("/fail");
            }
        }
    );


    server.listen(8080);
    console.log("Dashboard is now listening on port 8080!")
}