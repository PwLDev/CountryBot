import { EditComponentReply, EphemeralReply, EditReply, IntReply, EditReplyFile, DeferReply } from "../../utils/Interactions.js";
import { APIRequest } from "../../utils/APIRequest.js";

import path from "node:path";

import { owns, spawns } from "../Ready.js";
import { listMap, luckyMap } from "../../commands/Countrydex.js";
import { generate } from "@pwldev/discord-snowflake";
import { createCanvas, loadImage, registerFont } from "canvas";

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const countryballData = require("../../countrydex/countryballs.json");

export function LuckSpin(ws, d) {
    const authorId = d.data.custom_id.substring(9, d.data.custom_id.length);
    if (d.member.user.id !== authorId) return EphemeralReply(d, { content: "Lo siento, esta ruleta no puede ser controlada por tí.\nUsa `/countryballs luckyspin` para usar la ruleta." });
    else {
        if (luckyMap.has(d.member.user.id) && luckyMap.get(d.member.user.id)?.used) {
            return EditComponentReply(d, {
                embeds: [{
                    color: 0xcc0000,
                    author: { name: "CountryDex", icon_url: ws.avatarURL },
                    footer: { text: `Solicitado por ${d.member.user.username}`, icon_url: ws.getAvatarURL(d.member.user) },
                    description: `:x: ¡Ya giraste la ruleta de la suerte!\nPodrás volver a girarla <t:${Math.floor(luckyMap.get(d.member.user.id)?.finishes / 1000)}:R>`,
                }],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        custom_id: `luckspin_${d.member.user.id}`,
                        style: 2,
                        label: "Girar",
                        disabled: true
                    }]
                }]
            });
        }

        EditComponentReply(d, {
            embeds: [{
                color: 0x2b7fdf,
                author: { name: "CountryDex", icon_url: ws.avatarURL },
                title: "Ruleta de la suerte",
                description: "Veamos que decidirá la ruleta...",
                image: { url: "https://media.discordapp.net/attachments/1091932806206201857/1099813354433937509/ezgif.com-gif-maker_4.gif" },
                footer: { text: `Solicitado por ${d.member.user.username}`, icon_url: ws.getAvatarURL(d.member.user) },
            }],
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    custom_id: `luckspin_${d.member.user.id}`,
                    style: 2,
                    label: "Girar",
                    disabled: true
                }]
            }]
        });

        setTimeout(async () => {
            const { countryballs } = countryballData;
            const randomSelection = Math.floor(Math.random() * ((countryballs.length * 2) - 0) + 0)

            if (randomSelection > countryballs.length - 1) return EditReply(d, {
                embeds: [{
                    color: 0x2b7fdf,
                    author: { name: "CountryDex", icon_url: ws.avatarURL },
                    title: "Ruleta de la suerte",
                    image: { url: "https://cdn.discordapp.com/attachments/1087085946509471875/1111742729144238110/Ruleta_Nada.png" },
                    footer: { text: `Solicitado por ${d.member.user.username}`, icon_url: ws.getAvatarURL(d.member.user) },
                }]
            });

            else {
                const cbData = countryballs[randomSelection - 1];
                const snowflakeId = generate(Date.now()).toString()
                if (!owns.has(d.member.user.id)) owns.set(d.member.user.id, []);

                const randomPercentage1 = Math.floor(Math.random() * (20 - -20) + -20);
                const randomPercentage2 = Math.floor(Math.random() * (20 - -20) + -20);

                const calculatedHp = Math.floor(randomPercentage1 > 0 ? (cbData.defaultHp * (randomPercentage1 / 100 + 1)) : (cbData.defaultHp - (cbData.defaultHp * (Math.abs(randomPercentage1)) / 100)));
                const calculatedAtk = Math.floor(randomPercentage2 > 0 ? (cbData.defaultAtk * (randomPercentage2 / 100 + 1)) : (cbData.defaultAtk - (cbData.defaultAtk * (Math.abs(randomPercentage2)) / 100)));

                owns.union(d.member.user.id, {
                    data: cbData,
                    id: snowflakeId,
                    catchDate: Math.floor(Date.now() / 1000),
                    percentages: [randomPercentage1, randomPercentage2],
                    hp: calculatedHp,
                    atk: calculatedAtk,
                    spinObtained: true
                });

                const canvas = createCanvas(532, 469);
                const ctx = canvas.getContext("2d");

                registerFont(path.resolve("./assets/countrydex/fonts/BobbyJonesSoftRegular400.otf"), { family: "Bobby Jones Soft Regular" })
                const backgroundImage = await loadImage(path.resolve(`./assets/countrydex/static/spinwin.png`))
                ctx.drawImage(backgroundImage, 0, 0, 532, 469)

                ctx.font = "50px Bobby Jones Soft";

                ctx.fillStyle = "#ffffff";
                ctx.fillText(`${cbData.renderedName}!`, 45, 95);

                const cbImg = await loadImage(path.resolve(`./assets/countrydex/spawn/${cbData.names[0]}.png`))
                ctx.drawImage(cbImg, 370, 275, cbImg.width / 7.5, cbImg.height / 7.5);

                EditReplyFile(d, canvas.toBuffer("image/png"), `countryball_${snowflakeId}.png`, {
                    embeds: [{
                        color: 0x2b7fdf,
                        author: { name: "CountryDex", icon_url: ws.avatarURL },
                        title: "Ruleta de la suerte",
                        image: { url: `attachment://countryball_${snowflakeId}.png` },
                        footer: { text: `Solicitado por ${d.member.user.username}`, icon_url: ws.getAvatarURL(d.member.user) },
                    }]
                });

                if (
                    d.member.user.id === "779464887231447073"
                    || d.member.user.id === "626928937355706373"
                    || d.member.user.id === "850557709040353290"
                    || d.member.user.id === "1062470869781332070"
                    || d.member.user.id === "1068377034444779612"
                ) return;

                setTimeout(() => {
                    luckyMap.set(d.member.user.id, {
                        used: false, 
                        started: null,
                        finishes: null
                    });
                }, 7200000);

                return
            }
        }, 8000)

        if (
            d.member.user.id === "779464887231447073"
            || d.member.user.id === "626928937355706373"
            || d.member.user.id === "850557709040353290"
            || d.member.user.id === "1062470869781332070"
            || d.member.user.id === "1068377034444779612"
        ) return;

        
        luckyMap.set(d.member.user.id, {
            used: true, 
            started: Date.now(),
            finishes: Date.now() + 7200000
        });
    }
}

