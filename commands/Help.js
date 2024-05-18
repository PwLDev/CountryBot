import { APIRequest } from "../utils/APIRequest.js";
import { GetMember } from "../utils/Get.js"
import { DeferReply, EditReply, IntReply, EphemeralReply } from "../utils/Interactions.js"
import { Reply } from "../utils/Message.js";

export default {
    name: "help",
    alias: ["?", "h"],
    category: "info",
    description: "Ayuda de comandos del bot.",
    args: true,
    usage: "<comando (opcional)>",
    data: {
        type: 1,
        name: "help",
        description: "Ayuda de comandos del bot.",
        options: [{
            type: 3,
            name: "comando",
            description: "Ver más información sobre un comando."
        }]
    },
    run: (ws, message, args) => {
        if (args.length == 0) return Reply(message, {
            embeds: [{
                color: 0x2b7fdf,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                title: "Comandos de Mensaje",
                description: `Por ahora los comandos de mensaje son limitados.\n**__Prefix: c!__**\nUtiliza **c!help <nombre de comando>** para obtener más información acerca de un comando.`,
                fields: [{
                    name: "Todos los comandos",
                    value: "```8ball about ask avatar cat emoji emojify help neko ping template random say servercount```"
                }],
                footer: { text: `Solicitado por ${message.author.username} | v1.3.1`, icon_url: ws.getAvatarURL(message.author) },
            }]
        });

        const cmd = ws.commands.get(args[0]) || ws.commands.find(cmd => cmd.alias && cmd.alias.includes(args[0]))

        if (!cmd) return Reply(message, { embeds: [{
            color: 0xcc0000,
            author: { name: "CountryBot", icon_url: ws.avatarURL },
            footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) },
            description: ":x: No se encontró ese comando. Asegúrate de que ese comando esté en la lista de ayuda o que exista."
        }] });
        else return Reply(message, { embeds: [generateCommandEmbed(cmd, false, message.author, ws)] })

    },
    runSlash: async (ws, interaction) => {
        if (interaction.data.options && interaction.data.options[0].value) {
            const cmd = ws.commands.get(interaction.data.options[0].value) || ws.commands.find(cmd => cmd.alias && cmd.alias.includes(interaction.data.options[0].value))

            if (!cmd) return EphemeralReply(interaction, { embeds: [{
                color: 0xcc0000,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                footer: { text: `Solicitado por ${interaction.member.user.username}`, icon_url: ws.getAvatarURL(interaction.member.user) },
                description: ":x: No se encontró ese comando. Asegúrate de que ese comando esté en la lista de ayuda o que exista."
            }] });
            else return IntReply(interaction, { embeds: [generateCommandEmbed(cmd, true, interaction.member.user, ws)] })
        }

        return IntReply(interaction, {
            embeds: [{
                color: 0x2b7fdf,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                title: "Ayuda de CountryBot",
                description: `¡Hola! Soy CountryBot, un bot de utilidad y entretenimiento de Countryballs en Español.\n\nSelecciona una de las categorías de abajo para ver mis comandos o utiliza **/help <comando>** para ver información sobre un comando.`,
                footer: { text: `Solicitado por ${interaction.member.user.username} | v1.0.0`, icon_url: ws.getAvatarURL(interaction.member.user) },
            }],
            components: [{
                type: 1,
                components: [{
                    type: 3,
                    custom_id: "help_sections",
                    placeholder: "Selecciona una categoría",
                    options: [{
                        label: "Entretenimiento",
                        value: "fun",
                        description: `Mira todos mis comandos de entretenimiento.`,
                        emoji: { name: "fun", id: "1113848444222701628" }
                    }, {
                        label: "Utilidad",
                        value: "utility",
                        description: `Mira todos mis comandos de utilidad.`,
                        emoji: { name: "utility", id: "1113653665107017769" }
                    }, {
                        label: "Información",
                        value: "info",
                        description: `Mira todos mis comandos de información.`,
                        emoji: { name: "info", id: "1113653739719495761" }
                    }]
                }]
            }]
        });
    }
}

function generateCommandEmbed(
    commandObject,
    slash = false,
    user,
    ws
) {
    var aliasText ;

    if (commandObject.alias) {
        commandObject.alias.forEach((alias, i) => {
            if (i == 0 && commandObject.alias.length !== 1) return aliasText = alias + ", "

            if (i == commandObject.alias.length - 1) aliasText += alias
            else aliasText += (alias + ", ")
        });
    }

    return {
        color: 0x2b7fdf,
        author: { name: "CountryBot", icon_url: ws.avatarURL },
        title: commandObject.name.charAt(0).toUpperCase() + commandObject.name.slice(1),
        description: `${commandObject.onlySlash && !slash ? "**Este comando solo está disponible en Slash Commands (/)**\n\n" : ""}${commandObject.description}\n\n${commandObject.alias ? `__Alias: ${aliasText}__\n` : ""}${commandObject.args ? (commandObject.usage ? "Uso: " + (slash ? `/${commandObject.name} ` : `c!${commandObject.name} `) + commandObject.usage : (commandObject.usage ? (slash ? `/${commandObject.name}` : `c!${commandObject.name}` ) : "")) : ""}`
    }
}