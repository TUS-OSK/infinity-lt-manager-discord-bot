/**
 * Discordクライアントの準備完了イベントを処理するハンドラー
 * クライアントがDiscordに正常に接続した際に実行される
 */

import type { Client } from "discord.js";

/**
 * クライアント準備完了時のイベントハンドラー
 * @param {Client} client - Discord.jsのクライアントインスタンス
 * @returns {Promise<void>}
 */
export const clientReadyHandler = async (client: Client) => {
    console.log('clientReadyHandler start');
    console.log(`Logged in as ${client.user?.tag ?? 'unknown user'} at ${new Date().toISOString()}`);
    console.log('clientReadyHandler end');
};
