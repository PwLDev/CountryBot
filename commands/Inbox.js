import { mailModel } from "../models/Mail.js"
import { IntReply } from "../utils/Interactions.js";

export default {
    name: "inbox",
    category: "utility",
    description: "Revisar tu bandeja de entrada de correos.",
    args: false,
    onlySlash: true,
    data: {
        type: 1,
        name: "inbox",
        description: "Revisar tu bandeja de entrada de correos."
    },
    run: (ws) => { return },
    runSlash: (ws, interaction) => {
        const allMails = mailModel.find({ recipient: interaction.member.user.id, read: false });
        var options = [], length = 0

        allMails.then(document => {
            if (document.length == 0) return IntReply(interaction, { embeds: [{
                color: 0x4bb543,
                description: ":white_check_mark: **No hay correos en la bandeja de entrada**",
                footer: { text: `Solicitado por ${interaction.member.user.username}`, icon_url: ws.getAvatarURL(interaction.member.user) },
            }] });

            document.forEach(mail => {
                if (options.length > 24) return;
                if (mail.read) return;
                options.push({
                    label: (mail.reply.replied ? "RESPUESTA: " : "")  + mail.subject,
                    value: mail._id,
                    description: `Enviado por ${mail.sender.username}`,
                })
            })

            IntReply(interaction, { embeds: [{
                color: 0x4bb543,
                description: `:mailbox_with_mail: **Tienes ${options.length} correos no leídos**`,
                footer: { text: `Solicitado por ${interaction.member.user.username}`, icon_url: ws.getAvatarURL(interaction.member.user) },
            }], components: [{
                type: 1,
                components: [{
                    type: 3,
                    custom_id: "inbox_read",
                    placeholder: "Bandeja de entrada",
                    options: options
                }]
            }] });
        });

        
    }
}