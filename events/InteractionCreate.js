import { EditComponentReply, EphemeralReply, EditReply, IntReply, EditReplyFile } from "../utils/Interactions.js";
import { googleSearches } from "../commands/Google.js";
import { Edit, Reply } from "../utils/Message.js";
import { APIRequest } from "../utils/APIRequest.js";
import { createRequire } from "node:module";

import path from "node:path";
import axios from "axios";

import { owns, spawns } from "./Ready.js";
import { luckyMap } from "../commands/Countrydex.js";
import { generate } from "@pwldev/discord-snowflake";
import { createCanvas, loadImage, registerFont } from "canvas";
import { Store } from "data-store";
import { GoogleInteraction } from "./interactions/Google.js";
import { mailModel } from "../models/Mail.js";
import { recipientId } from "../commands/Mail.js";
import { GetChannel } from "../utils/Get.js";

const require = createRequire(import.meta.url);
const countryballData = require("../countrydex/countryballs.json");

var blacklistData = new Store({ path: path.resolve("./blacklist.json") });

import Card from "./interactions/Card.js";
import { CatchCountryball, CountryballModal, ListCountryballs, LuckSpin, SearchCountryball, SearchCountryballIds, ShowCard } from "./interactions/Countrydex.js";
import { InboxRead, MailReply, ReadMail, ReadMailReply, ReplyMail, SendMail } from "./interactions/Mail.js";
import { CatAPI } from "./interactions/Cat.js";
import { HelpSections } from "./interactions/Help.js";
import { Giveaway } from "./interactions/Giveaway.js";

import { guildBlacklistModel } from "../models/GuildBlacklist.js";
import { userBlacklistModel } from "../models/UserBlacklist.js";


const ownerIds = ["1072942897680371713", "791522027915444254", "779464887231447073", "626928937355706373"];

export default {
    name: "INTERACTION_CREATE",
    run: async (ws, d) => {
        // if (blacklistData.has(d.guild_id)) return EphemeralReply(d, { embeds: [{
        //     color: 0x000000,
        //     author: { name: "CountryBot", icon_url: ws.avatarURL },
        //     footer: { text: `Solicitado por ${message.author.username}`, icon_url: ws.getAvatarURL(message.author) },
        //     description: ":exclamation: Este servidor se encuentra en la blacklist.\nNo se puede usar CountryBot en este servidor.",
        // }] })

        if (d.type === 3) {
            // Google Message
            if (d.data.custom_id.startsWith("intgle")) GoogleInteraction(ws, d);
            if (d.data.custom_id.startsWith("cbspawn_")) CountryballModal(d)
            if (d.data.custom_id.startsWith("luckspin_")) LuckSpin(ws, d)
            if (d.data.custom_id.startsWith("replymail_")) ReplyMail(d)
            if (d.data.custom_id.startsWith("readmail_")) ReadMail(d)
            if (d.data.custom_id.startsWith("readmailreply_")) ReadMailReply(d)
            if (d.data.custom_id.startsWith("inbox_read")) InboxRead(d)
            if (d.data.custom_id.startsWith("help_sections")) HelpSections(ws, d)
            if (d.data.custom_id.startsWith("catapi_")) CatAPI(d)
            if (d.data.custom_id.startsWith("card_")) Card(ws, d);
            if (d.data.custom_id.startsWith("list_")) ListCountryballs(ws, d);
            if (d.data.custom_id.startsWith("countrydex_list_")) ShowCard(ws, d)
            if (d.data.custom_id.startsWith("giveaway_")) Giveaway(ws, d)
        }

        if (d.type === 5) {
            if (d.data.custom_id.startsWith("cbmodal_")) CatchCountryball(d)

            if (d.data.custom_id.startsWith("mailreply_")) MailReply(d)
            if (d.data.custom_id.startsWith("sendmail_")) SendMail(d)
            if (d.data.custom_id.startsWith("card_")) Card(ws, d)
        }

        if (d.type == 4) {
            if (d.data.options[0].name == "ballid") return SearchCountryballIds(d)
            if (d.data.options[0].options[0].name == "countryball") SearchCountryball(d)
        }

        if (d.type === 2) {
            const cmd = ws.commands.get(d.data.name);
            if (!cmd) return

            if (cmd.ownerOnly) {
                if (!ownerIds.includes(d.member.user.id)) return;
            }
    
            if (d.context == 0) {
                if (cmd.name !== "blacklist" && (await guildBlacklistModel.findOne({ _id: d.member.user.id }))) return EphemeralReply(d, { embeds: [{
                    color: 0xcc0000,
                    author: { name: "CountryBot", icon_url: ws.avatarURL },
                    description: ":exclamation: No puedes utilizar este comando porque este servidor está en la Blacklist, por lo tanto no podrás utilizar CountryBot en este servidor. Contáctate con los desarrolladores para más información <:info:1113653739719495761>",
                }] })
        
                if (cmd.name !== "blacklist" && (await userBlacklistModel.findOne({ _id: d.member.user.id }))) return EphemeralReply(d, { embeds: [{
                    color: 0xcc0000,
                    author: { name: "CountryBot", icon_url: ws.avatarURL },
                    description: ":exclamation: No puedes utilizar este comando porque estás en la Blacklist, por lo tanto no podrás utilizar CountryBot. Contáctate con los desarrolladores para más información <:info:1113653739719495761>",
                }] })
            }

            try {
                cmd.runSlash(ws, d)
            } catch (error) {
                EphemeralReply(d, { embeds: [{
                    color: 0xcc0000,
                    author: { name: "CountryBot", icon_url: ws.avatarURL },
                    footer: { text: `Solicitado por ${d.user.username}`, icon_url: ws.getAvatarURL(d.user) },
                    description: ":exclamation: Hubo un error al intentar ejecutar el comando.\nSi el error persiste, contáctate con el desarrollador.",
                    image: { url: "https://cdn.discordapp.com/attachments/1091932806206201857/1148389754283499550/162_sin_titulo_20230902220804.png" }
                }] });

                console.warn(error)
            }
        }
    }
}