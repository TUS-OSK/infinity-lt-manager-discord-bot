import type { Client } from "discord.js";

export const clientReadyHandler = async (client: Client) => {
    console.log('clientReadyHandler start');
    console.log(`Logged in as ${client.user?.tag ?? 'unknown user'} at ${new Date().toISOString()}`);
    console.log('clientReadyHandler end');
};
