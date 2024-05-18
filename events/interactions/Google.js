import { googleSearches } from "../../commands/Google.js";
import { EphemeralReply, EditComponentReply } from "../../utils/Interactions.js";

export function GoogleInteraction(ws, d) {
    const action = d.data.custom_id.substring(7, 11);
    const snowflakeId = d.data.custom_id.substring(12, d.data.custom_id.length);

    if (!googleSearches.has(snowflakeId)) return EphemeralReply(d, { content: "Esta interacción ha expirado.\nVuelve a ejecutar el comando usando `/google`." });  
    if (d.member.user.id !== googleSearches.get(snowflakeId)?.id) return EphemeralReply(d, { content: "Lo siento, este menú no puede ser controlado por tí\nUtiliza `/google` para buscar en Google." });  


    if (action === "prev") {
        const indexNumber = googleSearches.get(snowflakeId).selected;
        const data = googleSearches.get(snowflakeId).data
        const interaction = googleSearches.get(snowflakeId).interaction;
        const length = googleSearches.get(snowflakeId).length

        if (indexNumber === 0) return EphemeralReply(d, { content: "No se puede retroceder, ya que estás en la primera página." });
        else {
            googleSearches.set(snowflakeId, { selected: indexNumber - 1, data: data, interaction: interaction, length: length, id: d.member.user.id });

            EditComponentReply(d, { embeds: [{
                type: "rich",
                color: getDominantColor(googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].imgDominantColor),
                author: { name: googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].displayLink, icon_url: `http://www.google.com/s2/favicons?domain=${googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].displayLink}?size=64` },
                title: googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].title,
                // description: `${googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].title} - (${googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].displayLink})`,
                url: googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].image.contextLink,
                image: { url: googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].link, width: googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].image.width, height: googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].image.height },
                footer: { text: `Solicitado por ${d.member.user.username} | Página ${googleSearches.get(snowflakeId).selected + 1}/${length}`, icon_url: ws.getAvatarURL(d.member.user) },
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
            }] });
        }
    }    

    if (action === "next") {
        const indexNumber = googleSearches.get(snowflakeId).selected;
        const data = googleSearches.get(snowflakeId).data
        const interaction = googleSearches.get(snowflakeId).interaction;
        const length = googleSearches.get(snowflakeId).length;

        
        if (indexNumber + 1 === length) return EphemeralReply(d, { content: "No se puede avanzar, ya que estás en la última página." });
        else {
            googleSearches.set(snowflakeId, { selected: indexNumber + 1, data: data, interaction: interaction, length: length, id: d.member.user.id });

            
            EditComponentReply(d, { embeds: [{
                type: "rich",
                color: getDominantColor(googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].imgDominantColor),
                author: { name: googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].displayLink, icon_url: `http://www.google.com/s2/favicons?domain=${googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].displayLink}?size=64` },
                title: googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].title,
                // description: `${googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].title} - (${googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].displayLink})`,
                url: googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].image.contextLink,
                image: { url: googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].link, width: googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].image.width, height: googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].image.height },
                footer: { text: `Solicitado por ${d.member.user.username} | Página ${googleSearches.get(snowflakeId).selected + 1}/${length}`, icon_url: ws.getAvatarURL(d.member.user) },
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
            }] });
        }
    }

    if (action === "quit") {
        const indexNumber = googleSearches.get(snowflakeId).selected;
        const data = googleSearches.get(snowflakeId).data
        const interaction = googleSearches.get(snowflakeId).interaction;
        const length = googleSearches.get(snowflakeId).length;

        EditComponentReply(d, { embeds: [{
            type: "rich",
            color: getDominantColor(googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].imgDominantColor),
            author: { name: googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].displayLink, icon_url: `http://www.google.com/s2/favicons?domain=${googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].displayLink}?size=64` },
            title: googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].title,
            // description: `${googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].title} - (${googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].displayLink})`,
            url: googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].image.contextLink,
            image: { url: googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].link, width: googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].image.width, height: googleSearches.get(snowflakeId).data[googleSearches.get(snowflakeId).selected].image.height },
            footer: { text: `Solicitado por ${d.member.user.username} | Página ${googleSearches.get(snowflakeId).selected + 1}/${length}`, icon_url: ws.getAvatarURL(d.member.user) },
        }], components: [] });
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