export function CountryballModal(d) {
    const snowflakeId = d.data.custom_id.substring(8, d.data.custom_id.length);

    return APIRequest(`/interactions/${d.id}/${d.token}/callback`, {
        method: "POST",
        body: {
            type: 9,
            data: {
                title: "Adivina el Countryball",
                custom_id: `cbmodal_${snowflakeId}`,
                components: [{
                    type: 1,
                    components: [{
                        type: 4,
                        custom_id: `cbguess_${snowflakeId}`,
                        label: "Nombre del countryball",
                        style: 1,
                        required: true
                    }]
                }]
            }
        }
    })
}

export function CatchCountryball(d) {
    const snowflakeId = d.data.custom_id.substring(8, d.data.custom_id.length);
    const guess = d.data.components[0].components[0].value.toLowerCase().replace(" ", "").replace("'", "").replace(".", "");
    var matches = false;

    // if (d.member.user.id === "626928937355706373") return IntReply(d, { content: `<@${d.member.user.id}>, ` + "No puedes atrapar countryballs ya que eres el dueño y te sabes todas.\nDeja de los demás tambien atrapen, mejor tu PONTE A PROGRAMARME Y DEJA DE ANDAR ELIMINANDOME ARCHIVOS ctm." })

    const cbData = spawns.get(snowflakeId + ".data");
    if (!cbData) return IntReply(d, { content: `<@${d.member.user.id}>, ya fui atrapado.` });

    if (cbData.names.includes(guess)) matches = true;

    if (spawns.get(snowflakeId + ".catched")) return IntReply(d, { content: `<@${d.member.user.id}>, ya fui atrapado.` });

    if (matches) {
        var isShiny = spawns.get(snowflakeId + ".shiny");

        if (!cbData) return IntReply(d, { content: `<@${d.member.user.id}>, ese countryball ha expirado.` });
        spawns.set(snowflakeId + ".catched", true)

        IntReply(d, { content: `<@${d.member.user.id}>, ¡atrapaste a **${cbData.renderedName}**! ${isShiny ? "\n\n*✨ ¡Es un countryball brillante!*" : ""}` });

        APIRequest(`/channels/${d.channel_id}/messages/${spawns.get(snowflakeId + ".message.id")}`, {
            method: "PATCH",
            body: {
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        style: 2,
                        custom_id: `cbspawn_${snowflakeId}`,
                        label: "Atrápame",
                        disabled: true
                    }]
                }]
            }
        })

        if (!owns.has(d.member.user.id)) owns.set(d.member.user.id, []);

        const randomPercentage1 = Math.floor(Math.random() * (20 - -20) + -20);
        const randomPercentage2 = Math.floor(Math.random() * (20 - -20) + -20);

        const calculatedHp = Math.floor(randomPercentage1 > 0 ? (cbData.defaultHp * (randomPercentage1 / 100 + 1)) : (cbData.defaultHp - (cbData.defaultHp * (Math.abs(randomPercentage1)) / 100)));
        const calculatedAtk = Math.floor(randomPercentage2 > 0 ? (cbData.defaultAtk * (randomPercentage2 / 100 + 1)) : (cbData.defaultAtk - (cbData.defaultAtk * (Math.abs(randomPercentage2)) / 100)));

        if (cbData.hasOwnProperty("notVariate")) {
            calculatedHp = cbData.defaultHp
            calculatedAtk = cbData.defaultAtk
        }

        owns.union(d.member.user.id, {
            data: cbData,
            id: snowflakeId,
            catchDate: Math.floor(Date.now() / 1000),
            percentages: [randomPercentage1, randomPercentage2],
            hp: calculatedHp,
            atk: calculatedAtk,
            shiny: isShiny
        });
    } else return IntReply(d, { content: `<@${d.member.user.id}>, nombre incorrecto.` });
}

