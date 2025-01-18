'use strict';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { clientReadyHandler } from './eventHandlers/clientReadyHandler';


const { DISCORD_BOT_TOKEN } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on(Events.ClientReady, clientReadyHandler);

client.login(DISCORD_BOT_TOKEN);
