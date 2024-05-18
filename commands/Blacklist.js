import { Reply } from "../utils/Message.js";
import { Store } from "data-store";
import path from "node:path";

import { guildBlacklistModel } from "../models/GuildBlacklist.js";
import { userBlacklistModel } from "../models/UserBlacklist.js";

export default {
    name: "blacklist",
    ownerOnly: true,
    run: async (ws, message, args) => {
        if (
            args.length == 0
        ) return;

        if (
            !args[0] == "guild" &&
            !args[0] == "user"
        ) return;

        if (args[0] == "guild") {
            if (!args[1]) return Reply(message, { content: "`c!blacklist guild <id de servidor>`" });
            if (!ws.guildCache.includes(args[1])) return Reply(message, { content: "No se encontró este servidor, puede que el bot no esté ahi." });

            if (await guildBlacklistModel.findOne({ _id: args[1] })) {
                await guildBlacklistModel.deleteOne({ _id: args[1] })
                return Reply(message, { content: "Se eliminó `" + args[1] + "` de la Blacklist" });
            } else {
                new guildBlacklistModel({ _id: args[1] }).save();
                return Reply(message, { content: "Se añadio `" + args[1] + "` a la Blacklist" });
            }
        }

        if (args[0] == "user") {
            if (!args[1]) return Reply(message, { content: "`c!blacklist user <id usuario o mencion>`" });

            if (await userBlacklistModel.findOne({ _id: args[1].replace("<@", "").replace(">", "") })) {
                await userBlacklistModel.deleteOne({ _id: args[1].replace("<@", "").replace(">", "") })
                return Reply(message, { content: "Se eliminó `" + args[1] + "` de la Blacklist" });
            } else {
                new userBlacklistModel({ _id: args[1].replace("<@", "").replace(">", "") }).save();
                return Reply(message, { content: "Se añadio `" + args[1] + "` a la Blacklist" });
            }
        }

        if (args[0] == "list") {
            var renderedUsers = "\n", renderedGuild = "\n";
            const allUsers = await userBlacklistModel.find({});
            const allGuilds = await guildBlacklistModel.find({});

            allUsers.forEach(data => {
                renderedUsers += `- ${data._id}\n`
            })

            allGuilds.forEach(data => {
                renderedGuild += `- ${data._id}\n`
            })

            return Reply(message, {
                content: `\`\`\`\n===============================\n     Blacklist CountryBot      \n===============================\n\nUsuarios\n===============================\n${renderedUsers}\n\nServidores\n===============================\n${renderedGuild}\`\`\``
            })
        }
    }
}