export function SearchCountryball(d) {
    if (!owns.has(d.member.user.id)) return APIRequest(`/interactions/${d.id}/${d.token}/callback`, {
        method: "POST",
        body: {
            type: 8,
            data: { choices: [] }
        }
    })

    const query = d.data.options[0].options[0].value;
    var cbArray = []

    if (query.length == 0) {
        owns.get(d.member.user.id)
        .forEach(cbObject => {
            if (cbArray.length > 24) return;
            if (cbObject.hasOwnProperty("favorite")) return cbArray.unshift({ name: ` ♥ ${cbObject.data.renderedName} HP:${cbObject.percentages[0] > 0 ? `+${cbObject.percentages[0]}%` : `${cbObject.percentages[0]}%`} ATK:${cbObject.percentages[1] > 0 ? `+${cbObject.percentages[1]}%` : `${cbObject.percentages[1]}%`}`, value: cbObject.id })
            cbArray.push({ name: `${cbObject.data.renderedName} HP:${cbObject.percentages[0] > 0 ? `+${cbObject.percentages[0]}%` : `${cbObject.percentages[0]}%`} ATK:${cbObject.percentages[1] > 0 ? `+${cbObject.percentages[1]}%` : `${cbObject.percentages[1]}%`}`, value: cbObject.id });
        })
            
        return APIRequest(`/interactions/${d.id}/${d.token}/callback`, {
            method: "POST",
            body: {
                type: 8,
                data: { choices: cbArray }
            }
        })
    }

    owns.get(d.member.user.id)
    .forEach(cbObject => {
        if (cbArray.length > 24) return;
        if (cbObject.data.names[0].startsWith(query.toLowerCase().replace(" ", "").replace("'", "").replace(".", "").replace("í", "i"))) {
            if (cbObject.hasOwnProperty("favorite") && cbObject["favorite"] == true) return cbArray.unshift({ name: ` ♥ ${cbObject.data.renderedName} HP:${cbObject.percentages[0] > 0 ? `+${cbObject.percentages[0]}%` : `${cbObject.percentages[0]}%`} ATK:${cbObject.percentages[1] > 0 ? `+${cbObject.percentages[1]}%` : `${cbObject.percentages[1]}%`}`, value: cbObject.id })
            cbArray.push({ name: `${cbObject.data.renderedName} HP:${cbObject.percentages[0] > 0 ? `+${cbObject.percentages[0]}%` : `${cbObject.percentages[0]}%`} ATK:${cbObject.percentages[1] > 0 ? `+${cbObject.percentages[1]}%` : `${cbObject.percentages[1]}%`}`, value: cbObject.id })
        }
        else return;
    })

    return APIRequest(`/interactions/${d.id}/${d.token}/callback`, {
        method: "POST",
        body: {
            type: 8,
            data: { choices: cbArray }
        }
    })
}


