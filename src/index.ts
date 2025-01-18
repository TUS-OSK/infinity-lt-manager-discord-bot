'use strict';
import { Client, GatewayIntentBits } from 'discord.js';


const { DISCORD_BOT_TOKEN } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.login(DISCORD_BOT_TOKEN);
