import { DeferReply, EditReply } from "../utils/Interactions.js";
import { Reply, Edit } from "../utils/Message.js";

export default {
    name: "8ball",
    category: "fun",
    description: "Pregúntale algo a la bola 8 mágica",
    args: true,
    usage: "<pregunta>",
    data: {
        type: 1,
        name: "8ball",
        description: "Pregúntale algo a la bola 8 mágica",
        options: [{
            type: 3,
            name: "prompt",
            description: "Pregunta para hacerle a la bola 8",
            required: true
        }]
    },
    run: (ws, message, args) => {
        if (args.length === 0) {
            return Reply(message, { embeds: [{
                color: 0xcc0000,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) },
                description: ":x: No ingresaste qué preguntarle a la bola 8."
            }] });
        }

        const ballResponses = ["Es cierto", "Es decididamente así", "Sin lugar a dudas", "Sí, definitivamente", "Puedes confiar en ello", "Como yo lo veo, sí", "Lo más probable", "Perspectiva buena", "Sí", "Las señales apuntan a que sí", "Respuesta confusa, vuelve a intentarlo", "Vuelve a preguntar más tarde", "Mejor no decirte ahora", "No se puede predecir ahora", "Concéntrate y vuelve a preguntar", "No cuentes con ello", "Mi respuesta es no", "Mis fuentes dicen que no", "Las perspectivas no son muy buenas", "Muy dudoso"];

        const randomReply = ballResponses[Math.floor(Math.random() * ballResponses.length)];
        const prompt = args.slice(0).join(" ")


        Reply(message, { content: null, embeds: [{
            color: 0x2b7fdf,
            author: { name: "CountryBot", icon_url: ws.avatarURL },
            title: "Bola 8 Mágica",
            description: `**Pregunta:** *${prompt}*\n\n🎱 *${randomReply}*`,
            footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) },
        }] });
    },
    runSlash: (ws, interaction) => {
        const ballResponses = ["Es cierto", "Es decididamente así", "Sin lugar a dudas", "Sí, definitivamente", "Puedes confiar en ello", "Como yo lo veo, sí", "Lo más probable", "Perspectiva buena", "Sí", "Las señales apuntan a que sí", "Respuesta confusa, vuelve a intentarlo", "Vuelve a preguntar más tarde", "Mejor no decirte ahora", "No se puede predecir ahora", "Concéntrate y vuelve a preguntar", "No cuentes con ello", "Mi respuesta es no", "Mis fuentes dicen que no", "Las perspectivas no son muy buenas", "Muy dudoso"];
        DeferReply(interaction);

        const randomReply = ballResponses[Math.floor(Math.random() * ballResponses.length)];
        const prompt = interaction.data.options[0].value

        setTimeout(() => {
            EditReply(interaction, { embeds: [{
                color: 0x2b7fdf,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                title: "Bola 8 Mágica",
                description: `**Pregunta:** *${prompt}*\n\n🎱 *${randomReply}*`,
                footer: { text: `Solicitado por ${interaction.member.user.username}`, icon_url: ws.getAvatarURL(interaction.member.user) },
            }] });
        }, 3000)
    }
}