export function SearchCountryballIds(d) {
    const query = d.data.options[0].value;
    var cbArray = []


    if (query.length == 0) {
        countryballData.countryballs.forEach((countryball, index) => {
            if (cbArray.length == 25) return;

            cbArray.push({
                name: countryball.renderedName,
                value: index
            });
        });

        return APIRequest(`/interactions/${d.id}/${d.token}/callback`, {
            method: "POST",
            body: {
                type: 8,
                data: { choices: cbArray }
            }
        })
    }

    countryballData.countryballs.forEach((countryball, index) => {
        if (cbArray.length == 25) return;

        if (countryball.names[0].startsWith(query.toLowerCase().replace(" ", "").replace("'", "").replace(".", "").replace("í", "i"))) cbArray.push({
            name: countryball.renderedName,
            value: index
        });
    });

    return APIRequest(`/interactions/${d.id}/${d.token}/callback`, {
        method: "POST",
        body: {
            type: 8,
            data: { choices: cbArray }
        }
    })
}

export function ListCountryballs(ws, d) {
    const action = d.data.custom_id.substring(5, 9)
    const listId = d.data.custom_id.substring(10, d.data.custom_id.length);
    const data = listMap.get(listId);

    if (!data) return EphemeralReply(d, { content: "Esta lista expiró, crea otra usando `/countryballs list`." });
    if (data.author !== d.member.user.id) return EphemeralReply(d, { content: "Lo siento, pero este menú no puede ser controlado por ti." })

    if (action === "frst") {
        EditComponentReply(d, {
            content: "Lista de "+data.username,
            components: [{
                type: 1,
                components: [{
                    type: 3,
                    custom_id: "countrydex_list_"+data.user,
                    options: data.optionsArray[0]
                }]
            }, {
                type: 1,
                components: [ {
                    type: 2,
                    style: 2,
                    label: "«",
                    custom_id: "list_frst_"+listId,
                    disabled: true
                }, {
                    type: 2,
                    style: 1,
                    label: "...",
                    custom_id: "list_prev_"+listId,
                    disabled: true
                }, {
                    type: 2,
                    style: 2,
                    label: "1",
                    custom_id: "list_curr_"+listId,
                    disabled: true
                }, {
                    type: 2,
                    style: 1,
                    label: "2",
                    custom_id: "list_next_"+listId,
                    disabled: false,
                }, {
                    type: 2,
                    style: 2,
                    label: "»",
                    custom_id: "list_last_"+listId
                }]
            }]
        });

        listMap.set(listId, { page: 0, author: d.member.user.id, id: data.id, token: data.token, optionsArray: data.optionsArray, username: data.username, user: data.user });
    }

    if (action === "last") {
        EditComponentReply(d, {
            content: "Lista de "+data.username,
            components: [{
                type: 1,
                components: [{
                    type: 3,
                    custom_id: "countrydex_list_"+data.user,
                    options: data.optionsArray[data.optionsArray.length - 1]
                }]
            }, {
                type: 1,
                components: [{
                    type: 2,
                    style: 2,
                    label: "«",
                    custom_id: "list_frst_"+listId,
                    disabled: false
                }, {
                    type: 2,
                    style: 1,
                    label: String(data.optionsArray.length - 1),
                    custom_id: "list_prev_"+listId,
                    disabled: false
                }, {
                    type: 2,
                    style: 2,
                    label: String(data.optionsArray.length),
                    custom_id: "list_curr_"+listId,
                    disabled: true
                }, {
                    type: 2,
                    style: 1,
                    label: "...",
                    custom_id: "list_next_"+listId,
                    disabled: true,
                }, {
                    type: 2,
                    style: 2,
                    label: "»",
                    custom_id: "list_last_"+listId,
                    disabled: true
                }, ]
            }]
        });

        listMap.set(listId, { page: data.optionsArray.length - 1, author: d.member.user.id, id: data.id, token: data.token, optionsArray: data.optionsArray, username: data.username, user: data.user });
    }

    if (action === "prev") {
        if (data.page === 0) return EphemeralReply(d, { content: "No se puede retroceder, ya que estás en la primera página." })
        EditComponentReply(d, {
            content: "Lista de "+data.username,
            components: [{
                type: 1,
                components: [{
                    type: 3,
                    custom_id: "countrydex_list_"+data.user,
                    options: data.optionsArray[data.page - 1]
                }]
            }, {
                type: 1,
                components: [{
                    type: 2,
                    style: 2,
                    label: "«",
                    custom_id: "list_frst_"+listId,
                    disabled: data.page == 1 ? true : false
                }, {
                    type: 2,
                    style: 1,
                    label: data.page == 1 ? "..." : String(data.page - 1),
                    custom_id: "list_prev_"+listId,
                    disabled: data.page == 1 ? true : false
                }, {
                    type: 2,
                    style: 2,
                    label: data.page,
                    custom_id: "list_curr_"+listId,
                    disabled: true,
                }, {
                    type: 2,
                    style: 1,
                    label: String(data.page + 1),
                    custom_id: "list_next_"+listId,
                    disabled: false,
                }, {
                    type: 2,
                    style: 2,
                    label: "»",
                    custom_id: "list_last_"+listId
                }, ]
            }]
        });

        listMap.set(listId, { page: data.page - 1, author: d.member.user.id, id: data.id, token: data.token, optionsArray: data.optionsArray, username: data.username, user: data.user });
    }

    if (action === "next") {
        if (data.page === data.optionsArray.length - 1) return EphemeralReply(d, { content: "No se puede avanzar, ya que estás en la última página." })
        EditComponentReply(d, {
            content: "Lista de "+data.username,
            components: [{
                type: 1,
                components: [{
                    type: 3,
                    custom_id: "countrydex_list_"+data.user,
                    options: data.optionsArray[data.page + 1]
                }]
            }, {
                type: 1,
                components: [{
                    type: 2,
                    style: 2,
                    label: "«",
                    custom_id: "list_frst_"+listId,
                    disabled: true
                }, {
                    type: 2,
                    style: 1,
                    label: String(data.page + 1),
                    custom_id: "list_prev_"+listId,
                    disabled: false
                }, {
                    type: 2,
                    style: 2,
                    label: String(data.page + 2),
                    custom_id: "list_curr_"+listId,
                    disabled: false
                }, {
                    type: 2,
                    style: 1,
                    label: data.optionsArray.length >= data.page ? "..." : String(data.page + 3),
                    custom_id: "list_next_"+listId,
                    disabled: data.optionsArray.length >= data.page ? true : false,
                }, {
                    type: 2,
                    style: 2,
                    label: "»",
                    custom_id: "list_last_"+listId
                }, ]
            }]
        });

        listMap.set(listId, { page: data.page + 1, author: d.member.user.id, id: data.id, token: data.token, optionsArray: data.optionsArray, username: data.username, user: data.user });
    }
}

