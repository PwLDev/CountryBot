import { Reply } from "../utils/Message.js";
import { IntReply, EphemeralReply } from "../utils/Interactions.js";
import axios from "axios";

export default {
    name: "neko",
    category: "fun",
    description: "Responde con una chica gato aleatoria.",
    args: false,
    data: {
        type: 1,
        name: "neko",
        description: "Responde con una chica gato aleatoria."
    },
    run: async (ws, message) => {
        const request = await axios.get("https://nekos.life/api/v2/img/neko")
        .catch(async error => {
            console.error("Error while request to nekos.life", error);
            return Reply(message, { content: "Lo siento, tenemos problemas con el servicio 😿.\nVuelve a intentarlo más tarde..." })
        })
        .then(res => res.data);

        return Reply(message, { embeds: [{
            footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) },
            color: 0x2b7fdf,
            description: "Chica kitsune >w<",
            image: { url: request.url },
        }] });
    },
    runSlash: async (ws, interaction) => {
        const request = await axios.get("https://nekos.life/api/v2/img/fox_girl")
        .catch(async error => {
            console.error("Error while request to nekos.life", error);
            return EphemeralReply(interaction, { content: "Lo siento, tenemos problemas con el servicio 😿.\nVuelve a intentarlo más tarde..." })
        })
        .then(res => res.data);

        return IntReply(interaction, { embeds: [{
            footer: { text: `Solicitado por ${interaction.member.user.username}`, icon_url: ws.getAvatarURL(interaction.member.user) },
            color: 0x2b7fdf,
            description: "Chica kitsune >w<",
            image: { url: request[0].url },
        }] });
    }
}