import { set } from "mongoose";
import { giveawayMap } from "../../commands/Giveaway.js";
import { Send } from "../../utils/Message.js";
import { APIRequest } from "../../utils/APIRequest.js";
import { EphemeralReply, IntReply } from "../../utils/Interactions.js";
import { giveawayPointsMap } from "../MessageCreate.js";

const flags = [
    {
        emoji: ":flag_af:",
        display_name: "Afganistán",
        catch_names: ["afghanistan", "afganistan"]
    }, {
        emoji: ":flag_ax:",
        display_name: "Åland",
        catch_names: ["aland"]
    }, {
        emoji: ":flag_al:",
        display_name: "Albania",
        catch_names: ["albania"]
    }, {
        emoji: ":flag_dz:",
        display_name: "Argelia",
        catch_names: ["algeria", "argelia"]
    }, {
        emoji: ":flag_as:",
        display_name: "Samoa Americana",
        catch_names: ["samoaamericana"]
    }, {
        emoji: ":flag_ao:",
        display_name: "Angola",
        catch_names: ["angola"]
    }, {
        emoji: ":flag_ai:",
        display_name: "Anguila",
        catch_names: ["anguilla", "anguila"]
    }, {
        emoji: ":flag_aq:",
        display_name: "Antártida",
        catch_names: ["antartica", "antartida"]
    }, {
        emoji: ":flag_ag:",
        display_name: "Antigua y Barbuda",
        catch_names: ["antiguaybarbuda", "antiguaandbarbuda"]
    }, {
        emoji: ":flag_ar:",
        display_name: "Argentina",
        catch_names: ["argentina"]
    }, {
        emoji: ":flag_am:",
        display_name: "Armenia",
        catch_names: ["armenia"]
    }, {
        emoji: ":flag_aw:",
        display_name: "Aruba",
        catch_names: ["aruba"]
    }, {
        emoji: ":flag_au:",
        display_name: "Australia",
        catch_names: ["australia"]
    }, {
        emoji: ":flag_at:",
        display_name: "Austria",
        catch_names: ["austria"]
    }, {
        emoji: ":flag_az:",
        display_name: "Azerbaiyán",
        catch_names: ["azerbaiyan", "azerbaijan"]
    }, {
        emoji: ":flag_bs:",
        display_name: "Bahamas",
        catch_names: ["bahamas"]
    }, {
        emoji: ":flag_bh:",
        display_name: "Baréin",
        catch_names: ["barein", "bahrain"]
    }, {
        emoji: ":flag_bd:",
        display_name: "Bangladés",
        catch_names: ["banglades", "bangladesh"]
    }, {
        emoji: ":flag_bb:",
        display_name: "Barbados",
        catch_names: ["barbados"]
    }, {
        emoji: ":flag_by:",
        display_name: "Bielorrusia",
        catch_names: ["bielorrusia", "belarus"]
    }, {
        emoji: ":flag_be:",
        display_name: "Bélgica",
        catch_names: ["belgica", "belgium"]
    }, {
        emoji: ":flag_bz:",
        display_name: "Belice",
        catch_names: ["belice", "belize"]
    }, {
        emoji: ":flag_bj:",
        display_name: "Benin",
        catch_names: ["benin"]
    }, {
        emoji: ":flag_bm:",
        display_name: "Bermuda",
        catch_names: ["bermuda"]
    }, {
        emoji: ":flag_bt:",
        display_name: "Bután",
        catch_names: ["butan", "bhutan"]
    }, {
        emoji: ":flag_bo:",
        display_name: "Bolivia",
        catch_names: ["bolivia"]
    }, {
        emoji: ":flag_ba:",
        display_name: "Bosnia y Herzegovina",
        catch_names: ["bosniayherzegovina", "bosniaandherzegovina", "bosnia"]
    }, {
        emoji: ":flag_bw:",
        display_name: "Botsuana",
        catch_names: ["botsuana", "botswana"]
    }, {
        emoji: ":flag_br:",
        display_name: "Brasil",
        catch_names: ["brasil", "brazil"]
    }, {
        emoji: ":flag_io:",
        display_name: "Océano Indio",
        catch_names: ["oceanoindio", "indiaocean"]
    }, {
        emoji: ":flag_vg:",
        display_name: "Islas Vírgenes",
        catch_names: ["islasvirgenes", "virginislands"]
    }, {
        emoji: ":flag_bn:",
        display_name: "Brunei",
        catch_names: ["brunei"]
    }, {
        emoji: ":flag_bg:",
        display_name: "Bulgaria",
        catch_names: ["bulgaria"]
    }, {
        emoji: ":flag_bf:",
        display_name: "Burkina Faso",
        catch_names: ["burkinafaso"]
    }, {
        emoji: ":flag_bi:",
        display_name: "Burundi",
        catch_names: ["burundi"]
    }, {
        emoji: ":flag_kh:",
        display_name: "Camboya",
        catch_names: ["cambodia", "camboya"]
    }, {
        emoji: ":flag_cm:",
        display_name: "Camerún",
        catch_names: ["camerun", "cameroon"]
    }, {
        emoji: ":flag_ca:",
        display_name: "Canadá",
        catch_names: ["canada"]
    }, {
        emoji: ":flag_ic:",
        display_name: "Islas Canarias",
        catch_names: ["islascanarias", "canaryislands"]
    }, {
        emoji: ":flag_cv:",
        display_name: "Cabo Verde",
        catch_names: ["caboverde", "capeverde"]
    }, {
        emoji: ":flag_bq:",
        display_name: "Caribe Neelandés",
        catch_names: ["caribeneerlandes", "caribbeannetherlands"]
    }, {
        emoji: ":flag_ky:",
        display_name: "Islas Caimán",
        catch_names: ["caboverde", "caimanislands"]
    }, {
        emoji: ":flag_cf:",
        display_name: "República Centroafricana",
        catch_names: ["republicacentroafricana", "centralafricanrepublic", "car"]
    }, {
        emoji: ":flag_td:",
        display_name: "Chad",
        catch_names: ["chad"]
    }, {
        emoji: ":flag_cl:",
        display_name: "Chile",
        catch_names: ["chile"]
    }, {
        emoji: ":flag_cn:",
        display_name: "China",
        catch_names: ["china"]
    }, {
        emoji: ":flag_cx:",
        display_name: "Isla de Navidad",
        catch_names: ["isladenavidad", "christmasisland"]
    }, {
        emoji: ":flag_cc:",
        display_name: "Islas Cocos",
        catch_names: ["islascocos"]
    }, {
        emoji: ":flag_co:",
        display_name: "Colombia",
        catch_names: ["colombia", "geometricossammy"]
    }, {
        emoji: ":flag_co:",
        display_name: "Colombia",
        catch_names: ["colombia", "geometricossammy"]
    }, {
        emoji: ":flag_km:",
        display_name: "Comoras",
        catch_names: ["comoras", "comoros"]
    }, {
        emoji: ":flag_cg:",
        display_name: "Congo",
        catch_names: ["congo"]
    }, {
        emoji: ":flag_cd:",
        display_name: "República Democrática del Congo",
        catch_names: ["republicademocraticadelcongo", "democraticrepublicofcongo", "drcongo"]
    }, {
        emoji: ":flag_ck:",
        display_name: "Islas Cook",
        catch_names: ["islascook", "cookislands"]
    }, {
        emoji: ":flag_cr:",
        display_name: "Costa Rica",
        catch_names: ["costarica"]
    }, {
        emoji: ":flag_ci:",
        display_name: "Costa de Marfil",
        catch_names: ["costademarfil", "ivorycoast", "cotedivoire"]
    }, {
        emoji: ":flag_hr:",
        display_name: "Croacia",
        catch_names: ["croacia", "croatia"]
    }, {
        emoji: ":flag_cu:",
        display_name: "Cuba",
        catch_names: ["cuba"]
    }, {
        emoji: ":flag_cw:",
        display_name: "Curaçao",
        catch_names: ["curaçao", "curacao"]
    }, {
        emoji: ":flag_cy:",
        display_name: "Chipre",
        catch_names: ["chipre", "cyprus"]
    }, {
        emoji: ":flag_cz:",
        display_name: "República Checa",
        catch_names: ["republicacheca", "czechia", "czechrepublic"]
    }, {
        emoji: ":flag_dk:",
        display_name: "Dinamarca",
        catch_names: ["dinamarca", "denmark"]
    }, {
        emoji: ":flag_dj:",
        display_name: "Yibuti",
        catch_names: ["yibuti", "djibouti", "sami"]
    }, {
        emoji: ":flag_dm:",
        display_name: "Dominica",
        catch_names: ["dominica"]
    }, {
        emoji: ":flag_do:",
        display_name: "República Dominicana",
        catch_names: ["republicadominicana", "dominicanrepublic"]
    }, {
        emoji: ":flag_ec:",
        display_name: "Ecuador",
        catch_names: ["ecuador"]
    }, {
        emoji: ":flag_eg:",
        display_name: "Egipto",
        catch_names: ["egipto", "egypt"]
    }, {
        emoji: ":flag_sv:",
        display_name: "El Salvador",
        catch_names: ["elsalvador"]
    }, {
        emoji: ":flag_gq:",
        display_name: "Guinea Ecuatorial",
        catch_names: ["guineaecuatorial", "equatorialguinea"]
    }, {
        emoji: ":flag_er:",
        display_name: "Eritrea",
        catch_names: ["eritrea"]
    }, {
        emoji: ":flag_ee:",
        display_name: "Estonia",
        catch_names: ["estonia"]
    }, {
        emoji: ":flag_et:",
        display_name: "Etiopía",
        catch_names: ["etiopia", "ethiopia"]
    }, {
        emoji: ":flag_eu:",
        display_name: "Unión Europea",
        catch_names: ["unioneuropea", "europeanunion", "eu"]
    }, {
        emoji: ":flag_fk:",
        display_name: "Islas Malvinas",
        catch_names: ["islasmalvinas", "falklandislands"]
    }, {
        emoji: ":flag_fo:",
        display_name: "Islas Faroe",
        catch_names: ["islasfaroe", "faroeislands"]
    }, {
        emoji: ":flag_fj",
        display_name: "Islas Fiji",
        catch_names: ["islasfiji", "fijiislands"]
    }, {
        emoji: ":flag_fi:",
        display_name: "Finlandia",
        catch_names: ["finlandia", "finlandia"]
    }, {
        emoji: ":flag_fr:",
        display_name: "Francia",
        catch_names: ["francia", "france"]
    }, {
        emoji: ":flag_gf:",
        display_name: "Guyana Francesa",
        catch_names: ["guyanafrancesa", "frenchguyana"]
    }, {
        emoji: ":flag_pf:",
        display_name: "Polinesia Francesa",
        catch_names: ["polinesiafrancesa", "frenchpolynesia"]
    }, {
        emoji: ":flag_tf:",
        display_name: "Territorios Franceses del Sur",
        catch_names: ["territoriosfrancesesdelsur", "frenchsouthernterritories"]
    }, {
        emoji: ":flag_ga:",
        display_name: "Gabón",
        catch_names: ["gabon"]
    }, {
        emoji: ":flag_gn:",
        display_name: "Gambia",
        catch_names: ["gambia"]
    }, {
        emoji: ":flag_ge:",
        display_name: "Georgia",
        catch_names: ["georgia"]
    }, {
        emoji: ":flag_de:",
        display_name: "Alemania",
        catch_names: ["alemania", "germany"]
    }, {
        emoji: ":flag_gh:",
        display_name: "Ghana",
        catch_names: ["ghana"]
    }, {
        emoji: ":flag_gi:",
        display_name: "Gibraltar",
        catch_names: ["gibraltar"]
    }, {
        emoji: ":flag_gr:",
        display_name: "Grecia",
        catch_names: ["grecia", "greece"]
    }, {
        emoji: ":flag_gl:",
        display_name: "Groenlandia",
        catch_names: ["groenlandia", "greenland"]
    }, {
        emoji: ":flag_gd:",
        display_name: "Granada",
        catch_names: ["granada", "grenada"]
    }, {
        emoji: ":flag_gp:",
        display_name: "Guadalupe",
        catch_names: ["gualalupe"]
    }, {
        emoji: ":flag_gu:",
        display_name: "Guam",
        catch_names: ["guam"]
    }, {
        emoji: ":flag_gt:",
        display_name: "Guatemala",
        catch_names: ["guatemala"]
    }, {
        emoji: ":flag_gg:",
        display_name: "Guernsey",
        catch_names: ["guernsey"]
    }, {
        emoji: ":flag_gn:",
        display_name: "Guinea",
        catch_names: ["guinea"]
    }
]

