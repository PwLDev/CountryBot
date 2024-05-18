import { createCanvas, loadImage, registerFont } from "canvas";
import { cardMaps } from "../../commands/Card.js"
import { APIRequest } from "../../utils/APIRequest.js";
import { EditReply, EditReplyFile, EphemeralReply, IntReply, IntReplyFile } from "../../utils/Interactions.js";
import path from "node:path";

import abtob from "arraybuffer-to-buffer"
import fetch from "node-fetch";

const delay = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) };

export default async (ws, d) => {
    const cardId = d.data.custom_id.substring(9, d.data.custom_id.length);
    const cardAction = d.data.custom_id.substring(5, 8);

    if (cardAction.startsWith("mod")) {
        APIRequest(`/interactions/${d.id}/${d.token}/callback`, { method: "POST", body: { type: 6, data: null } });
        const data = cardMaps.get(cardId.substring(4, cardId.length));
        if (!cardMaps.has(cardId.substring(4, cardId.length))) return EphemeralReply(d, { content: "Esta carta expiró, puedes crear otra con `/card create`." })

        const modalCardId = d.data.custom_id.substring(13, d.data.custom_id.length);
        const modalCardAction = d.data.custom_id.substring(9, 12);

        switch (modalCardAction) {
            case "nam":
                
                cardMaps.set(cardId.substring(4, cardId.length), {
                    author: data.author,
                    token: data.token,
                    back: data.back ?? "gray",
                    name: d.data.components[0].components[0].value,
                    hability: data.hability ?? null,
                    description: data.description ??null,
                    image: data.image ?? null,
                    hp: data.hp ?? null,
                    atk: data.atk ?? null,
                    type: data.type ?? "default",
                    fillStyle: data.fillStyle ?? "white",
                    icon: data.icon ?? null,
                    special: {
                        enabled: data.special.enabled ?? false,
                        back: data.special.back ?? null,
                        decoration: data.special.decoration ?? null,
                        overlay: data.special.overlay ?? null,
                    }
                });

                generateImage(d, cardMaps.get(cardId.substring(4, cardId.length)), cardId)
                break;
            case "hab":
                cardMaps.set(cardId.substring(4, cardId.length), {
                    author: data.author,
                    token: data.token,
                    back: data.back ?? "gray",
                    name: data.name ?? null,
                    hability: d.data.components[0].components[0].value,
                    description: data.description ?? null,
                    image: data.image ?? null,
                    hp: data.hp ?? null,
                    atk: data.atk ?? null,
                    type: data.type ?? "default",
                    fillStyle: data.fillStyle ?? "white",
                    icon: data.icon ?? null,
                    special: {
                        enabled: data.special.enabled ?? false,
                        back: data.special.back ?? null,
                        decoration: data.special.decoration ?? null,
                        overlay: data.special.overlay ?? null,
                    }
                });

                generateImage(d, cardMaps.get(cardId.substring(4, cardId.length)), cardId)
                break;
            case "des":
                cardMaps.set(cardId.substring(4, cardId.length), {
                    author: data.author,
                    token: data.token,
                    back: data.back ?? "gray",
                    name: data.name ?? null,
                    hability: data.hability ?? null,
                    description: d.data.components[0].components[0].value,
                    image: data.image ?? null,
                    hp: data.hp ?? null,
                    atk: data.atk ?? null,
                    type: data.type ?? "default",
                    fillStyle: data.fillStyle ?? "white",
                    icon: data.icon ?? null,
                    special: {
                        enabled: data.special.enabled ?? false,
                        back: data.special.back ?? null,
                        decoration: data.special.decoration ?? null,
                        overlay: data.special.overlay ?? null,
                    }
                });

                generateImage(d, cardMaps.get(cardId.substring(4, cardId.length)), cardId)
                break;
            case "hlp":
                if (isNaN(parseInt(d.data.components[0].components[0].value))) return;
                
                cardMaps.set(cardId.substring(4, cardId.length), {
                    author: data.author,
                    token: data.token,
                    back: data.back ?? "gray",
                    name: data.name ?? null,
                    hability: data.hability ?? null,
                    description: data.description ?? null,
                    image: data.image ?? null,
                    hp: d.data.components[0].components[0].value,
                    atk: data.atk ?? null,
                    type: data.type ?? "default",
                    fillStyle: data.fillStyle ?? "white",
                    icon: data.icon ?? null,
                    special: {
                        enabled: data.special.enabled ?? false,
                        back: data.special.back ?? null,
                        decoration: data.special.decoration ?? null,
                        overlay: data.special.overlay ?? null,
                    }
                });

                generateImage(d, cardMaps.get(cardId.substring(4, cardId.length)), cardId)
                break;
            case "icn":
                cardMaps.set(cardId.substring(4, cardId.length), {
                    author: data.author,
                    token: data.token,
                    back: data.back ?? null,
                    name: data.name ?? null,
                    hability: data.hability ?? null,
                    description: data.description ?? null,
                    image: data.image ?? null,
                    hp: data.hp ?? null,
                    atk: data.atk ?? null,
                    type: data.type ?? "default",
                    fillStyle: data.fillStyle ?? null,
                    type: data.type ?? null,
                    icon:  d.data.values[0] === "none" ? null : d.data.values[0],
                    special: {
                        enabled: data.special.enabled ?? false,
                        back: data.special.back ?? null,
                        decoration: data.special.decoration ?? null,
                        overlay: data.special.overlay,
                    }
                });

                generateImage(d, cardMaps.get(cardId.substring(4, cardId.length)), cardId)
                break;
            case "atk":
                if (isNaN(parseInt(d.data.components[0].components[0].value))) return;
                
                cardMaps.set(cardId.substring(4, cardId.length), {
                    author: data.author,
                    token: data.token,
                    back: data.back ?? "gray",
                    name: data.name ?? null,
                    hability: data.hability ?? null,
                    description: data.description ?? null,
                    image: data.image ?? null,
                    hp: data.hp ?? null,
                    atk: d.data.components[0].components[0].value,
                    type: data.type ?? "default",
                    fillStyle: data.fillStyle ?? "white",
                    icon: data.icon ?? null,
                    special: {
                        enabled: data.special.enabled ?? false,
                        back: data.special.back ?? null,
                        decoration: data.special.decoration ?? null,
                        overlay: data.special.overlay ?? null,
                    }
                });

                generateImage(d, cardMaps.get(cardId.substring(4, cardId.length)), cardId)
                break;
            case "img":
                cardMaps.set(cardId.substring(4, cardId.length), {
                    author: data.author,
                    token: data.token,
                    back: data.back ?? "gray",
                    name: data.name ?? null,
                    hability: data.hability ?? null,
                    description: data.description ?? null,
                    image: d.data.components[0].components[0].value,
                    hp: data.hp ?? null,
                    atk: data.atk ?? null,
                    type: data.type ?? "default",
                    fillStyle: data.fillStyle ?? "white",
                    icon: data.icon ?? null,
                    special: {
                        enabled: data.special.enabled ?? false,
                        back: data.special.back ?? null,
                        decoration: data.special.decoration ?? null,
                        overlay: data.special.overlay ?? null,
                    }
                });

                generateImage(d, cardMaps.get(cardId.substring(4, cardId.length)), cardId)
                break;
            case "clr":
                if (data.special.enabled) {
                    cardMaps.set(cardId.substring(4, cardId.length), {
                        author: data.author,
                        token: data.token,
                        back: d.data.values[0],
                        name: data.name ?? null,
                        hability: data.hability ?? null,
                        description: data.description ?? null,
                        image: data.image ?? null,
                        hp: data.hp ?? null,
                        atk: data.atk ?? null,
                        type: data.type ?? "default",
                        fillStyle: data.fillStyle ?? "white",
                        icon: data.icon ?? null,
                        special: {
                            enabled: true,
                            back: data.special.back ?? null,
                            decoration: data.special.decoration ?? null,
                            overlay: data.special.overlay ?? null,
                        }
                    });
                } else {
                    cardMaps.set(cardId.substring(4, cardId.length), {
                        author: data.author,
                        token: data.token,
                        back: d.data.values[0],
                        name: data.name ?? null,
                        hability: data.hability ?? null,
                        description: data.description ?? null,
                        image: data.image ?? null,
                        hp: data.hp ?? null,
                        atk: data.atk ?? null,
                        type: data.type ?? "default",
                        fillStyle: data.fillStyle ?? "white",
                        icon: data.icon ?? null,
                        special: {
                            enabled: false,
                            back: data.special.back ?? null,
                            decoration: data.special.decoration ?? null,
                            overlay: data.special.overlay ?? null,
                        }
                    });
                }
                generateImage(d, cardMaps.get(cardId.substring(4, cardId.length)), cardId)
                break;
            case "txt":
                cardMaps.set(cardId.substring(4, cardId.length), {
                    author: data.author,
                    token: data.token,
                    back: data.back ?? null,
                    name: data.name ?? null,
                    hability: data.hability ?? null,
                    description: data.description ?? null,
                    image: data.image ?? null,
                    hp: data.hp ?? null,
                    atk: data.atk ?? null,
                    type: data.type ?? "default",
                    fillStyle: d.data.values[0],
                    icon: data.icon ?? null,
                    special: {
                        enabled: data.special.enabled ?? false,
                        back: data.special.back ?? null,
                        decoration: data.special.decoration ?? null,
                        overlay: data.special.overlay ?? null,
                    }
                });

                generateImage(d, cardMaps.get(cardId.substring(4, cardId.length)), cardId)
                break;
            // Special Cases
            case "deb":
                cardMaps.set(cardId.substring(4, cardId.length), {
                    author: data.author,
                    token: data.token,
                    back: data.back ?? null,
                    name: data.name ?? null,
                    hability: data.hability ?? null,
                    description: data.description ?? null,
                    image: data.image ?? null,
                    hp: data.hp ?? null,
                    atk: data.atk ?? null,
                    type: data.type ?? "default",
                    fillStyle: data.fillStyle ?? null,
                    icon: data.icon ?? null,
                    special: {
                        enabled: true,
                        back: d.data.values[0],
                        decoration: data.special.decoration ?? null,
                        overlay: data.special.overlay ?? null,
                    }
                });

                generateImage(d, cardMaps.get(cardId.substring(4, cardId.length)), cardId)
                break;
            case "dec":
                cardMaps.set(cardId.substring(4, cardId.length), {
                    author: data.author,
                    token: data.token,
                    back: data.back ?? null,
                    name: data.name ?? null,
                    hability: data.hability ?? null,
                    description: data.description ?? null,
                    image: data.image ?? null,
                    hp: data.hp ?? null,
                    atk: data.atk ?? null,
                    type: data.type ?? "default",
                    fillStyle: data.fillStyle ?? null,
                    icon: data.icon ?? null,
                    special: {
                        enabled: true,
                        back: data.special.back ?? null,
                        decoration: d.data.values[0] ?? null,
                        overlay: data.special.overlay ?? null,
                    }
                });

                generateImage(d, cardMaps.get(cardId.substring(4, cardId.length)), cardId)
                break;
            case "deo":
                cardMaps.set(cardId.substring(4, cardId.length), {
                    author: data.author,
                    token: data.token,
                    back: data.back ?? null,
                    name: data.name ?? null,
                    hability: data.hability ?? null,
                    description: data.description ?? null,
                    image: data.image ?? null,
                    hp: data.hp ?? null,
                    atk: data.atk ?? null,
                    type: data.type ?? "default",
                    fillStyle: data.fillStyle ?? null,
                    type: data.type ?? null,
                    icon: data.icon ?? null,
                    special: {
                        enabled: true,
                        back: data.special.back ?? null,
                        decoration: data.special.decoration ?? null,
                        overlay:  d.data.values[0],
                    }
                });

                generateImage(d, cardMaps.get(cardId.substring(4, cardId.length)), cardId)
                break;
            case "del":
                cardMaps.set(cardId.substring(4, cardId.length), {
                    author: data.author,
                    token: data.token,
                    back: data.back ?? null,
                    name: data.name ?? null,
                    hability: data.hability ?? null,
                    description: data.description ?? null,
                    image: data.image ?? null,
                    hp: data.hp ?? null,
                    atk: data.atk ?? null,
                    type: data.type ?? "default",
                    fillStyle: data.fillStyle ?? null,
                    icon: data.icon ?? null,
                    special: {
                        enabled: true,
                        back: d.data.values[0],
                        decoration: data.special.decoration ?? null,
                        overlay: data.special.overlay ?? null,
                    }
                });

                generateImage(d, cardMaps.get(cardId.substring(4, cardId.length)), cardId)
                break;
        }

        return
    }

    const data = cardMaps.get(cardId);
    if (!cardMaps.has(cardId)) return EphemeralReply(d, { content: "Esta carta expiró, puedes crear otra con `/card create`." })

    switch (cardAction) {
        case "nam": 
            if (data.author !== d.member.user.id) return APIRequest(`/interactions/${d.id}/${d.token}/callback`, { method: "POST", body: { type: 6, data: null } })
            APIRequest(`/interactions/${d.id}/${d.token}/callback`, {
                method: "POST",
                body: {
                    type: 9,
                    data: {
                        title: "Cambiar nombre",
                        custom_id: "card_mod_nam_"+cardId,
                        components: [{
                            type: 1,
                            components: [{
                                type: 4,
                                custom_id: `card_modal_nav_`+cardId,
                                label: "Nombre de la carta",
                                style: 1,
                                required: true
                            }]
                        }]
                    }
                }
            })
            break;
        case "hab":
            if (data.author !== d.member.user.id) return APIRequest(`/interactions/${d.id}/${d.token}/callback`, { method: "POST", body: { type: 6, data: null } })
            APIRequest(`/interactions/${d.id}/${d.token}/callback`, {
                method: "POST",
                body: {
                    type: 9,
                    data: {
                        title: "Cambiar habilidad",
                        custom_id: "card_mod_hab_"+cardId,
                        components: [{
                            type: 1,
                            components: [{
                                type: 4,
                                custom_id: `card_modal_hab_`+cardId,
                                label: "Cambiar habilidad de la carta",
                                style: 1,
                                required: true
                            }]
                        }]
                    }
                }
            })
            break;
        case "des":
            if (data.author !== d.member.user.id) return APIRequest(`/interactions/${d.id}/${d.token}/callback`, { method: "POST", body: { type: 6, data: null } })
            APIRequest(`/interactions/${d.id}/${d.token}/callback`, {
                method: "POST",
                body: {
                    type: 9,
                    data: {
                        title: "Cambiar descripción",
                        custom_id: "card_mod_des_"+cardId,
                        components: [{
                            type: 1,
                            components: [{
                                type: 4,
                                custom_id: `card_modal_des_`+cardId,
                                label: "Cambiar descripción de la carta",
                                style: 2,
                                required: true
                            }]
                        }]
                    }
                }
            })
            break;
        case "spc":
            if (data.author !== d.member.user.id) return APIRequest(`/interactions/${d.id}/${d.token}/callback`, { method: "POST", body: { type: 6, data: null } })
            return EphemeralReply(d, {
                content: "Decoraciones especiales ✨",
                components: [{
                    type: 1,
                    components: [{
                        type: 3,
                        custom_id: "card_mod_deb_"+cardId,
                        placeholder: "Selecciona un fondo",
                        options: [{
                            label: "Christmas (Navidad)",
                            value: "xmas"
                        }, {
                            label: "Spooky (Halloween)",
                            value: "spooky"
                        }, {
                            label: "Boss (Jefe)",
                            value: "boss"
                        }, {
                            label: "Easter (Pascua)",
                            value: "easter"
                        }, {
                            label: "Shiny (Brillante)",
                            value: "shiny"
                        }]
                    }] 
                }, {
                    type: 1,
                    components: [{
                        type: 3,
                        custom_id: "card_mod_dec_"+cardId,
                        placeholder: "Selecciona una decoración",
                        options: [{
                            label: "Christmas (Navidad)",
                            value: "xmas"
                        }, {
                            label: "Spooky (Halloween)",
                            value: "spooky"
                        }, {
                            label: "Boss (Jefe)",
                            value: "boss"
                        }, {
                            label: "Easter (Pascua)",
                            value: "easter"
                        }, {
                            label: "Shiny (Brillante)",
                            value: "shiny"
                        }]
                    }]
                }, {
                    type: 1,
                    components: [{
                        type: 3,
                        custom_id: "card_mod_deo_"+cardId,
                        placeholder: "Selecciona unos iconos",
                        options: [{
                           label: "Default (Normal)",
                           value: "default"
                        }, {
                            label: "Christmas (Navidad)",
                            value: "xmas"
                        }, {
                            label: "Spooky (Halloween)",
                            value: "spooky"
                        }, {
                            label: "Boss (Jefe)",
                            value: "boss"
                        }, {
                            label: "Easter (Pascua)",
                            value: "easter"
                        }, {
                            label: "Shiny (Brillante)",
                            value: "shiny"
                        }]
                    }]
                }]
            })
        case "typ":
            if (data.author !== d.member.user.id) return APIRequest(`/interactions/${d.id}/${d.token}/callback`, { method: "POST", body: { type: 6, data: null } })
            return EphemeralReply(d, {
                components: [{
                    type: 1,
                    components: [{
                        type: 3,
                        custom_id: "card_mod_icn_"+cardId,
                        options: [{
                            label: "Ninguno",
                            value: "none"
                        }, {
                            label: "Democracia",
                            value: "democracy"
                        }, {
                            label: "Unión",
                            value: "union"
                        },{
                            label: "Soviético",
                            value: "sovietic"
                        }]
                    }]
                }]
            })
        case "hlp":
            if (data.author !== d.member.user.id) return APIRequest(`/interactions/${d.id}/${d.token}/callback`, { method: "POST", body: { type: 6, data: null } })
            APIRequest(`/interactions/${d.id}/${d.token}/callback`, {
                method: "POST",
                body: {
                    type: 9,
                    data: {
                        title: "Cambiar vida",
                        custom_id: "card_mod_hlp_"+cardId,
                        components: [{
                            type: 1,
                            components: [{
                                type: 4,
                                custom_id: `card_modal_hlp_`+cardId,
                                label: "Cambiar vida",
                                style: 1,
                                required: true
                            }]
                        }]
                    }
                }
            })
            break;
        case "atk":
            if (data.author !== d.member.user.id) return APIRequest(`/interactions/${d.id}/${d.token}/callback`, { method: "POST", body: { type: 6, data: null } })
            APIRequest(`/interactions/${d.id}/${d.token}/callback`, {
                method: "POST",
                body: {
                    type: 9,
                    data: {
                        title: "Cambiar ataque",
                        custom_id: "card_mod_atk_"+cardId,
                        components: [{
                            type: 1,
                            components: [{
                                type: 4,
                                custom_id: `card_modal_atk_`+cardId,
                                label: "Cambiar ataque",
                                style: 1,
                                required: true
                            }]
                        }]
                    }
                }
            })
            break;
        case "img":
            if (data.author !== d.member.user.id) return APIRequest(`/interactions/${d.id}/${d.token}/callback`, { method: "POST", body: { type: 6, data: null } })
            APIRequest(`/interactions/${d.id}/${d.token}/callback`, {
                method: "POST",
                body: {
                    type: 9,
                    data: {
                        title: "Cambiar URL de imagen",
                        custom_id: "card_mod_img_"+cardId,
                        components: [{
                            type: 1,
                            components: [{
                                type: 4,
                                custom_id: `card_modal_img_`+cardId,
                                label: "Cambiar imagen de la carta (URL) (1360 x 735)",
                                style: 1,
                                required: true
                            }]
                        }]
                    }
                }
            })
            break;
        case "clr":
            if (data.author !== d.member.user.id) return APIRequest(`/interactions/${d.id}/${d.token}/callback`, { method: "POST", body: { type: 6, data: null } })
            return EphemeralReply(d, {
                components: [{
                    type: 1,
                    components: [{
                        type: 3,
                        custom_id: "card_mod_clr_"+cardId,
                        placeholder: "Selecciona un color",
                        options: [{
                            label: "Rojo oscuro",
                            value: "darkred",
                        }, {
                            label: "Rojo",
                            value: "red",
                        }, {
                            label: "Naranja",
                            value: "orange",
                        }, {
                            label: "Amarillo",
                            value: "yellow",
                        }, {
                            label: "Verde Alen't",
                            value: "alentgreen",
                        }, {
                            label: "Verde claro",
                            value: "lightgreen",
                        }, {
                            label: "Verde",
                            value: "green",
                        }, {
                            label: "Celeste",
                            value: "skyblue",
                        }, {
                            label: "Turquesa",
                            value: "turquoise",
                        }, {
                            label: "Azul",
                            value: "blue",
                        }, {
                            label: "Morado",
                            value: "purple"
                        },{
                            label: "Fuchsia",
                            value: "fuchsia",
                        }, {
                            label: "Rosa",
                            value: "pink",
                        }, {
                            label: "Gris",
                            value: "gray",
                        }, {
                            label: "Blanco",
                            value: "white"
                        }, {
                            label: "Default 1",
                            value: "default1",
                        }, {
                            label: "Default 2",
                            value: "default2",
                        }, {
                            label: "Default 3",
                            value: "default3",
                        }]
                    }]
                }]
            })
        case "txt":
            if (data.author !== d.member.user.id) return APIRequest(`/interactions/${d.id}/${d.token}/callback`, { method: "POST", body: { type: 6, data: null } })
            return EphemeralReply(d, { content: "Color del texto", components: [{
                type: 1,
                components: [{
                    type: 3,
                    custom_id: "card_mod_txt_"+cardId,
                    placeholder: "Selecciona un color de texto",
                    options: [{
                        label: "Blanco",
                        value: "white"
                    }, {
                        label: "Negro",
                        value: "black"
                    }]
                }],
            }] })
        case "end":
            if (data.author !== d.member.user.id) return APIRequest(`/interactions/${d.id}/${d.token}/callback`, { method: "POST", body: { type: 6, data: null } })
            IntReplyFile(d, await generateImageBuffer(d, data, cardId), "card_"+cardId+".png", { attachments: [{ id: 0, url: "attachment://card_"+cardId+".png" }] })
            break;
        case "ccl":
            if (data.author !== d.member.user.id) return APIRequest(`/interactions/${d.id}/${d.token}/callback`, { method: "POST", body: { type: 6, data: null } })
            APIRequest(`/webhooks/1090811431391334520/${data.token}/messages/@original`, { method: "DELETE" });
            cardMaps.delete(cardId)
            break;
    }
}

