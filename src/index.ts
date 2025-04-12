/**
 * Discordボットのエントリポイント
 * ボットの初期化、イベントハンドラの登録、ログイン処理を行う
 */
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { clientReadyHandler } from './eventHandlers/clientReadyHandler';
import { interactionCreateHandler } from './eventHandlers/interactionCreateHandler';


const { DISCORD_BOT_TOKEN } = process.env;

/**
 * Discordクライアントの初期化
 * 必要なインテントを指定して新しいクライアントインスタンスを作成
 * @type {Client}
 */
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

client.on(Events.ClientReady, clientReadyHandler);
client.on(Events.InteractionCreate, interactionCreateHandler);

client.login(DISCORD_BOT_TOKEN);
