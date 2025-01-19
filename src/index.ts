import { Client, Events, GatewayIntentBits } from 'discord.js';
import { clientReadyHandler } from './eventHandlers/clientReadyHandler';
import { interactionCreateHandler } from './eventHandlers/interactionCreateHandler';


const { DISCORD_BOT_TOKEN } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on(Events.ClientReady, clientReadyHandler);
client.on(Events.InteractionCreate, interactionCreateHandler);

client.login(DISCORD_BOT_TOKEN);
