import { Reply } from "../utils/Message.js";
import { IntReply, EphemeralReply } from "../utils/Interactions.js";
import axios from "axios";

export default {
    name: "cat",
    category: "fun",
    description: "Responde con un gatito aleatorio, miau.",
    args: false,
    data: {
        type: 1,
        name: "cat",
        description: "Responde con un gatito aleatorio, miau."
    },
    run: async (ws, message) => {
        const request = await axios.get("https://api.thecatapi.com/v1/images/search")
        .catch(async error => {
            console.error("Error while request to TheCatAPI", error);
            return Reply(message, { content: "Lo siento, tenemos problemas con el servicio 😿.\nVuelve a intentarlo más tarde..." })
        })
        .then(res => res.data);

        return Reply(message, { embeds: [{
            author: { name: "CountryBot", icon_url: ws.avatarURL },
            footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) },
            color: 0x2b7fdf,
            description: "Miau :3",
            image: { url: request[0].url },
        }], components: [{
            type: 1,
            components: [{
                type: 2,
                label: "Descubre más",
                custom_id: "catapi_"+request[0].id,
                style: 1,
                emoji: { name: "🐱" }
            }]
        }] });
    },
    runSlash: async (ws, interaction) => {
        const request = await axios.get("https://api.thecatapi.com/v1/images/search")
        .catch(async error => {
            console.error("Error while request to TheCatAPI", error);
            return EphemeralReply(interaction, { content: "Lo siento, tenemos problemas con el servicio 😿.\nVuelve a intentarlo más tarde..." })
        })
        .then(res => res.data);

        return IntReply(interaction, { embeds: [{
            author: { name: "CountryBot", icon_url: ws.avatarURL },
            footer: { text: `Solicitado por ${interaction.user.username}`, icon_url: ws.getAvatarURL(interaction.member.user) },
            color: 0x2b7fdf,
            description: "Miau :3",
            image: { url: request[0].url },
        }], components: [{
            type: 1,
            components: [{
                type: 2,
                label: "Descubre más",
                custom_id: "catapi_"+request[0].id,
                style: 1,
                emoji: { name: "🐱" }
            }]
        }] });
    }
}