import { IntReply } from "../utils/Interactions.js";
import { Reply } from "../utils/Message.js";

export default {
    name: "servercount",
    alias: ["svc", "svcount"],
    category: "info",
    description: "Muestra la cantidad de servidores donde está CountryBot",
    args: false,
    data: {
        type: 1,
        name: "servercount",
        description: "Muestra la cantidad de servidores donde está Countrybot"
    },
    run: (ws, message) => {
        return Reply(message, { embeds: [{
            color: 0x2b7fdf,
            author: { name: "CountryBot", icon_url: ws.avatarURL },
            title: "Cuenta de servidores",
            description: `Actualmente, CountryBot es usado en:\n**${ws.guildCount} servidores**`,
            footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) }
        }] });
    },
    runSlash: (ws, interaction) => {
        return IntReply(interaction, { embeds: [{
            color: 0x2b7fdf,
            author: { name: "CountryBot", icon_url: ws.avatarURL },
            title: "Cuenta de servidores",
            description: `Actualmente, CountryBot es usado en:\n**${ws.guildCount} servidores**`,
            footer: { text: `Solicitado por ${interaction.member.user.username}`, icon_url: ws.getAvatarURL(interaction.member.user) }
        }] });
    }
}