async function generateImage(d, data, cardId) {
    const canvas = createCanvas(1428, 2000);
    const ctx = canvas.getContext("2d");

    var icon = null, specialIcon = null;

    if (data.special.enabled) {
        if (data.special.back) var specialBack = await loadImage(path.resolve(`./assets/static/cards/special/back/${data.special.back}.png`));
        if (data.special.decoration) var specialDecoration = await loadImage(path.resolve(`./assets/static/cards/special/decoration/${data.special.decoration}.png`));
        if (data.special.overlay) var specialOverlay = await loadImage(path.resolve(`./assets/static/cards/special/overlay/${data.special.overlay}.png`));

        if (data.icon) specialIcon = await loadImage(path.resolve(`./assets/static/cards/type/${data.icon}.png`));
    } else {
        var back = await loadImage(path.resolve(`./assets/static/cards/back/${data.back}.png`))
        var overlay = await loadImage(path.resolve("./assets/static/cards/overlay.png"));

        if (data.icon) icon = await loadImage(path.resolve(`./assets/static/cards/type/${data.icon}.png`))
        
        await delay(500);
    }
    
    registerFont(path.resolve("./assets/countrydex/fonts/ArsenicaTrial-Extrabold.ttf"), { family: "Arsenica Trial Extrabold" })
    registerFont(path.resolve("./assets/countrydex/fonts/OpenSans.ttf"), { family: "Open Sans" })
    registerFont(path.resolve("./assets/countrydex/fonts/BobbyJonesSoftRegular400.otf"), { family: "Bobby Jones Soft Regular" })

    // Load images

    if (data.special.enabled) {
        if (data.special.back) ctx.drawImage(specialBack, 0, 0, 1428, 2000)
        if (data.special.decoration) ctx.drawImage(specialDecoration, 0, 0, 1428, 2000)
        if (data.special.overlay) ctx.drawImage(specialOverlay, 0, 0, 1428, 2000)
        if (icon) ctx.drawImage(specialIcon, 0, 0, 1428, 2000)
    } else {
        ctx.drawImage(back, 0, 0, 1428, 2000)
        ctx.drawImage(overlay, 0, 0, 1428, 2000)
        if (icon) ctx.drawImage(icon, 0, 0, 1428, 2000)
    }

    if (data.fillStyle == "white") {
        ctx.fillStyle = "#fff"
        await loadImage(path.resolve(`./assets/static/cards/watermark/white.png`)).then(img => ctx.drawImage(img, 0, 0, 1428, 2000));
    } else if (data.fillStyle == "black") {
        ctx.fillStyle = "#000"
        await loadImage(path.resolve(`./assets/static/cards/watermark/black.png`)).then(img => ctx.drawImage(img, 0, 0, 1428, 2000));
    }

    if (data.name) {
        ctx.font = "165px Arsenica Trial Extrabold"

        ctx.fillText(data.name, 40, 195)
    }

    if (data.hability) {
        ctx.font = "95px Bobby Jones Soft Regular"

        ctx.fillText("Habilidad: "+data.hability, 70, 1130);
    }

    if (data.description) {
        ctx.font = "bold 60px Open Sans"

        var words = data.description;
        var line = "";
        var x = 70;
        var y = 1365;
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
    }

    if (data.image) {
        if (!data.image.startsWith("http://") && !data.image.startsWith("https://")) return;
        
        const arraybuffer = await fetch(data.image).then(res => res.arrayBuffer());
        const abImg = await loadImage(abtob(arraybuffer));
        abImg.onerror = () => { return EphemeralReply(d, { content: "Esta no es una URL válida, tienes que usar una URL de una imagen. Resolución recomendada: 1360 x 735" }); }

        ctx.drawImage(abImg, 34, 259, 1360, 735)
    }

    if (data.hp) {
        ctx.font = "110px Bobby Jones Soft";
        ctx.fillStyle = "#eb7264";

        ctx.fillText(data.hp, 325, 1780)
    }

    if (data.atk) {
        ctx.font = "110px Bobby Jones Soft";
        ctx.fillStyle = "#fec44c";

        ctx.fillText(data.atk, 980, 1780)
    }

    EditReplyFile({ token: data.token }, canvas.toBuffer(), cardId.substring(4, cardId.length)+".png", {
        embeds: [{
            color: 0x808080,
            title: "Creador de Cartas",
            image: { url: "attachment://"+cardId.substring(4, cardId.length)+".png" }
        }],
        components: [{
            type: 1,
            components: [{
                type: 2,
                style: 1,
                custom_id: "card_nam_"+cardId.substring(4, cardId.length),
                label: "Nombre"
            }, {
                type: 2,
                style: 1,
                custom_id: "card_hab_"+cardId.substring(4, cardId.length),
                label: "Habilidad"
            }, {
                type: 2,
                style: 1,
                custom_id: "card_des_"+cardId.substring(4, cardId.length),
                label: "Descripción"
            }, {
                type: 2,
                style: 1,
                custom_id: "card_spc_"+cardId.substring(4, cardId.length),
                label: "Especial"
            }, {
                type: 2,
                style: 1,
                custom_id: "card_typ_"+cardId.substring(4, cardId.length),
                label: "Tipo"
            }]
        }, {
            type: 1,
            components: [{
                type: 2,
                style: 2,
                custom_id: "card_hlp_"+cardId.substring(4, cardId.length),
                label: "Vida"
            }, {
                type: 2,
                style: 2,
                custom_id: "card_atk_"+cardId.substring(4, cardId.length),
                label: "Ataque"
            }, {
                type: 2,
                style: 2,
                custom_id: "card_img_"+cardId.substring(4, cardId.length),
                label: "Foto"
            }, {
                type: 2,
                style: 2,
                custom_id: "card_clr_"+cardId.substring(4, cardId.length),
                label: "Color"
            }, {
                type: 2,
                style: 2,
                custom_id: "card_txt_"+cardId.substring(4, cardId.length),
                label: "Texto"
            }]
        }, {
            type: 1,
            components: [{
                type: 2,
                style: 3,
                custom_id: "card_end_"+cardId.substring(4, cardId.length),
                label: "Crear"
            }, {
                type: 2,
                style: 4,
                custom_id: "card_ccl_"+cardId.substring(4, cardId.length),
                label: "Cancelar"
            }]
        }]
    })
}

