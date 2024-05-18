import { SpawnRandomCountryball } from "../utils/Countrydex.js";
import { GetChannel } from "../utils/Get.js";
import { Reply, Send } from "../utils/Message.js";
import Store from "data-store";
import path from "node:path";
import { triggers, countrydexConfig } from "./Ready.js";
import { guildBlacklistModel } from "../models/GuildBlacklist.js";
import { userBlacklistModel } from "../models/UserBlacklist.js";
import { afkMap } from "../commands/Afk.js";
import { giveawayMap } from "../commands/Giveaway.js";
import { APIRequest } from "../utils/APIRequest.js";

const ownerIds = ["1072942897680371713", "791522027915444254", "779464887231447073", "626928937355706373"];
const prefix = "c!";

const giveawayPointsMap = new Map();
export { giveawayPointsMap }

export default {
    name: "MESSAGE_CREATE",
    run: async (ws, message) => {
        if (message.author.bot) return;

        if (message.content.match(/<@!*&*[0-9]+>/gm)) {
            const mentionedId = /<@!*&*[0-9]+>/gm.exec(message.content)[0]?.replace("<@", "").replace(">", "");
            if (afkMap.has(mentionedId) && afkMap.get(mentionedId)?.guild === message.guild_id && mentionedId !== message.author.id) return Reply(message, { content: `**${afkMap.get(mentionedId).username} está AFK.**\nDesde <t:${afkMap.get(mentionedId).time}:R>\nMotivo: ${afkMap.get(mentionedId).reason}` });
        }

        if (afkMap.has(message.author.id) && afkMap.get(message.author.id)?.guild === message.guild_id) {
            // <@!*&*[0-9]+>
            Reply(message, { content: `**¡Hola, ${message.author.global_name ?? message.author.username}!**\nHe removido tu estado AFK, ausente desde <t:${afkMap.get(message.author.id).time}:R>` });
            afkMap.delete(message.author.id);
        }

        if (giveawayMap.has(message.channel_id)) {
            const data = giveawayMap.get(message.channel_id);
            const guess = message.content.toLowerCase().replace(" ", "").replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u");
            if (data.randomFlag && data.randomFlag?.catch_names.includes(guess)) {
                if (data.guessed) return;
                APIRequest(`/channels/${message.channel_id}/messages/${message.id}/reactions/%E2%9C%85/@me`, { method: "PUT" });
                clearTimeout(data.noGuess)

                giveawayMap.set(message.channel_id, {
                    objective: data.objective,
                    prize: data.prize ?? "No especificado",
                    author: data.author,
                    noGuess: null,
                    randomFlag: data.randomFlag,
                    points: giveawayPointsMap,
                    guessed: true
                });

                if (!giveawayPointsMap.has(message.channel_id))
                    giveawayPointsMap.set(message.channel_id, {});

                if (!giveawayPointsMap.get(message.channel_id).hasOwnProperty(message.author.id)) {
                    const pointsObject = giveawayPointsMap.get(message.channel_id);
                    pointsObject[message.author.id] = {
                        name: message.author.global_name,
                        points: 1
                    }
                    giveawayPointsMap.set(message.channel_id, pointsObject);

                    if (pointsObject[message.author.id].points == data.objective) {
                        giveawayMap.set(message.channel_id, {
                            objective: data.objective,
                            prize: data.prize ?? "No especificado",
                            author: data.author,
                            noGuess: null,
                            randomFlag: data.randomFlag,
                            points: giveawayPointsMap,
                            guessed: true,
                            end: true
                        });
                        giveawayPointsMap.delete(message.channel_id)
                        return Reply(message, {
                            content: `## Ganador :tada:\n**¡${message.author.global_name}** fue el ganador de este sorteo!\nHa ganado **${data.prize}** GG!`
                        });
                    }
                } else {
                    const pointsObject = giveawayPointsMap.get(message.channel_id);
                    pointsObject[message.author.id] = {
                        name: message.author.global_name,
                        points: pointsObject[message.author.id].points + 1
                    }

                    if (pointsObject[message.author.id].points == data.objective) {
                        giveawayMap.set(message.channel_id, {
                            objective: data.objective,
                            prize: data.prize ?? "No especificado",
                            author: data.author,
                            noGuess: null,
                            randomFlag: data.randomFlag,
                            points: giveawayPointsMap,
                            guessed: true,
                            end: true
                        });
                        giveawayPointsMap.delete(message.channel_id)
                        return Reply(message, {
                            content: `## Ganador :tada:\n**¡${message.author.global_name}** fue el ganador de este sorteo!\nHa ganado **${data.prize}** GG!`
                        });
                    }

                    giveawayPointsMap.set(message.channel_id, pointsObject);
                }

                setTimeout(() => {
                    var table = new String();
                    
                    for (const [key, value] of Object.entries(giveawayPointsMap.get(message.channel_id))) {
                        if (table.length == 0)
                            table = `**${value.name}** - ${value.points} puntos\n`
                        else 
                            table += `**${value.name}** - ${value.points} puntos\n`
                    }

                    Send(message, {
                       content: `## Puntuación\n\n${table}`
                    });  
                }, 1500);
            }
        }
        // console.log(`Mensaje enviado en el servidor: ${ws.guildMap.get(message.guild_id).name}\nDice: ${message.content}\nEnviado en el canal con ID: ${message.channel_id}`)\
        //if (blacklistData.has(message.guild_id) && message.content !== "c!blacklist") return;
        if (countrydexConfig.has(message.guild_id) && message.channel_id === countrydexConfig.get(message.guild_id + ".channel") && triggers.get(message.guild_id) == true) {
            triggers.set(message.guild_id, false)
            setTimeout(() => {
                SpawnRandomCountryball(countrydexConfig.get(message.guild_id + ".channel"));
            }, 5000)
        }
        if (!message.guild_id && message.content.toLowerCase().replace(" ", "").startsWith(prefix)) return Reply(message, { content: "Lo siento, no puedes usarme en DM.\nSi deseas añadirme a un servidor, da clic en mi perfil y pulsa Añadir a servidor." })
        if (!message.content.toLowerCase().replace(" ", "").startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        const cmd = ws.commands.get(command) || ws.commands.find(cmd => cmd.alias && cmd.alias.includes(command));
        if (!cmd) return;

        if (cmd.ownerOnly) {
            if (!ownerIds.includes(message.author.id)) return;
        }

        if (cmd.name !== "blacklist" && (await guildBlacklistModel.findOne({ _id: message.guild_id }))) return Reply(message, { embeds: [{
            color: 0xcc0000,
            author: { name: "CountryBot", icon_url: ws.avatarURL },
            description: ":exclamation: No puedes utilizar este comando porque este servidor está en la Blacklist, por lo tanto no podrás utilizar CountryBot en este servidor. Contáctate con los desarrolladores para más información <:info:1113653739719495761>",
        }] })

        if (cmd.name !== "blacklist" && (await userBlacklistModel.findOne({ _id: message.author.id }))) return Reply(message, { embeds: [{
            color: 0xcc0000,
            author: { name: "CountryBot", icon_url: ws.avatarURL },
            description: ":exclamation: No puedes utilizar este comando porque estás en la Blacklist, por lo tanto no podrás utilizar CountryBot. Contáctate con los desarrolladores para más información <:info:1113653739719495761>",
        }] })

        try {
            cmd.run(ws, message, args);
        } catch (error) {
            Reply(message, { embeds: [{
                color: 0xcc0000,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) }, 
                description: ":exclamation: Hubo un error al intentar ejecutar el comando.\nSi el error persiste, contáctate con el desarrollador.",
                image: { url: "https://cdn.discordapp.com/attachments/1091932806206201857/1148389754283499550/162_sin_titulo_20230902220804.png" }
            }] });

            console.warn(error);
        }
    }
}