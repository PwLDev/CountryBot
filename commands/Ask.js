import { premiumModel } from "../models/Premium.js";
import { APIRequest } from "../utils/APIRequest.js";
import { GPTAsk } from "../utils/ChatGPT.js";
import { HasPermission } from "../utils/Get.js";
import { IntReply, EditReply, DeferReply } from "../utils/Interactions.js";
import { Reply } from "../utils/Message.js"

var askCooldown = new Map();

export default {
    name: "ask",
    alias: ["preguntar"],
    category: "fun",
    description: "Pregúntale algo a ChatGPT (5 preguntas por hora)",
    args: true,
    usage: "<pregunta>",
    data: {
        type: 1,
        name: "ask",
        description: "Preguntale algo a ChatGPT",
        options: [{
            type: 3,
            name: "pregunta",
            description: "Pregunta a hacer a ChatGPT",
            required: true
        }]
    },
    run: async (ws, message, args) => {
        return Reply(message, { content: "Lamentablemente, debido a problemas económicos, este comando está deshabilidado." });
        // if (!await HasPermission("MANAGE_GUILD", message.author.id, message.guild_id)) return Reply(message, { content: "como el comando esta en desarrollo, solo lo pueden usar los admins en unas horas lo haremos publico" })
        const hasPremium = await premiumModel.findOne({ user: message.author.id });

        // Premium
        if (hasPremium) {
            const request = await GPTAsk(args.slice(0).join(" "));

            const reply = await request.json()
            .catch(error => {
                console.error(error);
                Reply(message, { embeds: [{
                    color: 0xcc0000,
                    author: { name: "CountryBot", icon_url: ws.avatarURL },
                    footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) },
                    description: ":exclamation: Actualmente estamos teniendo dificultades con este servicio.\nVuelve a intentarlo en unos minutos.",
                    image: { url: "https://cdn.discordapp.com/attachments/1091932806206201857/1096993927376158801/66_sin_titulo_20230415220156.png" }
                }] });
            })
    
            Reply(message, { embeds: [{
                color: 0x2b7fdf,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                title: "ChatGPT",
                fields: [{
                    name: "**Pregunta**",
                    value: args.slice(0).join(" ")
                }, {
                    name: "**Respuesta**",
                    value: reply.choices[0].message.content,
                }],
                footer: { text: `Solicitado por ${message.author.username} | Potenciado por OpenAI`, icon_url: ws.getAvatarURL(message.author) } 
            }] });

            return;
        }

        if (args.length == 0) return Reply(message, { embeds: [{
            color: 0xcc0000,
            author: { name: "CountryBot", icon_url: ws.avatarURL },
            footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) },
            description: ":x: No ingresaste qué preguntarle a ChatGPT\nIngresa algo para preguntarle."
        }] });

        if (askCooldown.get(message.author.id)?.started) return Reply(message, { content: `Alcanzaste tu límite de 5 preguntas.\nVuelve <t:${Math.floor((askCooldown.get(message.author.id).timeEnd / 1000))}:R>.\n\n¿Quieres usos ilimitados? ¡Obtén CountryBot Premium 👑! Más información con el comando /premium` });

        const request = await GPTAsk(args.slice(0).join(" "));

        if (!askCooldown.has(message.author.id)) {
            askCooldown.set(message.author.id, {
                timeUses: 0,
                started: false,
                timeStart: null,
                timeEnd: null
            });
        }

        askCooldown.set(message.author.id, {
            timeUses: (askCooldown.get(message.author.id)?.timeUses + 1) ?? 1,
            started: (askCooldown.get(message.author.id)?.timeUses) === 5 ? true : false,
            timeStart: (askCooldown.get(message.author.id)?.started) ? Date.now() : null,
            timeEnd: (askCooldown.get(message.author.id)?.started) ? Date.now() + 3600000 : null
        });

        const reply = await request.json()
        .catch(error => {
            console.error(error);
            Reply(message, { embeds: [{
                color: 0xcc0000,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) },
                description: ":exclamation: Actualmente estamos teniendo dificultades con este servicio.\nVuelve a intentarlo en unos minutos.",
                image: { url: "https://cdn.discordapp.com/attachments/1091932806206201857/1096993927376158801/66_sin_titulo_20230415220156.png" }
            }] });
        })

        Reply(message, { embeds: [{
            color: 0x2b7fdf,
            author: { name: "CountryBot", icon_url: ws.avatarURL },
            title: "ChatGPT",
            fields: [{
                name: "**Pregunta**",
                value: args.slice(0).join(" ")
            }, {
                name: "**Respuesta**",
                value: reply.choices[0].message.content,
            }],
            footer: { text: `Solicitado por ${message.author.username} | Potenciado por OpenAI`, icon_url: ws.getAvatarURL(message.author) } 
        }], components: [{
            type: 1,
            components: [{
                type: 2,
                label: `Usos: ${askCooldown.get(message.author.id)?.timeUses ?? 1}/5`,
                custom_id: "chatgpt_reply",
                style: 1,
                disabled: true,
            }]
        }] });

        if ((askCooldown.get(message.author.id)?.timeUses ?? 1) === 5) askCooldown.set(message.author.id, {
            timeUses: 5,
            started: true,
            timeStart: Date.now(),
            timeEnd: Date.now() + 3600000
        });

        setTimeout(() => {
            askCooldown.set(message.author.id, {
                timeUses: 1,
                started: false,
                timeStart: null,
                timeEnd: null
            });
        }, 7200000)
    },
    runSlash: async (ws, interaction) => {
        return IntReply(interaction, { content: "Lamentablemente, debido a problemas económicos, este comando está deshabilidado." });
        
        DeferReply(interaction);
        const query = interaction.data.options[0].value;

        const hasPremium = await premiumModel.findOne({ user: interaction.member.user.id });

        if (hasPremium) {
            const request = await GPTAsk(query);

            const reply = await request.json()
            .catch(error => {
                console.error(error);
                EditReply(interaction, { embeds: [{
                    color: 0xcc0000,
                    author: { name: "CountryBot", icon_url: ws.avatarURL },
                    footer: { text: `Solicitado por ${interaction.member.user.username} | Potenciado por OpenAI`, icon_url: ws.getAvatarURL(interaction.member.user) },
                    description: ":exclamation: Actualmente estamos teniendo dificultades con este servicio.\nVuelve a intentarlo en unos minutos.",
                    image: { url: "https://cdn.discordapp.com/attachments/1091932806206201857/1096993927376158801/66_sin_titulo_20230415220156.png" }
                }] });
            })

            EditReply(interaction, { embeds: [{
                color: 0x2b7fdf,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                title: "ChatGPT",
                fields: [{
                    name: "**Pregunta**",
                    value: query
                }, {
                    name: "**Respuesta**",
                    value: reply.choices[0].message.content,
                }],
                footer: { text: `Solicitado por ${interaction.member.user.username} | Potenciado por OpenAI`, icon_url: ws.getAvatarURL(interaction.member.user) } 
            }] });

            return;
        }

        if (askCooldown.get(interaction.member.user.id)?.started) return EditReply(interaction, { content: `Alcanzaste tu límite de 5 preguntas.\nVuelve <t:${Math.floor((askCooldown.get(interaction.member.user.id).timeEnd / 1000))}:R>.\n\n¿Quieres usos ilimitados? ¡Obtén CountryBot Premium 👑! Más información con el comando /premium` });

        const request = await GPTAsk(query);

        if (!askCooldown.has(interaction.member.user.id)) {
            askCooldown.set(interaction.member.user.id, {
                timeUses: 0,
                started: false,
                timeStart: null,
                timeEnd: null
            });
        }

        askCooldown.set(interaction.member.user.id, {
            timeUses: (askCooldown.get(interaction.member.user.id)?.timeUses + 1) ?? 1,
            started: (askCooldown.get(interaction.member.user.id)?.timeUses) === 5 ? true : false,
            timeStart: (askCooldown.get(interaction.member.user.id)?.started) ? Date.now() : null,
            timeEnd: (askCooldown.get(interaction.member.user.id)?.started) ? Date.now() + 3600000 : null
        });

        EditReply(interaction, { embeds: [{
            color: 0x2b7fdf,
            author: { name: "CountryBot", icon_url: ws.avatarURL },
            title: "ChatGPT",
            fields: [{
                name: "**Pregunta**",
                value: query
            }, {
                name: "**Respuesta**",
                value: (await request.json()).choices[0].message.content,
            }],
            footer: { text: `Solicitado por ${interaction.member.user.username} | Potenciado por OpenAI`, icon_url: ws.getAvatarURL(interaction.member.user) } 
        }], components: [{
            type: 1,
            components: [{
                type: 2,
                label: `Usos: ${askCooldown.get(interaction.member.user.id)?.timeUses ?? 1}/5`,
                custom_id: "chatgpt_reply",
                style: 1,
                disabled: true,
            }]
        }] });

        if ((askCooldown.get(interaction.member.user.id)?.timeUses ?? 1) === 5) askCooldown.set(interaction.member.user.id, {
            timeUses: 5,
            started: true,
            timeStart: Date.now(),
            timeEnd: Date.now() + 3600000
        });

        setTimeout(() => {
            askCooldown.set(interaction.member.user.id, {
                timeUses: 1,
                started: false,
                timeStart: null,
                timeEnd: null
            });
        }, 7200000)
    }
}