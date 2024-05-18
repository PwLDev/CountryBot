import { IntReply } from "../utils/Interactions.js";
import { Reply, Send } from "../utils/Message.js"

//const letters = [":regional_indicator_a:", ":regional_indicator_b:", ":regional_indicator_c:", ":regional_indicator_d:", ":regional_indicator_e:", ":regional_indicator_f:", ":regional_indicator_g:", ":regional_indicator_h:", ":regional_indicator_i:", ":regional_indicator_j:", ":regional_indicator_k:", ":regional_indicator_l:", ":regional_indicator_m:", ":regional_indicator_n:", ":regional_indicator_o:", ":regional_indicator_p:", ":regional_indicator_q:", ":regional_indicator_r:", ":regional_indicator_s:", ":regional_indicator_t:", ":regional_indicator_u:", ":regional_indicator_v:", ":regional_indicator_w:", ":regional_indicator_x:", ":regional_indicator_y:", ":regional_indicator_z:"];
//const numbers = [":zero:", ":one:", ":two:", ":three:", ":four:", ":five:", ":six:", ":seven:", ":eight:", ":nine:"];
//const symbols = [":exclamation:", ":hash:", ":asterisk:", ":heavy_plus_sign:"]

const specialChars = {
    "0": ":zero:",
    "1": ":one:",
    "2": ":two:",
    "3": ":three:",
    "4": ":four:",
    "5": ":five:",
    "6": ":six:",
    "7": ":seven:",
    "8": ":eight:",
    "9": ":nine:",
    "#": ":hash:",
    "*": ":asterisk:",
    "?": ":grey_question:",
    "!": ":grey_exclamation:",
    " ": "  ",
}

export default {
    name: "emojify",
    category: "fun",
    description: "Convierte un texto dado en caracteres de Emoji.",
    args: true,
    usage: "<texto>",
    data: {
        type: 1,
        name: "emojify",
        description: "Convierte un texto dado en caracteres de Emoji.",
        options: [{
            type: 3,
            name: "text",
            description: "Texto a convertir",
            required: true
        }]
    },
    run: (ws, message, args) => {
        // console.log(args.slice(0).join(" ").toLowerCase().replace("a", letters[0]).replace("b", letters[1]).replace("c", letters[2]).replace("d", letters[3]).replace("e", letters[4]).replace("f", letters[5]).replace("g", letters[6]).replace("h", letters[7]).replace("i", letters[8]).replace("j", letters[9]).replace("k", letters[10]).replace("l", letters[11]).replace("m", letters[12]).replace("n", letters[13]).replace("o", letters[14]).replace("p", letters[15]).replace("q", letters[16]).replace("r", letters[17]).replace("s", letters[18]).replace("t", letters[19]).replace("u", letters[20]).replace("v", letters[21]).replace("w", letters[22]).replace("x", letters[23]).replace("y", letters[24]).replace("z", letters[25]).replace("0", numbers[0]).replace("1", numbers[1]).replace("2", numbers[2]).replace("3", numbers[3]).replace("4", numbers[4]).replace("5", numbers[5]).replace("6", numbers[6]).replace("7", numbers[7]).replace("8", numbers[8]).replace("9", numbers[9]).replace("!", symbols[0]).replace("#", symbols[1]).replace("*", symbols[2]).replace("+", symbols[3]))
        if (args.length == 0) return Reply(message, { content: ":exclamation: Tienes que dar un texto para convertir a emojis" });
        // const emojiContent = args.slice(0).join(" ").toLowerCase().split("").replace("a", letters[0]).replace("b", letters[1]).replace("c", letters[2]).replace("d", letters[3]).replace("e", letters[4]).replace("f", letters[5]).replace("g", letters[6]).replace("h", letters[7]).replace("i", letters[8]).replace("j", letters[9]).replace("k", letters[10]).replace("l", letters[11]).replace("m", letters[12]).replace("n", letters[13]).replace("o", letters[14]).replace("p", letters[15]).replace("q", letters[16]).replace("r", letters[17]).replace("s", letters[18]).replace("t", letters[19]).replace("u", letters[20]).replace("v", letters[21]).replace("w", letters[22]).replace("x", letters[23]).replace("y", letters[24]).replace("z", letters[25]).replace("0", numbers[0]).replace("1", numbers[1]).replace("2", numbers[2]).replace("3", numbers[3]).replace("4", numbers[4]).replace("5", numbers[5]).replace("6", numbers[6]).replace("7", numbers[7]).replace("8", numbers[8]).replace("9", numbers[9]).replace("!", symbols[0]).replace("#", symbols[1]).replace("*", symbols[2]).replace("+", symbols[3])

        const text = args.join(" ").toLowerCase().split("").map(letter => {
            if (/[a-z]/g.test(letter)) return `:regional_indicator_${letter}:`
            else if (specialChars[letter]) return specialChars[letter]
        }).join(" ")

        Send(message, { content: text })
    },
    runSlash: (ws, interaction) => {
        // const emojiContent = interaction.data.options[0].value.toLowerCase().replace("a", letters[0]).replace("b", letters[1]).replace("c", letters[2]).replace("d", letters[3]).replace("e", letters[4]).replace("f", letters[5]).replace("g", letters[6]).replace("h", letters[7]).replace("i", letters[8]).replace("j", letters[9]).replace("k", letters[10]).replace("l", letters[11]).replace("m", letters[12]).replace("n", letters[13]).replace("o", letters[14]).replace("p", letters[15]).replace("q", letters[16]).replace("r", letters[17]).replace("s", letters[18]).replace("t", letters[19]).replace("u", letters[20]).replace("v", letters[21]).replace("w", letters[22]).replace("x", letters[23]).replace("y", letters[24]).replace("z", letters[25]).replace("0", numbers[0]).replace("1", numbers[1]).replace("2", numbers[2]).replace("3", numbers[3]).replace("4", numbers[4]).replace("5", numbers[5]).replace("6", numbers[6]).replace("7", numbers[7]).replace("8", numbers[8]).replace("9", numbers[9]).replace("!", symbols[0]).replace("#", symbols[1]).replace("*", symbols[2]).replace("+", symbols[3])

        const text = interaction.data.options[0].value.toLowerCase().split("").map(letter => {
            if (/[a-z]/g.test(letter)) return `:regional_indicator_${letter}:`
            else if (specialChars[letter]) return specialChars[letter]
        }).join("")

        IntReply(interaction, { content: text })
    }
}    