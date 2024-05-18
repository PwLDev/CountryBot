import { countrydexConfig, triggers } from "./Ready.js";
import { intervalMap } from "./GuildCreate.js";
import Store from "data-store";
import path from "node:path"


export default {
    name: "GUILD_DELETE",
    run: (ws, d) => {
        ws.guildCount--;
	    //console.info(d.name, d.id);

        if (countrydexConfig.has(d.id)) triggers.del(d.id)
        if (countrydexConfig.has(d.id)) {
            const interval = intervalMap.get(d.id);
            clearInterval(interval);

            countrydexConfig.del(d.id)
            triggers.del(d.id)
        }
    }
}