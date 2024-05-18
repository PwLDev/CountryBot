import WebSocket from "ws";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { Collection } from "@discordjs/collection";
import { Reply } from "./utils/Message.js";
import { IntReply } from "./utils/Interactions.js"
import mongoose from "mongoose";
import "reflect-metadata"
import { initServer } from "./localServer.js";

const ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");
dotenv.config()

var interval = 0, lastPing;

ws.events = new Map();
ws.commands = new Collection();
ws.guildMap = new Map();
ws.pingMs = "Cargando ping...";
ws.guildCount = 0;
ws.loadingState = true;
ws.loadingStart = Date.now();

const payload = {
    op: 2,
    d: {
        token: process.env["token"],
        intents: 46727,
        properties: {
            device: "pc",
            browser: "chrome",
            os: process.platform
        },
        presence: {
            activities: [{
                name: "Mantenimiento",
                type: 3
            }],
            status: "dnd",
            afk: false,
            since: Date.now()
        }
    }
}

ws.on("open", () => ws.send(JSON.stringify(payload)));

fs.readdirSync(path.resolve("./events/")).filter(f => f.endsWith(".js"))
.forEach(async file => {
    const { default: event } = await import(`./events/${file}`);

    ws.events.set(event.name, event);
});

fs.readdirSync(path.resolve("./commands/")).filter(f => f.endsWith(".js"))
.forEach(async file => {
    const { default: command } = await import(`./commands/${file}`);

    ws.commands.set(command.name, command);
});


mongoose.connect(`mongodb://${process.env["mongoUser"]}:${process.env["mongoPwd"]}@ac-n8wr7zc-shard-00-00.8oahhzm.mongodb.net:27017,ac-n8wr7zc-shard-00-01.8oahhzm.mongodb.net:27017,ac-n8wr7zc-shard-00-02.8oahhzm.mongodb.net:27017/?ssl=true&replicaSet=atlas-14abre-shard-0&authSource=admin&retryWrites=true&w=majority`, { connectTimeoutMS: 60000 });

const MongoDB = mongoose.connection;
MongoDB.on("disconnect", () => mongoose.connect(`mongodb://${process.env["mongoUser"]}:${process.env["mongoPwd"]}@ac-n8wr7zc-shard-00-00.8oahhzm.mongodb.net:27017,ac-n8wr7zc-shard-00-01.8oahhzm.mongodb.net:27017,ac-n8wr7zc-shard-00-02.8oahhzm.mongodb.net:27017/?ssl=true&replicaSet=atlas-14abre-shard-0&authSource=admin&retryWrites=true&w=majority`, { connectTimeoutMS: 60000 }))
MongoDB.on("error", console.error.bind(console, "Connection error to MongoDB:  "))
MongoDB.on("open", () => console.info("Connected successfully to MongoDB"));

initServer(ws)

ws.on("message", (data) => {
    const payload = JSON.parse(data);
    const { d, t, op } = payload;

    switch (op) {
        case 10:
            interval = heartbeat(d.heartbeat_interval);
            console.info("Heartbeat Interval", d.heartbeat_interval);
        case 11:
            if (!lastPing) return;
            ws.pingMs = Date.now() - lastPing;
    }

    const event = ws.events.get(t);
    if (!event) return;
    else event.run(ws, d)
});

ws.on("close", (code, reason) => {
    console.info(`Client has just closed!\n\nInfo:\nClose Code: ${code}\nWith ${reason ? reason + " reason" : "no reason"}\n\nExiting now...`);
    process.exit(0)
})

const heartbeat = (ms) => { return setInterval(() => { ws.send(JSON.stringify({ op: 1, d: null })); lastPing = Date.now(); }, ms); };