async function generateImageBuffer(d, data, cardId) {
    const canvas = createCanvas(1428, 2000);
    const ctx = canvas.getContext("2d");

    var icon = null, specialIcon = null;

    if (data.special.enabled) {
        if (data.special.back) var specialBack = await loadImage(path.resolve(`./assets/static/cards/special/back/${data.special.back}.png`));
        if (data.special.decoration) var specialDecoration = await loadImage(path.resolve(`./assets/static/cards/special/decoration/${data.special.decoration}.png`));
        if (data.special.overlay) var specialOverlay = await loadImage(path.resolve(`./assets/static/cards/special/overlay/${data.special.overlay}.png`));

        if (data.icon) specialIcon = await loadImage(path.resolve(`./assets/static/cards/type/${data.icon}.png`));
    } else {
        var back = await loadImage(path.resolve(`./assets/static/cards/back/${data.back}.png`))
        var overlay = await loadImage(path.resolve("./assets/static/cards/overlay.png"));

        if (data.icon) icon = await loadImage(path.resolve(`./assets/static/cards/type/${data.icon}.png`))
        
        await delay(500);
    }
    
    registerFont(path.resolve("./assets/countrydex/fonts/ArsenicaTrial-Extrabold.ttf"), { family: "Arsenica Trial Extrabold" })
    registerFont(path.resolve("./assets/countrydex/fonts/OpenSans.ttf"), { family: "Open Sans" })
    registerFont(path.resolve("./assets/countrydex/fonts/BobbyJonesSoftRegular400.otf"), { family: "Bobby Jones Soft Regular" })

    // Load images

    if (data.special.enabled) {
        if (data.special.back) ctx.drawImage(specialBack, 0, 0, 1428, 2000)
        if (data.special.decoration) ctx.drawImage(specialDecoration, 0, 0, 1428, 2000)
        if (data.special.overlay) ctx.drawImage(specialOverlay, 0, 0, 1428, 2000)
        if (icon) ctx.drawImage(specialIcon, 0, 0, 1428, 2000)
    } else {
        ctx.drawImage(back, 0, 0, 1428, 2000)
        ctx.drawImage(overlay, 0, 0, 1428, 2000)
        if (icon) ctx.drawImage(icon, 0, 0, 1428, 2000)
    }

    if (data.fillStyle == "white") {
        ctx.fillStyle = "#fff"
        await loadImage(path.resolve(`./assets/static/cards/watermark/white.png`)).then(img => ctx.drawImage(img, 0, 0, 1428, 2000));
    } else if (data.fillStyle == "black") {
        ctx.fillStyle = "#000"
        await loadImage(path.resolve(`./assets/static/cards/watermark/black.png`)).then(img => ctx.drawImage(img, 0, 0, 1428, 2000));
    }

    if (data.name) {
        ctx.font = "165px Arsenica Trial Extrabold"

        ctx.fillText(data.name, 40, 195)
    }

    if (data.hability) {
        ctx.font = "95px Bobby Jones Soft Regular"

        ctx.fillText("Habilidad: "+data.hability, 70, 1130);
    }

    if (data.description) {
        ctx.font = "bold 60px Open Sans"

        var words = data.description;
        var line = "";
        var x = 70;
        var y = 1365;
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
    }

    if (data.image) {
        if (!data.image.startsWith("http://") && !data.image.startsWith("https://")) return;
        
        const arraybuffer = await fetch(data.image).then(res => res.arrayBuffer());
        const abImg = await loadImage(abtob(arraybuffer));
        abImg.onerror = () => { return EphemeralReply(d, { content: "Esta no es una URL válida, tienes que usar una URL de una imagen. Resolución recomendada: 1360 x 735" }); }

        ctx.drawImage(abImg, 34, 259, 1360, 735)
    }

    if (data.hp) {
        ctx.font = "110px Bobby Jones Soft";
        ctx.fillStyle = "#eb7264";

        ctx.fillText(data.hp, 325, 1780)
    }

    if (data.atk) {
        ctx.font = "110px Bobby Jones Soft";
        ctx.fillStyle = "#fec44c";

        ctx.fillText(data.atk, 980, 1780)
    }

    return await canvas.toBuffer();

}
