import Store from "data-store";
import path from "node:path";
import { SpawnRandomCountryball } from "../utils/Countrydex.js";
import { count } from "node:console";
import { premiumModel } from "../models/Premium.js";
import { APIRequest } from "../utils/APIRequest.js";

var countrydexConfig = new Store({ path: path.join(process.cwd() + "/countrydex/config.json"), debounce: 0 });
var triggers = new Store({ path: path.join(process.cwd() + "/countrydex/triggers.json"), debounce: 0 });
var spawns = new Store({ path: path.join(process.cwd() + "/countrydex/spawns.json") });
var owns = new Store({ path: path.join(process.cwd() + "/countrydex/owns.json") });

export { triggers, countrydexConfig, spawns, owns }

export default {
    name: "READY",
    run: (ws, d) => {
        console.info(`Connected as ${d.user.username}#${d.user.discriminator}`);
        ws.avatarURL = `https://cdn.discordapp.com/avatars/${d.user.id}/${d.user.avatar}.png`
        ws.getAvatarURL = (user) =>`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
        ws.guildCache = [];

        setTimeout(() => console.info(`Bot is connected in ${ws.guildCount} guilds.`), 15000)
        setInterval(() => {
            triggers.load();

            countrydexConfig.load();

            spawns.load();

            owns.load();
        }, 1500)

        setInterval(async () => {
            const documents = await premiumModel.find({});

            documents.forEach(async document => {
                if (!document.end) {
                    document.deleteOne();

                    const dmChannel = await APIRequest("/users/@me/channels", {
                        method: "POST",
                        body: { recipient_id: document.user }
                    }).then(res => res.json())
                    .catch(error => { return console.error(error) });

                    APIRequest(`/channels/${dmChannel.id}/messages`, { content: "¡Tu suscripción de CountryBot Premium ha finalizado!\n\nSi deseas volver a tener CountryBot Premium o necesitas otra clave, contáctate con Alen't o PwL. Gracias por el apoyo." });
                }

                if (Date.now() >= document.end) {
                    console.log(document)
                    document.deleteOne();

                    const dmChannel = await APIRequest("/users/@me/channels", {
                        method: "POST",
                        body: { recipient_id: document.user }
                    }).then(res => res.json())
                    .catch(error => { return console.error(error) });

                    APIRequest(`/channels/${dmChannel.id}/messages`, { method: "POST", body: { content: "# ¡Tu suscripción de CountryBot Premium ha finalizado!\n\nSi deseas volver a tener CountryBot Premium o necesitas otra clave, contáctate con Alen't o PwL. Gracias por el apoyo, se aprecia demasiado :heart:." } });
                }
                else return;
            })
        }, 30000)
    }
}