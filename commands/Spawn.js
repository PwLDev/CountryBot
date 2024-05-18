import { EphemeralReply } from "../utils/Interactions.js";
import { triggers, countrydexConfig } from "../events/Ready.js";
import { SpawnSpecifiedCountryball } from "../utils/Countrydex.js";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const countryballData = require("../countrydex/countryballs.json");

const ownerIds = ["626928937355706373", "779464887231447073", "1072942897680371713", "791522027915444254"] // Valen owner! siuuuuuuuuuuuuu

export default {
    name: "spawn",
    category: "utility",
    description: "Aparece una ball especificada. (SOLO PARA ADMINS)",
    args: true,
    usage: "<id de ball> <canal> (SOLO PARA ADMINS)",
    onlySlash: true,
    data: {
        type: 1,
        name: "spawn",
        description: "Forzar a aparecer un countryball en un canal especificado",
        default_member_permissions: (1 << 3).toString(),
        dm_permission: false,
        options: [{
            type: 4,
            name: "ballid",
            description: "ID de countryball a aparecer",
            required: true,
            autocomplete: true
        }, {
            type: 7,
            name: "channel",
            description: "Aparecer en un canal específico",
            required: false
        }]
    },
    run: () => { return }, //hola pwl ola XD
    runSlash: (ws, interaction) => {
        if (!ownerIds.includes(interaction.member.user.id)) return EphemeralReply(interaction, { content: "Este comando solo es para owners." })

        const ballId = interaction.data.options[0].value;
        var channel = interaction.data.options.length == 2 ? interaction.data.options[1].value : null;

        if (ballId > countryballData.countryballs.length - 1 || ballId < 0) return EphemeralReply(interaction, { content: "Este countryball no existe, utiliza la función de Autocompletar" })
        if (!channel && !countrydexConfig.has(interaction.guild_id)) return EphemeralReply(interaction, { content: ":exclamation: **Canal no especificado**\nConfigura a Countrydex utilizando `/config countrydex enable` o especifica un canal." });

        if (!channel) channel = countrydexConfig.get(interaction.guild_id + ".channel");

        SpawnSpecifiedCountryball(channel, ballId).then(() => EphemeralReply(interaction, { content: "Countryball aparecido" }))
    }
}