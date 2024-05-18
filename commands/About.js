import { Reply } from "../utils/Message.js";
import { IntReply as InteractionReply } from "../utils/Interactions.js";

export default {
    name: "about",
    category: "info",
    description: "Descubre más información sobre el bot.",
    args: false,
    data: {
        type: 1,
        name: "about",
        description: "Descubre más información sobre el bot."
    },
    run: (ws, message) => {
        Reply(message, { embeds: [{
            color: 0x2b7fdf,
            author: { name: "CountryBot", icon_url: ws.avatarURL },
            title: "Información",
            description: `**Versión del bot**: 1.4\n\nCreado por [PwL](https://github.com/PwLDev) y Alen't. Para la comunidad hispana de Countryballs.\nCo-creador: Venezuela VIP (DazianosD)\n¿No sabes que comandos usar? Usa \`/help\` para ver los comandos que puedes utilizar.`,
            footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) },
            thumbnail: { url: "https://cdn.discordapp.com/attachments/1091932806206201857/1097003039891673159/67_sin_titulo_20230415223813.png" }
        }] })
    },
    runSlash: (ws, interaction) => {
        InteractionReply(interaction, { embeds: [{
            color: 0x2b7fdf,
            author: { name: "CountryBot", icon_url: ws.avatarURL },
            title: "Información",
            description: `**Versión del bot**: 1.4\n\nCreado por [PwL](https://github.com/PwLDev) y Alen't. Para la comunidad hispana de Countryballs.\nCo-creador: Venezuela VIP (DazianosD)\n¿No sabes que comandos usar? Usa \`/help\` para ver los comandos que puedes utilizar.`,
            footer: { text: `Solicitado por ${interaction.user.username}`, icon_url: ws.getAvatarURL(interaction.member.user) },
            thumbnail: { url: "https://cdn.discordapp.com/attachments/1091932806206201857/1097003039891673159/67_sin_titulo_20230415223813.png" }
        }] })
    }
}