import dotenv from "dotenv";
import FormData from "form-data";
import fetch from "node-fetch";
dotenv.config();

export async function APIRequest(endpoint, options) {
    if (options.body && typeof options.body === "object") options.body = JSON.stringify(options.body);
    const url = "https://discord.com/api/v10" + endpoint;

    const res = await fetch(url, {
        headers: {
            Authorization: `Bot ${process.env.token}`,
            "Content-Type": "application/json",
            "User-Agent": "PwLDev (https://github.com/PwLDev)" // Requerido por la API
        },
        ...options
    });

    if (!res.ok) console.error(JSON.stringify(await res.json()));

    return res;
}