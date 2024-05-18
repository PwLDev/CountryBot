import { generate } from "@pwldev/discord-snowflake";
import { Reply } from "../utils/Message.js";
import { DeferReply, EditReply, IntReply } from "../utils/Interactions.js";

var giveawayMap = new Map();
export { giveawayMap }

export default {
    name: "giveaway",
    category: "fun",
    description: "¡Organiza un sorteo con una trivia de banderas! Automáticamente mostraré banderas hasta que haya un ganador.",
    args: true,
    usage: "<objective> <prize>",
    data: {
        type: 1,
        name: "giveaway",
        description: "¡Organiza un sorteo con una trivia de banderas!",
        options: [{
            type: 10,
            name: "objective",
            description: "El objetivo de puntos para ganar.",
            min_value: 1,
            max_value: 100,
            required: true
        }, {
            type: 3,
            name: "prize",
            description: "El premio de este sorteo.",
            required: true
        }]
    },
    run: (ws, message, args) => {
        const objective = parseInt(args[0])
        const prize = args.slice(1).join(" ");
        if (isNaN(objective)) return Reply(message, { content: ":x: El objetivo del sorteo no es válido. Por favor introduce un número válido como primer argumento." });

        const giveawayId = message.channel_id;
        if (giveawayMap.has(giveawayId)) return Reply(message, { content: ":x: Ya se está llevando a cabo un sorteo en este canal." });
        giveawayMap.set(giveawayId, {
            objective,
            prize: prize.length > 0 ? prize : "No especificado",
            author: message.author
        });

        return Reply(message, {
            embeds: [{
                color: 0x2b7fdf,
                title: "¡Sorteo! :tada:",
                description: "Este es un sorteo con trivia de banderas, el objetivo es adivinar la mayor cantidad de banderas para alcanzar el objetivo, el primero en alcanzar el objetivo, recibirá el premio. Estaré enviando banderas al azar, para adivinar, simplemente envía el nombre del país al que corresponde la bandera, si aciertas, sumas un punto. ¡Diviértete!\n\nEl botón de iniciar sorteo iniciará el evento, el botón de cancelar estará disponible siempre en este mensaje.",
                fields: [{
                    name: "Organizador del sorteo",
                    value: message.author.nickname ?? message.author.global_name
                }, {
                    name: "Objetivo de puntos",
                    value: objective.toString()
                }, {
                    name: "Premio",
                    value: prize.length > 0 ? prize : "No especificado"
                }]
            }],
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    style: 3,
                    label: "Iniciar Sorteo",
                    custom_id: "giveaway_start_"+giveawayId,
                    emoji: { name: "🎉" }
                }, {
                    type: 2,
                    style: 4,
                    label: "Cancelar Sorteo",
                    custom_id: "giveaway_gstop_"+giveawayId,
                    emoji: { name: "🛑" }
                }]
            }]
        });
    },
    runSlash: (ws, interaction) => {
        const objective = interaction.data.options[0].value;
        const prize = interaction.data.options[1].value;

        DeferReply(interaction);

        if (isNaN(objective)) return IntReply(interaction, { content: ":x: El objetivo del sorteo no es válido. Por favor introduce un número válido como primer argumento." });

        const giveawayId = interaction.channel_id;
        if (giveawayMap.has(giveawayId)) return IntReply(interaction, { content: ":x: Ya se está llevando a cabo un sorteo en este canal." });
        giveawayMap.set(giveawayId, {
            objective,
            prize: prize.length > 0 ? prize : "No especificado",
            author: interaction.member.user
        });

        return EditReply(interaction, {
            embeds: [{
                color: 0x2b7fdf,
                title: "¡Sorteo! :tada:",
                description: "Este es un sorteo con trivia de banderas, el objetivo es adivinar la mayor cantidad de banderas para alcanzar el objetivo, el primero en alcanzar el objetivo, recibirá el premio. Estaré enviando banderas al azar, para adivinar, simplemente envía el nombre del país al que corresponde la bandera, si aciertas, sumas un punto. ¡Diviértete!\n\nEl botón de iniciar sorteo iniciará el evento, el botón de cancelar estará disponible siempre en este mensaje.",
                fields: [{
                    name: "Organizador del sorteo",
                    value: interaction.member.user.nickname ?? interaction.member.user.global_name
                }, {
                    name: "Objetivo de puntos",
                    value: objective.toString()
                }, {
                    name: "Premio",
                    value: prize.length > 0 ? prize : "No especificado"
                }]
            }],
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    style: 3,
                    label: "Iniciar Sorteo",
                    custom_id: "giveaway_start_"+giveawayId,
                    emoji: { name: "🎉" }
                }, {
                    type: 2,
                    style: 4,
                    label: "Cancelar Sorteo",
                    custom_id: "giveaway_gstop_"+giveawayId,
                    emoji: { name: "🛑" }
                }]
            }]
        });
    }
}