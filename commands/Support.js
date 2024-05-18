import { Reply } from "../utils/Message.js";
import { EphemeralReply } from "../utils/Interactions.js";

export default {
    name: "support",
    category: "info",
    description: "Envía el servidor de soporte de CountryBot",
    args: false,
    onlySlash: true,
    data: {
        type: 1,
        name: "support",
        description: "Envía el servidor de Soporte de CountryBot."
    },
    runSlash: (ws, interaction) => {
        EphemeralReply(interaction, { content: "**__Soporte de CountryBot__**\n\n¿Deseas reportar un bug? ¿Tienes dudas sobre CountryBot?\nÚnete a nuestro servidor oficial de CountryBot.\n\nhttps://discord.gg/Z4Wb62C7Ud" })
    }
}