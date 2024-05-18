import { createCanvas, registerFont, loadImage } from "canvas";
import { IntReplyFile, EditReplyFile, DeferReply, IntReply } from "../utils/Interactions.js";
import path from "node:path";
import { generate } from "@pwldev/discord-snowflake";

import fs from "node:fs";

var cardMaps = new Map();
export { cardMaps }

export default {
    name: "card",
    category: "utility",
    description: "Crea tu propia carta de tu ball",
    args: true,
    usage: "<modo> <opciones>",
    slashOnly: true,
    data: {
        type: 1,
        name: "card",
        description: "Crea tu propia carta de tu ball",
        options: [{
            type: 1,
            name: "text",
            description: "Crear carta con solo el texto",
            options: [{
                type: 3,
                name: "nombre",
                description: "Nombre de la ball",
                required: true
            }, {
                type: 3,
                name: "habilidad",
                description: "Nombre de la habilidad",
                required: true
            }, {
                type: 3,
                name: "descripción",
                description: "Descripción de la habilidad",
                required: true
            }]
        }, {
            type: 1,
            name: "create",
            description: "Crea tu propia carta (interactivo)"
        }]
    },
    runSlash: async (ws, interaction) => {
        if (interaction.data.options[0].name == "text") {
            DeferReply(interaction);

            const canvas = createCanvas(1428, 2000);
            const ctx = canvas.getContext("2d");

            const name = interaction.data.options[0].options[0].value
            const hability = interaction.data.options[0].options[1].value
            const description = interaction.data.options[0].options[2].value

            registerFont(path.resolve("./assets/countrydex/fonts/ArsenicaTrial-Extrabold.ttf"), { family: "Arsenica Trial Extrabold" })
            registerFont(path.resolve("./assets/countrydex/fonts/OpenSans.ttf"), { family: "Open Sans" })
            registerFont(path.resolve("./assets/countrydex/fonts/BobbyJonesSoftRegular400.otf"), { family: "Bobby Jones Soft Regular" })

            await loadImage(path.resolve("./assets/static/cards/invisible.png")).then(img => ctx.drawImage(img, 0, 0));

            ctx.fillStyle = "#fff";
            ctx.font = "165px Arsenica Trial Extrabold"

            ctx.fillText(name, 40, 195)

            ctx.fillStyle = "#fff";
            ctx.font = "95px Bobby Jones Soft Regular"

            ctx.fillText("Habilidad: "+hability, 70, 1130);

            ctx.fillStyle = "#fff";
            ctx.font = "bold 60px Open Sans"

            var words = description;
            var line = "";
            var x = 70;
            var y = 1400;
            var maxWidth = 1200;
            var lineHeight = 70;
            for(var n = 0; n < words.length; n++) {
                var testLine = line + words[n];
                var metrics = ctx.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    ctx.fillText(line, x, y);
                    line = words[n];
                    y += lineHeight;
                }
                else {
                    line = testLine;
                }
            }
            ctx.fillText(line, x, y);

            const buffer = canvas.toBuffer();
            const cardId = generate(Date.now())

            EditReplyFile(interaction, buffer, `card_${cardId}.png`, {
                attachments: [{ id: 0, url: `attachment://card_${cardId}.png` }]
            })
        }

        if (interaction.data.options[0].name == "create") {
            const cardId = generate(Date.now()).toString();
            const randomDefault = Math.floor(Math.random() * (3 - 1) + 1)
            cardMaps.set(cardId, {
                author: interaction.user.id,
                token: interaction.token,
                back: "default"+randomDefault.toString(),
                name: null,
                hability: null,
                description: null,
                image: null,
                hp: null,
                atk: null,
                type: "default",
                fillStyle: "white",
                icon: null,
                special: {
                    enabled: false,
                    back: null,
                    decoration: null,
                    overlay: null
                }
            })
            
            IntReplyFile(interaction, fs.readFileSync(path.resolve(`./assets/static/cards/default/${randomDefault}.png`)), "card.png", {
                embeds: [{
                    color: 0x808080,
                    title: "Creador de Cartas",
                    description: "Bienvenido al Creador de Cartas de CountryBot. Aqui puedes hacer tu propia carta de Countrydex, pulsa los botones de abajo y la imagen se editará en tiempo real.",
                    image: { url: "attachment://card.png" }
                }],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        style: 1,
                        custom_id: "card_nam_"+cardId,
                        label: "Nombre"
                    }, {
                        type: 2,
                        style: 1,
                        custom_id: "card_hab_"+cardId,
                        label: "Habilidad"
                    }, {
                        type: 2,
                        style: 1,
                        custom_id: "card_des_"+cardId,
                        label: "Descripción"
                    }, {
                        type: 2,
                        style: 1,
                        custom_id: "card_spc_"+cardId,
                        label: "Especial"
                    }, {
                        type: 2,
                        style: 1,
                        custom_id: "card_typ_"+cardId,
                        label: "Tipo"
                    }]
                }, {
                    type: 1,
                    components: [{
                        type: 2,
                        style: 2,
                        custom_id: "card_hlp_"+cardId,
                        label: "Vida"
                    }, {
                        type: 2,
                        style: 2,
                        custom_id: "card_atk_"+cardId,
                        label: "Ataque"
                    }, {
                        type: 2,
                        style: 2,
                        custom_id: "card_img_"+cardId,
                        label: "Foto"
                    }, {
                        type: 2,
                        style: 2,
                        custom_id: "card_clr_"+cardId,
                        label: "Color"
                    }, {
                        type: 2,
                        style: 2,
                        custom_id: "card_txt_"+cardId,
                        label: "Texto"
                    }]
                }, {
                    type: 1,
                    components: [{
                        type: 2,
                        style: 3,
                        custom_id: "card_end_"+cardId,
                        label: "Crear"
                    }, {
                        type: 2,
                        style: 4,
                        custom_id: "card_ccl_"+cardId,
                        label: "Cancelar"
                    }]
                }]
            })
        }
    }
}