import { createCanvas, loadImage, registerFont } from "canvas";

import Store from "data-store";
import path from "node:path";
import { createRequire } from "node:module";
import { EphemeralReply, IntReply, IntReplyFile, EditReplyFile, DeferReply } from "../../utils/Interactions.js";

var countrydexConfig = new Store({ path: path.join(process.cwd() + "/countrydex/config.json"), debounce: 0 });

import { owns } from "../../events/Ready.js";
import { Reply } from "../../utils/Message.js";

const require = createRequire(import.meta.url);

var ongoingTrades = new Map(), luckyMap = new Map();

export { luckyMap };

export default {
    name: "countryballs",
    alias: [],
    data: {
        type: 1,
        name: "countryballs",
        description: "Interactúa con Countrydex",
        options: [{
            type: 1,
            name: "info",
            description: "Muestra información específica de un countryball.",
            options: [{
                type: 3,
                name: "countryball",
                description: "Countryball a inspeccionar.",
                autocomplete: true,
                required: true
            }]
        }, {
            type: 1,
            name: "give",
            description: "Regala uno de tus countryballs a otro miembro.",
            options: [{
                type: 3,
                name: "countryball",
                description: "Countryball a regalar.",
                autocomplete: true,
                required: true
            }, {
                type: 6,
                name: "member",
                description: "Miembro a regalar.",
                required: true
            }]
        }, {
            type: 1,
            name: "completion",
            description: "Muestra tu progreso en Countrydex."
        }, {
            type: 1,
            name: "last",
            description: "Muestra tu último countryball que atrapaste."
        }, {
            type: 1,
            name: "about",
            description: "Muestra más información sobre Countrydex."
        }, {
            type: 1,
            name: "favorite",
            description: "Establece uno de tus countryballs como favoritos.",
            options: [{
                type: 3,
                name: "countryball",
                description: "Countryball a modificar.",
                autocomplete: true,
                required: true
            }]
        }, {
            type: 1,
            name: "luckyspin",
            description: "¡Prueba tu suerte girando la ruleta de la suerte!"
        }]
    },
    run: (ws, message) => { return Reply(message, { content: "tas bien desactualizado we, aca puro slash command. actualizate desactualizado de mrd." }) },
    runSlash: async (ws, interaction) => {
        if (interaction.data.options[0].name == "info") {
            var countryballData;

            if (!owns.has(interaction.member.user.id)) return IntReply(interaction, { content: "¡Aún no has conseguido ningún countryball!" });
            else {
                const fetchId = interaction.data.options[0].options[0].value;
                var cbObject = {};

                owns.get(interaction.member.user.id)
                .forEach(countryball => {
                    if (countryball.id === fetchId) cbObject = countryball
                });

                if (Object.keys(cbObject).length == 0) return IntReply(interaction, { content: "No se encontró ese countryball.\nAsegúrate de usar la función de Autocompletar." })
                else {
                    DeferReply(interaction)
                    const canvas = createCanvas(1428, 2000);
                    const ctx = canvas.getContext("2d");
                    registerFont(path.resolve("./assets/countrydex/fonts/BobbyJonesSoftRegular400.otf"), { family: "Bobby Jones Soft Regular" })

                    ctx.font = "110px Bobby Jones Soft";

                    var image = await loadImage(path.resolve(`./assets/countrydex/cards/alent/${cbObject.data.names[0]}.png`));
                    ctx.drawImage(image, 0, 0, 1428, 2000);

                    ctx.fillStyle = "#eb7264";
                    ctx.fillText(cbObject.hp.toString(), 325, 1780)

                    ctx.fillStyle = "#fec44c";
                    ctx.fillText(cbObject.atk.toString(), 980, 1780)

                    return EditReplyFile(
                        interaction,
                        canvas.toBuffer("image/png"),
                        `countryball_${fetchId}.png`,
                        {
                            content: `Atrapado el <t:${cbObject.catchDate}:F> (<t:${cbObject.catchDate}:R>) ${cbObject?.spinObtained ? "\nObtenido mediante la ruleta de la suerte." : ""}${cbObject.tradeWith ? `\nObtenido mediante un intercambio con ${cbObject.tradeWith}` : ""}\n\nHP: ${cbObject.hp} (${cbObject.percentages[0] > 0 ? `+${cbObject.percentages[0]}%` : `${cbObject.percentages[0]}%`})\nATK: ${cbObject.atk} (${cbObject.percentages[1] > 0 ? `+${cbObject.percentages[1]}%` : `${cbObject.percentages[1]}%`})`,
                            attachments: [{ id: 0, filename: `countryball_${fetchId}.png`, url: `attachment://countryball_${fetchId}.png` }]
                        }
                    )
                }
            }
        }

        if (interaction.data.options[0].name == "last") {
            if (!owns.has(interaction.member.user.id) || owns.get(interaction.member.user.id)?.length == 0) return IntReply(interaction, { content: "¡Aún no has conseguido ningún countryball!" });
            else {

                const fetchId = owns.get(interaction.member.user.id)[owns.get(interaction.member.user.id).length - 1].id;
                var cbObject = {};

                owns.get(interaction.member.user.id)
                .forEach(countryball => {
                    if (countryball.id === fetchId) cbObject = countryball
                });

                if (Object.keys(cbObject).length == 0) return IntReply(interaction, { content: "No se encontró ese countryball.\nAsegúrate de usar la función de Autocompletar." })
                else {
                    DeferReply(interaction);

                    const canvas = createCanvas(1428, 2000);
                    const ctx = canvas.getContext("2d");
                    registerFont(path.resolve("./assets/countrydex/fonts/BobbyJonesSoftRegular400.otf"), { family: "Bobby Jones Soft Regular" })

                    ctx.font = "110px Bobby Jones Soft";

                    const image = await loadImage(path.resolve(`./assets/countrydex/cards/alent/${cbObject.data.names[0]}.png`));
                    ctx.drawImage(image, 0, 0, 1428, 2000);

                    ctx.fillStyle = "#eb7264";
                    ctx.fillText(cbObject.hp.toString(), 325, 1780)

                    ctx.fillStyle = "#fec44c";
                    ctx.fillText(cbObject.atk.toString(), 980, 1780)

                    return EditReplyFile(
                        interaction,
                        canvas.toBuffer("image/png"),
                        `countryball_${fetchId}.png`,
                        {
                            content: `Atrapado el <t:${cbObject.catchDate}:F> (<t:${cbObject.catchDate}:R>) ${cbObject?.spinObtained ? "\nObtenido mediante la ruleta de la suerte." : ""}${cbObject.tradeWith ? `\nObtenido mediante un intercambio con ${cbObject.tradeWith}` : ""}\n\nHP: ${cbObject.hp} (${cbObject.percentages[0] > 0 ? `+${cbObject.percentages[0]}%` : `${cbObject.percentages[0]}%`})\nATK: ${cbObject.atk} (${cbObject.percentages[1] > 0 ? `+${cbObject.percentages[1]}%` : `${cbObject.percentages[1]}%`})`,
                            attachments: [{ id: 0, filename: `countryball_${fetchId}.png`, url: `attachment://countryball_${fetchId}.png` }]
                        }
                    )
                }
            }
        }

        if (interaction.data.options[0].name == "give") {
            if (!owns.has(interaction.member.user.id)) return IntReply(interaction, { content: "¡Aún no has conseguido ningún countryball!" });

            const giftermappedCountryballs = new Map();
            const giftedmappedCountryballs = new Map();


            owns.get(interaction.member.user.id)
            .forEach(countryball => {
                giftermappedCountryballs.set(countryball.id, countryball);
            });

            const fetchId = interaction.data.options[0].options[0].value;
            const giftUser = interaction.data.options[0].options[1].value
            const getCountryball = giftermappedCountryballs.get(fetchId);

            if (!getCountryball) return IntReply(interaction, { content: "No se encontró ese countryball.\nAsegúrate de usar la función de Autocompletar." })

            if (!owns.has(giftUser)) owns.set(giftUser, []);
            const gifterUser = owns.get(interaction.member.user.id)
            const giftedUser = owns.get(giftUser)

            owns.get(giftUser)
            .forEach(countryball => {
                giftedmappedCountryballs.set(countryball.id, countryball);
            });

            IntReply(interaction, { content: `¡Has regalado ${getCountryball.data.hasOwnProperty("emoji") ? getCountryball.data.emoji : ""} **${getCountryball.data.renderedName}** a <@${giftUser}>!\nID: \`${fetchId}\`` })

            giftermappedCountryballs.delete(fetchId);
            giftedmappedCountryballs.set(fetchId, getCountryball);

            const arrayGifter = Array.from(giftermappedCountryballs);
            const arrayGifted = Array.from(giftedmappedCountryballs);

            var gifterArr = [], giftedArr = [];

            for (var i = 0; i < arrayGifter.length; i++) gifterArr.push(arrayGifter[i][1])
            for (var i = 0; i < arrayGifted.length; i++) {
                if (arrayGifted[i][1]?.id === fetchId) arrayGifted[i][1]["tradeWith"] = interaction.member.user.username
                giftedArr.push(arrayGifted[i][1]);
            }

            owns.set(interaction.member.user.id, gifterArr);
            owns.set(giftUser, giftedArr);

        }

        if (interaction.data.options[0].name == "about") {
            return IntReply(interaction, { embeds: [{
                color: 0x2b7fdf,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                title: "Información de Countrydex",
                description: `Countrydex, un proyecto inspirado en Ballsdex para los seguidores de Countryballs.\nAtrapa y colecciona cada uno de los countryballs.\n\nCreador: ! Sprite\nProgramador: [PwL](https://github.com/pwldev)\nArtista (Countrybot): Alen't\nCreador original de Ballsdex: [El Laggron](https://github.com/laggron42).`,
                footer: { text: `Solicitado por ${interaction.member.user.username}`, icon_url: ws.getAvatarURL(interaction.member.user) },
                image: { url: "https://cdn.discordapp.com/attachments/1091932806206201857/1097351201416294530/58_sin_titulo_20230416135149.png" }
            }] })
        }
        
        if (interaction.data.options[0].name == "completion") {
            var gotNames = [], missingNames = [], renderedGotList = "", renderedMissingList = "";

            if (!owns.has(interaction.member.user.id)) return IntReply(interaction, { content: "¡Aún no has conseguido ningún countryball!" });

            const countryballsInfo = require("../../countrydex/countryballs.json");
            if (owns.get(interaction.member.user.id).length == 0) return IntReply(interaction, { content: "¡Aún no has conseguido ningún countryball!" });

            // Got Countryballs
            owns.get(interaction.member.user.id).forEach(countryball => {
                if (!gotNames.includes(countryball.data.names[0])) gotNames.push(countryball.data.names[0]);
                else return;
            });

            // Missing Countryballs
            countryballsInfo.countryballs.forEach(countryball => {
                if (gotNames.includes(countryball.names[0])) return
                else missingNames.push(countryball.names[0])
            });

            if (missingNames.length == 0) renderedMissingList = "**¡Felicitaciones, has obtenido todos los countryballs!**";
            else {
                var cache = [];
                countryballsInfo.countryballs.forEach(countryball => {
                    if (missingNames.includes(countryball.names[0]) && !cache.includes(countryball.names[0])) {
                        renderedMissingList += `${countryball.emoji} `
                        cache.push(countryball.names[0])
                    } else return
                })
            }

            countryballsInfo.countryballs.forEach(countryball => {
                if (gotNames.includes(countryball.names[0])) renderedGotList += `${countryball.emoji} `
                else return
            });

            return IntReply(interaction, { embeds: [{
                color: 0x2b7fdf,
                author: { name: "AlentDex", icon_url: ws.avatarURL },
                title: "Progreso de Alentdex",
                description: `Progreso realizado: **${(gotNames.length * 100 / countryballsInfo.countryballs.length).toFixed(2)}%**`,
                footer: { text: `Solicitado por ${interaction.member.user.username}`, icon_url: ws.getAvatarURL(interaction.member.user) },
                fields: [{
                    name: "Countryballs conseguidos",
                    value: renderedGotList
                }, {
                    name: "Countryballs faltantes",
                    value: renderedMissingList
                }]
            }] })
        }

        if (interaction.data.options[0].name === "favorite") {
            if (!owns.has(interaction.member.user.id)) return IntReply(interaction, { content: "¡Aún no has conseguido ningún countryball!" });

            const allOwnedCountryballs = owns.get(interaction.member.user.id);
            const requestedId = interaction.data.options[0].options[0].value;
            var getCountryball = {}, matches = false;

            var finalBalls = []

            allOwnedCountryballs.forEach(countryball => { if (countryball.id === requestedId) matches = true })

            if (!matches) return IntReply(interaction, { content: "No se encontró ese countryball.\nAsegúrate de usar la función de Autocompletar." })
            else {
                allOwnedCountryballs.forEach(countryball => {
                    if (countryball.id === requestedId) {
                        if (!countryball.hasOwnProperty("favorite") || !countryball["favorite"]) {
                            countryball["favorite"] = true
                            getCountryball = countryball;
                        } else {
                            countryball["favorite"] = false
                            getCountryball = countryball;
                        }
                    }    
                    finalBalls.push(countryball)
                });
            }
            
            owns.set(interaction.member.user.id, finalBalls)
            
            IntReply(interaction, { content: `Se ${getCountryball.favorite ? "estableció" : "quitó"} ${getCountryball.data.hasOwnProperty("emoji") ? getCountryball.data.emoji : ""} **${getCountryball.data.renderedName}** como favorito.\nID: \`${requestedId}}\`` })
        }

        if (interaction.data.options[0].name == "luckyspin") {
            if (!luckyMap.has(interaction.member.user.id)) luckyMap.set(interaction.member.user.id, {
                used: false,
                started: null,
                finishes: null
            });

            if (luckyMap.get(interaction.member.user.id)?.used) return EphemeralReply(interaction, { embeds: [{
                color: 0xcc0000,
                author: { name: "AlentDex", icon_url: ws.avatarURL },
                footer: { text: `Solicitado por ${interaction.member.user.username}`, icon_url: ws.getAvatarURL(interaction.member.user) },
                description: `:x: ¡Ya giraste la ruleta de la suerte!\nPodrás volver a girarla <t:${Math.floor(luckyMap.get(interaction.member.user.id)?.finishes / 1000)}:R>`,
            }] });

            IntReply(interaction, {
                embeds: [{
                    color: 0x2b7fdf,
                    author: { name: "AlentDex", icon_url: ws.avatarURL },
                    title: "Ruleta de la suerte",
                    description: "**¿Te sientes hoy con suerte? ¡Prueba a girar la ruleta de la suerte!**\nCada 2 horas la podrás girar, te puede salir un countryball o nada, la suerte lo decidirá.",
                    image: { url: "https://media.discordapp.net/attachments/1091932806206201857/1108576212890161212/93_sin_titulo2_20230516215006.png?width=807&height=650" },
                    footer: { text: `Solicitado por ${interaction.member.user.username}`, icon_url: ws.getAvatarURL(interaction.member.user) },
                }],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        custom_id: `luckspin_${interaction.member.user.id}`,
                        style: 1,
                        label: "Girar"
                    }]
                }]
            });
        }
    }
}