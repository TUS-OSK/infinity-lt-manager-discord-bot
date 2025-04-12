/**
 * Discordアプリケーションコマンドを削除するスクリプト
 * 指定されたギルド(サーバー)から全てのスラッシュコマンドを削除する
 */
import { REST, Routes } from "discord.js";

// 環境変数から必要な設定値を取得
const { 
    DISCORD_BOT_TOKEN, // Discordボットのトークン
    GUILD_ID,         // コマンドを削除するギルド(サーバー)ID
    CLIENT_ID        // DiscordアプリケーションのクライアントID
} = process.env;

// Discord REST APIクライアントを初期化
const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);

try {
    // ギルドコマンドを空の配列で上書きして全て削除
    await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), 
        { body: [] }
    );
} catch (error) {
    console.error(`コマンド削除に失敗しました: ${error}`);
}

console.log('アプリケーションコマンド(/)の削除が完了しました');
