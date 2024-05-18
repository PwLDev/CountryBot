import { DeferReply, EditReply, EditComponentReply } from "../../utils/Interactions.js";

export function HelpSections(ws, d) {
    const category = d.data.values[0]
    var renderedName, renderedNames, renderedEmoji;

    if (category == "fun") renderedName = "Entretenimiento"
    else if (category == "utility") renderedName = "Utilidad"
    else if (category == "info") renderedName = "Información"

    
    if (category == "fun") renderedEmoji = "<:fun:1113848444222701628>"
    else if (category == "utility") renderedEmoji = "<:utility:1113653665107017769>"
    else if (category == "info") renderedEmoji = "<:info:1113653739719495761>"

    const commandsArray = Array.from(ws.commands.filter(cmd => cmd.category && cmd.category == category));
    (commandsArray).forEach((cmd, index) => {
        if (cmd?.ownerOnly) return;
        if (index == 0 && commandsArray.length !== 1) return renderedNames = cmd[1].name + " "

        renderedNames += (cmd[1].name + " ")
    })

    return EditComponentReply(d, {
        embeds: [{
            color: 0x2b7fdf,
            author: { name: "CountryBot", icon_url: ws.avatarURL },
            title: renderedEmoji + " Comandos de " + renderedName,
            description: "```" + renderedNames + "```",
            footer: { text: `Solicitado por ${d.member.user.username} | v1.4.0`, icon_url: ws.getAvatarURL(d.member.user) },
        }]
    })
}