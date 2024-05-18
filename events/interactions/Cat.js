import { EphemeralReply, IntReply } from "../../utils/Interactions.js";

import axios from "axios";


export function CatAPI(d) {
    const catId = d.data.custom_id.substring(7, d.data.custom_id.length);
                
    (async () => {
        const request = await axios.get("https://api.thecatapi.com/v1/images/"+catId)
        .catch(async error => {
            console.error("Error while request to TheCatAPI", error);
            IntReply(d, { content: "Lo siento, tenemos problemas con el servicio 😿.\nVuelve a intentarlo en un minuto..." })
            return
        })
        .then(res => res.data);
    
        if (!request.breeds) return EphemeralReply(d, { content: "Este gato no contiene más información 🙀", ephemeral: true })
    
        return IntReply(d, { embeds: [{
            color: 0xE50000,
            title: request.breeds[0].name,
            description: `**Raza:** ${request.breeds[0].name}\n**Origen:** ${request.breeds[0].origin} :flag_${request.breeds[0].country_code.toLowerCase()}:\n**Peso:** ${request.breeds[0].weight.metric} kgs\n**Temperamento:** ${request.breeds[0].temperament}\n**Esperanza de vida:** ${request.breeds[0].life_span} años\n\n[Descubre más sobre esta raza](${request.breeds[0].wikipedia_url})`,
            image: { url: request.url },
            footer: { text: `Potenciado por TheCatAPI` }
        }] })
    })();
}