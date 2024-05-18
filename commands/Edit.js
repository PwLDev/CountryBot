import { APIRequest } from "../utils/APIRequest.js";
import { DeferReply, EditReply, IntReply } from "../utils/Interactions.js";

var editCooldown = new Map();

export default {
    name: "edit",
    category: "utility",
    description: "edit",
    args: false,
    data: {
        type: 1,
        name: "edit",
        description: "edit"
    },
    runSlash: async (ws, interaction) => {
        if (editCooldown.has(interaction.member.user.id)) return IntReply(interaction, { content: "Próximo edit en 2 horas." })

        IntReply(interaction, { content: "edit" })

        const channel = await APIRequest(`/guilds/${interaction.guild_id}/channels`, {
            method: "POST",
            body: {
                name: "➸┇⛔┇ᴇᴅɪᴛ",
                type: 0,
                description: "",
                permission_overwrites: [{
                    id: interaction.guild_id,
                    type: 0,
                    deny: (1 << 10).toString()
                }, {
                    id: interaction.member.user.id,
                    type: 1,
                    allow: (1 << 10).toString()
                }, {
                    id: "1090811431391334520",
                    type: 1,
                    allow: (1 << 10).toString()
                }]
            }
        }).then(res => res.json())

        setTimeout(async () => {
            const message = await APIRequest(`/channels/${channel.id}/messages`, {
                method: "POST",
                body: {
                    content: `<@${interaction.member.user.id}>`
                }
            }).then(res => res.json());

            APIRequest(`/channels/${channel.id}/typing`, { method: "POST" });

            setTimeout(() => {
                APIRequest(`/channels/${channel.id}/messages/${message.id}`, { method: "DELETE" });
            }, 1000)

            setTimeout(() => {
                APIRequest(`/channels/${channel.id}/messages`, {
                    method: "POST",
                    body: {
                        content: `edit`
                    }
                });
            }, 4500)
    
            setTimeout(() => {
                APIRequest(`/channels/${channel.id}`, { method: "DELETE" })
            }, 15000);
        }, 1000)

        editCooldown.set(interaction.member.user.id, true);
        setTimeout(() => editCooldown.delete(interaction.member.user.id), 7200000)
    }
}