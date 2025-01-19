import { REST, Routes } from "discord.js";
import commands from "../src/commands";


const { DISCORD_BOT_TOKEN, GUILD_ID, CLIENT_ID } = process.env;

const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);
console.log(`Started refreshing application (/) commands: ${commands.map(cmd => cmd.data.name).join(', ')}`);
const commandData = commands.map(cmd => cmd.data);

try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commandData });
    console.log(`Commands registered: ${commandData.map(cmd => cmd.name).join(', ')}`);
} catch (error) {
    console.error(`Failed to register commands: ${error}`);
}

console.log('Finished refreshing application (/) commands');

