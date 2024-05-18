import { IntReply } from "../../utils/Interactions.js";
import { APIRequest } from "../../utils/APIRequest.js";


import { mailModel } from "../../models/Mail.js";
import { recipientId } from "../../commands/Mail.js";
import { GetChannel } from "../../utils/Get.js";

export function ReplyMail(d) {
    const id = d.data.custom_id.substring(10, d.data.custom_id.length);

    mailModel.findOne({ _id: id })
    .then(async document => {
        const channel = await GetChannel(d.channel_id);
        if (document.recipient !== d.member?.user.id &&
            channel.type !== 1) return APIRequest(`/interactions/${d.id}/${d.token}/callback`, { method: "POST", body: { type: 6, data: null } })
        else return APIRequest(`/interactions/${d.id}/${d.token}/callback`, {
            method: "POST",
            body: {
                type: 9,
                data: {
                    title: "Responder correo",
                    custom_id: "mailreply_"+id,
                    components: [{
                        type: 1,
                        components: [{
                            type: 4,
                            custom_id: `message_${id}`,
                            label: "Mensaje",
                            style: 2,
                            required: true
                        }]
                    }]
                }
            }
        });
    })
}

export function ReadMail(d) {
    const id = d.data.custom_id.substring(9, d.data.custom_id.length);

    mailModel.findOne({ _id: id })
    .then(async (document) => {
        const channel = await GetChannel(d.channel_id);
        if (document.recipient !== d.member?.user.id &&
            channel.type !== 1) return APIRequest(`/interactions/${d.id}/${d.token}/callback`, { method: "POST", body: { type: 6, data: null } })

        if (document.reply.replied) {
            return IntReply(d, {
                embeds: [{
                    color: 0x2b7fdf,
                    title: "📨 Correo",
                    description: `Enviado por: **${document.sender.username}**\nFecha: <t:${document.sentTimestamp}:F>\n\nAsunto: **${document.reply.replied ? "Respuesta a " : ""}"${document.subject}"**\n\`\`\`${document.reply.content}\`\`\``,
                }],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        style: 1,
                        label: "Responder",
                        custom_id: "replymail_"+id,
                        emoji: { name: "🖊" }
                    }]
                }]
            });
        }

        IntReply(d, {
            embeds: [{
                color: 0x2b7fdf,
                title: "📨 Correo",
                description: `Enviado por: **${document.sender.username}**\nFecha: <t:${document.sentTimestamp}:F>\n\nAsunto: **${document.reply.replied ? "Respuesta a: " : ""}${document.subject}**\n\`\`\`${document.message}\`\`\``,
            }],
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    style: 1,
                    label: "Responder",
                    custom_id: "replymail_"+id,
                    emoji: { name: "🖊" }
                }]
            }]
        });

        mailModel.findOneAndUpdate({ _id: document._id }, { read: true })
    })
}

export function ReadMailReply(d) {
    const id = d.data.custom_id.substring(14, d.data.custom_id.length);

    mailModel.findOne({ _id: id })
    .then(async (document) => {
        const channel = await GetChannel(d.channel_id);
        if (document.recipient !== d.member?.user.id &&
            channel.type !== 1) return APIRequest(`/interactions/${d.id}/${d.token}/callback`, { method: "POST", body: { type: 6, data: null } })

        IntReply(d, {
            embeds: [{
                color: 0x2b7fdf,
                title: "📨 Correo",
                description: `Enviado por: **${document.sender.username}**\nFecha: <t:${document.sentTimestamp}:F>\n\nAsunto: **${document.reply.replied ? "Respuesta a " : ""}"${document.subject}"**\n\`\`\`${document.reply.content}\`\`\``,
            }],
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    style: 1,
                    label: "Responder",
                    custom_id: "replymail_"+id,
                    emoji: { name: "🖊" }
                }]
            }]
        });

        mailModel.findOneAndUpdate({ _id: document._id }, { read: true })
    })
}

export function InboxRead(d) {
    const id = d.data.values[0];

    mailModel.findOne({ _id: id })
    .then(async (document) => {
        const channel = await GetChannel(d.channel_id);
        if (document.recipient !== d.member?.user.id &&
            channel.type !== 1) return APIRequest(`/interactions/${d.id}/${d.token}/callback`, { method: "POST", body: { type: 6, data: null } })

        if (document.reply.replied) {
            return IntReply(d, {
                embeds: [{
                    color: 0x2b7fdf,
                    title: "📨 Correo",
                    description: `Enviado por: **${document.sender.username}**\nFecha: <t:${document.sentTimestamp}:F>\n\nAsunto: **${document.reply.replied ? "Respuesta a " : ""}"${document.subject}"**\n\`\`\`${document.reply.content}\`\`\``,
                }],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        style: 1,
                        label: "Responder",
                        custom_id: "replymail_"+id,
                        emoji: { name: "🖊" }
                    }]
                }]
            });
        }

        IntReply(d, {
            embeds: [{
                color: 0x2b7fdf,
                title: "📨 Correo",
                description: `Enviado por: **${document.sender.username}**\nFecha: <t:${document.sentTimestamp}:F>\n\nAsunto: **${document.reply.replied ? "Respuesta a: " : ""}${document.subject}**\n\`\`\`${document.message}\`\`\``,
            }],
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    style: 1,
                    label: "Responder",
                    custom_id: "replymail_"+id,
                    emoji: { name: "🖊" }
                }]
            }]
        });

        if (!document.read) mailModel.findOneAndUpdate({ _id: document._id }, { read: true })
    })
}

