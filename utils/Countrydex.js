import { generate } from "@pwldev/discord-snowflake";
import { Edit, SendFile } from "./Message.js";
import { createRequire } from "node:module";
import Store from "data-store";

import fs from "node:fs";
import path from "node:path";
import { Send } from "./Message.js";

const require = createRequire(import.meta.url);
const countryballData = JSON.parse(fs.readFileSync(path.resolve("./countrydex/countryballs.json"), { encoding: "utf-8" }));

import { spawns } from "../events/Ready.js";
// var spawns = new Store({ path: path.join(process.cwd() + "/countrydex/spawns.json") });

export async function SpawnRandomCountryball(message) {
    const snowflakeId = generate(Date.now()).toString();
    countryballData.countryballs.forEach((element, index) => {
        if (element.notSpawn) countryballData.countryballs.splice(index, 1);
    });

    const randomCountryball = countryballData.countryballs[Math.floor(Math.random() * countryballData.countryballs.length)]
    const req = await SendFile(
        { channel_id: message },
        fs.readFileSync(path.resolve(`./assets/countrydex/spawn/${randomCountryball.names[0]}.png`)),
        `countryball_${snowflakeId}.png`,
        {
            content: "¡Ha aparecido un countryball!",
            attachments: [{ id: 0, url: `attachment://countryball_${snowflakeId}.png` }],
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    style: 2,
                    custom_id: `cbspawn_${snowflakeId}`,
                    label: "Atrápame"
                }]
            }]
        }
    ).catch(error => {
        return Send(message, { content: "Lo siento, ocurrió un error al aparecer el countryball." })
    })

    const messageId = req.data.id;

    const randomNumber = Math.floor(Math.random() * (1350 - 1) + 1);

    spawns.set(snowflakeId, {
        catched: false,
        message: {
            channel_id: message,
            id: messageId
        },
        data: randomCountryball,
        shiny: randomNumber == 1000 && (randomCountryball.names[0] === "countrybot" || randomCountryball.names[0] === "alent") ? true : false
    });

    setTimeout(() => {
        if (!spawns.get(snowflakeId + ".catched")) Edit(spawns.get(snowflakeId + ".message"), {
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    style: 2,
                    custom_id: `cbspawn_${snowflakeId}`,
                    label: "Atrápame",
                    disabled: true
                }]
            }]
        });

        spawns.del(snowflakeId)
    }, (3 * 60000))
}

export async function SpawnSpecifiedCountryball(message, ballId) {
    if (ballId > countryballData.countryballs.length - 1) return console.error("Specified countryball does not exist!");
    const snowflakeId = generate(Date.now()).toString();
    countryballData.countryballs.forEach((element, index) => {
        if (element.notSpawn) countryballData.countryballs.splice(index, 1);
    });

    const randomCountryball = countryballData.countryballs[ballId]
    const req = await SendFile(
        { channel_id: message },
        fs.readFileSync(path.resolve(`./assets/countrydex/spawn/${randomCountryball.names[0]}.png`)),
        `countryball_${snowflakeId}.png`,
        {
            content: "¡Ha aparecido un countryball!",
            attachments: [{ id: 0, url: `attachment://countryball_${snowflakeId}.png` }],
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    style: 2,
                    custom_id: `cbspawn_${snowflakeId}`,
                    label: "Atrápame"
                }]
            }]
        }
    ).catch(error => {
        return Send(message, { content: "Lo siento, ocurrió un error al aparecer el countryball." })
    })

    const messageId = req.data.id;

    const randomNumber = Math.floor(Math.random() * (1350 - 1) + 1);

    spawns.set(snowflakeId, {
        catched: false,
        message: {
            channel_id: message,
            id: messageId
        },
        data: randomCountryball,
        shiny: randomNumber == 1000 && (randomCountryball.names[0] === "countrybot" || randomCountryball.names[0] === "alent") ? true : false
    });

    setTimeout(() => {
        if (!spawns.get(snowflakeId + ".catched")) Edit(spawns.get(snowflakeId + ".message"), {
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    style: 2,
                    custom_id: `cbspawn_${snowflakeId}`,
                    label: "Atrápame",
                    disabled: true
                }]
            }]
        });

        spawns.del(snowflakeId)
    }, (3 * 60000))
}