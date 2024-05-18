import { Reply } from "../utils/Message.js";
import { IntReply } from "../utils/Interactions.js";

export default {
    name: "emoji",
    alias: ["e", "jumbo"],
    category: "fun",
    description: "Hacer un emoji más grande y mostrarlo.",
    args: true,
    usage: "<emoji (solo emojis personalizados)>",
    data: {
        type: 1,
        name: "emoji",
        description: "Hacer un emoji más grande y mostrarlo.",
        options: [{
            type: 3,
            name: "emoji",
            description: "Emoji a ampliar",
            required: true
        }]
    },
    run: (ws, message, args) => {
        if (args.length == 0) return Reply(message, { embeds: [{
            color: 0xcc0000,
            author: { name: "CountryBot", icon_url: ws.avatarURL },
            footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) },
            description: ":x: No ingresaste el emoji a ampliar."
        }] });

        const emoteRegex = /<:.+:(\d+)>/gm
        const animatedEmoteRegex = /<a:.+:(\d+)>/gm;
        var emoji;

        if (emoji = emoteRegex.exec(args[0])) {
            const url = `https://cdn.discordapp.com/emojis/${emoji[1]}.png?size=1024`;
            Reply(message, { embeds: [{
                color: 0x2b7fdf,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                image: { url: url, width: 1500, height: 1500 },
                footer: { text: `Solicitado por ${message.author.username} | Potenciado por OpenAI`, icon_url: ws.getAvatarURL(message.author) } 
            }] });
        } else if (emoji = animatedEmoteRegex.exec(args[0])) {
            const url = `https://cdn.discordapp.com/emojis/${emoji[1]}.gif?size=1024`;
            Reply(message, { embeds: [{
                color: 0x2b7fdf,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                image: { url: url, width: 1500, height: 1500 },
                footer: { text: `Solicitado por ${message.author.username} | Potenciado por OpenAI`, icon_url: ws.getAvatarURL(message.author) } 
            }] });
        } else {
            return Reply(message, { embeds: [{
                color: 0xcc0000,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) },
                description: ":x: Al parecer este no es un emoji válido.\nAsegúrate de que yo esté en ese servidor o que hayas ingresado un emoji personalizado. No es compatible con emojis normales."
            }] });
        }
    },
    runSlash: (ws, interaction) => {
        const emoteRegex = /<:.+:(\d+)>/gm
        const animatedEmoteRegex = /<a:.+:(\d+)>/gm;
        var emoji;

        const arg = interaction.data.options[0].value;

        if (emoji = emoteRegex.exec(arg)) {
            const url = `https://cdn.discordapp.com/emojis/${emoji[1]}.png?size=1024`;
            IntReply(interaction, { embeds: [{
                color: 0x2b7fdf,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                image: { url: url, width: 1024, height: 1024 },
                footer: { text: `Solicitado por ${interaction.member.user.username} | Potenciado por OpenAI`, icon_url: ws.getAvatarURL(interaction.member.user) } 
            }] });
        } else if (emoji = animatedEmoteRegex.exec(arg)) {
            const url = `https://cdn.discordapp.com/emojis/${emoji[1]}.gif?size=1024`;
            IntReply(interaction, { embeds: [{
                color: 0x2b7fdf,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                image: { url: url, width: 1024, height: 1024 },
                footer: { text: `Solicitado por ${interaction.member.user.username} | Potenciado por OpenAI`, icon_url: ws.getAvatarURL(interaction.member.user) } 
            }] });
        } else {
            return IntReply(interaction, { embeds: [{
                color: 0xcc0000,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                footer: { text: `Solicitado por ${interaction.member.user.username}`, icon_url: ws.getAvatarURL(interaction.member.user) },
                description: ":x: Al parecer este no es un emoji válido.\nAsegúrate de que yo esté en ese servidor o que hayas ingresado un emoji personalizado. No es compatible con emojis normales."
            }] });
        }
    }
}