import { Reply } from "../utils/Message.js"
import { IntReply as InteractionReply } from "../utils/Interactions.js";

export default {
    name: "ping",
    category: "info",
    description: "Analiza la latencia del bot.",
    args: false,
    data: {
        type: 1,
        name: "ping",
        description: "Analiza la latencia del bot."
    },
    run: (ws, message) => {
        var renderedPing;
        if (typeof ws.pingMs !== "number") renderedPing = `\`${ws.pingMs}\``
        else renderedPing = `\`${ws.pingMs}ms\``;

        const msgTimestamp = new Date(message.timestamp).getTime();

        Reply(message, { embeds: [{
            color: 0x2b7fdf,
            author: { name: "CountryBot", icon_url: ws.avatarURL },
            title: "¡Pong!",
            description: "Aquí están los resultados de la prueba.",
            fields: [{
                name: "📩 Ping Mensajes",
                value: `\`${Date.now() - msgTimestamp}ms\``
            }, {
                name: "🌐 Ping WebSocket",
                value: renderedPing
            }],
            footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) }
        }] });
    },
    runSlash: (ws, interaction) => {
        var renderedPing;
        if (typeof ws.ping == "string") renderedPing = `\`${ws.pingMs}\``
        else renderedPing = `\`${ws.pingMs}ms\``;

        const msgTimestamp = new Date(interaction.timestamp).getTime();

        InteractionReply(interaction, { embeds: [{
            color: 0x2b7fdf,
            author: { name: "CountryBot", icon_url: ws.avatarURL },
            title: "¡Pong!",
            description: "Aquí están los resultados de la prueba.",
            fields: [{
                name: "📩 Ping Mensajes",
                value: `\`No disponible, usa c!ping para obtenerlo.\``
            }, {
                name: "🌐 Ping WebSocket",
                value: renderedPing
            }],
            footer: { text: `Solicitado por ${interaction.member.user.username}`, icon_url: ws.getAvatarURL(interaction.member.user) }
        }] });
    }
}