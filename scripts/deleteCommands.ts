import { REST, Routes } from "discord.js";

const { DISCORD_BOT_TOKEN, GUILD_ID, CLIENT_ID } = process.env;

const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);

try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] });
} catch (error) {
    console.error(`Failed to register commands: ${error}`);
}

console.log('Finished refreshing application (/) commands');

