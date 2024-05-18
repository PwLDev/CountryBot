import path from "node:path";
import { SpawnRandomCountryball } from "../../utils/Countrydex.js";
import { count } from "node:console";

const intervalMap = new Map();

export { intervalMap };
import { triggers, countrydexConfig } from "../Ready.js";
import { Store } from "data-store";

var configData = new Store({ path: path.resolve("./config.json") });

export default {
    name: "GUILD_CREATE",
    run: (ws, d) => {
        ws.guildCount++;
	    console.info(d.name, d.id);
        
        if (!configData.has(d.id)) configData.set(d.id, {})

        if (countrydexConfig.has(d.id)) triggers.set(d.id, false)
        if (countrydexConfig.has(d.id)) {
            var i = setInterval(() => {
                triggers.set(d.id, true);
                countrydexConfig.save();
                countrydexConfig.load()
            }, 30 * 60000)


            intervalMap.set(intervalMap, i)
        }
    }
}