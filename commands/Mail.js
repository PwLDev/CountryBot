import { generate } from "@pwldev/discord-snowflake";
import { APIRequest } from "../utils/APIRequest.js";
import { GetMember } from "../utils/Get.js";

var recipientId;

export default {
    name: "mail",
    category: "utility",
    description: "Envía un correo a alguien.",
    args: true,
    usage: "<destinatario>",
    onlySlash: true,
    data: {
        type: 1,
        name: "mail",
        description: "Envía un correo a alguien.",
        options: [{
            type: 6,
            name: "destinatario",
            description: "Usuario para enviar el correo.",
            required: true
        }]
    },
    runSlash: async (ws, interaction) => {
        const sendId = interaction.data.options[0].value;
        const mailId = generate(Math.floor(Date.now())).toString();

        const userData = await GetMember(interaction.guild_id, sendId)

        recipientId = {
            id: sendId,
            username: userData.user.username
        }

        return APIRequest(`/interactions/${interaction.id}/${interaction.token}/callback`, {
            method: "POST",
            body: {
                type: 9,
                data: {
                    title: `Enviar correo a ${userData.user.username}`,
                    custom_id: `sendmail_${mailId}`,
                    components: [{
                        type: 1,
                        components: [{
                            type: 4,
                            custom_id: `subject_${mailId}`,
                            label: "Asunto",
                            style: 1,
                            required: true
                        }]
                    }, {
                        type: 1,
                        components: [{
                            type: 4,
                            custom_id: `message_${mailId}`,
                            label: "Mensaje",
                            style: 2,
                            required: true
                        }]
                    }]
                }
            }
        })
    }
}

export { recipientId }