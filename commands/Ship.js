import { DeferReply, EditReplyFile } from "../utils/Interactions.js";
import { GetMember } from "../utils/Get.js"
import fetch from "node-fetch";
import { createCanvas, loadImage, registerFont } from "canvas";
import arrayBufferToBuffer from "arraybuffer-to-buffer";
import path from "node:path";
import { generate } from "@pwldev/discord-snowflake";

export default {
    name: "ship",
    category: "fun",
    description: "Descubre cual es la compatibilidad amorosa entre 2 miembros",
    args: true,
    usage: "<usuario>",
    onlySlash: true,
    data: {
        type: 1,
        name: "ship",
        description: "Descubre cual es la compatibilidad amorosa entre 2 miembros.",
        options: [{
            type: 6,
            name: "miembro_1",
            description: "Primer Miembro",
            required: true
        }, {
            type: 6,
            name: "miembro_2",
            description: "Segundo Miembro",
            required: true
        }]
    },
    runSlash: async (ws, interaction) => {
        DeferReply(interaction);

        const member1id = interaction.data.options[0].value;
        const member2id = interaction.data.options[1].value;

        const member1 = await GetMember(interaction.guild_id, member1id)        
        const member2 = await GetMember(interaction.guild_id, member2id) 

        const member1Img = await fetch(ws.getAvatarURL(member1.user)).then(res => res.arrayBuffer());
        const member2Img = await fetch(ws.getAvatarURL(member2.user)).then(res => res.arrayBuffer());

        const nameCut1 = Math.floor(Math.random() * (6 - 2) + 2)
        const nameCut2 = Math.floor(Math.random() * (6 - 2) + 2)

        const backPic = Math.round(Math.random())

        const shipPercentage = Math.floor(Math.random() * (100 - 0) + 0)

        const shipNameString = member1.user.username.substring(0, nameCut1) + member2.user.username.substring((member2.user.username.length - 1) - nameCut2, member2.user.username.length).toLowerCase();
        const shipName = shipNameString.charAt(0).toUpperCase() + shipNameString.slice(1).toLowerCase()


        const circleTemplate = {
            x: 297,
            y: 310,
            radius: 132
        }

        const canvas = createCanvas(1550, 650);
        const ctx = canvas.getContext("2d");

        await loadImage(path.resolve(`./assets/static/ship/${backPic}.png`)).then(image => ctx.drawImage(image, 0, 0, 1550, 650));

        registerFont(path.resolve("./assets/countrydex/fonts/BobbyJonesSoftRegular400.otf"), { family: "Bobby Jones Soft Regular" })

        ctx.font = "100px Bobby Jones Soft";
        ctx.fillStyle = "#ffffff"

        ctx.fillText(`${shipPercentage}%`, 750, 200);

        ctx.beginPath();
        ctx.arc(1240, circleTemplate.y, 199, 0, Math.PI * 2, true);
        ctx.arc(circleTemplate.x, circleTemplate.y, 199, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.closePath();

        const member1image = await loadImage(arrayBufferToBuffer(member1Img))
        const member2image = await loadImage(arrayBufferToBuffer(member2Img))

        const aspect = 415 / 415;
        const hsx = 198 * Math.max(1.0 / aspect, 1.0);
        const hsy = 198 * Math.max(aspect, 1.0);
        ctx.drawImage(member1image, circleTemplate.x - hsx, circleTemplate.y - hsy, hsx * 2, hsy * 2);
        ctx.drawImage(member2image, 1250 - hsx, circleTemplate.y - hsy, hsx * 2, hsy * 2);

        const canvasBuffer = canvas.toBuffer();
        const shipId = generate(Date.now())

        return EditReplyFile(interaction, canvasBuffer, `ship_${shipId}.png`, {
            embeds: [{
                color: 0x2b7fdf,
                author: { name: "CountryBot", icon_url: ws.avatarURL },
                title: "Ship: " + shipName,
                image: { url: `attachment://ship_${shipId}.png` }
            }]
        })
    }
}