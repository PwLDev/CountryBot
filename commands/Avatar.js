import { GetMember } from "../utils/Get.js";
import { IntReply } from "../utils/Interactions.js";
import { Reply } from "../utils/Message.js";


export default {
    name: "avatar",
    alias: ["a"],
    category: "info",
    description: "Muestra tu avatar o el de alguien más.",
    args: true,
    usage: "<pregunta>",
    data: {
        type: 1,
        name: "avatar",
        description: "Muestra tu avatar o el de alguien más.",
        options: [{
            type: 6,
            name: "user",
            description: "Usuario para ver su avatar.",
            required: false
        }]
    },
    run: async (ws, message, args) => {
        if (args.length == 0) args[0] = message.author.id;
        else args[0] = args[0].replace("<@", "").replace(">", "");

        await GetMember(message.guild_id, args[0])
        .then(data => {

            return Reply(message, { embeds: [{
                color: 0x2b7fdf,
                author: { name: data.user.global_name, icon_url: ws.getAvatarURL(data.user) },
                footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) },
                title: `Avatar de ${data.user.username}#${data.user.discriminator}`,
                url: `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png?size=256`,
                image: { name: data.user.username, url: `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png?size=256` }
            }] });
        })
        .catch(err => {
            console.error(err);
            return Reply(message, { embeds: [{
                color: 0xcc0000,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) },
                description: `:x: No se encontró el usuario ${args[0]}. Asegúrate de mencionarlo o usar su ID correcto.`
            }] });
        })
    },
    runSlash: async (ws, interaction) => {
        var id;

        if (interaction.data.options) id = interaction.data.options[0].value
        else id = interaction.member.user.id;

        await GetMember(interaction.guild_id, id)
        .then(data => {
            return IntReply(interaction, { embeds: [{
                color: 0x2b7fdf,
                author: { name: data.user.global_name, icon_url: ws.getAvatarURL(data.user) },
                footer: { text: `Solicitado por ${interaction.member.user.username}`, icon_url: ws.getAvatarURL(interaction.member.user) },
                title: `Avatar de ${data.user.username}#${data.user.discriminator}`,
                url: `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png?size=256`,
                image: { name: data.user.username, url: `https://cdn.discordapp.com/avatars/${data.user.id}/${data.user.avatar}.png?size=256` }
            }] });
        })
        .catch(err => {
            console.error(err);
            return IntReply(interaction, { embeds: [{
                color: 0xcc0000,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                footer: { text: `Solicitado por ${interaction.member.user.username}`, icon_url: ws.getAvatarURL(interaction.member.user) },
                description: `:x: No se encontró el usuario ${id}. Asegúrate de mencionarlo o usar su ID correcto.`
            }] });
        })
    }
}