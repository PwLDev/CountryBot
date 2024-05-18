import { APIRequest } from "./utils/APIRequest.js";
import fs from "node:fs";
import path from "node:path";

var availableCommands = new Array();
var disallowedCommands = ["config", "afk", "edit"];

fs.readdirSync(path.resolve("./commands/")).filter(f => f.endsWith(".js"))
.forEach(async file => {
    const { default: command } = await import(`./commands/${file}`);

    if (!command.data) return;
    if (command.data.name === "spawn") return;
    availableCommands.push(command.data)

});

setTimeout(() => {
    try {
        console.log("Updating Slash Commands...\nThis will take a while, please wait.");

        availableCommands.forEach(cmd => {
            if (disallowedCommands.includes(cmd.name)) cmd["dm_permission"] = false;
            else cmd["dm_permission"] = true;
        });

        APIRequest("/applications/1090811431391334520/commands", {
            method: "PUT",
            body: availableCommands
        })

        console.info("Updated", availableCommands.length, "commands.")
    } catch (error) {
        throw new Error(error)
    }
}, 1000)