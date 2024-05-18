import { Reply } from "../utils/Message.js";
import { premiumModel } from "../models/Premium.js";
import { IntReply } from "../utils/Interactions.js";
import ms from "ms";
import { keyModel } from "../models/Keys.js";
import { APIRequest } from "../utils/APIRequest.js";

const owners = ["626928937355706373", "779464887231447073", "1072942897680371713", "791522027915444254"] 

export default {
    name: "premium",
    description: "Descubre más sobre premium",
    data: {
        type: 1,
        name: "premium",
        description: "Descubre más sobre CountryBot Premium"
    },
    run: async (ws, message, args) => {
        if (args.length == 0) return Reply(message, { content: "https://cdn.discordapp.com/attachments/1091932806206201857/1122673352595742760/Untitled38_20230625164301.png" });

        if (args.length > 0) {
            if (!owners.includes(message.author.id)) return;

            if (args[0] == "add") {
                if (!args[1]) return Reply(message, { content: "Tienes que mencionar a un miembro o proporcionar una ID para administrar premium." })
                const userId = args[1].replace("<@", "").replace(">", "");

                const data = await premiumModel.findOne(
                    {
                        user: userId,
                    }
                );

                if (data) return Reply(message, { content: "Este usuario ya tiene premium." })
                else {
                    new premiumModel({
                        user: userId,
                        time: Date.now() + 2592000000 
                    }).save();

                    return Reply(message, { content: "El usuario <@" + userId + "> obtuvo premium. ¡Felicidades!" });
                }
            }

            if (args[0] == "remove") {
                if (!args[1]) return Reply(message, { content: "Tienes que mencionar a un miembro o proporcionar una ID para administrar premium." })
                const userId = args[1].replace("<@", "").replace(">", "");

                const data = await premiumModel.findOne(
                    {
                        user: userId
                    }
                );

                if (!data) return Reply(message, { content: "Este usuario no tiene premium." })
                else {
                    data.deleteOne();

                    Reply(message, { content: "El usuario <@" + userId + "> se le quitó el premium. Que triste." })
                }
            }


            if (args[0] == "generate") {
                if (!args[1]) return Reply(message, { content: "Debes introducir un tiempo valido." })
                const time = ms(args[1]);
                const key = generateCode();

                if (time) {
                    Reply(message, { content: "Se genero un codigo, mas informacion al DM." })
                    const dmChannel = await APIRequest("/users/@me/channels", {
                        method: "POST",
                        body: { recipient_id: message.author.id }
                    }).then(res => res.json());

                    APIRequest(`/channels/${dmChannel.id}/messages`, {
                        method: "POST",
                        body: {
                            embeds: [{
                                color: 0x2b7fdf,
                                title: "Codigo Premium",
                                description: `Se genero un codigo de CountryBot Premium por ${args[1]}`,
                                fields: [{
                                    name: "Clave",
                                    value: "```" + key + "```"
                                }]
                            }],
                        }
                    });

                    new keyModel({
                        key: key.replace("-", ""),
                        claimed: false,
                        end: Date.now() + parseInt(time)
                    }).save();
                } else return Reply(message, { content: "No se ingreso un tiempo valido." })
            }
        }


    },
    runSlash: (ws, interaction) => {
        IntReply(interaction, { embeds: [{
            title: "CountryBot Premium",
            description: `Obtenlo a través de [nuestra página web](https://dashboard.countrybot.lat)`,
            image: { url: "https://cdn.discordapp.com/attachments/1091932806206201857/1122673352595742760/Untitled38_20230625164301.png" },
            color: 0x2b7fdf,
        }] })
    }
}

function generateCode() {
    const charList = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var part1 = "", part2 = "", part3 = "", part4 = "";

    for (var i = 0; i < 4; i++) {
        part1 += charList.charAt(Math.floor(Math.random() * charList.length));
        part2 += charList.charAt(Math.floor(Math.random() * charList.length));
        part3 += charList.charAt(Math.floor(Math.random() * charList.length));
        part4 += charList.charAt(Math.floor(Math.random() * charList.length));
    }

    return `${part1}-${part2}-${part3}-${part4}`
}