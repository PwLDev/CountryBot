import dotenv from "dotenv";
import fetch from "node-fetch";
dotenv.config(); //43200000 

export async function GPTAsk(text) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        headers: {
            Authorization: `Bearer ${process.env["apiKey"]}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            temperature: 0.5,
            "messages": [
                {
                    "role": "system",
                    "content": "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Remember to only speak in Spanish. Knowledge cutoff: September 2021 Current date: " + `${new Date(Date.now).getDay()}/${new Date(Date.now).getMonth()}/${new Date(Date.now).getFullYear()}`
                },
                {       
                    "role": "user",
                    "content": text
                }
            ],
        })
    });

    if (!res.ok) console.error(JSON.stringify(await res.json()));

    return res;
}