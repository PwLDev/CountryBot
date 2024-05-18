import google from "google";
import { APIRequest } from "../utils/APIRequest.js";
import { Reply } from "../utils/Message.js";
import { generate } from "@pwldev/discord-snowflake";
import { EphemeralReply, IntReply } from "../utils/Interactions.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const googleSearches = new Map();

export { googleSearches };

export default {
    name: "google",
    alias: ["search", "g"],
    category: "utility",
    description: "Buscar algo en Google",
    args: true,
    usage: "<busqueda>",
    onlySlash: true,
    data: {
        type: 1,
        name: "google",
        description: "Buscar algo en Google.",
        options: [{
            type: 3,
            name: "query",
            description: "Escribe aquí para buscar.",
            required: true
        }]
    },
    runSlash: async (ws, interaction) => {
        const query = interaction.data.options[0].value.replace(" ", "+");

        const search = await fetch(`https://www.googleapis.com/customsearch/v1?key=${process.env["googleKey"]}&cx=a1be4b38f87f94b50&q=${query}&hl=es&searchType=image&num=10&gl=mx`, { method: "GET" }).then(res => res.json())
        .catch(err => {
            console.error(err);
            if (err) return EphemeralReply(interaction, { embeds: [{
                color: 0xcc0000,
                author: { name: "Buscar con Google", icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2000px-Google_%22G%22_Logo.svg.png" },
                footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) },
                description: ":exclamation: Ocurrió un error al intentar buscar en Google.\nSi el error persiste, contacta al desarrollador o inténtalo más tarde."
            }] });
        });

        const snowflakeId = generate(Math.floor(Date.now())).toString();
        googleSearches.set(snowflakeId, { selected: 0, data: search.items, interaction: interaction, length: search.items.length, id: interaction.member.user.id });

        await IntReply(interaction, { embeds: [{
            color: getDominantColor(googleSearches.get(snowflakeId).data[0].imgDominantColor),
            author: { name: googleSearches.get(snowflakeId).data[0].displayLink, icon_url: `http://www.google.com/s2/favicons?domain=${googleSearches.get(snowflakeId).data[0].displayLink}?size=64` },
            title: googleSearches.get(snowflakeId).data[0].title,
            // description: `${googleSearches.get(snowflakeId).data[0].title} - (${googleSearches.get(snowflakeId).data[0].displayLink})`,
            url: googleSearches.get(snowflakeId).data[0].image.contextLink,
            image: { url: googleSearches.get(snowflakeId).data[0].link, width: googleSearches.get(snowflakeId).data[0].image.width, height: googleSearches.get(snowflakeId).data[0].image.height },
            footer: { text: `Solicitado por ${interaction.member.user.username} | Página 1/${search.items.length}`, icon_url: ws.getAvatarURL(interaction.member.user) },
        }], components: [{
            type: 1,
            components: [{
                type: 2,
                style: 1,
                custom_id: "intgle_prev_" + snowflakeId,
                label: "<"
            }, {
                type: 2,
                style: 1,
                custom_id: "intgle_next_" + snowflakeId,
                label: ">"
            }, {
                type: 2,
                style: 2,
                custom_id: "intgle_nvto_" + snowflakeId,
                label: "☰"
            }, {
                type: 2,
                style: 4,
                custom_id: "intgle_quit_" + snowflakeId,
                label: "×"
            }]
        }] })
    }
}

function getDominantColor(dominantColor) {
    if (dominantColor === "IMG_DOMINANT_COLOR_UNDEFINED") return 0x2b7fdf
    else if (dominantColor === "BLACK") return 0x000000
    else if (dominantColor === "BLUE") return 0x0000FF
    else if (dominantColor === "BROWN") return 0x964B00
    else if (dominantColor === "GRAY") return 0x808080
    else if (dominantColor === "GREEN") return 0x00FF00
    else if (dominantColor === "ORANGE") return 0xFFA500
    else if (dominantColor === "PINK") return 0xFFC0CB
    else if (dominantColor === "PURPLE") return 0xA020F0
    else if (dominantColor === "RED") return 0xFFA500
    else if (dominantColor === "TEAL") return 0x008080
    else if (dominantColor === "WHITE") return 0xFFFFFF
    else if (dominantColor === "YELLOW") return 0xFFFF00
    else return 0x2b7fdf;
}