export { flags }
var flagInterval;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function Giveaway(ws, d) {
    const channelId = d.data.custom_id.substring(15, d.data.custom_id.length);
    const action = d.data.custom_id.substring(9, 14);

    const data = giveawayMap.get(channelId);

    if (action == "gstop") {
        if (!data) return IntReply(d, { content: "No se está llevando a cabo ningún sorteo en este canal." });

        giveawayMap.delete(channelId);
        giveawayPointsMap.delete(channelId)
        clearInterval(flagInterval);

        return IntReply(d, { content: "🛑 Se detuvo el sorteo exitosamente." });
    }

    if (action == "start") {
        if (!data) return EphemeralReply(d, { content: "Este sorteo expiró debido a que este se canceló o un reinicio del bot. Por favor inicia otro sorteo." })
        if (data?.started) return EphemeralReply(d, { content: ":x: Ya se está llevando a cabo un sorteo en este canal." })
        if (d.member.user.id !== data.author.id) 
            return APIRequest(`/interactions/${d.id}/${d.token}/callback`, { method: "POST", body: { type: 6, data: null } });
    

        IntReply(d, { content: "# Sorteo Iniciado :tada:\nMucha suerte :D" });
        giveawayMap.set(channelId, {
            objective: data.objective,
            prize: data.prize ?? "No especificado",
            author: data.author, 
            started: true
        });

        setTimeout(() => {
            flagInterval = setInterval(flagGuess, 15000);

            async function flagGuess() {
                if (giveawayMap.get(channelId).end) {
                    clearInterval(flagInterval)
                    return giveawayMap.delete(channelId);
                }
    
                const randomFlag = flags[Math.floor(Math.random() * flags.length)]
                Send({ channel_id: channelId }, { content: randomFlag.emoji });


                var noGuess = setTimeout(() => {
                    clearInterval(flagInterval);
                    Send({ channel_id: channelId }, { content: "El país tiene el nombre de: **"+randomFlag.display_name+"**" });
                    setTimeout(() => {
                        flagGuess();
                        flagInterval = setInterval(flagGuess, 15000);
                    }, 5000);
                }, 10000)

                giveawayMap.set(channelId, {
                    objective: data.objective,
                    prize: data.prize ?? "No especificado",
                    author: data.author,
                    noGuess: noGuess,
                    randomFlag,
                    guessed: false
                });

            }

            flagGuess();
        }, 5000);

        
    }
    
}
