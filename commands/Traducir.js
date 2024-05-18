import translate from "@saipulanuar/google-translate-api";
import { Reply } from "../utils/Message.js";
import { IntReply } from "../utils/Interactions.js";

const translateChoices = [
    {
        name: "✨ Detectar automáticamente",
        value: "auto"
    },
    {
        name: "Inglés",
        value: "en"
    },
    {
        name: "Chino Mandarín",
        value: "zh-CN"
    },
    {
        name: "Hindi",
        value: "hi"
    },
    {
        name: "Español",
        value: "es"
    },
    {
        name: "Francés",
        value: "fr"
    },
    {
        name: "Árabe",
        value: "ar"
    },
    {
        name: "Bengalí",
        value: "bn"
    },
    {
        name: "Ruso",
        value: "ru"
    },
    {
        name: "Portugués",
        value: "pt"
    },
    {
        name: "Indonesio",
        value: "id"
    },
    {
        name: "Alemán",
        value: "de"
    },
    {
        name: "Japonés",
        value: "jp"
    },
    {
        name: "Coreano",
        value: "ko"
    },
    {
        name: "Turco",
        value: "tr"
    },
    {
        name: "Griego",
        value: "el"
    },
    {
        name: "Neerlandés",
        value: "nl"
    },
    {
        name: "Ucraniano",
        value: "uk"
    },
    {
        name: "Italiano",
        value: "it"
    }
];

const resChoices = [
    {
        name: "Inglés",
        value: "en"
    },
    {
        name: "Chino Mandarín",
        value: "zh-CN"
    },
    {
        name: "Hindi",
        value: "hi"
    },
    {
        name: "Español",
        value: "es"
    },
    {
        name: "Francés",
        value: "fr"
    },
    {
        name: "Árabe",
        value: "ar"
    },
    {
        name: "Bengalí",
        value: "bn"
    },
    {
        name: "Ruso",
        value: "ru"
    },
    {
        name: "Portugués",
        value: "pt"
    },
    {
        name: "Indonesio",
        value: "id"
    },
    {
        name: "Alemán",
        value: "de"
    },
    {
        name: "Japonés",
        value: "jp"
    },
    {
        name: "Coreano",
        value: "ko"
    },
    {
        name: "Turco",
        value: "tr"
    },
    {
        name: "Griego",
        value: "el"
    },
    {
        name: "Neerlandés",
        value: "nl"
    },
    {
        name: "Ucraniano",
        value: "uk"
    },
    {
        name: "Italiano",
        value: "it"
    }
];


export default {
    name: "translate",
    aliases: ["traducir"],
    category: "utility",
    description: "Traduce texto con Google Translate",
    args: true,
    usage: "<texto> <idioma de origen> <idioma a traducir>",
    onlySlash: true,
    data: {
        type: 1,
        name: "translate",
        description: "Traduce texto con ayuda de Google Translate.",
        options: [{
            type: 3,
            name: "texto",
            description: "Texto a traducir",
            required: true
        },
        {
            type: 3,
            name: "origen",
            description: "El idioma en el que está escrito el texto.",
            choices: translateChoices,
            required: true
        }, {
            type: 3,
            name: "resultado",
            description: "El idioma en el que se traducirá.",
            choices: resChoices,
            required: true
        }]
    },
    run: (ws, message, args) => {
        if (args.length == 0) return Reply(message, { content: ":x: No diste ningún argumento para traducir.\nEjemplo: `c!translate es en texto a traducir `\nUsa `/help translate` para ver los idiomas con sus respectivos códigos." })

        console.log(args)
        const text = args.slice(2).join(" ")
        const origin = args[0];
        const target = args[1];

        if (!origin || !target) return Reply(message, { content: ":x: No diste los argumentos correctos.\nEjemplo: `c!translate es en texto a traducir `\nUsa `/help translate` para ver los idiomas con sus respectivos códigos." });
        if (!text) return Reply(message, { content: ":x: No diste el texto para traducir.\nEjemplo: `c!translate es en texto a traducir `\nUsa `/help translate` para ver los idiomas con sus respectivos códigos." })

        translate(text, { from: origin, to: target }).then(translation => {
            return Reply(message, {
                embeds: [{
                    color: 0x2b7fdf,
                    author: { name: "Google Translate", icon_url: "https://upload.wikimedia.org/wikipedia/commons/d/db/Google_Translate_Icon.png" },
                    title: "Traducción",
                    description: `${origin} → ${target}`,
                    fields: [{
                        name: "**Texto original**",
                        value: text
                    }, {
                        name: "**Traducción**",
                        value: translation.text
                    }],
                    footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) }
                }]
            })
        }).catch(err => {
            console.warn(err);
            return Reply(message, { content: "Lo siento, falló la traducción del texto.\nPuede ser que sea un error del servidor, o usaste mal el comando.\nEjemplo: `c!translate es en texto a traducir `\nUsa `/help translate` para ver los idiomas con sus respectivos códigos." });
        })
    },
    runSlash: (ws, interaction) => {
        // if (args.length == 0) return Reply(message, { content: ":x: No diste ningún argumento para traducir.\nEjemplo: `c!translate es en texto a traducir`" })

        const origin = interaction.data.options[1].value;
        const target = interaction.data.options[2].value;
        const text = interaction.data.options[0].value;

        translate(text, { from: origin, to: target }).then(translation => {
            return IntReply(interaction, {
                embeds: [{
                    color: 0x2b7fdf,
                    author: { name: "Google Translate", icon_url: "https://upload.wikimedia.org/wikipedia/commons/d/db/Google_Translate_Icon.png" },
                    title: "Traducción",
                    description: `${origin} → ${target}`,
                    fields: [{
                        name: "**Texto original**",
                        value: text
                    },
                    {
                        name: "**Traducción**",
                        value: translation.text
                    }],
                    footer: { text: `Solicitado por ${interaction.member.user.username}`, icon_url: ws.getAvatarURL(interaction.member.user) }
                }]
            })
        })
        .catch(err => {
            console.warn(err)
            return IntReply(interaction, { content: "Lo siento, falló la traducción del texto.\nPuede ser que sea un error del servidor, vuelve a intentarlo más tarde" });
        });
    }
}