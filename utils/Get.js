import { APIRequest } from "./APIRequest.js"
import { permissions } from "discord-bitfield-calculator";

export async function GetChannel(channelId) {
	const req = await APIRequest(`/channels/${channelId}`, { method: "GET" }).then(res => res.json());
	return req;
}

export async function GetMember(guildId, userId) {
    const req = await APIRequest(`/guilds/${guildId}/members/${userId}`, { method: "GET" }).then(res => res.json());
    return req;
}

export async function GetPermissions(userId, guildId)  {
    const member = await GetMember(guildId, userId);

    if (!member.roles || member.roles.length === 0) return new Array();

    const guildRoles = new Map();
	const permissionBits = new Array();

	const rolesGet = await APIRequest(`/guilds/${guildId}/roles`, { method: "GET" });
    const roles = JSON.parse(await rolesGet.text())
	roles.forEach(role => guildRoles.set(role.id, role.permissions));

	member.roles.forEach(role => {
		if (guildRoles.has(role)) {
			const resolvedBits = permissions(guildRoles.get(role));
			
			for (var i = 0; i < resolvedBits.length; i++) {
				permissionBits.push(resolvedBits[i]);
			}
		} else return;
	});
	return (permissionBits);
}

export async function HasPermission(permission, memberId, guildId) {
	if (typeof permission !== "string") throw new Error("Permission has to be a resolved string");
	const perms = await GetPermissions(memberId, guildId);

	if (perms.includes(permission) || perms.includes("ADMINISTRATOR")) return true
	else return false
}

export function HasPermissionByBits(permission, bits) {
	const perms = permissions(bits);

	if (perms.includes(permission) || perms.includes("ADMINISTRATOR")) return true
	else return false
}