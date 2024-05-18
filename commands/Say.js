import { APIRequest } from "../utils/APIRequest.js";
import { HasPermission } from "../utils/Get.js";
import { EphemeralReply, IntReply } from "../utils/Interactions.js";
import { Reply, Send } from "../utils/Message.js";
import { premiumModel } from "../models/Premium.js";

export default {
    name: "say",
    alias: ["decir"],
    category: "fun",
    description: "Decir algo",
    args: true,
    usage: "<texto> (Permiso requerido: Gestionar Mensajes)",
    data: {
        name: "say",
        description: "Decir un texto dado.",
        options: [{
            type: 3,
            name: "texto",
            description: "Texto a decir",
            required: true
        }]
    },
    run: async (ws, message, args) => {
        // if (!await HasPermission("MANAGE_MESSAGES", message.author.id, message.guild_id)) {
        //     const reply = await Reply(message, { embeds: [{
        //         color: 0xcc0000,
        //         author: { name: "CountryBot", icon_url: ws.avatarURL },
        //         footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) },
        //         description: ":x: No tienes permiso para ejecutar este comando.\nPermiso requerido: `Gestionar Mensajes`."
        //     }] }).then(res => res.json());

        //     setTimeout(() => {
        //         APIRequest(`/channels/${message.channel_id}/messages/${reply.id}`, { method: "DELETE" });
        //         APIRequest(`/channels/${message.channel_id}/messages/${message.id}`, { method: "DELETE" });
        //     }, 5000);

        //     return;
        // }

        if (args.length == 0) {
            const id = await Reply(message, { embeds: [{
                color: 0xcc0000,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) },
                description: ":x: No ingresaste qué decir."
            }] }).then(res => res.json());

            setTimeout(() => {
                APIRequest(`/channels/${message.channel_id}/messages/${id.id}`, { method: "DELETE" });
                APIRequest(`/channels/${message.channel_id}/messages/${message.id}`, { method: "DELETE" });
            }, 5000)
        } else {
            const hasPremium = await premiumModel.findOne({ user: message.author.id });

            if (hasPremium) {
                APIRequest(`/channels/${message.channel_id}/messages/${message.id}`, { method: "DELETE" });
                if (message.message_reference) Send(message, { content: args.slice(0).join(" ").replace("@everyone", "[everyone]").replace("@here", "[here]"), message_reference: { message_id: message.message_reference.message_id, channel_id: message.channel_id } });
                // else if (message.attachments) Send(message, { content: args.slice(0).join(" "), attachments: [{ id: 0, filename: message.attachments[0].filename, url: message.attachments[0].url }] });
                // else if (message.attachments && message.message_reference) Send(message, { content: args.slice(0).join(" "), attachments: [{ id: 0, filename: message.attachments[0].filename, url: message.attachments[0].url }], message_reference: { message_id: message.message_reference.message_id, channel_id: message.channel_id } });
                else Send(message, { content: args.slice(0).join(" ") });
                return;
            }

            APIRequest(`/channels/${message.channel_id}/messages/${message.id}`, { method: "DELETE" });
            if (message.message_reference) Send(message, { content: args.slice(0).join(" ").replace("@everyone", "[everyone]").replace("@here", "[here]"), message_reference: { message_id: message.message_reference.message_id, channel_id: message.channel_id }, components: [{
                type: 1,
                components: [{
                    type: 2,
                    style: 2,
                    custom_id: "author_mtn",
                    label: `Enviado por ${message.author.username}`,
                    disabled: true
                }]
            }] });
            // else if (message.attachments) Send(message, { content: args.slice(0).join(" "), attachments: [{ id: 0, filename: message.attachments[0].filename, url: message.attachments[0].url }] });
            // else if (message.attachments && message.message_reference) Send(message, { content: args.slice(0).join(" "), attachments: [{ id: 0, filename: message.attachments[0].filename, url: message.attachments[0].url }], message_reference: { message_id: message.message_reference.message_id, channel_id: message.channel_id } });
            else Send(message, { content: args.slice(0).join(" ").replace("@everyone", "[everyone]").replace("@here", "[here]"), components: [{
                type: 1,
                components: [{
                    type: 2,
                    style: 2,
                    custom_id: "author_mtn",
                    label: `Enviado por ${message.author.username}`,
                    disabled: true
                }]
            }] });
        }
    },
    runSlash: async (ws, interaction) => {
        const content = interaction.data.options[0].value;

        const hasPremium = await premiumModel.findOne({ user: interaction.member.user.id });

        EphemeralReply(interaction, { content: "Mensaje enviado." });
        if (hasPremium) return Send({ channel_id: interaction.channel_id }, { content: content.replace("@everyone", "[everyone]").replace("@here", "[here]") })

        Send({ channel_id: interaction.channel_id }, { content: content.replace("@everyone", "[everyone]").replace("@here", "[here]"), components: [{
            type: 1,
            components: [{
                type: 2,
                style: 2,
                custom_id: "author_mtn",
                label: `Enviado por ${interaction.member.user.username}`,
                disabled: true
            }]
        }] })
    }
}