export function MailReply(d) {
    const id = d.data.custom_id.substring(10, d.data.custom_id.length);

    mailModel.findOne({ _id: id }).then(async document => {
        IntReply(d, { embeds: [{
            color: 0x4bb543,
            description: ":white_check_mark: **Correo respondido exitosamente**",
        }] });

        if (document.reply.replied) {
            mailModel.findOneAndUpdate({ _id: id }, {
                reply: {
                    replied: false,
                    content: null
                },
                subject: `Respuesta a "${document.subject}"`,
                sender: {
                    id: document.recipient,
                    username: document.recipientUsername
                },
                recipient: document.sender.id,
                recipientUsername: document.sender.username,
                content: d.data.components[0].components[0].value
            }).then(async doc => {
                const dmChannel = await APIRequest("/users/@me/channels", {
                    method: "POST",
                    body: { recipient_id: document.sender.id }
                }).then(res => res.json());


                APIRequest(`/channels/${dmChannel.id}/messages`, {
                    method: "POST",
                    body: {
                        embeds: [{
                            color: 0x2b7fdf,
                            title: "Notificación",
                            description: `📩 ${doc.recipientUsername} ha respondido tu correo \`${doc.subject}\``,
                        }],
                        components: [{
                            type: 1,
                            components: [{
                                type: 2,
                                style: 2,
                                label: "Leer",
                                custom_id: "readmailreply_" + id,
                                emoji: { name: "✉" }
                            }, {
                                type: 2,
                                style: 1,
                                label: "Responder",
                                custom_id: "replymail_"+id,
                                emoji: { name: "🖊" }
                            }],
                        }]
                    }
                })
            });
        } else {
            mailModel.findOneAndUpdate({ _id: id }, {
                reply: {
                    replied: true,
                    content: d.data.components[0].components[0].value
                }
            }).then(async doc => {
                const dmChannel = await APIRequest("/users/@me/channels", {
                    method: "POST",
                    body: { recipient_id: document.sender.id }
                }).then(res => res.json());
                

                APIRequest(`/channels/${dmChannel.id}/messages`, {
                    method: "POST",
                    body: {
                        embeds: [{
                            color: 0x2b7fdf,
                            title: "Notificación",
                            description: `📩 ${doc.recipientUsername} ha respondido tu correo \`${doc.subject}\``,
                        }],
                        components: [{
                            type: 1,
                            components: [{
                                type: 2,
                                style: 2,
                                label: "Leer",
                                custom_id: "readmailreply_" + id,
                                emoji: { name: "✉" }
                            }, {
                                type: 2,
                                style: 1,
                                label: "Responder",
                                custom_id: "replymail_"+id,
                                emoji: { name: "🖊" }
                            }],
                        }]
                    }
                })
            })
        }

    })
}

export function SendMail(d) {
    const id = d.data.custom_id.substring(9, d.data.custom_id.length);

    const mailDetails = new mailModel({
        _id: id,
        sentTimestamp: Math.floor(Date.now() / 1000),
        sender: {
            id: d.member.user.id,
            username: d.member.user.username
        },
        reply: {
            replied: false,
            content: null
        },
        recipient: recipientId.id,
        recipientUsername: recipientId.username,
        subject: d.data.components[0].components[0].value,
        message: d.data.components[1].components[0].value,
        read: false
    });
    
    mailDetails.save()
    .then(async () => {
        IntReply(d, { embeds: [{
            color: 0x4bb543,
            description: ":white_check_mark: **Correo enviado exitosamente**",
        }] });

        const dmChannel = await APIRequest("/users/@me/channels", {
            method: "POST",
            body: { recipient_id: recipientId.id }
        }).then(res => res.json());
        

        APIRequest(`/channels/${dmChannel.id}/messages`, {
            method: "POST",
            body: {
                embeds: [{
                    color: 0x2b7fdf,
                    title: "Notificación",
                    description: `📩  Has recibido un correo nuevo de ${d.member.user.username}`,
                }],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        style: 2,
                        label: "Leer",
                        custom_id: "readmail_" + id,
                        emoji: { name: "✉" }
                    }, {
                        type: 2,
                        style: 1,
                        label: "Responder",
                        custom_id: "replymail_"+id,
                        emoji: { name: "🖊" }
                    }],
                }]
            }
        })
    })
}