export async function ShowCard(ws, d) {
    const fetchId = d.data.values[0];
    var cbObject = {};
    console.log(fetchId)

    owns.get(d.data.custom_id.substring(16, d.data.custom_id.length))
    .forEach(countryball => {
        if (countryball.id === fetchId) cbObject = countryball
    });
    console.log(cbObject)
    if (Object.keys(cbObject).length == 0) return IntReply(d, { content: "No se encontró ese countryball.\nAsegúrate de usar la función de Autocompletar." })
    else {
        DeferReply(d)
        const canvas = createCanvas(1428, 2000);
        const ctx = canvas.getContext("2d");
        registerFont(path.resolve("./assets/countrydex/fonts/BobbyJonesSoftRegular400.otf"), { family: "Bobby Jones Soft Regular" })

        ctx.font = "110px Bobby Jones Soft";

        var image;
        if (cbObject?.shiny) image = await loadImage(path.resolve(`./assets/countrydex/shiny/${cbObject.data.names[0]}.png`))
        else image = await loadImage(path.resolve(`./assets/countrydex/cards/${cbObject.data.names[0]}.png`));
        ctx.drawImage(image, 0, 0, 1428, 2000);

        ctx.fillStyle = "#eb7264";
        ctx.fillText(cbObject.hp.toString(), 325, 1780)

        ctx.fillStyle = "#fec44c";
        ctx.fillText(cbObject.atk.toString(), 980, 1780)

        return EditReplyFile(
            d,
            canvas.toBuffer("image/png"),
            `countryball_${fetchId}.png`,
            {
                content: `ID: \`${fetchId}\`\nAtrapado el <t:${cbObject.catchDate}:F> (<t:${cbObject.catchDate}:R>) ${cbObject?.spinObtained ? "\nObtenido mediante la ruleta de la suerte." : ""}${cbObject.tradeWith ? `\nObtenido mediante un intercambio con ${cbObject.tradeWith}` : ""}\n\nHP: ${cbObject.hp} (${cbObject.percentages[0] > 0 ? `+${cbObject.percentages[0]}%` : `${cbObject.percentages[0]}%`})\nATK: ${cbObject.atk} (${cbObject.percentages[1] > 0 ? `+${cbObject.percentages[1]}%` : `${cbObject.percentages[1]}%`})`,
                attachments: [{ id: 0, filename: `countryball_${fetchId}.png`, url: `attachment://countryball_${fetchId}.png` }]
            }
        )
    } 
}