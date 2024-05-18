import { getPost } from "random-reddit";
import { Reply } from "../utils/Message.js";
import { IntReply } from "../utils/Interactions.js";

export default {
    name: "random",
    category: "fun",
    description: "Obtiene un comic aleatorio de Polandball",
    args: false,
    alias: ["random_polandball", "random_comic"],
    data: {
        type: 1,
        name: "random",
        description: "Obtiene un comic aleatorio de Polandball",
    },
    run: async (ws, message) => {
        const randomPost = await getPost("polandball");

        return Reply(message, { embeds: [{
            color: 0x2b7fdf,
                author: { name: "r/polandball", icon_url: "https://styles.redditmedia.com/t5_2sih3/styles/communityIcon_mkqjxv5y5fra1.png?width=256&v=enabled&s=539f2f606945df55539bc72587c087b980b8e42a" },
                title: randomPost.title,
                url: `https://reddit.com/r/polandball/comments/${randomPost.id}/${randomPost.name}`,
                image: { url: randomPost.url },
                description: `Post por ${randomPost.author}\n⬆ ${randomPost.ups} ⬇ ${randomPost.downs}`,
                footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) }
        }] })
    },
    runSlash: async (ws, interaction) => {
        const randomPost = await getPost("polandball");

        return IntReply(interaction, { embeds: [{
            color: 0x2b7fdf,
                author: { name: "r/polandball", icon_url: "https://styles.redditmedia.com/t5_2sih3/styles/communityIcon_mkqjxv5y5fra1.png?width=256&v=enabled&s=539f2f606945df55539bc72587c087b980b8e42a" },
                title: randomPost.title,
                url: `https://reddit.com/r/polandball/comments/${randomPost.id}/${randomPost.name}`,
                image: { url: randomPost.url },
                description: `Post por ${randomPost.author}\n⬆ ${randomPost.ups} ⬇ ${randomPost.downs}`,
                footer: { text: `Solicitado por ${interaction.member.user.username}`, icon_url: ws.getAvatarURL(interaction.member.user) }
        }] })
    }
}