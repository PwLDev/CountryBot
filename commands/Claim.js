import { keyModel } from "../models/Keys.js";
import { premiumModel } from "../models/Premium.js";
import { IntReply } from "../utils/Interactions.js";

export default {
    name: "claim",
    category: "utility",
    description: "Si tienes una clave de CountryBot Premium, lo puedes canjear aquí.",
    args: true,
    usage: "<clave>",
    slashOnly: true,
    data: {
        type: 1,
        name: "claim",
        description: "Si tienes un codigo de CountryBot Premium, lo puedes canjear aquí.",
        options: [{
            type: 3,
            name: "key",
            description: "Ingresa tu clave aquí",
            required: true
        }]
    },
    runSlash: async (ws, interaction) => {
        const inputKey = interaction.data.options[0].value.replace("-", "").replace("```", "");

        const keyData = await keyModel.findOne({ key: inputKey });
        const userData = await premiumModel.findOne({ user: interaction.member.user.id });
        if (userData) return IntReply(interaction, { content: "❗ Ya tienes CountryBot Premium en tu cuenta." })
        if (!keyData) return IntReply(interaction, { content: "❗ La clave que ingresaste no es válida, asegúrate de ingresar correctamente todos los caracteres." })

        if (keyData.claimed) IntReply(interaction, { content: "❗ Lamentablemente esta clave ya fue utilizada." });
        
        IntReply(interaction, { content: `¡Felicitaciones! Ahora eres miembro de **CountryBot Premium 👑**.\nTu suscripcion termina <t:${Math.floor(keyData.end / 1000)}:R>.\n\n¡Disfruta mucho tus beneficios!` })
        await keyModel.findOneAndUpdate({ key: inputKey }, { claimed: true });

        new premiumModel({
            user: interaction.member.user.id,
            end: keyData.end
        }).save();
    }
}