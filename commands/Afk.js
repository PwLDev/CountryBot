import { Reply } from "../utils/Message.js";
import { IntReply } from "../utils/Interactions.js";

const afkMap = new Map();
export { afkMap }

export default {
    name: "afk",
    data: {
        type: 1,
        name: "afk",
        description: "Establece tu estado AFK y avisa a otros.",
        options: [{
            type: 3,
            name: "motivo",
            description: "Motivo para estar AFK"
        }]
    },
    run: async (ws, message, args) => {
        var reason;

        if (args.length == 0) reason = "No se dió un motivo"
        else reason = args.slice(0).join(" ");

        afkMap.set(message.author.id, {
            username: message.author.global_name ?? message.author.username,
            reason: reason,
            time: Math.floor(Date.now() / 1000),// Convert milliseconds to seconds
            guild: message.guild_id
        });

        Reply(message, { embeds: [{
            color: 0x2b7fdf,
            title: `¡Adiós, ${message.author.global_name ?? message.author.username}!`,
            description: `Ahora estás AFK.\nMotivo: **${reason}**`,
            thumbnail: { url: ws.getAvatarURL(message.author) },
            footer: { text: "#FuerzasPac | Avisaré a quienes te mencionen." }
        }] })
    },
    runSlash: async (ws, interaction) => {
        var reason;

        if (!interaction.data?.options) reason = "No se dió un motivo"
        else reason = interaction.data.options[0].value;

        afkMap.set(interaction.member.user.id, {
            username: interaction.member.user.global_name ?? interaction.member.user.username,
            reason: reason,
            time: Math.floor(Date.now() / 1000),// Convert milliseconds to seconds
            guild: interaction.guild_id
        });

        IntReply(interaction, { embeds: [{
            color: 0x2b7fdf,
            title: `¡Adiós, ${interaction.member.user.global_name ?? interaction.member.user.username}!`,
            description: `Ahora estás AFK.\nMotivo: **${reason}**`,
            thumbnail: { url: ws.getAvatarURL(interaction.member.user) },
            footer: { text: "#FuerzasPac | Avisaré a quienes te mencionen." }
        }] })
    }
}